const UPVOTE_LOG_PREFIX = "[Higan Haozi][upvote-runtime]";

interface UpvoteRuntimeConfig {
  countSelector: string;
  group: string;
  nameAttribute: string;
  networkRequestFailedMsg: string;
  plural: string;
  storageKey: string;
  triggerSelector: string;
}

interface UpvoteRuntimeState {
  config: UpvoteRuntimeConfig;
  likedNames: Set<string>;
  pendingNames: Set<string>;
}

function getRuntimeConfigs(): UpvoteRuntimeConfig[] {
  return Array.from(document.querySelectorAll<HTMLScriptElement>("script[data-upvote-runtime]"))
    .map((configElement) => {
      const countSelector = configElement.dataset.countSelector;
      const group = configElement.dataset.group;
      const nameAttribute = configElement.dataset.nameAttribute;
      const networkRequestFailedMsg = configElement.dataset.networkRequestFailedMsg;
      const plural = configElement.dataset.plural;
      const storageKey = configElement.dataset.storageKey;
      const triggerSelector = configElement.dataset.triggerSelector;

      if (
        !storageKey ||
        !group ||
        !plural ||
        !nameAttribute ||
        !triggerSelector ||
        !countSelector ||
        !networkRequestFailedMsg
      ) {
        console.error(`${UPVOTE_LOG_PREFIX} Incomplete upvote runtime config.`, {
          countSelector,
          group,
          nameAttribute,
          networkRequestFailedMsg,
          plural,
          storageKey,
          triggerSelector,
        });
        return null;
      }

      return {
        countSelector,
        group,
        nameAttribute,
        networkRequestFailedMsg,
        plural,
        storageKey,
        triggerSelector,
      };
    })
    .filter((config): config is UpvoteRuntimeConfig => config !== null);
}

function readLikedNames(storageKey: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return new Set<string>();
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set<string>();
    }

    return new Set(parsed.filter((item): item is string => typeof item === "string" && item.trim() !== ""));
  } catch (error) {
    console.error(`${UPVOTE_LOG_PREFIX} Failed to read liked ids from localStorage.`, error);
    return new Set<string>();
  }
}

function writeLikedNames(storageKey: string, likedNames: Set<string>): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(likedNames)));
  } catch (error) {
    console.error(`${UPVOTE_LOG_PREFIX} Failed to persist liked ids to localStorage.`, error);
  }
}

function getTargetName(nameAttribute: string, element: Element): string | null {
  const name = element.getAttribute(nameAttribute)?.trim();
  return name ? name : null;
}

function updateActiveButtons(config: UpvoteRuntimeConfig, targetName: string): void {
  document.querySelectorAll<HTMLElement>(config.triggerSelector).forEach((triggerElement) => {
    if (getTargetName(config.nameAttribute, triggerElement) !== targetName) {
      return;
    }

    triggerElement.style.color = "var(--color-accent)";
    triggerElement.style.fontWeight = "500";
  });
}

function incrementCountNodes(config: UpvoteRuntimeConfig, targetName: string): void {
  document.querySelectorAll<HTMLElement>(config.countSelector).forEach((countElement) => {
    if (getTargetName(config.nameAttribute, countElement) !== targetName) {
      return;
    }

    const count = Number.parseInt(countElement.innerText, 10);
    countElement.innerText = String(Number.isNaN(count) ? 1 : count + 1);
  });
}

async function submitUpvote(config: UpvoteRuntimeConfig, targetName: string): Promise<boolean> {
  try {
    const response = await fetch("/apis/api.halo.run/v1alpha1/trackers/upvote", {
      body: JSON.stringify({
        group: config.group,
        name: targetName,
        plural: config.plural,
      }),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return true;
  } catch (error) {
    alert(config.networkRequestFailedMsg);
    console.error(`${UPVOTE_LOG_PREFIX} Failed to submit upvote.`, error);
    return false;
  }
}

const runtimeStates = getRuntimeConfigs().map((config) => ({
  config,
  likedNames: readLikedNames(config.storageKey),
  pendingNames: new Set<string>(),
}));

runtimeStates.forEach((runtimeState) => {
  runtimeState.likedNames.forEach((likedName) => {
    updateActiveButtons(runtimeState.config, likedName);
  });
});

document.addEventListener("click", async (event: Event): Promise<void> => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) {
    return;
  }

  for (const runtimeState of runtimeStates) {
    const triggerElement = target.closest<HTMLElement>(runtimeState.config.triggerSelector);
    if (!triggerElement) {
      continue;
    }

    const targetName = getTargetName(runtimeState.config.nameAttribute, triggerElement);
    if (!targetName) {
      return;
    }

    event.preventDefault();

    if (runtimeState.likedNames.has(targetName) || runtimeState.pendingNames.has(targetName)) {
      return;
    }

    runtimeState.pendingNames.add(targetName);
    const isSubmitted = await submitUpvote(runtimeState.config, targetName);
    runtimeState.pendingNames.delete(targetName);

    if (!isSubmitted) {
      return;
    }

    runtimeState.likedNames.add(targetName);
    writeLikedNames(runtimeState.config.storageKey, runtimeState.likedNames);
    incrementCountNodes(runtimeState.config, targetName);
    updateActiveButtons(runtimeState.config, targetName);
    return;
  }
});
