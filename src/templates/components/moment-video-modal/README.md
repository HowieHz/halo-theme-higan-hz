# Moment Video Modal Component

## Description

This component provides a modal video player for moment posts that contain video media.
It allows users to click on a video thumbnail to open a modal window and play the video.

## Usage

Head Content(for including necessary scripts/styles)

```html
<th:block th:replace="~{components/moment-video-modal/template :: headContent}"></th:block>
```

Content Insertion(for displaying the video modal)

```html
<th:block th:insert="~{components/moment-video-modal/template :: content(${media})}"></th:block>
```

API
- `${media}`: A media object containing video data (`type`, `url`).
