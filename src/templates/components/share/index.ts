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
    void navigator.share(shareData);
  } else {
    console.error(
      `[Higan Haozi][share] This browser does not support the Web Share API or cannot share the provided data.`,
    );
  }
});
