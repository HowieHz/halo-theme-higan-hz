# Releases

## Versioning

This project uses semantic versioning in the format `MAJOR.MINOR.PATCH`.

- `MAJOR`: incremented when the Halo CMS major version changes.
- `MINOR`: incremented when configuration updates are introduced.
- `PATCH`: incremented when changes do not update configuration files.

## Release Types

This theme ships two kinds of releases: stable releases and nightly prereleases. Both publish all generated theme packages to GitHub Releases; stable releases also sync to the Halo App Store, while nightly prereleases sync depending on how they are triggered.

- Stable release: triggered automatically after merging a PR labeled `release`, where `theme.yaml` carries the target semantic version.
- Nightly prerelease: triggered automatically at 00:00 Asia/Shanghai when the `main` branch had commits during the previous day. Scheduled runs publish only to GitHub Releases and do not sync to the Halo App Store by default. Manual runs can control Halo App Store sync through the `sync_to_halo_store` input, which defaults to `false`.

## Build Artifacts

The release pipeline builds multiple installable theme archives. It always uploads `howiehz-higan-cn.zip` first so Halo CMS installs the Simplified Chinese package by default during updates.

Current release artifacts:

- `howiehz-higan-cn.zip`
- `howiehz-higan-en.zip`

For full release process details, see the _Release Flow_ section in the [Contribution Guide](./contributing.md#release-flow).

## Build Provenance

Every stable release generates two kinds of provenance attestations for all `.zip` artifacts, signed by the GitHub Actions build environment, so anyone can verify the origin of a downloaded file.

| Type                    | Location                              | Verification tool       |
| ----------------------- | ------------------------------------- | ----------------------- |
| GitHub Attestation (L2) | GitHub Attestation API                | `gh attestation verify` |
| SLSA Provenance (L3)    | Release asset `multiple.intoto.jsonl` | `slsa-verifier`         |

See [Security Protection](/en/tutorial/security#verify-theme-package-integrity) for verification instructions.
