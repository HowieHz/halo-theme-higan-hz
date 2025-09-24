import Plugin from "@swup/plugin";

export type Options = {
  head: boolean;
  body: boolean;
  optin: boolean;
};

export default class SwupScriptsPlugin extends Plugin {
  name = "SwupScriptsPlugin";

  requires = {
    swup: ">=4",
  };

  defaults: Options = {
    head: true,
    body: true,
    optin: false,
  };

  options: Options;

  constructor(options: Partial<Options> = {}) {
    super();
    this.options = { ...this.defaults, ...options };
  }

  mount() {
    this.before("visit:start", () => {
      // howiehz's hook 重新建立 moduleReady 和 moduleResolve 以确保脚本加载的 Promise 可用
      window.moduleReady.swupScriptsPlugin = new Promise((resolve) => {
        window.moduleResolve.swupScriptsPlugin = resolve;
      });
    });
    this.on("content:replace", () => {
      this.runScripts();
    });
  }

  runScripts() {
    const { head, body, optin } = this.options;
    const scope = this.getScope({ head, body });
    if (!scope) {
      return;
    }

    const selector = optin ? "script[data-swup-reload-script]" : "script:not([data-swup-ignore-script])";

    const scripts = Array.from(scope.querySelectorAll<HTMLScriptElement>(selector));
    const failedScripts: HTMLScriptElement[] = []; // 记录失败的脚本

    scripts.forEach((script) => {
      try {
        this.runScript(script);
      } catch (error) {
        if (error instanceof ReferenceError) {
          console.warn(`Script failed with ReferenceError: ${error.message}`, script);
          failedScripts.push(script); // 记录失败脚本
        } else {
          throw error; // 其他错误重新抛出
        }
      }
    });

    window.moduleResolve.swupScriptsPlugin(); // howiehz's hook for script load complete

    // 重试失败的脚本
    failedScripts.forEach((script) => {
      try {
        this.runScript(script);
        console.log(`Retried script successfully:`, script);
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : String(error);
        console.error(`Script retry failed: ${message}`, script);
      }
    });

    this.swup.log(`Executed ${scripts.length} scripts.`);
  }

  runScript(script: HTMLScriptElement) {
    const element = document.createElement("script");
    // @ts-expect-error TS2488 copy from @swup/scripts-plugin
    for (const { name, value } of script.attributes) {
      element.setAttribute(name, value);
    }
    element.textContent = script.textContent;
    script.replaceWith(element);

    return element;
  }

  getScope({ head, body }: Pick<Options, "head" | "body">) {
    if (head && body) return document;

    if (head) return document.head;

    if (body) return document.body;

    return null;
  }
}
