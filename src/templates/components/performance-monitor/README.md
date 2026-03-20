# Performance Monitor

## Description

This runtime injects a draggable performance monitor panel for the current page.
It tracks FPS, frame time, long tasks, and JS heap usage, and persists panel state in `localStorage`.

## Features

- Real-time stats: `平均帧率 (FPS)`, `平均帧耗时 (ms)`, `帧率范围 (Min/Max)`, `估算掉帧数 (frames)`, `已用堆内存 (MB)`, `堆内存总量 (MB)`, `长任务次数 (50ms+)`, `当前帧耗时 (ms)`
- Real-time charts: FPS trend, long task markers, JS heap usage trend
- Interactions: drag move, bottom-right resize, title double-click minimize/restore, theme toggle (`Dark` / `Light`), close button
- State persistence: position, size, minimized state, theme, dock mode
- Dock modes: free floating panel, top dock floating bar
- Edge behavior: drag near top edge to dock top; otherwise free-mode edge snap animation

## Usage

Head Content

```html
<th:block th:insert="~{components/performance-monitor/template :: head}"></th:block>
```

## User Interactions

- Drag the title bar: near top edge docks to top; otherwise keeps floating and snaps to close edges.
- Double-click the title bar: in free mode minimize/restore; in top dock mode undock back to free mode.
- Action buttons: `Dark` / `Light` toggles theme, `-` / `+` minimizes/restores in free mode, `v` exits top dock, `x` destroys monitor.

## Runtime API

After initialization, the monitor exposes a global API on `window.__PERF_MONITOR__`.

```ts
window.__PERF_MONITOR__.dockTop();
window.__PERF_MONITOR__.undock();
window.__PERF_MONITOR__.minimize();
window.__PERF_MONITOR__.maximize();
window.__PERF_MONITOR__.toggle();
window.__PERF_MONITOR__.toggleTheme();
window.__PERF_MONITOR__.destroy();
```

## Notes

- `performance.memory` is available in some browsers (mainly Chromium-based).
- Long task monitoring depends on `PerformanceObserver` with the `longtask` entry type.
- The runtime auto-starts on page load and destroys the previous instance before creating a new one.
