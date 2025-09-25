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
- If it exists, automatically bump the patch version
- Build the library
- Publish to npm
- Create a git tag for the published version

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

## Current Package Information

- **Package Name**: ngx-country-selector
- **Current Version**: 19.1.3
- **NPM URL**: https://www.npmjs.com/package/ngx-country-selector
- **Repository**: https://github.com/evicio1/ngx-country-selector

## Publishing Process

1. Make your changes to the library
2. Update version in `projects/country-selector-library/package.json` if needed
3. Commit and push to master branch
4. GitHub Actions will automatically build and publish
5. Check https://www.npmjs.com/package/ngx-country-selector for the new version
