# Moment Video Modal Component

## Description

This component provides a modal video player for moments that contain video media.
It displays a video thumbnail with a play button overlay, and when clicked, opens a modal window to play the video in full screen mode.

## Usage

Head Content (for including necessary scripts/styles)

```html
<th:block th:insert="~{components/moment-video-modal/template :: head}"></th:block>
```

Content Insertion (for displaying the video modal)

```html
<th:block th:insert="~{components/moment-video-modal/template :: body(media)}"></th:block>
```

## Parameters

- `media`: A media object containing video data with `type` (should be 'VIDEO') and `url` properties.
