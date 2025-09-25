# Publishing Guide for ngx-country-selector

## Setup Requirements

### 1. NPM Token Setup

To publish to npm automatically via GitHub Actions, you need to:

1. Generate an npm access token:

   - Go to https://www.npmjs.com/
   - Click on your profile picture → "Access Tokens"
   - Click "Generate New Token" → "Granular Access Token"
   - Give it a name like "GitHub Actions ngx-country-selector"
   - Set expiration as desired
   - Select permissions: "Read and write" for the package
   - Copy the generated token

2. Add the token to GitHub Secrets:
   - Go to your repository on GitHub: https://github.com/evicio1/ngx-country-selector
   - Click Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: paste your npm token
   - Click "Add secret"

### 2. Version Management

The workflow will automatically:

- Check if the current version already exists on npm
- **Stop and fail if the version exists** (you need to manually update the version)
- Build the library
- Publish to npm only if the version is new
- **Create a GitHub Release** with release notes and package tarball
- **Publish to GitHub Packages** (as @evicio1/ngx-country-selector)
- Create a git tag for the published version

**Important**: The workflow no longer auto-bumps versions. If you try to publish an existing version, the workflow will fail with clear instructions to update the version manually.

### 3. Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
# Build the library
npm run build:lib

# Navigate to dist folder and publish
cd dist/country-selector-library
npm publish --access public
```

## Troubleshooting

### Common Issues:

1. **Permission denied (publickey) error**: This was caused by git trying to access a non-existent repository. The updated workflow fixes this by:

   - Removing any git references from the dist folder
   - Running npm publish from within the dist directory
   - Properly configuring git credentials

2. **Version already exists**: The workflow now automatically checks and bumps versions

3. **Missing files**: The workflow now copies README.md and LICENSE.txt to the dist folder

4. **Write access to repository not granted**: Fixed by adding proper permissions to the GitHub Actions workflow:
   - Added `contents: write` permission for creating and pushing Git tags
   - Added `packages: write` permission for npm publishing
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
- **Current Version**: 19.1.5
- **NPM URL**: https://www.npmjs.com/package/ngx-country-selector
- **GitHub Packages**: @evicio1/ngx-country-selector
- **Repository**: https://github.com/evicio1/ngx-country-selector
- **Releases**: https://github.com/evicio1/ngx-country-selector/releases
- **Packages**: https://github.com/evicio1/ngx-country-selector/packages

## Publishing Process

1. Make your changes to the library
2. **Update version in `projects/country-selector-library/package.json` to a new version**
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
