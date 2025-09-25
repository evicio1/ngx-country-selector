# Test script to validate the publishing workflow locally
Write-Host "🧪 Testing ngx-country-selector publishing workflow..." -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "projects/country-selector-library/package.json")) {
  Write-Host "❌ Error: Run this script from the project root directory" -ForegroundColor Red
  exit 1
}

Write-Host "📦 Current package information:" -ForegroundColor Green
$packageJson = Get-Content "projects/country-selector-library/package.json" | ConvertFrom-Json
$currentVersion = $packageJson.version
Write-Host "Version: $currentVersion"
Write-Host "Name: $($packageJson.name)"

Write-Host ""
Write-Host "🔍 Checking if version exists on npm..." -ForegroundColor Yellow
$npmCheckResult = npm view "ngx-country-selector@$currentVersion" version 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host "❌ Version $currentVersion already exists on npm" -ForegroundColor Red
  $latestVersion = npm view ngx-country-selector version
  Write-Host "Latest version: $latestVersion"
}
else {
  Write-Host "✅ Version $currentVersion is available for publishing" -ForegroundColor Green
}

Write-Host ""
Write-Host "🏗️  Building library..." -ForegroundColor Blue
$buildResult = npm run build:lib
if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Build successful" -ForegroundColor Green
}
else {
  Write-Host "❌ Build failed" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "📁 Built package information:" -ForegroundColor Magenta
if (Test-Path "dist/country-selector-library/package.json") {
  Push-Location "dist/country-selector-library"
  $builtPackageJson = Get-Content "package.json" | ConvertFrom-Json
  Write-Host "Built version: $($builtPackageJson.version)"

  $size = (Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
  Write-Host "Package size: $([math]::Round($size, 2)) MB"

  Write-Host "Files included:"
  Get-ChildItem | Select-Object Name, Length | Format-Table -AutoSize
  Pop-Location
}
else {
  Write-Host "❌ Built package not found" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "🎯 Ready for publishing!" -ForegroundColor Green
Write-Host "To publish:"
Write-Host "1. Commit your changes"
Write-Host "2. Push to master branch"
Write-Host "3. GitHub Actions will handle the rest"
