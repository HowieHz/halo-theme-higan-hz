export type MermaidTheme = "dark" | "light" | null;

type MermaidConfigScalar = boolean | number | string | null;

export type MermaidConfigValue =
  | MermaidConfigScalar
  | MermaidConfigValue[]
  | {
      [key: string]: MermaidConfigValue | undefined;
    };

export type MermaidConfig = {
  startOnLoad?: boolean;
  [key: string]: MermaidConfigValue | undefined;
};

export type MermaidRuntimeConfig = {
  url: string;
  selector: string;
  config?: MermaidConfig;
};

export type MermaidRenderResult = {
  svg: string;
  bindFunctions?: (element: Element) => void;
};

export type MermaidModule = {
  initialize(config?: MermaidConfig): void;
  render(id: string, text: string): Promise<MermaidRenderResult>;
};

export type ReferenceAttribute = "marker-start" | "marker-mid" | "marker-end" | "xlink:href" | "href";
