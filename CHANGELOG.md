# Changelog

All notable changes to this project will be documented in this file.

## [20.0.0] - 2025-09-25

### 🚀 Major Update: Angular 20 Support

#### Changed

- **BREAKING CHANGE**: Updated to Angular 20 from Angular 19.1.x
- Updated all Angular dependencies to version 20.x
- Updated Angular Material to 20.2.5 (latest compatible version)
- Updated Angular CDK to 20.2.5
- Updated ng-packagr to 20.3.0
- Updated TypeScript to 5.8.0
- Library major version now matches Angular major version (20.x.x)

#### Dependencies Updated

- `@angular/core`: `^19.1.2` → `^20.0.0`
- `@angular/common`: `^19.1.2` → `^20.0.0`
- `@angular/material`: `^19.1.0` → `^20.2.5`
- `@angular/cdk`: `^19.1.0` → `^20.2.5`
- All other Angular packages updated to 20.x
- `ng-packagr`: `^19.1.0` → `^20.3.0`
- `typescript`: `~5.5.2` → `~5.8.0`

#### Migration Notes

- This is a major version update that requires Angular 20+
- Applications using this library must be updated to Angular 20+ to maintain compatibility
- No breaking changes in the library API - only Angular version compatibility updated
- Compatible with any Angular 20.x version (20.0.0, 20.1.x, 20.2.x, 20.3.x, etc.)

#### Installation

```bash
npm install ngx-country-selector@20.0.0
```

#### Requirements

- Angular 20+ (any 20.x version)
- Node.js 18+ (recommended)

#### Versioning Strategy

Starting with this release, the library follows this versioning pattern:

- **Major version** matches Angular major version (20.x.x for Angular 20)
- **Minor version** for new features and enhancements
- **Patch version** for bug fixes and minor improvements

---

## [19.1.5] - 2025-09-25

### Added

- GitHub Releases integration
- GitHub Packages publishing
- Automated release notes generation
- Enhanced CI/CD workflow

### Fixed

- Git repository URL format for npm publishing
- Version conflict handling in publishing workflow

### Changed

- Improved publishing workflow with better error handling
- Updated repository URL format to prevent npm warnings

---

## [19.1.3] - Previous Release

### Features

- Angular Country Selector component
- Angular 19.1.x compatibility
- TypeScript support
- SCSS styling support
