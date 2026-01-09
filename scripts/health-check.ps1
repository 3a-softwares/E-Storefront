# E-Commerce Platform Health Check Script
# This script checks the health of all services, frontend apps, and packages

param(
    [switch]$Services,
    [switch]$Frontend,
    [switch]$Packages,
    [switch]$All,
    [switch]$Verbose
)

# If no specific flag is provided, run all checks
if (-not $Services -and -not $Frontend -and -not $Packages) {
    $All = $true
}

# Colors for output
function Write-Success { param($msg) Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Failure { param($msg) Write-Host "  ✗ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "  ℹ $msg" -ForegroundColor Cyan }
function Write-Header { param($msg) Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Magenta; Write-Host "  $msg" -ForegroundColor Magenta; Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta }

$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$results = @{
    Services = @()
    Frontend = @()
    Packages = @()
}

# Service configurations
$services = @(
    @{ Name = "auth-service"; Port = 3011; Endpoint = "/health" },
    @{ Name = "category-service"; Port = 3012; Endpoint = "/health" },
    @{ Name = "coupon-service"; Port = 3013; Endpoint = "/health" },
    @{ Name = "product-service"; Port = 3014; Endpoint = "/health" },
    @{ Name = "order-service"; Port = 3015; Endpoint = "/health" },
    @{ Name = "graphql-gateway"; Port = 4000; Endpoint = "/health" }
)

# Frontend app configurations
$frontendApps = @(
    @{ Name = "shell-app"; Port = 3000; Type = "webpack" },
    @{ Name = "admin-app"; Port = 3001; Type = "vite" },
    @{ Name = "seller-app"; Port = 3002; Type = "vite" },
    @{ Name = "storefront-app"; Port = 3003; Type = "next" }
)

# Package configurations
$packages = @(
    @{ Name = "types"; Path = "packages/types" },
    @{ Name = "utils"; Path = "packages/utils" },
    @{ Name = "ui-library"; Path = "packages/ui-library" }
)

# ============================================================
# SERVICE HEALTH CHECKS
# ============================================================
function Test-ServiceHealth {
    Write-Header "BACKEND SERVICES HEALTH CHECK"
    
    $runningCount = 0
    $totalCount = $services.Count

    foreach ($service in $services) {
        $url = "http://localhost:$($service.Port)$($service.Endpoint)"
        try {
            $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 5 -ErrorAction Stop
            Write-Success "$($service.Name) is running on port $($service.Port)"
            if ($Verbose) {
                Write-Info "  Response: $($response | ConvertTo-Json -Compress)"
            }
            $results.Services += @{ Name = $service.Name; Status = "Running"; Port = $service.Port }
            $runningCount++
        }
        catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            if ($statusCode) {
                Write-Failure "$($service.Name) returned status $statusCode on port $($service.Port)"
                $results.Services += @{ Name = $service.Name; Status = "Error"; Port = $service.Port; Error = "HTTP $statusCode" }
            }
            else {
                Write-Failure "$($service.Name) is not running on port $($service.Port)"
                $results.Services += @{ Name = $service.Name; Status = "Offline"; Port = $service.Port }
            }
        }
    }

    Write-Host "`n  Summary: $runningCount/$totalCount services running" -ForegroundColor $(if ($runningCount -eq $totalCount) { "Green" } else { "Yellow" })
    return $runningCount -eq $totalCount
}

# ============================================================
# FRONTEND APP CHECKS
# ============================================================
function Test-FrontendApps {
    Write-Header "FRONTEND APPS STATUS CHECK"
    
    $runningCount = 0
    $totalCount = $frontendApps.Count

    foreach ($app in $frontendApps) {
        $url = "http://localhost:$($app.Port)"
        try {
            $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 5 -ErrorAction Stop -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Success "$($app.Name) is running on port $($app.Port) [$($app.Type)]"
                $results.Frontend += @{ Name = $app.Name; Status = "Running"; Port = $app.Port; Type = $app.Type }
                $runningCount++
            }
        }
        catch {
            Write-Failure "$($app.Name) is not running on port $($app.Port) [$($app.Type)]"
            $results.Frontend += @{ Name = $app.Name; Status = "Offline"; Port = $app.Port; Type = $app.Type }
        }
    }

    Write-Host "`n  Summary: $runningCount/$totalCount frontend apps running" -ForegroundColor $(if ($runningCount -eq $totalCount) { "Green" } else { "Yellow" })
    return $runningCount -eq $totalCount
}

