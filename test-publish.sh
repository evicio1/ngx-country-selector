#!/bin/bash

# Test script to validate the publishing workflow locally
echo "🧪 Testing ngx-country-selector publishing workflow..."

# Check if we're in the right directory
if [ ! -f "projects/country-selector-library/package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📦 Current package information:"
CURRENT_VERSION=$(node -p "require('./projects/country-selector-library/package.json').version")
echo "Version: $CURRENT_VERSION"
echo "Name: $(node -p "require('./projects/country-selector-library/package.json').name")"

echo ""
echo "🔍 Checking if version exists on npm..."
if npm view ngx-country-selector@$CURRENT_VERSION version 2>/dev/null; then
    echo "❌ Version $CURRENT_VERSION already exists on npm"
    echo "Latest version: $(npm view ngx-country-selector version)"
else
    echo "✅ Version $CURRENT_VERSION is available for publishing"
fi

echo ""
echo "🏗️  Building library..."
if npm run build:lib; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "📁 Built package information:"
if [ -f "dist/country-selector-library/package.json" ]; then
    cd dist/country-selector-library
    echo "Built version: $(node -p "require('./package.json').version")"
    echo "Package size: $(du -sh . | cut -f1)"
    echo "Files included:"
    ls -la | head -10
    cd ../..
else
    echo "❌ Built package not found"
    exit 1
fi

echo ""
echo "🎯 Ready for publishing!"
echo "To publish:"
echo "1. Commit your changes"
echo "2. Push to master branch"
echo "3. GitHub Actions will handle the rest"
