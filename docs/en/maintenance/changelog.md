# Changelog

<!-- markdownlint-disable MD024 -->

<!--
💥 BREAKING CHANGES
🚀 Features
🔧 Code Refactoring
⚠️ Deprecated
🗑️ Removed
🐛 Bug Fixes
🔒 Security
📄 Documentation
🛠️ Miscellaneous Chores
-->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 💥 Breaking Changes

- In the social media settings (`console/theme/settings/sns`), the `index_sns` array has been renamed to `sns_list`, and its `type` field has been changed from an object type to a string type. **Existing configurations require the social media list to be re-configured.**

### 🐛 Bug Fixes

- Fixed an issue where the selected type could not be displayed after saving social media settings (`console/theme/settings/sns`).

## [1.58.2] - 2026-03-18

### 💥 Breaking Changes

- Minimum required Halo version bumped to 2.23.1.

### 🔧 Code Refactoring

- Improve accessibility text.
- Wrap the main content of the page in a `<main>` element to improve accessibility.

### 🗑️ Removed

- Removed the `<meta name="description">` tag from the tag detail page to align with Halo 2.23.1's built-in SEO description output.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.58.1] - 2026-03-15

### 🚀 Features

- Added support for `<meta name="theme-color" />`, with automatic output and updates based on the active theme style.

### 🔧 Code Refactoring

- Moved the `scripts` and `styles` directories into `templates`, and updated related asset reference paths.

### 🗑️ Removed

- Removed the `<meta http-equiv="X-UA-Compatible">` tag from the layout template.

### 📄 Documentation

- Added a new "Responsive Breakpoints" reference page to standardize mobile, tablet, and desktop breakpoint ranges, with both modern and compatibility syntax examples.
- Updated the contribution guide with nightly prerelease commit-count rules (time window, stable-tag boundary, and excluded automated commits).

### 🛠️ Miscellaneous Chores

- Refined nightly prerelease trigger checks to count only commits within the previous Asia/Shanghai day window and after the latest stable tag, while excluding commits whose subject starts with `docs:`.
- Changed the commit prefix for page size audit result PRs from `chore:` to `docs:`.
- Added automatic regeneration and CI validation for changelog compare-link definitions (`[Unreleased]` and version links) at the end of both changelog files.

## [1.58.0] - 2026-03-13

### 🚀 Features

- Added a canonical link output toggle switch (enabled by default) for all pages containing a `<link rel="canonical">` tag (homepage, post, archives, category collection, category details, tag collection, tag details, author details, custom pages, links, photo gallery, moments, friends circle).

### 🔧 Code Refactoring

- Consolidated heading and paragraph margin styles, and added paragraph controls to reduce page render size.

### 📄 Documentation

- Revised the contributing guide.

## [1.57.6] - 2026-03-13

### 📄 Documentation

- Relocated changelog and contribution guidelines.
- Created release process documentation.

### 🛠️ Miscellaneous Chores

- Refactored the release workflow.
- Added artifact attestation (Sigstore provenance) to both stable and nightly prerelease workflows for verifiable zip artifact provenance.

## [1.57.5] - 2026-03-12

### 🐛 Bug Fixes

- Ref: [nonzzz/vite-plugin-compression#93](https://github.com/nonzzz/vite-plugin-compression/issues/93). To comply with RFC 9659 and avoid runtime errors in Chrome (v123+) and Firefox (v126+), adjusted the zstandard compression level for `*.zst` precompressed assets to 19.

## [1.57.4] - 2026-03-12

### 🚀 Features

- Added the `<link rel="canonical">` tag to pages to improve SEO.

### 🔧 Code Refactoring

- Adjusted the zstandard compression level for `*.zst` precompressed assets to 22.

### 🐛 Bug Fixes

- Improved light theme colors to increase contrast between several UI colors and their backgrounds.
- Fixed incorrect title color rendering on the home page and Friends page.
- Fixed incorrect second-level heading styles in article items under the home page's rich list layout.
- Fixed incorrect title style rendering for inline links inside posts.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.57.3] - 2026-02-28

