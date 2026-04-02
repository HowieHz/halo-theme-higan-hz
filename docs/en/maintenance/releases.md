# Releases

## Versioning

This project uses semantic versioning in the format `MAJOR.MINOR.PATCH`.

- `MAJOR`: incremented when the Halo CMS major version changes.
- `MINOR`: incremented when configuration updates are introduced.
- `PATCH`: incremented when changes do not update configuration files.

## Release Types

This theme ships two kinds of releases: stable releases and nightly prereleases. Both first verify build-artifact attestations before publishing all generated theme packages; stable releases also sync to the Halo App Store, while nightly prereleases sync depending on how they are triggered.

- Stable release: triggered automatically after merging a PR labeled `release`, where `package.json` carries the target semantic version.
- Nightly prerelease: triggered automatically at 00:00 Asia/Shanghai when the `main` branch had commits during the previous day. Scheduled runs publish only to GitHub Releases and do not sync to the Halo App Store by default. Manual runs can control Halo App Store sync through the `sync_to_halo_store` input, which defaults to `false`.

## Build Artifacts

The release pipeline builds multiple installable theme archives. It always uploads `howiehz-higan-cn.zip` first so Halo CMS installs the Simplified Chinese package by default during updates.

Current release artifacts:

- `howiehz-higan-cn.zip`
- `howiehz-higan-en.zip`

For full release process details, see the _Release Flow_ section in the [Contribution Guide](./contributing.md#release-flow).

## Build Provenance

Every stable release and nightly prerelease generates GitHub Artifact Attestations for all `.zip` artifacts, signed by the GitHub Actions build environment so anyone can verify the origin of a downloaded file.

The build pipeline follows GitHub's recommended reusable-workflow pattern: build, artifact upload, and attestation issuance all happen inside the reusable build workflow. This corresponds to GitHub's SLSA v1 Build Level 3 path.

In both the stable and nightly workflows, `gh attestation verify` runs as a release gate before publishing any `.zip` artifacts; once the gate passes, GitHub Release publication and Halo App Store sync (when enabled) proceed in parallel.

| Type                                                     | Location               | Verification tool       |
| -------------------------------------------------------- | ---------------------- | ----------------------- |
| GitHub Artifact Attestation (GitHub-recommended L3 path) | GitHub Attestation API | `gh attestation verify` |

See [Security Protection](/en/tutorial/security#verify-theme-package-integrity) for verification instructions.
