n# OneDrive Workaround Script for .nuxt directory
# This script prevents OneDrive from syncing the .nuxt directory which causes EPERM errors

Write-Host "OneDrive Workaround: Excluding .nuxt directory from OneDrive sync..." -ForegroundColor Yellow

$nuxtPath = Join-Path $PSScriptRoot ".nuxt"
$devPath = Join-Path $nuxtPath "dev"

# Check if .nuxt directory exists
if (Test-Path $nuxtPath) {
    Write-Host "Found .nuxt directory" -ForegroundColor Green
    
    # Try to remove the dev subdirectory if it exists and is locked
    if (Test-Path $devPath) {
        Write-Host "Attempting to remove locked .nuxt/dev directory..." -ForegroundColor Yellow
        try {
            # Force remove with retry logic
            $maxRetries = 5
            $retryCount = 0
            while ($retryCount -lt $maxRetries) {
                try {
                    Remove-Item -Path $devPath -Recurse -Force -ErrorAction Stop
                    Write-Host "Successfully removed .nuxt/dev directory" -ForegroundColor Green
                    break
                } catch {
                    $retryCount++
                    if ($retryCount -lt $maxRetries) {
                        Write-Host "Retry $retryCount/$maxRetries - Waiting 2 seconds..." -ForegroundColor Yellow
                        Start-Sleep -Seconds 2
                    } else {
                        Write-Host "Failed to remove .nuxt/dev after $maxRetries attempts" -ForegroundColor Red
                        Write-Host "You may need to close any processes using this directory or restart your IDE" -ForegroundColor Yellow
                    }
                }
            }
        } catch {
            Write-Host "Error removing .nuxt/dev: $_" -ForegroundColor Red
        }
    }
    
    # Create a .onedriveignore file in .nuxt directory to prevent OneDrive sync
    $ignoreFile = Join-Path $nuxtPath ".onedriveignore"
    if (-not (Test-Path $ignoreFile)) {
        try {
            Set-Content -Path $ignoreFile -Value "*" -Force
            Write-Host "Created .onedriveignore file in .nuxt directory" -ForegroundColor Green
        } catch {
            Write-Host "Could not create .onedriveignore file: $_" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host ".nuxt directory does not exist yet" -ForegroundColor Gray
}

# Alternative: Add to OneDrive exclusion list via registry (requires admin)
Write-Host "`nTo permanently exclude .nuxt from OneDrive:" -ForegroundColor Cyan
Write-Host "1. Right-click the OneDrive icon in system tray" -ForegroundColor White
Write-Host "2. Go to Settings > Sync and backup > Advanced settings" -ForegroundColor White
Write-Host "3. Add '.nuxt' to the exclusion list" -ForegroundColor White
Write-Host "`nOr run this script as Administrator to add registry exclusion" -ForegroundColor Yellow

Write-Host "`nScript completed!" -ForegroundColor Green

