# Publishing Guide for ngx-country-selector

## Setup Requirements

### 1. npm Trusted Publishing Setup

The workflow publishes to npm with [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC). GitHub Actions proves its identity to npm for each run, so **no npm token is stored in this repository** and there is nothing to renew.

This is a one-time setup on npmjs.com, done by a maintainer of the package:

1. Go to https://www.npmjs.com/package/ngx-country-selector → **Settings**
2. In the **Trusted Publisher** section, choose **GitHub Actions** and fill in:
   - **Organization or user**: `evicio1`
   - **Repository**: `ngx-country-selector`
   - **Workflow filename**: `publish.yml` (the filename only, not the path)
   - **Environment name**: leave empty
   - **Allowed actions**: allow `npm publish`
3. Save. npm asks for your two-factor code.

The values must match exactly. If the repository is renamed or `.github/workflows/publish.yml` is renamed, update the trusted publisher or publishing fails with an authentication error.

Requirements, all met by the workflow: a GitHub-hosted runner, the `id-token: write` permission, npm 11.5.1 or later and Node.js 22.14.0 or later. Packages published this way get a provenance attestation automatically.

**Why not a token:** npm is retiring token-based publishing from CI. Granular tokens that bypass 2FA lose the ability to publish directly around January 2027 ([announcement](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/)). The old `NPM_TOKEN` repository secret is no longer used and can be deleted. Once trusted publishing works, npm recommends setting the package's **Publishing access** to "Require two-factor authentication and disallow tokens".

### 2. Version Management

The workflow will automatically:

- Build the library (this also copies `README.md` and `LICENSE.txt` into the package)
- Check if the current version already exists on npm
- **Stop and fail if the version exists** (you need to manually update the version)
- Publish to npm only if the version is new
- **Create a GitHub Release** with release notes and package tarball
- **Publish to GitHub Packages** (as @evicio1/ngx-country-selector)
- Create a git tag for the published version

**Important**: The workflow no longer auto-bumps versions. If you try to publish an existing version, the workflow will fail with clear instructions to update the version manually.

### 3. Manual Publishing (Alternative)

If you prefer to publish manually (you need to be logged in with `npm login`, and npm asks for your two-factor code if 2FA is enabled):

```bash
# Build the library (also copies README.md and LICENSE.txt into dist)
npm run build:lib

# Navigate to dist folder and publish
cd dist/country-selector-library
npm publish --access public
```

Building requires a Node.js version supported by Angular 22 (`^22.22.3`, `^24.15.0` or `>=26`). The workflow uses Node.js 24.

## Troubleshooting

### Common Issues:

1. **Permission denied (publickey) error**: This was caused by git trying to access a non-existent repository. The updated workflow fixes this by:

   - Removing any git references from the dist folder
   - Running npm publish from within the dist directory
   - Properly configuring git credentials

2. **Version already exists**: The workflow checks for this and fails. Update the version in `projects/country-selector-library/package.json` and push again

3. **Missing files**: `npm run build:lib` copies README.md and LICENSE.txt to the dist folder (`postbuild:lib` script)

4. **"Publish to npm" fails with an authentication error (401, 403, 404 or `ENEEDAUTH`)**: The trusted publisher on npmjs.com is missing or does not match this repository and workflow file. See "npm Trusted Publishing Setup" above

5. **Write access to repository not granted**: Fixed by adding proper permissions to the GitHub Actions workflow:
   - Added `contents: write` permission for creating and pushing Git tags
   - Added `packages: write` permission for publishing to GitHub Packages
   - Added `id-token: write` permission for npm trusted publishing
   - Configured proper authentication with GitHub token

## Installation Options

After publishing, users can install your package from multiple sources:

### From NPM (Primary)

```bash
npm install ngx-country-selector
```

### From GitHub Packages

```bash
# First, configure npm to use GitHub Packages for @evicio1 scope
echo "@evicio1:registry=https://npm.pkg.github.com" >> ~/.npmrc

# Then install
npm install @evicio1/ngx-country-selector
```

### From GitHub Releases

Users can also download the tarball directly from the Releases page:

- Go to: https://github.com/evicio1/ngx-country-selector/releases
- Download the `.tgz` file
- Install locally: `npm install path/to/ngx-country-selector-x.x.x.tgz`

## Current Package Information

- **Package Name**: ngx-country-selector
- **Current Version**: 22.0.0
- **Angular Version**: 22+ (any 22.x version)
- **NPM URL**: https://www.npmjs.com/package/ngx-country-selector
- **GitHub Packages**: @evicio1/ngx-country-selector
- **Repository**: https://github.com/evicio1/ngx-country-selector
- **Releases**: https://github.com/evicio1/ngx-country-selector/releases
- **Packages**: https://github.com/evicio1/ngx-country-selector/packages

## Versioning Strategy

Starting with version 20.0.0, this library follows a **Major-Minor-Patch** pattern aligned with Angular:

### Format: `[ANGULAR_MAJOR].[FEATURE].[PATCH]`

- **Major Version** (20.x.x): Matches Angular major version
  - `20.x.x` = Compatible with Angular 20+ (any 20.x version)
  - `21.x.x` = Compatible with Angular 21+ (any 21.x version)
  - `22.x.x` = Compatible with Angular 22+ (any 22.x version)
- **Minor Version** (x.1.x): New features, enhancements, non-breaking changes
  - `20.1.0` = New feature added
  - `20.2.0` = Another feature added
- **Patch Version** (x.x.1): Bug fixes, minor improvements
  - `20.0.1` = Bug fix
  - `20.1.1` = Bug fix for v20.1.0

### Examples:

```bash
# Angular 20 support with flexible compatibility
npm install ngx-country-selector@20.0.0  # Works with Angular 20.0.x, 20.1.x, 20.2.x, 20.3.x

# Future versions
npm install ngx-country-selector@20.1.0  # New features for Angular 20
npm install ngx-country-selector@21.0.0  # Angular 21 support
npm install ngx-country-selector@22.0.0  # Angular 22 support
```

### Benefits:

- ✅ **Clear Angular compatibility** - Major version tells you Angular support
- ✅ **Flexible updates** - Works with any Angular patch/minor updates
- ✅ **Independent evolution** - Library can evolve with its own minor/patch releases
- ✅ **Predictable upgrades** - Only major version changes require Angular updates

## Publishing Process

1. Make your changes to the library
2. **Update version in `projects/country-selector-library/package.json` to a new version** and add an entry to `CHANGELOG.md`
3. Commit and push to master branch
4. GitHub Actions will automatically:
   - Build and publish to npm (if version is new)
   - Create a GitHub Release with release notes and downloadable package
   - Publish to GitHub Packages as `@evicio1/ngx-country-selector`
   - Create a Git tag
5. Check the results:
   - **npm**: https://www.npmjs.com/package/ngx-country-selector
   - **GitHub Releases**: https://github.com/evicio1/ngx-country-selector/releases
   - **GitHub Packages**: https://github.com/evicio1/ngx-country-selector/packages

**Note**: If you forget to update the version and it already exists on npm, the workflow will fail with a clear message telling you to update the version.
