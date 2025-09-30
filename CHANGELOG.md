# Changelog

All notable changes to this project will be documented in this file.

## [20.0.2] - 2025-09-30

### 🔧 Performance Improvement

#### Fixed

- **Template Optimization**: Improved `@for` loop tracking in country list template
  - Changed `track country` to `track country.code` for better change detection performance
  - More efficient rendering when country list updates
  - Prevents unnecessary DOM re-renders for unchanged countries

#### Technical Details

- Enhanced Angular's change detection strategy for country dropdown options
- Better performance when filtering or updating country lists
- Follows Angular's best practices for `@for` directive tracking functions

---

## [20.0.1] - 2025-09-29

### 🚀 Performance & Stability Update

#### Added

- **Zoneless Change Detection**: Migrated to Angular 20's modern zoneless change detection for better performance
- Missing password field in demo form (was causing validation issues)
- Enhanced form validation state management for Angular 20 compatibility

#### Fixed

- **CRITICAL**: Form validation issues after Angular 19→20 migration
  - Fixed ControlValueAccessor implementation in country selector component
  - Resolved validation timing issues with custom form controls
  - Proper validation state synchronization between component and parent forms
- Form submission validation - now correctly validates all required fields
- Merge conflicts resolution maintaining zoneless implementation
- Missing password input field in demo application

#### Improved

- **Performance**: Removed zone.js dependency for smaller bundle size and faster change detection
- Cleaner ControlValueAccessor implementation without manual change detection calls
- Modern signal-based reactive patterns throughout the application
- Better error handling and debugging support for form validation

#### Changed

- **BREAKING (Development)**: Removed zone.js dependency - applications can now optionally use zoneless change detection
- Updated app configuration to use `provideZonelessChangeDetection()`
- Simplified component lifecycle management without manual change detection
- Enhanced form control validation patterns for Angular 20

#### Bundle Size

- Reduced JavaScript bundle size by removing zone.js dependency
- Faster application startup and runtime performance

#### Migration Notes

- Applications can now optionally migrate to zoneless change detection
- Existing zone-based applications will continue to work normally
- Form validation is now more reliable and Angular 20 compliant

---

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