# ============================================================
# PACKAGE BUILD CHECKS
# ============================================================
function Test-PackageBuilds {
    Write-Header "PACKAGES BUILD STATUS CHECK"
    
    $builtCount = 0
    $totalCount = $packages.Count

    foreach ($pkg in $packages) {
        $distPath = Join-Path $rootDir "$($pkg.Path)/dist"
        $packageJsonPath = Join-Path $rootDir "$($pkg.Path)/package.json"
        
        if (Test-Path $distPath) {
            $distFiles = Get-ChildItem -Path $distPath -File -Recurse
            if ($distFiles.Count -gt 0) {
                $latestFile = $distFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
                $timeSinceBuild = (Get-Date) - $latestFile.LastWriteTime
                Write-Success "$($pkg.Name) is built ($($distFiles.Count) files, last build: $($timeSinceBuild.TotalHours.ToString('F1'))h ago)"
                $results.Packages += @{ Name = $pkg.Name; Status = "Built"; FileCount = $distFiles.Count; LastBuild = $latestFile.LastWriteTime }
                $builtCount++
            }
            else {
                Write-Failure "$($pkg.Name) dist folder is empty"
                $results.Packages += @{ Name = $pkg.Name; Status = "Empty" }
            }
        }
        else {
            Write-Failure "$($pkg.Name) is not built (no dist folder)"
            $results.Packages += @{ Name = $pkg.Name; Status = "Not Built" }
        }

        # Check if package.json exists and is valid
        if ($Verbose -and (Test-Path $packageJsonPath)) {
            try {
                $pkgJson = Get-Content $packageJsonPath | ConvertFrom-Json
                Write-Info "  Version: $($pkgJson.version)"
            }
            catch {
                Write-Failure "  Invalid package.json"
            }
        }
    }

    Write-Host "`n  Summary: $builtCount/$totalCount packages built" -ForegroundColor $(if ($builtCount -eq $totalCount) { "Green" } else { "Yellow" })
    return $builtCount -eq $totalCount
}

# ============================================================
# TEST EXECUTION CHECK
# ============================================================
function Test-RunTests {
    param([string]$Scope = "all")
    
    Write-Header "RUNNING TESTS: $Scope"
    
    Push-Location $rootDir
    try {
        switch ($Scope) {
            "frontend" { yarn test:frontend }
            "backend" { yarn test:backend }
            "packages" { yarn test:package }
            default { yarn test:all }
        }
        $testPassed = $LASTEXITCODE -eq 0
        if ($testPassed) {
            Write-Success "All tests passed"
        }
        else {
            Write-Failure "Some tests failed"
        }
        return $testPassed
    }
    finally {
        Pop-Location
    }
}

# ============================================================
# MAIN EXECUTION
# ============================================================
Write-Host "`n" -NoNewline
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       E-COMMERCE PLATFORM HEALTH CHECK                    ║" -ForegroundColor Cyan
Write-Host "║       $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')                              ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

$allPassed = $true

if ($All -or $Services) {
    $servicesPassed = Test-ServiceHealth
    $allPassed = $allPassed -and $servicesPassed
}

if ($All -or $Frontend) {
    $frontendPassed = Test-FrontendApps
    $allPassed = $allPassed -and $frontendPassed
}

if ($All -or $Packages) {
    $packagesPassed = Test-PackageBuilds
    $allPassed = $allPassed -and $packagesPassed
}

# Final Summary
Write-Header "FINAL SUMMARY"
if ($allPassed) {
    Write-Host "  ✓ All checks passed!" -ForegroundColor Green
}
else {
    Write-Host "  ⚠ Some checks failed. Review the output above." -ForegroundColor Yellow
}

Write-Host "`nUsage:" -ForegroundColor Gray
Write-Host "  .\health-check.ps1              # Run all checks" -ForegroundColor Gray
Write-Host "  .\health-check.ps1 -Services    # Check only backend services" -ForegroundColor Gray
Write-Host "  .\health-check.ps1 -Frontend    # Check only frontend apps" -ForegroundColor Gray
Write-Host "  .\health-check.ps1 -Packages    # Check only packages" -ForegroundColor Gray
Write-Host "  .\health-check.ps1 -Verbose     # Show detailed output" -ForegroundColor Gray
Write-Host ""

exit $(if ($allPassed) { 0 } else { 1 })
