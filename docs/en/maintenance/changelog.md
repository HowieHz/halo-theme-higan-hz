# Changelog

<!-- markdownlint-disable MD024 -->

<!--
Level-3 heading order

### 💥 Breaking Changes
### 🚀 Features
### 🔧 Code Refactoring
### ⚠️ Deprecated
### 🗑️ Removed
### 🐛 Bug Fixes
### 🔒 Security
### 📄 Documentation
### 🛠️ Miscellaneous Chores
-->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.61.0] - 2026-03-30

### 🚀 Features

- Added the ["Inline code style preset"](/en/guide/theme-configuration#inline-code-style-preset) setting (Post Page Style -> Inline code style preset) for inline code in posts and single pages. Includes three presets: dotted border, soft highlight, and theme pill. Multi-line code blocks are unchanged.

### 🛠️ Miscellaneous Chores

- Reduced Tailwind CSS scan sources by excluding unnecessary component and docs paths to avoid unused styles.
- Updated dependencies.

## [1.60.1] - 2026-03-28

### 🗑️ Removed

- Removed the "Author Detail Page Style -> Page Description" setting. The author detail page now uses the author description, falling back to the site description when the author description is empty.

### 🐛 Bug Fixes

- Fixed misaligned post title columns in the simple post list caused by variable-width date digits in proportional fonts.

## [1.60.0] - 2026-03-23

### 🚀 Features

- Heading anchor links are available on post and single page templates: hovering over or focusing a heading reveals a clickable `#` before it; clicking navigates to that heading's anchor and updates the address bar URL. h2 headings display the anchor permanently; all other levels show it on hover or focus. On mobile (screen width below 640px), the anchor appears to the right of the heading text instead.
- Added ["Heading anchor symbol"](/en/guide/theme-configuration#heading-anchor-symbol) setting (Post Page Style -> Heading anchor symbol) to customize the symbol displayed before heading anchor links. Leave empty to use the default `#`. Implemented via the `--heading-anchor-symbol` CSS custom property.
- Added ["Heading anchor symbol raw output"](/en/guide/theme-configuration#heading-anchor-symbol-raw-output) setting (Post Page Style -> Heading anchor symbol raw output). When enabled, the anchor symbol value is written directly as the CSS variable value without quoting, intended for users familiar with CSS `content` property syntax.
- Added ["Heading anchor icon"](/en/guide/theme-configuration#heading-anchor-icon) setting (Post Page Style -> Heading anchor icon) to select an icon from the Iconify icon library as the heading anchor. When configured, it takes precedence over the anchor symbol setting. The icon color automatically follows the theme's primary color.

### 📄 Documentation

- Added the [Verify Theme Package Integrity](/en/tutorial/security#verify-theme-package-integrity) section to the [Security Protection](/en/tutorial/security) docs.

### 🛠️ Miscellaneous Chores

- Added SLSA L3 provenance generation (`slsa-github-generator`) to the release pipeline alongside the existing GitHub Attestation (L2). Each release will now include a `.intoto.jsonl` file that can be independently verified with `slsa-verifier`.
- Applied `line-break: strict` for CJK text to prevent punctuation from appearing at the start or end of a line.
- Updated development dependencies.

## [1.59.2] - 2026-03-22

### 🐛 Bug Fixes

- Fixed the missing top margin above the footer content and restored the expected spacing.

### 🛠️ Miscellaneous Chores

- Upgraded the build tool to Vite 8.
- Removed the `cheerio` dependency from the documentation build pipeline.

## [1.59.1] - 2026-03-21

### 🚀 Features

- Added rel="noopener noreferrer nofollow" to share links to improve security and control SEO link equity.

### 🔧 Code Refactoring

- Share links now open in a new tab (`target="_blank"`).

## [1.59.0] - 2026-03-21

### 💥 Breaking Changes

- In the social media settings (`/console/theme/settings/sns`), the `index_sns` array has been renamed to `sns_list`, and its `type` field has been changed from an object type to a string type. **Existing configurations require the social media list to be re-configured.**
- In the share button settings (`/console/theme/settings/share`), the `button_config` array has been split into `share_list` (preset button list) and `custom_share` (custom buttons). **Existing configurations require the share button list to be re-configured.**
- The global settings remove the `Custom Resource Location Address` and `instant.page Resource Location` options, and instant.page now uses the theme-bundled resource. **Existing values for these two settings no longer take effect.**
- Mermaid support removes the `Mermaid Resource Location` setting, and Mermaid now uses the theme-bundled resource. **Existing values for this setting no longer take effect.**

### 🚀 Features

- Added preset share buttons for Reddit, WhatsApp, Tumblr, LINE, Hacker News, Blogger, Gmail, Yahoo Mail and Skype.
- Added a global setting `Enable performance monitor panel` to control performance monitor panel injection.
- Expanded bottom content settings into [Add content to the page bottom/sidebar](/en/guide/theme-configuration#add-content-to-the-page-bottom-sidebar), with new options for page bottom/sidebar content display mode, sidebar hover opacity, and tablet and mobile sidebar display behavior.

### 🔧 Code Refactoring

- Refactored Mermaid injection from an inline Thymeleaf `<script>` into a standalone TypeScript module.
- Optimized log output.

### 🐛 Bug Fixes

- Fixed an issue where the selected type could not be displayed after saving social media settings (`/console/theme/settings/sns`).
- Fixed an issue where the RSS `<link>` tag was not output when the RSS plugin was not installed but an RSS link was configured in the social media settings.
- Fixed an issue in Mermaid injection where `xlink:href` references were not updated synchronously.
- Fixed `Force Footer at Page Bottom` option not taking effect.

### 📄 Documentation

- Improved configuration option names.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.58.2] - 2026-03-18

### 💥 Breaking Changes

- Minimum required Halo version bumped to 2.23.1.

### 🔧 Code Refactoring

- Improved accessibility text.
- Wrapped the main page content in a `<main>` element to improve accessibility.

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
    - On nginx/Apache and other servers, see the [performance guide](/en/tutorial/performance) to enable automatic precompressed asset delivery.

### 🔧 Code Refactoring

- Adjusted instant.page script injection position to improve loading performance.

### 📄 Documentation

- Updated the [Security Practices](/en/tutorial/security) docs.

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
  - Docs: [Friends plugin intro](/en/guide/plugin-compatibility#moments-feed-subscription)
  - Added related options: [Friends page style options](/en/guide/theme-configuration#friends-page-style)
- Added publish date display controls for home page post lists.
  - Simple post list: added `Show Publish Date` (default: enabled).
  - Rich post list: added `Show Publish Date` (default: enabled).

### 🐛 Bug Fixes

- Fixed an issue where pages could not load when `Home Page Style -> Main List Layout` was set to `Moments Feed` and page number was greater than 1.

### 📄 Documentation

- Improved translation quality for English documentation.

## [1.54.0] - 2026-01-28

### 💥 Breaking Changes

- After updating, you must reconfigure `Global Style -> Custom Font File` to fix an issue where the selected option could not be displayed.

### 🚀 Features

- Refactored custom font configuration and enabled more granular setup.

### 🔧 Code Refactoring

- Expanded the default Meslo font declarations: added bold, italic, and bold-italic variants.
- Optimized custom font rendering logic.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.53.1] - 2026-01-28

### 🔧 Code Refactoring

- Optimized custom cursor declarations.
- Upgraded Meslo font from 1.2 to 1.2.1 and recompressed all formats to reduce font size.
- Optimized fallback font declarations.
- Removed unnecessary `vite-ignore` declarations to reduce build output size.

### 🐛 Bug Fixes

- Fixed unexpected line breaks in footer content and the top menu on post pages in WebKit-based browsers.

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

### 💥 Breaking Changes

- Minimum required Halo CMS version changed from 2.22.0 to 2.22.1.

### 🚀 Features

- Added `Links Page Style - Avatar-First Layout`, a three-column grid layout emphasizing avatar display.
  - Added sub-option `Links Page Style - Link Description Line Clamp`.

### 🔧 Code Refactoring

- Moved pages containing plugin-dependent options to the end and added a notice at the top.
- Replaced checkbox controls with switch controls in configuration pages.

### 🐛 Bug Fixes

- Fixed text overflow on the Links page when link descriptions were long and could not wrap.
- Fixed `Home Page Style - Rich List Excerpt Line Clamp` not working as expected.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.51.1] - 2026-01-04

### 🐛 Bug Fixes

- Fixed incorrect pin icon color in the home page post list.

## [1.51.0] - 2026-01-03

### 💥 Breaking Changes

- After updating, you must reconfigure `Global Style -> Color Scheme` to fix an issue where the selected option could not be displayed.
- After updating, you must reconfigure `Global Style -> Custom Color Scheme` to align with the new theme variable design.

### 🚀 Features

- Added support for custom theme colors using new Halo CMS 2.22 controls.
  - Even without frontend knowledge, you can now customize theme colors easily.
  - See: [Tutorial: Custom Theme](/en/tutorial/custom-theme)

### 🔧 Code Refactoring

- Removed v2 comment component support to reduce bundle size.
- Simplified the number of theme CSS variables.
- Loaded font-size declarations on demand to reduce asset size.
- Loaded custom styles on demand to reduce page size.
- Reduced the use of `if: "$get(xxx).value === 'xxx'"` in config files to lower the chance of config page glitches.
- Modularized comment component styles and loaded them on demand to reduce page size.
- Modularized `color-scheme` handling and loaded it on demand to reduce page size.
- Optimized tag styles on the Moments page.

### 🐛 Bug Fixes

- Fixed `Global Style -> Color Scheme` not showing the selected option after saving.
- Fixed unexpected centering of link-page image descriptions.
- Fixed incorrect style rendering in docs preview.
- Fixed non-responsive expand/collapse button in the Moments detail page comment section.

## [1.50.2] - 2026-01-01

### 🚀 Features

- Added support for the Vditor plugin inline table of contents syntax: `[toc]`.

## [1.50.1] - 2025-12-28

### 🔧 Code Refactoring

- Reduced bundle size.

### 📄 Documentation

- Improved docs and added a new [Browser Compatibility](/en/reference/browser-compatibility) page.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.50.0] - 2025-12-24

### 💥 Breaking Changes

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

### 🔧 Code Refactoring

- Improved icon display styles.

### 🐛 Bug Fixes

- Fixed footer content overlapping with the like button when likes were enabled and comments were disabled on post pages.
- Fixed page crashes caused by the random-article feature when no posts were published.
- Removed an accidentally applied border color.

### 🛠️ Miscellaneous Chores

- Refactored the build workflow.
- Modularized part of the templates.
- Updated development dependencies.

## [1.49.0] - 2025-11-29

### 💥 Breaking Changes

- You must migrate custom icons using the new process. See `Tutorial: Custom Icons (Deleted)`. If you previously customized icons, please follow that migration guide.
- Options under `Custom Share Buttons` will be reset. Existing values are not overwritten in source data; you can recover them from [Export Theme Config](/en/reference/faq#how-to-export-theme-configuration).

### 🔧 Code Refactoring

- Improved link behavior for the `Native` (browser-native share) item in `Custom Share Buttons -> Share Button Settings`.
- Optimized code to avoid attaching unnecessary data to the global `window` object, reducing page size.
- Upgraded Tailwind CSS from v3 to v4.
- Migrated the icon system from `vite-plugin-purge-icons` to `@iconify/tailwind4`.

### 🐛 Bug Fixes

- Fixed save failures caused by missing defaults in some `Custom Share Buttons -> Share Button Settings` items.
  - For the `Native` item under `Custom Share Buttons -> Share Button Settings`, the URL should be `@URL`.
- Fixed an issue where the desktop post-page share menu could occasionally fail to open.
- Fixed an incorrect type for `Show in Post List` in the English settings package.
- Fixed SVG icons not being inlined into CSS; runtime icon fetching from iconify servers is no longer required.

## [1.48.3] - 2025-11-26

### 🔧 Code Refactoring

- Further optimized code splitting and removed redundant styles.

### 🐛 Bug Fixes

- Fixed incorrect hover style rendering for author names on the Moments page.

### 🛠️ Miscellaneous Chores

- Refactored the build workflow.
- Modularized part of the templates.
- Updated development dependencies.

## [1.48.2] - 2025-11-25

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

### 🐛 Bug Fixes

- Fixed pages using the simple post list layout not rendering as expected.
- Fixed redundant styles appearing in the Moments page list.
- Fixed incorrect hover style rendering for action-bar buttons on the Moments page.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.48.1] - 2025-11-23

### 🚀 Features

- Added a new doc: [Performance Reference](/en/reference/performance).
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

- Added `Page Metadata -> Custom Template -> [Post Page Style](/en/guide/metadata-configuration#post-page-style)`.
  - Replaces the previous `Custom Page Style -> Enable Post-like Page Style`.

### 🔧 Code Refactoring

- Optimized custom page style size; script and stylesheet bundles were both reduced by [-15%](https://github.com/HowieHz/halo-theme-higan-hz/pull/327#issuecomment-3566640583).

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.47.0] - 2025-11-20

### 🚀 Features

- Added `Global Style -> [Extra Menu Items](/en/guide/theme-configuration#extra-menu-items)`.
  - Replaces the previous `Global Style -> Random Article Menu Item` and `Global Style -> User Account Menu Item`.
  - Implemented as a repeater: supports custom ordering, free add/remove of entries.
  - Added a new `User Account` item type:
    - When logged out, the menu shows `Login` and links to `/login`.
    - When logged in, the menu shows the username and links to `/uc`.

### 🛠️ Miscellaneous Chores

- Updated development dependencies.

## [1.46.0] - 2025-11-17

### 🚀 Features

- Launched the new docs site: [Higan Haozi](/en/).
  - [Writing reference docs: base styles, extended styles, and usage](/en/guide/style-reference)
  - [Plugin compatibility docs](/en/guide/plugin-compatibility)
  - [Theme configuration docs](/en/guide/theme-configuration)
  - [Metadata configuration docs](/en/guide/metadata-configuration)

### 🔧 Code Refactoring

- Split part of shared styles out to reduce page size.
- Optimized descriptions for theme configuration options.

### 🛠️ Miscellaneous Chores

- Updated development dependencies and removed unused dependencies.

## [1.45.4] - 2025-11-07

### 🐛 Bug Fixes

- Fixed tag color rendering issues when `Tags Page Style -> Tag Sort Order` was enabled.

## [1.45.3] - 2025-11-07

### 🚀 Features

- Tags in the tag list, tag detail pages, the home page rich post list, and the post header tag area now follow the configured tag colors.

## [1.45.2] - 2025-11-06

### 🔧 Code Refactoring

- Adapted the theme to [API Extension Pack v3](https://www.halo.run/store/apps/app-di1jh8gd).

## [1.45.1] - 2025-11-05

### 🚀 Features

- Added Spanish translations for built-in i18n strings.

### 🔧 Code Refactoring

- Optimized the performance of `Global -> Restrict Access to Allowed Domains`, which is intended to prevent traffic loss from malicious mirrors.

## [1.45.0] - 2025-10-20

### 🚀 Features

- Added a `Show in Post Lists` metadata option for posts. This controls whether a post appears in post lists across the home page, tag detail pages, category detail pages, author detail pages, and archives.

## [1.44.0] - 2025-10-02

### 🚀 Features

- Added support for displaying word counts on post pages.
- Added support for displaying word counts and estimated reading time on single pages.
- Added support for displaying word counts and estimated reading time on Moments pages.
  - These features are also compatible with the lightweight edition of API Extension Pack v2.
  - When the plugin is enabled, word counts and estimated reading time use a more accurate calculation method automatically.

## [1.43.1] - 2025-10-01

### 🚀 Features

- Added support for the lightweight edition of API Extension Pack v2.
  - When the plugin is enabled, single-post word counts use a more accurate calculation method automatically.
  - `General Styles -> Site Statistics at the Bottom of the Page` can now display a total word count.

## [1.43.0] - 2025-09-21

### 🚀 Features

- Added support for the [plugin-extra-api](https://github.com/HowieHz/halo-plugin-extra-api) extension plugin.
  - When the plugin is enabled, single-post word counts use a more accurate calculation method automatically.
  - `General Styles -> Site Statistics at the Bottom of the Page` can now display a total word count.

## [1.42.14] - 2025-09-13

### 🚀 Features

- The theme now injects RSS `link` tags on pages whenever the RSS plugin is enabled or RSS is included in the home page contact links.

## [1.42.13] - 2025-09-05

### 🔧 Code Refactoring

- Refactored generated output to reduce theme package size and final render size, lowering bandwidth usage.

### 🐛 Bug Fixes

- Fixed an issue where some configuration items could not be loaded correctly.

## [1.42.12] - 2025-08-27

### 🐛 Bug Fixes

- Fixed an issue where some top-menu buttons did not work correctly on certain pages.
- Fixed inaccessible 404 and 5xx pages.
- Hid the `Deleted User` label on post pages as a workaround for [halo-dev/halo#7710](https://github.com/halo-dev/halo/issues/7710).

## [1.42.11] - 2025-08-27

### 🐛 Bug Fixes

- Fixed an issue where some custom font formats could not be loaded correctly. See [#268](https://github.com/HowieHz/halo-theme-higan-hz/pull/268).

## [1.42.10] - 2025-08-26

### 🚀 Features

- Improved the mobile post-page table of contents styles and auto-scroll behavior. See [#265](https://github.com/HowieHz/halo-theme-higan-hz/pull/265).

## [1.42.9] - 2025-08-25

### 🐛 Bug Fixes

- Fixed an issue where the mobile post-page table of contents could fail to render correctly when there were too many items, ensuring auto-highlighting and auto-scrolling work as expected. See [#261](https://github.com/HowieHz/halo-theme-higan-hz/pull/261).
- Fixed an issue where the desktop post-page table of contents did not auto-scroll correctly. See [#262](https://github.com/HowieHz/halo-theme-higan-hz/pull/262).

## [1.42.8] - 2025-08-24

### 🚀 Features

- Added support for the new official comment component v3 styles.

## [1.42.7] - 2025-08-05

### 🚀 Features

- Added custom `hide` and `spoiler` tags for concealing sensitive content.
  - Content is blurred by default for privacy protection.
  - Supports `class="black"` as a black-box style variant.
  - Content is revealed automatically on hover, focus, or text selection.
  - Includes smooth transitions for a better user experience.
  - Suitable for spoilers, answer hints, or other content that should be revealed cautiously.

### 🔧 Code Refactoring

- Refactored the build structure and template generation flow to replace the deprecated `th:include` tag and reduce shared style size.
- Refactored desktop table of contents control logic for more consistent styling.

### 🐛 Bug Fixes

- Fixed an issue where long table-of-contents entries could push the desktop menu leftward.
  - Refactored the related code to improve layout stability.
- Fixed abbreviation previews not working on mobile devices.

## [1.42.6] - 2025-08-03

### 🚀 Features

- Added a custom `hide` tag for concealing sensitive content.
  - Content is blurred by default for privacy protection.
  - Content is revealed automatically on hover, focus, or text selection.
  - Includes smooth transitions for a better user experience.
  - Suitable for spoilers, answer hints, or other content that should be revealed cautiously.

### 🐛 Bug Fixes

- Fixed an issue where the `head` tag was closed prematurely.

## [1.42.5] - 2025-08-02

### 🐛 Bug Fixes

- Fixed broken buttons in the single-page template ([#249](https://github.com/HowieHz/halo-theme-higan-hz/pull/249)).

## [1.42.4] - 2025-07-30

### 🔧 Code Refactoring

- Changed `font-display` from `block` to `swap` in third-party `@font-face` declarations to improve perceived font loading and avoid blocking text rendering.

## [1.42.3] - 2025-07-29

### 🔧 Code Refactoring

- Rewrote table-of-contents generation to remove external dependencies entirely, significantly reducing bundle size and improving build-time and runtime performance.
  - Post-page `post.js`: 240.13 kB (76.70 kB gzipped) -> 4.48 kB (1.62 kB gzipped), a reduction of 98.13% raw and 97.89% gzipped.
- Optimized TOC highlighting by rewriting the scroll handler to reduce jank.

### 🐛 Bug Fixes

- Fixed an issue where H4 headings did not appear in the mobile post-page table of contents.
- Fixed an issue where the TOC generator could produce duplicate IDs.

## [1.42.2] - 2025-07-29

### 🔧 Code Refactoring

- Rewrote table-of-contents generation to remove external dependencies entirely, significantly reducing bundle size and improving build-time and runtime performance.
- Optimized TOC highlighting by rewriting the scroll handler to reduce jank.

### 🐛 Bug Fixes

- Fixed an issue where H4 headings did not appear in the mobile post-page table of contents.

## [1.42.1] - 2025-07-27

### 🔧 Code Refactoring

- Added a JavaScript compatibility layer to improve backward compatibility.
- Removed unused dependencies.
- Revised the automated build scripts.
- Migrated project configuration files from CommonJS to ES Modules.

### 🐛 Bug Fixes

- Fixed incorrect hyperlink styles in Moments page content.

## [1.42.0] - 2025-07-21

### 🚀 Features

- Added support for custom font files:
  - When enabled, you can upload font files in formats such as `.woff`, `.woff2`, and `.ttf`, and the theme will use them in place of the default fonts.
  - You can also specify a font name, such as `My Custom Font Regular` or `MyCustomFont-Regular`, so a locally installed copy is preferred when available.

### 🔧 Code Refactoring

- Made `woff2` the preferred default font format (153 KB), with automatic fallback to `woff` (223 KB) and then `ttf` (488 KB).
- Fully refactored the build pipeline to split styles and scripts by page, improving asset reuse, reducing bandwidth, and speeding up page loads.
- Preloaded critical assets to shorten initial render time.
- Reduced asset sizes significantly:
  - Test home page: 1.1 MiB -> 304 KB (about 72% smaller)
  - Test post page: 2.2 MiB -> 1.6 MiB (about 27% smaller)

## [1.41.2] - 2025-07-15

### 🐛 Bug Fixes

- Fixed an issue where the post-page first-line indentation setting unexpectedly affected images [#231](https://github.com/HowieHz/halo-theme-higan-hz/issues/231) @HowieHz in [#234](https://github.com/HowieHz/halo-theme-higan-hz/pull/234).

## [1.41.1] - 2025-07-10

### 🐛 Bug Fixes

- Fixed an issue where the post-page first-line indentation setting unexpectedly affected lists [#231](https://github.com/HowieHz/halo-theme-higan-hz/issues/231) @HowieHz in [#232](https://github.com/HowieHz/halo-theme-higan-hz/pull/232).

## [1.41.0] - 2025-07-01

### 🚀 Features

- Adapted multilingual features for Halo 2.20.19 and later ([#229](https://github.com/HowieHz/halo-theme-higan-hz/pull/229)).
- Added automatic redirects based on the browser language.

### 🔧 Code Refactoring

- Streamlined multilingual configuration options to reduce redundancy.

## [1.40.1] - 2025-06-30

### 🔧 Code Refactoring

- Refactored the codebase to remove the jQuery dependency entirely ([#227](https://github.com/HowieHz/halo-theme-higan-hz/pull/227)).

## [1.40.0] - 2025-06-27

### 🚀 Features

- Added custom bylines for footer copyright text. You can now set a custom byline in `Page Styles`; if left empty, the site title is used.
- Added a paragraph first-line indentation toggle so you can choose whether paragraph indentation is enabled.
- Added paragraph height optimization settings, including a minimum paragraph height for better display of intentional blank lines in posts.

### 🔧 Code Refactoring

- Migrated the main JavaScript code to TypeScript to improve code quality and type safety.
- Reduced reliance on jQuery by replacing some jQuery logic with native JavaScript.
- Removed `idle.js` to simplify the code structure.
- Optimized TOC generation:
  - Added warnings when `inputHTML` is empty during TOC generation.
  - Removed `@ts-expect-error` annotations to improve type safety.
  - Added targeted comments to improve maintainability.

### 🐛 Bug Fixes

- Fixed an issue where H1 headings could not appear correctly in the post-page table of contents.

## [1.39.0] - 2025-06-25

### 🚀 Features

- Added an option to remove the underline style from H3 headings.

## [1.38.0] - 2025-06-02

### 🚀 Features

- Added RSS support for category, tag, and author detail pages ([#215](https://github.com/HowieHz/halo-theme-higan-hz/pull/215)).
  - Added `Allow RSS Subscribe Button on This Page` to `Tag Detail Page Style`, `Category Detail Page Style`, and `Author Detail Page Style`.
- Added sorting rules and post-count visibility controls for the tag index page ([#217](https://github.com/HowieHz/halo-theme-higan-hz/pull/217)).
  - `Tags Page Style` now includes an option to show or hide the post count for each tag.
  - You can set the character shown before the post count.
  - You can set the character shown after the post count.
  - `Tags Page Style` now includes tag sorting options:
    - Default order
    - Post count, descending
    - Post count, ascending
    - Name, ascending
    - Name, descending

### 🛠️ Miscellaneous Chores

- Updated dependencies ([#216](https://github.com/HowieHz/halo-theme-higan-hz/pull/216)).

## [1.37.0] - 2025-05-17

### 🚀 Features

- Adapted breadcrumb support for category metadata in the home page rich post list.
- Further aligned the theme with official comment plugin styles.

### 🔧 Code Refactoring

- Revised custom style settings.
- Revised color scheme settings.

### 🛠️ Miscellaneous Chores

- Optimized stylesheet output.

## [1.36.0] - 2025-05-14

### 🚀 Features

- Added a Moments list layout option for the home page.
  - Allows you to configure the number of entries shown.
  - Allows you to choose whether author avatars and nicknames are displayed.

### 🐛 Bug Fixes

- Fixed incorrect hover styles for the like button on the Moments page.

## [1.35.0] - 2025-04-20

### 🚀 Features

- Added an option to hide post view counts.
- Improved breadcrumb display for post categories.

### 🔧 Code Refactoring

- Reduced script bundle size.
- Refactored stylesheets to reduce size, improve compatibility, and remove unused styles.

## [1.34.1] - 2025-04-14

### 📄 Documentation

- Added documentation for the theme template map.

### 🛠️ Miscellaneous Chores

- Optimized stylesheets.
- Improved toolchain configuration.
- Reduced distribution size.

## [1.34.0] - 2025-04-09

### 🚀 Features

- Added an option to enable post-like styling on custom pages.

## [1.33.0] - 2025-04-09

### 🚀 Features

- Added support for configuring the maximum width of the sidebar table of contents.

## [1.32.1] - 2025-04-07

### 🔧 Code Refactoring

- Optimized template rendering performance and related styles.

### 🐛 Bug Fixes

- Hid the empty placeholder space beside adjacent-post navigation when no recommendations are available.
- Prevented the current post from appearing in the recommendation list.

## [1.32.0] - 2025-04-06

### 🚀 Features

- Added recommended posts and adjacent-post navigation at the end of posts.

### 🔧 Code Refactoring

- Improved the wording for random-article menu descriptions and slightly adjusted the configuration location.

## [1.31.0] - 2025-03-30

### 🚀 Features

- Added support for jumping to a random post.

## [1.30.0] - 2025-03-16

### 🚀 Features

- Added an option to set table bottom-border width.
- Added support for custom resource locations.
- Added support for heading margin multipliers.
- Added support for paragraph margin multipliers.

### 🐛 Bug Fixes

- Fixed unexpected line wrapping in footer information at narrow widths.

## [1.29.1] - 2025-02-14

### 🐛 Bug Fixes

- Fixed an issue where the bottom border of each table row could render incorrectly.

### 📄 Documentation

- Updated the sponsor list. Thanks for the support.

## [1.29.0] - 2025-02-12

### 🚀 Features

- Added support for preserving the bottom border on each table row.

### 📄 Documentation

- Updated the sponsor list.

## [1.28.0] - 2025-02-10

### 🚀 Features

- Added support for custom random-sentence text and custom Hitokoto links.

### 🛠️ Miscellaneous Chores

- Removed unused components.
- Updated project dependencies.

## [1.27.0] - 2025-01-25

### 🚀 Features

- Added support for customizing footer theme information.

### 🛠️ Miscellaneous Chores

- Added support for customizing the theme name shown there.
- Added support for customizing the Halo version label shown there.
- Updated library versions.
- `unplugin-fonts`: `1.1.1` -> `1.3.1`
- `vite`: `3.2.11` -> `6.0.11`
- Reduced `DOMContentLoaded` and full load time by 0.02 seconds on a 3G network profile.

## [1.26.0] - 2025-01-20

### 🚀 Features

- Added support for displaying post cover images in the rich post list ([#152](https://github.com/HowieHz/halo-theme-higan-hz/issues/152)).

## [1.25.0] - 2025-01-17

### 🚀 Features

- Added support for collapsing archive entries by publication year and month ([#149](https://github.com/HowieHz/halo-theme-higan-hz/pull/149)).

## [1.24.0] - 2025-01-14

### 🚀 Features

- Added support for displaying post view counts on tag detail pages and category detail pages ([#147](https://github.com/HowieHz/halo-theme-higan-hz/pull/147)).

## [1.23.0] - 2025-01-14

### 🚀 Features

- Added support for displaying post view counts in the simple post list ([#145](https://github.com/HowieHz/halo-theme-higan-hz/pull/145)).

### 🔧 Code Refactoring

- Optimized color rendering for elements in the rich post list.

## [1.22.0] - 2025-01-13

### 🚀 Features

- Added excerpt line-clamp controls for the rich post list ([#137](https://github.com/HowieHz/halo-theme-higan-hz/pull/137)).
- Added support for displaying estimated reading time on the home page rich post list and post pages ([#140](https://github.com/HowieHz/halo-theme-higan-hz/pull/140)).
- Added support for custom color schemes ([#141](https://github.com/HowieHz/halo-theme-higan-hz/pull/141)).
- Added multilingual support for the announcement bar ([#142](https://github.com/HowieHz/halo-theme-higan-hz/pull/142)).
- Added multilingual support for the content shown at the very bottom of the page ([#143](https://github.com/HowieHz/halo-theme-higan-hz/pull/143)).

### 🐛 Bug Fixes

- Fixed [#135](https://github.com/HowieHz/halo-theme-higan-hz/issues/135) ([#136](https://github.com/HowieHz/halo-theme-higan-hz/pull/136)).

## [1.21.0] - 2025-01-10

### 🚀 Features

- Added an option to disable the share menu ([#123](https://github.com/HowieHz/halo-theme-higan-hz/pull/123)).
- Added support for displaying post publish and update times ([#124](https://github.com/HowieHz/halo-theme-higan-hz/pull/124)).
- Enhanced the theme mode toggle ([#125](https://github.com/HowieHz/halo-theme-higan-hz/pull/125)).
  - Added an option to switch color schemes automatically based on browser preferences.
  - Added an option to save color-scheme preferences in the browser.
- Expanded customization for the home page rich post list ([#126](https://github.com/HowieHz/halo-theme-higan-hz/pull/126)).
  - Added options to show post categories.
  - Added options to show post tags.
  - Added options to show post view counts.
  - Added options to hide post excerpts.
- Added support for site statistics at the bottom of the page ([#127](https://github.com/HowieHz/halo-theme-higan-hz/pull/127)).
  - Supports custom order and item count.
  - Supports choosing icons or text.
- Added support for automatic redirects and countdowns on error pages ([#128](https://github.com/HowieHz/halo-theme-higan-hz/pull/128)).
- Added WeChat, QR Code generation, and browser-native sharing to the share menu ([#129](https://github.com/HowieHz/halo-theme-higan-hz/pull/129)).
- Added support for preserving blank lines inside blockquotes ([#130](https://github.com/HowieHz/halo-theme-higan-hz/pull/130)).
- Matched scrollbar colors to the active light or dark theme ([#132](https://github.com/HowieHz/halo-theme-higan-hz/pull/132)).
- Added support for a like button at the bottom of posts ([#133](https://github.com/HowieHz/halo-theme-higan-hz/pull/133)).
  - Added options to set icon size.
  - Added options to show or hide the like count.
  - Added options to control alignment: left, center, or right.

## [1.20.0] - 2025-01-09

### 🚀 Features

- Added support for the [plugin-photos photo management plugin](https://www.halo.run/store/apps/app-BmQJW).

| **Desktop** | **Mobile** |
| :---: | :---: |
| ![BEFC9E98360B43EDF103C42E1ED66F5C](https://github.com/user-attachments/assets/ecf41f06-b2c1-41d4-b0a1-e187031a92e7) | ![Screenshot 2025-01-09 015045](https://github.com/user-attachments/assets/6a46b65c-bbdf-4654-91cc-465e5802f690) |

- Added an option to set image border radius.
- Added an option to set image fade-in animation duration.
- Added an option to hide group titles.
- Added support for waterfall layout.
  - Added options to set the maximum and minimum column count.
  - Added an option to set the minimum image width.
  - Added an option to set gutter width.
- Added advanced options for users with frontend knowledge:
  - Custom `onmouseover` attributes for images.
  - Custom `onmouseout` attributes for images.
- Recommended for use with the [Photo Lightbox plugin](https://www.halo.run/store/apps/app-OoggD).
- Photo Lightbox plugin settings:

| Path match | Target area |
| --- | --- |
| `/photos` | `article .content` |
| `/photos/**` | `article .content` |

## [1.19.0] - 2025-01-04

### 🚀 Features

- Enhanced the share menu.

### 🐛 Bug Fixes

- Fixed incorrect URLs generated by share buttons.

### 🛠️ Miscellaneous Chores

- Applied the share buttons in this release to posts and custom pages in both desktop and mobile layouts.

## [1.18.0] - 2025-01-03

### 🚀 Features

- Added a new blue color scheme.
- Added support for assigning different theme schemes to each state of the light/dark/auto toggle.

### 🐛 Bug Fixes

- Reset the default `Add Quote After Blockquote` setting to match the upstream theme.

### 🛠️ Miscellaneous Chores

- Optimized theme-toggle logic.

## [1.17.0] - 2025-01-01

### 🚀 Features

- Added an option to append quotation marks after blockquotes.
- Added an option to remove quotation marks before blockquotes.

### 🔧 Code Refactoring

- Formatted text with `autocorrect`.

### 🛠️ Miscellaneous Chores

- Merged the upstream change `chore: add annotations app-id`.
- Merged the upstream change `chore: remove thumbnail for site logo`.

## [1.16.1] - 2024-12-13

### 🐛 Bug Fixes

- Fixed Mermaid SVG ID collisions (related upstream issue: [mermaid-js/mermaid#5741](https://github.com/mermaid-js/mermaid/issues/5741)).

### 📄 Documentation

- Split the contribution guide out of the README.

## [1.16.0] - 2024-12-11

### 🚀 Features

- Added built-in Mermaid support with automatic light/dark theme switching. See the documentation for details.
  - Compared with the available plugin as of 2024-12-11, the built-in support is more complete.
- Added support for content that is shown only in light mode or only in dark mode.

## [1.15.1] - 2024-12-09

### 🚀 Features

- Added animation to the back-to-top button in the mobile bottom navigation bar.

### 🛠️ Miscellaneous Chores

- Improved code efficiency.
- Reduced page size.
- Removed unused code.

## [1.15.0] - 2024-12-08

### 🚀 Features

- Added an option to hide the bottom navigation bar on post pages in mobile layout.
- Added show/hide animations for the top navigation bar on non-post pages in mobile layout.
- Added show/hide animations for the bottom navigation bar, including submenus, on post pages in mobile layout.
- Added show/hide animations for the top navigation bar, including submenus, on post pages in desktop layout.
- Added show/hide animations for the top navigation bar, its submenus, and the back-to-top button on post pages in tablet layout.

### 🔧 Code Refactoring

- Reduced unnecessary DOM depth.
- Changed some button links from `#` to `javascript:void(0);`.

### 🐛 Bug Fixes

- Fixed an issue where the back-to-top button did not display correctly on post pages in tablet layout.
- Fixed an issue where the menu did not hide together with the menu button on post pages in tablet layout.
- Fixed an issue where the hidden top navigation bar on post pages in desktop layout could still block page controls _[#89](https://github.com/HowieHz/halo-theme-higan-hz/issues/89)_.

## [1.14.0] - 2024-12-07

### 🚀 Features

- Added an option to hide the header avatar.
- Added an option to hide the header menu.
- Added an option to hide the footer pager, or hide it automatically when there is only one page.

### 🔧 Code Refactoring

- Fine-tuned configuration item descriptions.

## [1.13.1] - 2024-12-06

### 🚀 Features

- Added animation for theme switching between light and dark modes.

### 🔧 Code Refactoring

- Nudged the theme toggle button one pixel up and one pixel left.

## [1.13.0] - 2024-12-06

### 🚀 Features

- Added an option to hide the three fixed text strings on the home page.

## [1.12.3] - 2024-12-06

### 🔧 Code Refactoring

- Reduced the chance of `instant.page` JavaScript being blocked.

### 🐛 Bug Fixes

- Fixed theme-switch flashing while the page was loading.

## [1.12.2] - 2024-11-26

### 🚀 Features

- Added `Global -> instant.page Support` to load the `instant.page` script automatically and improve page load speed.

### 🔧 Code Refactoring

- Optimized script loading to improve page load performance.

## [1.12.1] - 2024-11-23

### 🚀 Features

- Added i18n support for admin-side configuration pages.
- Added automatic GitHub Actions builds for language-specific theme packages.

### 🔧 Code Refactoring

- Reduced theme package size from 3900 KB to 679 KB for the Chinese package and 677 KB for the English package.

### 🛠️ Miscellaneous Chores

- Updated project dependencies and bundled JavaScript libraries.

## [1.12.0] - 2024-11-21

### 🚀 Features

- Added an optional theme mode toggle beside the main heading, cycling through `light -> dark -> auto -> light` ([#13](https://github.com/HowieHz/halo-theme-higan-hz/issues/13)).
- Persisted the selected mode in `localStorage` after clicking the icon.
- Added fully customizable social profiles, including icons, links, and accessibility labels ([#83](https://github.com/HowieHz/halo-theme-higan-hz/issues/83)).
- Added an option to force the footer to stay at the bottom of the page ([#78](https://github.com/HowieHz/halo-theme-higan-hz/issues/78)).

## [1.11.0] - 2024-11-19

### 🚀 Features

- Added support for inserting plain text among the social icons on the home page.

### 🔧 Code Refactoring

- Merged `RSS` settings into `Social Profiles / RSS`.

## [1.10.2] - 2024-11-19

### 🚀 Features

- Added `zh_TW` support to i18n.

### 🔧 Code Refactoring

- Reworked the language file structure.

## [1.10.1] - 2024-11-18

### 🐛 Bug Fixes

- Fixed a home page error that prevented the page from loading.

## [1.10.0] - 2024-11-18

### 🚀 Features

- Added `Default Page Language`, which lets you define the default page language (`lang` on the HTML element). When left empty, it falls back to `zh`.
- Added custom `Page Title` and `Page Language` metadata options for post pages, category pages, tag pages, and single pages.
- Added i18n support.
  - Added multilingual menus.
  - Added `zh` and `en` language files so all fixed strings can be customized.

### ⚠️ Deprecated

- Deprecated the following configuration items to support i18n:
  - `Home Page - Text to the Left of Social Profile Icons`
  - `Home Page - Home Page Post List Title`
  - `Home Page - Hint Text for Post Links`

## [1.9.0] - 2024-10-16

### 🚀 Features

- Added more flexible controls for content width.
- Added support for a custom maximum content width.
- Added support for a custom minimum content width.
- Added support for forcing the minimum content width.
- Added support for a custom content width property value.

## [1.8.1] - 2024-10-10

### 🚀 Features

- Added `Restrict Access to Allowed Domains`.
- This helps prevent traffic loss from malicious mirrors by redirecting requests from non-allowlisted domains to the specified domain.

### 🐛 Bug Fixes

- Fixed an issue where child options under `Restrict Access to Allowed Domains` were not hidden correctly.

## [1.8.0] - 2024-10-10

### 🚀 Features

- Added `Restrict Access to Allowed Domains`.
- This helps prevent traffic loss from malicious mirrors by redirecting requests from non-allowlisted domains to the specified domain.

## [1.7.0] - 2024-09-02

### 🚀 Features

- Synced upstream changes from [halo-theme-higan@v2.9.0](https://github.com/guqing/halo-theme-higan/releases/tag/v2.9.0).
- Added compatibility for upstream improvements to responsive thumbnails.

## [1.6.1] - 2024-08-27

### 🐛 Bug Fixes

- Fixed an incorrectly assigned minimum page height that prevented the footer from staying at the bottom of the page ([#60](https://github.com/HowieHz/halo-theme-higan-hz/issues/60)).

## [1.6.0] - 2024-08-07

### 🚀 Features

- Added `General Styles -> Add Content to Bottom of Footer`, allowing custom content to be inserted at the very bottom of the footer.

### 📄 Documentation

- Added documentation for the new configuration item.

### 🛠️ Miscellaneous Chores

- Corrected inaccurate descriptions in the README.

## [1.5.0] - 2024-07-20

### 🚀 Features

- Added a `Categories Page Style` settings page for `/categories`.
- Added an option to show or hide the number of posts in each category.
- Added an option to set the character shown before the post count, which defaults to `(` in this release.
- Added an option to set the character shown after the post count, which defaults to `)` in this release.
- Added an option to show or hide nested categories.

### 🛠️ Miscellaneous Chores

- Updated project documentation.

## [1.4.0] - 2024-07-11

### 🛠️ Miscellaneous Chores

- Updated project documentation.

## [1.3.0] - 2024-06-19

### 🚀 Features

- Added an option to disable comments on all post pages ([#48](https://github.com/HowieHz/halo-theme-higan-hz/issues/48)).
- Added an option to remove the separator line at the end of posts.
- Added an option to disable the like button on the Moments page ([#48](https://github.com/HowieHz/halo-theme-higan-hz/issues/48)).
- Added an option to disable comments on the Moments page ([#48](https://github.com/HowieHz/halo-theme-higan-hz/issues/48)).
- Added an option to disable comments on custom pages ([#48](https://github.com/HowieHz/halo-theme-higan-hz/issues/48)).
- Added an option to enable a separator between custom-page content and the comment section.

### 🔧 Code Refactoring

- Renamed the `RSS - Home Page RSS Display` option.

### 🛠️ Miscellaneous Chores

- Updated project documentation.
- Improved project structure.
- Updated project dependencies.

## [1.2.1] - 2024-06-12

### 🐛 Bug Fixes

- Refactored styling with `PostCSS`, `Tailwind CSS`, and `daisyUI`, fixing upstream styles that were referenced in class attributes but not loaded correctly, as well as styles that were not working as intended.

### 🛠️ Miscellaneous Chores

- Removed unused styles to reduce final bundle size.

## [1.2.0] - 2024-06-11

### 🚀 Features

- Added support for customizing fixed text on the home page ([#29](https://github.com/HowieHz/halo-theme-higan-hz/issues/29)).
- Added support for custom post-page titles through post metadata (`f33fc41c852718af8548c1dd7fb0ccaee9a44ffc`).
- Added support for setting a dedicated HTML title for the home page instead of always using `Halo Settings -> Basic Settings -> Site Title` ([#50](https://github.com/HowieHz/halo-theme-higan-hz/issues/50)).

### 🔧 Code Refactoring

- Improved compatibility with upstream special data types in the Moments template.

### 🐛 Bug Fixes

- Removed stray whitespace that appeared before navigation text. Thanks to @THYUU and @L33Z22L11. [upstream#113](https://github.com/guqing/halo-theme-higan/issues/113)

### 🛠️ Miscellaneous Chores

- Removed deprecated `halo:comment` tag attributes.
- Fixed issues reported by VS Code inspections.
- Updated `pnpm-lock.yaml` from `lockfileVersion: '6.0'` to `lockfileVersion: '9.0'`.
- Corrected the `license` field in `package.json` from `"GPL-3.0"` to `"MIT"`.
- Deleted unused files to reduce package size.
- Normalized inconsistent headings in `README.md`. Thanks to @KazariEX.
- Fixed broken post TOC positioning. Authored by @HowieHz. [upstream#69](https://github.com/guqing/halo-theme-higan/issues/69)

## [1.1.4] - 2024-05-12

### 💥 Breaking Changes

- Updating to this version requires clearing and re-entering the `Social Profiles` configuration.

### 🔧 Code Refactoring

- Improved the social profile setup guide.

### 🛠️ Miscellaneous Chores

- Renamed `v1.1.3.1` to `v1.1.4`.

## [1.1.3] - 2024-05-12

### 🚀 Features

- Added controls for enabling or disabling the pin icon in post lists and for choosing its position.
- Added an option to hide footer theme information.
- Added an option to hide footer copyright information.
- Added an option to hide the footer menu.
- Added an option to let users define the maximum page width ([#35](https://github.com/HowieHz/halo-theme-higan-hz/issues/35)).

### 🔧 Code Refactoring

- Improved icon selection for the home page social media section.
- Improved settings labels.
- Improved the social profile setup guide.

### 🛠️ Miscellaneous Chores

- Updated original theme metadata to point to the current branch.

## [1.1.2] - 2024-05-12

### 💥 Breaking Changes

- This release includes major configuration-file changes. Back up existing configuration values before upgrading.

### 🚀 Features

- Added support for custom RSS icon target links (`bb4d6946a36579ae4ca7fcdea4c0d4df4d5cfd80`).
- Reorganized options into multiple sections instead of grouping everything under a single `Style` section (`bb4d6946a36579ae4ca7fcdea4c0d4df4d5cfd80`).
- Added support for customizing the number and order of contact methods shown on the home page (`bb4d6946a36579ae4ca7fcdea4c0d4df4d5cfd80`).
- Added support for HTML in the introduction area of the Links page (`8f7379353257168ab77cd39ac8e5e41c1713bcbb`).
- Added support for more social platforms ([#6](https://github.com/HowieHz/halo-theme-higan-hz/issues/6)).

### 🐛 Bug Fixes

- Fixed layout breakage in the home page rich list when long words appeared at narrow widths [#16](https://github.com/HowieHz/halo-theme-higan-hz/issues/16).
- Fixed an issue where category and tag archive pages showed the creation time instead of the publish time on the left side of each post item [#12](https://github.com/HowieHz/halo-theme-higan-hz/issues/12).
- Fixed `package.json` scripts that could not run on Linux and macOS.
- Reworked inline JavaScript to use Thymeleaf natural templates so files can be formatted correctly (`bb4d6946a36579ae4ca7fcdea4c0d4df4d5cfd80`).
- Hid the `Find me on` text when home page social profiles are empty [#33](https://github.com/HowieHz/halo-theme-higan-hz/issues/33).
- Fixed incorrect table-of-contents positioning styles [#11](https://github.com/HowieHz/halo-theme-higan-hz/issues/11).

### 🛠️ Miscellaneous Chores

- Reworked inline JavaScript to use Thymeleaf natural templates so files can be formatted correctly.
- Added an `issues` field to the theme configuration file and removed unused fields.
- Adjusted spacing between code blocks and the comment component.
- Improved consistency in comment input background colors.
- Optimized content area sizing on wide screens.
- Added license declarations.
- Fixed inconsistent spacing on archive pages.
- Improved line wrapping for footer copyright text.
- Fixed excessive spacing around long inline code spans.
- Added `aria-label` attributes to pagination.

## [1.1.1] - 2024-04-06

### 🚀 Features

- Added Qzone to the share bar at the top of posts.

### 🔧 Code Refactoring

- Replaced the Twitter share link with X.

### 🐛 Bug Fixes

- Fixed inline code rendering issues [#24](https://github.com/HowieHz/halo-theme-higan-hz/issues/24).

### 🛠️ Miscellaneous Chores

- Optimized project styles and reduced redundant files.
- Added missing tags and closed unclosed `img` tags.
- Ran linting.

## [1.1.0] - 2024-04-05

### 🚀 Features

- Added support for enabling Hitokoto and the personal profile at the same time [#14](https://github.com/HowieHz/halo-theme-higan-hz/issues/14).

### 🔧 Code Refactoring

- Increased the height of the `Style - Personal Profile` input box from `100px` to `150px`.

### 🛠️ Miscellaneous Chores

- Converted Thymeleaf inline CSS in `templates\\fragments\\layout.html` to natural template syntax to avoid formatting-related breakage.
- Polished configuration option wording and documentation.

## [1.0.1] - 2024-04-05

### 💥 Breaking Changes

- The configuration values for `Style - Color Scheme` changed. After upgrading, select a different color scheme and save once to refresh the stored value, then switch back to the scheme you actually want to use.

### 🐛 Bug Fixes

- Fixed rendering flicker caused by delayed stylesheet loading ([#18](https://github.com/HowieHz/halo-theme-higan-hz/issues/18)).

## [1.0.0] - 2024-04-05

### 🚀 Features

- Added a pinned-post indicator to the home page when using the rich list layout, using the same icon as the simple list layout.
- Added a `Follow System` option to `Style - Color Scheme`.
- Added `Content Area Maximum Width` under `Style`, with a default value of `48rem` to match the upstream theme.

### 🔧 Code Refactoring

- Wrapped `Theme is higan Powered by Halo © 2024 sitename` across multiple lines in the footer to avoid layout issues on small screens [guqing/halo-theme-higan#87](https://github.com/guqing/halo-theme-higan/issues/87).
- Adjusted several fixed text strings on the home page to better fit the forked theme [guqing/halo-theme-higan#86](https://github.com/guqing/halo-theme-higan/issues/86).
- Added several missing `aria-label` attributes [guqing/halo-theme-higan#83](https://github.com/guqing/halo-theme-higan/issues/83).
- Renamed color scheme labels for `Style - Color Scheme`: `Dark Black` -> `Dark`, `White` -> `Light`, and `Light` -> `Gray Pink`.

### 📄 Documentation

- This theme is a customized fork of [halo-theme-higan](https://github.com/guqing/halo-theme-higan) `v2.8.0`.

### 🛠️ Miscellaneous Chores

- Changed the HTML `lang` attribute from `en` to `zh`.
- Refactored the theme-switching implementation.
- Updated original project links to point to the fork and adjusted metadata to avoid conflicts with the upstream theme.

[Unreleased]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.61.0...HEAD
[1.61.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.60.1...v1.61.0
[1.60.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.60.0...v1.60.1
[1.60.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.59.2...v1.60.0
[1.59.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.59.1...v1.59.2
[1.59.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.59.0...v1.59.1
[1.59.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.58.2...v1.59.0
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
[1.45.4]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.45.3...v1.45.4
[1.45.3]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.45.2...v1.45.3
[1.45.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.45.1...v1.45.2
[1.45.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.45.0...v1.45.1
[1.45.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.44.0...v1.45.0
[1.44.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.43.1...v1.44.0
[1.43.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.43.0...v1.43.1
[1.43.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.14...v1.43.0
[1.42.14]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.13...v1.42.14
[1.42.13]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.12...v1.42.13
[1.42.12]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.11...v1.42.12
[1.42.11]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.10...v1.42.11
[1.42.10]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.9...v1.42.10
[1.42.9]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.8...v1.42.9
[1.42.8]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.7...v1.42.8
[1.42.7]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.6...v1.42.7
[1.42.6]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.5...v1.42.6
[1.42.5]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.4...v1.42.5
[1.42.4]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.3...v1.42.4
[1.42.3]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.2...v1.42.3
[1.42.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.1...v1.42.2
[1.42.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.42.0...v1.42.1
[1.42.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.41.2...v1.42.0
[1.41.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.41.1...v1.41.2
[1.41.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.41.0...v1.41.1
[1.41.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.40.1...v1.41.0
[1.40.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.40.0...v1.40.1
[1.40.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.39.0...v1.40.0
[1.39.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.38.0...v1.39.0
[1.38.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.37.0...v1.38.0
[1.37.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.36.0...v1.37.0
[1.36.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.35.0...v1.36.0
[1.35.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.34.1...v1.35.0
[1.34.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.34.0...v1.34.1
[1.34.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.33.0...v1.34.0
[1.33.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.32.1...v1.33.0
[1.32.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.32.0...v1.32.1
[1.32.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.31.0...v1.32.0
[1.31.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.30.0...v1.31.0
[1.30.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.29.1...v1.30.0
[1.29.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.29.0...v1.29.1
[1.29.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.28.0...v1.29.0
[1.28.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.27.0...v1.28.0
[1.27.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.26.0...v1.27.0
[1.26.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.25.0...v1.26.0
[1.25.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.24.0...v1.25.0
[1.24.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.23.0...v1.24.0
[1.23.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.22.0...v1.23.0
[1.22.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.21.0...v1.22.0
[1.21.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.20.0...v1.21.0
[1.20.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.19.0...v1.20.0
[1.19.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.18.0...v1.19.0
[1.18.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.17.0...v1.18.0
[1.17.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.16.1...v1.17.0
[1.16.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.16.0...v1.16.1
[1.16.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.15.1...v1.16.0
[1.15.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.15.0...v1.15.1
[1.15.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.14.0...v1.15.0
[1.14.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.13.1...v1.14.0
[1.13.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.13.0...v1.13.1
[1.13.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.12.3...v1.13.0
[1.12.3]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.12.2...v1.12.3
[1.12.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.12.1...v1.12.2
[1.12.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.12.0...v1.12.1
[1.12.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.11.0...v1.12.0
[1.11.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.10.2...v1.11.0
[1.10.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.10.1...v1.10.2
[1.10.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.10.0...v1.10.1
[1.10.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.9.0...v1.10.0
[1.9.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.8.1...v1.9.0
[1.8.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.8.0...v1.8.1
[1.8.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.6.1...v1.7.0
[1.6.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.1.4...v1.2.0
[1.1.4]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/HowieHz/halo-theme-higan-hz/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/HowieHz/halo-theme-higan-hz/releases/tag/v1.0.0
