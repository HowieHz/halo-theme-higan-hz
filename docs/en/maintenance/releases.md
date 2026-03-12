# Releases

## Release Types

This theme ships two kinds of releases: stable releases and nightly prereleases. Both are published to GitHub Releases and the Halo App Store, and both upload all generated theme packages.

- Stable release: triggered automatically after merging a PR labeled `release` whose title is a semantic version.
- Nightly prerelease: triggered automatically at 00:00 Asia/Shanghai when the `main` branch had commits during the previous day.

## Build Artifacts

The release pipeline builds multiple installable theme archives. It always uploads `howiehz-higan-cn.zip` first so Halo CMS installs the Simplified Chinese package by default during updates.

Current release artifacts:

- `howiehz-higan-cn.zip`
- `howiehz-higan-en.zip`

For full release process details, see the “Release Flow” section in the [Contribution Guide](./contributing.md#release-flow).
