const SHARE_LOG_PREFIX = "[Higan Haozi][share]";

document.addEventListener("click", (event: Event): void => {
  const nativeShareLink =
    event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-native-share-link]") : null;

  if (!nativeShareLink) {
    return;
  }

  event.preventDefault();

  const shareData = {
    title: nativeShareLink.dataset.nativeShareTitle ?? "",
    url: nativeShareLink.dataset.nativeShareLink ?? "",
  };

  if (navigator.canShare?.(shareData)) {
    // Swallow user-initiated share cancellations; log only unexpected share failures.
    void navigator.share(shareData).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error(`${SHARE_LOG_PREFIX} Failed to share content:`, error);
    });
  } else {
    console.error(
      `${SHARE_LOG_PREFIX} This browser does not support the Web Share API or cannot share the provided data.`,
    );
  }
});
