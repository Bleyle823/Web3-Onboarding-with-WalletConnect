# Cleanup script for locked Tailwind CSS files
# Run this script AFTER closing Cursor/VS Code and all Node processes

Write-Host "Cleaning up locked Tailwind CSS files..." -ForegroundColor Yellow

# Stop any remaining Node processes
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Remove the locked directory
$tailwindPath = "node_modules\@tailwindcss"
if (Test-Path $tailwindPath) {
    Write-Host "Removing $tailwindPath..." -ForegroundColor Yellow
    Remove-Item -Path $tailwindPath -Recurse -Force -ErrorAction SilentlyContinue
    
    # If still locked, try with takeown
    if (Test-Path $tailwindPath) {
        Write-Host "Taking ownership and removing..." -ForegroundColor Yellow
        takeown /F $tailwindPath /R /D Y 2>&1 | Out-Null
        icacls $tailwindPath /grant "${env:USERNAME}:(F)" /T /C 2>&1 | Out-Null
        Remove-Item -Path $tailwindPath -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Cleanup complete! Now run: yarn install" -ForegroundColor Green