### 🔧 Code Refactoring

- Refactored component implementations.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.
- Improved the build workflow.

## [1.57.2] - 2026-02-13

### 🔧 Code Refactoring

- Improved SEO behavior: on some pages, the site name at the top is no longer rendered as an H1.

## [1.57.1] - 2026-02-10

### 🚀 Features

- Added SRI metadata for theme assets to improve security.
- Added precompressed static assets for the theme:
  - File types:
    - `.js`: `.js.gz`, `.js.br`, `.js.zst`
    - `.css`: `.css.gz`, `.css.br`, `.css.zst`
  - Algorithms and compression levels:
    - `*.gz` - gzip (level 9, max)
    - `*.br` - brotli (level 11, max)
    - `*.zst` - zstandard (level 21, max - 1 to avoid OOM during builds)
  - Automatic delivery and server setup:
    - On native Halo CMS deployment, `.br` files are served automatically.
    - On nginx/Apache and other servers, see the [performance guide](https://howiehz.top/halo-theme-higan-haozi/en/tutorial/performance) to enable automatic precompressed asset delivery.

### 🔧 Code Refactoring

- Adjusted instant.page script injection position to improve loading performance.

### 📄 Documentation

- Updated the [Security Practices](https://howiehz.top/halo-theme-higan-haozi/en/tutorial/security) docs.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.57.0] - 2026-02-05

### 🚀 Features

- Added support for section headings in the Photos page waterfall layout.
  - When waterfall mode is enabled, each group now renders with its own independent waterfall instance.
  - The `Photos Page Style -> Show Group Titles` option is now also available when waterfall mode is enabled.

## [1.56.2] - 2026-02-04

### 🐛 Bug Fixes

- Fixed an internal error when `Global -> Language Feature Prefix Matching Mode` was enabled and the root menu contained non-custom link types.

## [1.56.1] - 2026-02-04

### 🐛 Bug Fixes

- Fixed unclosed quotation marks in templates.

## [1.56.0] - 2026-02-04

### 🚀 Features

- Added a Friends-feed list layout option for the home page.
  - Added `Friends Feed` to `Home Page Style -> Main List Layout`, allowing subscription posts from the [Friends](https://www.halo.run/store/apps/app-yISsV) plugin to be displayed on the home page.
  - Added `Friends Feed Item Count` to configure how many items are shown (default: 10).
  - Added `Show Publish Date in Friends Feed` (default: enabled).
  - Added `Show Author Info in Friends Feed` (default: enabled).
  - Added `Show Author Avatar in Friends Feed` (default: enabled).
  - Added `Show Author Name in Friends Feed` (default: enabled).
  - Added `Show Post Excerpt in Friends Feed` (default: enabled).
  - Added `Friends Feed Excerpt Line Clamp` to limit excerpt lines (default: 3, range: 1-5).
  - Added `Show Jump-Link Hint Text in Friends Feed` (default: enabled).
- Added publish date display controls for archive page post lists.
  - Added `Show Publish Date in Post List` (default: enabled).
- Added publish date display controls for tag detail page post lists.
  - Added `Show Publish Date in Post List` (default: enabled).
- Added publish date display controls for category detail page post lists.
  - Added `Show Publish Date in Post List` (default: enabled).
- Added publish date display controls for Moments page entries.
  - Added `Show Moment Publish Date` (default: enabled).
- Added publish date display controls for home page moments feed entries.
  - Added `Show Entry Publish Date in Moments Feed` (default: enabled).
- Added standalone configuration options for the home page moments feed.
  - Added `Show Estimated Reading Time in Moments Feed` (default: disabled).
  - Added `Show Word Count in Moments Feed` (default: disabled).
  - Added `Enable Like Button in Moments Feed` (default: enabled).
  - Added `Enable Comments in Moments Feed` (default: enabled).
- Added publish date display controls for author detail page post lists.
  - Added `Show Publish Date in Post List` (default: enabled).

### 🐛 Bug Fixes

- Fixed an internal server error when `Home Page Style -> Main List Layout` was set to `Moments Feed` while the Moments plugin was not running.
- Fixed incorrect menu matching when `Global -> Multi-language Menu Support` was enabled but `Global -> Language Feature Prefix Matching Mode` was disabled.
- Fixed fallback error title still rendering even when the primary error title was available.
- Fixed a typo in the built-in `Light - Gray Pink` theme filename.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.
- Manually reformatted string values inside template `th:if`, `th:unless`, and `th:with` expressions.

## [1.55.1] - 2026-02-03

### 🐛 Bug Fixes

- Fixed incorrect pagination links on the Moments page (`/moments`).
- Fixed infinite redirects when `Global -> Restrict Access to Allowed Domains` was enabled and the domain allowlist was empty.

## [1.55.0] - 2026-02-03

### 🚀 Features

- Added compatibility with the [Friends](https://github.com/chengzhongxue/plugin-friends-new) plugin ([Marketplace page](https://www.halo.run/store/apps/app-yISsV)).
  - Docs: [Friends plugin intro](https://howiehz.top/halo-theme-higan-haozi/en/guide/plugin-compatibility#moments-feed-subscription)
  - Added related options: [Friends page style options](https://howiehz.top/halo-theme-higan-haozi/en/guide/theme-configuration#friends-page-style)
- Added publish date display controls for home page post lists.
  - Simple post list: added `Show Publish Date` (default: enabled).
  - Rich post list: added `Show Publish Date` (default: enabled).

### 🐛 Bug Fixes

- Fixed an issue where pages could not load when `Home Page Style -> Main List Layout` was set to `Moments Feed` and page number was greater than 1.

### 📄 Documentation

- Improved translation quality for English documentation.

## [1.54.0] - 2026-01-28

### 💥 BREAKING CHANGES

- After updating, you must reconfigure `Global Style -> Custom Font File` to fix an issue where the selected option could not be displayed.

### 🚀 Features

- Refactored custom font configuration and enabled more granular setup.

### 🔧 Code Refactoring

- Expanded the default Meslo font declarations: added bold, italic, and bold-italic variants.
- Optimized custom font rendering logic.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.53.1] - 2026-01-28

### 🐛 Bug Fixes

- Fixed unexpected line breaks in footer content and the top menu on post pages in WebKit-based browsers.

### 🔧 Code Refactoring

- Optimized custom cursor declarations.
- Upgraded Meslo font from 1.2 to 1.2.1 and recompressed all formats to reduce font size.
- Optimized fallback font declarations.
- Removed unnecessary `vite-ignore` declarations to reduce build output size.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.53.0] - 2026-01-17

### 🚀 Features

- Added support for custom mouse cursors.

## [1.52.1] - 2026-01-16

### 🚀 Features

- Added support for displaying second-level menus.
- Added table-of-contents support on post pages in tablet layout (viewport >= 768px and < 1024px).
  - Replaced the "Back to Top" button in the top-right menu with a TOC button.
  - When the page is scrolled, both "Back to Top" and TOC buttons are shown in the bottom-right controls.

### 🐛 Bug Fixes

- Fixed default values not being applied correctly for `Links Page Style - Link Description Line Clamp` and `Home Page Style - Rich List Excerpt Line Clamp`.

### 📄 Documentation

- Added more multilingual documentation.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.52.0] - 2026-01-15

### 💥 BREAKING CHANGES

- Minimum required Halo CMS version changed from 2.22.0 to 2.22.1.

### 🚀 Features

- Added `Links Page Style - Avatar-First Layout`, a three-column grid layout emphasizing avatar display.
  - Added sub-option `Links Page Style - Link Description Line Clamp`.

### 🐛 Bug Fixes

- Fixed text overflow on the Links page when link descriptions were long and could not wrap.
- Fixed `Home Page Style - Rich List Excerpt Line Clamp` not working as expected.

### 🔧 Code Refactoring

- Moved pages containing plugin-dependent options to the end and added a notice at the top.
- Replaced checkbox controls with switch controls in configuration pages.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.51.1] - 2026-01-04

### 🐛 Bug Fixes

- Fixed incorrect pin icon color in the home page post list.

## [1.51.0] - 2026-01-03

### 💥 BREAKING CHANGES

- After updating, you must reconfigure `Global Style -> Color Scheme` to fix an issue where the selected option could not be displayed.
- After updating, you must reconfigure `Global Style -> Custom Color Scheme` to align with the new theme variable design.

### 🚀 Features

- Added support for custom theme colors using new Halo CMS 2.22 controls.
  - Even without frontend knowledge, you can now customize theme colors easily.
  - See: [Tutorial: Custom Theme](https://howiehz.top/halo-theme-higan-haozi/en/tutorial/custom-theme)

### 🐛 Bug Fixes

- Fixed `Global Style -> Color Scheme` not showing the selected option after saving.
- Fixed unexpected centering of link-page image descriptions.
- Fixed incorrect style rendering in docs preview.
- Fixed non-responsive expand/collapse button in the Moments detail page comment section.

### 🔧 Code Refactoring

- Removed v2 comment component support to reduce bundle size.
- Simplified the number of theme CSS variables.
- Loaded font-size declarations on demand to reduce asset size.
- Loaded custom styles on demand to reduce page size.
- Reduced the use of `if: "$get(xxx).value === 'xxx'"` in config files to lower the chance of config page glitches.
- Modularized comment component styles and loaded them on demand to reduce page size.
- Modularized `color-scheme` handling and loaded it on demand to reduce page size.
- Optimized tag styles on the Moments page.

## [1.50.2] - 2026-01-01

### 🚀 Features

- Added support for the Vditor plugin inline table of contents syntax: `[toc]`.

## [1.50.1] - 2025-12-28

### 🔧 Code Refactoring

- Reduced bundle size.

### 📄 Documentation

- Improved docs and added a new [Browser Compatibility](https://howiehz.top/halo-theme-higan-haozi/en/reference/browser-compatibility) page.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.50.0] - 2025-12-24

### 💥 BREAKING CHANGES

- Required Halo CMS version is now `2.22+`.
- Custom icon settings now align with the `iconify` type introduced in Halo CMS 2.22. You must reconfigure this after upgrade.

### 🚀 Features

- Added `Tags Page Style -> Page Description`.
- Added `Categories Page Style -> Page Description`.
- Added `Author Detail Page Style -> Page Description`.
- Added `Archives Page Style -> Page Description`.
- Added support for `figcaption` (captions for images, videos, and audio).

### 🔧 Code Refactoring

- Updated repeater-style options (repeatable input groups with add/remove/reorder) to the latest Halo CMS 2.22 UI style.

### 🐛 Bug Fixes

- Fixed the error page not rendering correctly.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.
- Replaced PostCSS with Lightning CSS; build speed roughly doubled.
  - Moved base styles into the `@layer base` layer to avoid overriding Tailwind CSS styles.

## [1.49.2] - 2025-12-13

### 🐛 Bug Fixes

- Fixed `Force footer and pager to stay at page bottom` option not taking effect.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.49.1] - 2025-12-06

### 🐛 Bug Fixes

- Fixed footer content overlapping with the like button when likes were enabled and comments were disabled on post pages.
- Fixed page crashes caused by the random-article feature when no posts were published.
- Removed an accidentally applied border color.

### 🔧 Code Refactoring

- Improved icon display styles.

### 🛠️ Miscellaneous Chores

- Refactored the build workflow.
- Modularized part of the templates.
- Updated development dependencies.

## [1.49.0] - 2025-11-29

### 💥 BREAKING CHANGES

- You must migrate custom icons using the new process. See [Tutorial: Custom Icons](https://howiehz.top/halo-theme-higan-haozi/en/tutorial/custom-svg). If you previously customized icons, please follow that migration guide.
- Options under `Custom Share Buttons` will be reset. Existing values are not overwritten in source data; you can recover them from [Export Theme Config](https://howiehz.top/halo-theme-higan-haozi/en/reference/faq#how-to-export-theme-configuration).

### 🐛 Bug Fixes

- Fixed save failures caused by missing defaults in some `Custom Share Buttons -> Share Button Settings` items.
  - For the `Native` item under `Custom Share Buttons -> Share Button Settings`, the URL should be `@URL`.
- Fixed an issue where the desktop post-page share menu could occasionally fail to open.
- Fixed an incorrect type for `Show in Post List` in the English settings package.
- Fixed SVG icons not being inlined into CSS; runtime icon fetching from iconify servers is no longer required.

### 🔧 Code Refactoring

- Improved link behavior for the `Native` (browser-native share) item in `Custom Share Buttons -> Share Button Settings`.
- Optimized code to avoid attaching unnecessary data to the global `window` object, reducing page size.
- Upgraded Tailwind CSS from v3 to v4.
- Migrated the icon system from `vite-plugin-purge-icons` to `@iconify/tailwind4`.

## [1.48.3] - 2025-11-26

### 🐛 Bug Fixes

- Fixed incorrect hover style rendering for author names on the Moments page.

### 🔧 Code Refactoring

- Further optimized code splitting and removed redundant styles.

### 🛠️ Miscellaneous Chores

- Refactored the build workflow.
- Modularized part of the templates.
- Updated development dependencies.

## [1.48.2] - 2025-11-25

### 🐛 Bug Fixes

- Fixed pages using the simple post list layout not rendering as expected.
- Fixed redundant styles appearing in the Moments page list.
- Fixed incorrect hover style rendering for action-bar buttons on the Moments page.

### 🔧 Code Refactoring

- Further optimized code splitting and removed redundant styles.
- Post-optimization metrics:
  - Theme assets:
    - 1.48.1 average size: 66.808 KiB (gzipped) / 135.609 KiB (raw)
    - 1.48.2 average size: 66.867 KiB (gzipped) / 132.980 KiB (raw)
    - 📉 Gzipped delta: -0.060 KiB (-0.09%)
    - 📉 Raw size delta: 2.629 KiB (1.94%)
  - Total page assets:
    - 1.48.1 average size: 341.412 KiB (gzipped) / 999.784 KiB (raw)
    - 1.48.2 average size: 341.500 KiB (gzipped) / 997.325 KiB (raw)
    - 📉 Gzipped delta: -0.088 KiB (-0.03%)
    - 📉 Raw size delta: 2.460 KiB (0.25%)

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.48.1] - 2025-11-23

### 🚀 Features

- Added a new doc: [Performance Reference](https://howiehz.top/halo-theme-higan-haozi/en/reference/performance).
  - Shows resource size changes from v1.0.0 to the latest version.

### 🔧 Code Refactoring

- Added AVIF/WebP formats for the default logo, with PNG retained as fallback.
- Used [KonghaYao/cn-font-split](https://github.com/KonghaYao/cn-font-split) to split the default font.
- Refined the build flow by removing template comments and empty lines to reduce distribution and output size.
- Post-optimization metrics:
  - Theme assets:
    - 1.48.0 average size: 368.038 KiB (gzipped) / 428.557 KiB (raw)
    - 1.48.1 average size: 66.808 KiB (gzipped) / 135.609 KiB (raw)
    - 📉 Gzipped delta: 301.230 KiB (81.85%)
    - 📉 Raw size delta: 292.948 KiB (68.36%)
  - Total page assets:
    - 1.48.0 average size: 642.663 KiB (gzipped) / 1292.573 KiB (raw)
    - 1.48.1 average size: 341.412 KiB (gzipped) / 999.784 KiB (raw)
    - 📉 Gzipped delta: 301.251 KiB (46.88%)
    - 📉 Raw size delta: 292.789 KiB (22.65%)

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.48.0] - 2025-11-22

### 🚀 Features

- Added `Page Metadata -> Custom Template -> [Post Page Style](http://howiehz.top/halo-theme-higan-haozi/guide/metadata-configuration#%E6%96%87%E7%AB%A0%E9%A1%B5%E6%A0%B7%E5%BC%8F)`.
  - Replaces the previous `Custom Page Style -> Enable Post-like Page Style`.

### 🔧 Code Refactoring

- Optimized custom page style size; script and stylesheet bundles were both reduced by [-15%](https://github.com/HowieHz/halo-theme-higan-hz/pull/327#issuecomment-3566640583).

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.47.0] - 2025-11-20

### 🚀 Features

- Added `Global Style -> [Extra Menu Items](http://howiehz.top/halo-theme-higan-haozi/guide/theme-configuration#%E9%A2%9D%E5%A4%96%E8%8F%9C%E5%8D%95%E9%A1%B9)`.
  - Replaces the previous `Global Style -> Random Article Menu Item` and `Global Style -> User Account Menu Item`.
  - Implemented as a repeater: supports custom ordering, free add/remove of entries.
  - Added a new `User Account` item type:
    - When logged out, the menu shows `Login` and links to `/login`.
    - When logged in, the menu shows the username and links to `/uc`.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.46.0] - 2025-11-17

### 🚀 Features

- Launched the new docs site: [Higan Haozi](https://howiehz.top/halo-theme-higan-haozien/).
  - [Writing reference docs: base styles, extended styles, and usage](https://howiehz.top/halo-theme-higan-haozi/en/guide/style-reference)
  - [Plugin compatibility docs](https://howiehz.top/halo-theme-higan-haozi/en/guide/plugin-compatibility)
  - [Theme configuration docs](https://howiehz.top/halo-theme-higan-haozi/en/guide/theme-configuration)
  - [Metadata configuration docs](https://howiehz.top/halo-theme-higan-haozi/en/guide/metadata-configuration)

### 🔧 Code Refactoring

- Split part of shared styles out to reduce page size.
- Optimized descriptions for theme configuration options.

### 🛠️ Miscellaneous Chores

- Updated development dependencies and removed unused dependencies.

## [1.45.4] - 2025-11-07

### 🐛 Bug Fixes

- Fixed tag color rendering issues when `Tags Page Style -> Tag Sort Order` was enabled.

[Unreleased]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.58.2...HEAD
[1.58.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.58.1...v1.58.2
[1.58.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.58.0...v1.58.1
[1.58.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.57.6...v1.58.0
[1.57.6]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.57.5...v1.57.6
[1.57.5]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.57.4...v1.57.5
[1.57.4]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.57.3...v1.57.4
[1.57.3]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.57.2...v1.57.3
[1.57.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.57.1...v1.57.2
[1.57.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.57.0...v1.57.1
[1.57.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.56.2...v1.57.0
[1.56.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.56.1...v1.56.2
[1.56.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.56.0...v1.56.1
[1.56.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.55.1...v1.56.0
[1.55.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.55.0...v1.55.1
[1.55.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.54.0...v1.55.0
[1.54.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.53.1...v1.54.0
[1.53.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.53.0...v1.53.1
[1.53.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.52.1...v1.53.0
[1.52.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.52.0...v1.52.1
[1.52.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.51.1...v1.52.0
[1.51.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.51.0...v1.51.1
[1.51.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.50.2...v1.51.0
[1.50.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.50.1...v1.50.2
[1.50.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.50.0...v1.50.1
[1.50.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.49.2...v1.50.0
[1.49.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.49.1...v1.49.2
[1.49.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.49.0...v1.49.1
[1.49.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.48.3...v1.49.0
[1.48.3]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.48.2...v1.48.3
[1.48.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.48.1...v1.48.2
[1.48.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.48.0...v1.48.1
[1.48.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.47.0...v1.48.0
[1.47.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.46.0...v1.47.0
[1.46.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.45.4...v1.46.0
[1.45.4]: https://github.com/HowieHz/halo-theme-higan-hz/releases/tag/v1.45.4
