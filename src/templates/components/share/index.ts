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

  if (!navigator.share) {
    console.warn(`${SHARE_LOG_PREFIX} Web Share API is not supported in this browser.`);
  } else if (navigator.canShare && !navigator.canShare(shareData)) {
    // canShare returning false means the data itself is invalid or unshareable,
    // not that the API is missing. Report the rejected payload for easier debugging.
    console.warn(`${SHARE_LOG_PREFIX} Cannot share the provided data.`, shareData);
  } else {
    // Swallow user-initiated share cancellations; log only unexpected share failures.
    void navigator.share(shareData).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      console.error(`${SHARE_LOG_PREFIX} Failed to share content:`, error);
    });
  }
});
