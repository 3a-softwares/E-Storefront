# Package Resolution Mode Switcher (PowerShell Version)
# Switch between local (source) and production (node_modules) modes

param(
    [Parameter(Position=0)]
    [ValidateSet("local", "production", "status", "env", "help")]
    [string]$Command = "help"
)

# Colors
function Write-Header($text) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Blue
    Write-Host $text -ForegroundColor Blue
    Write-Host "================================================" -ForegroundColor Blue
    Write-Host ""
}

function Write-Success($text) {
    Write-Host "✓ $text" -ForegroundColor Green
}

function Write-Info($text) {
    Write-Host "ℹ $text" -ForegroundColor Cyan
}

function Write-Warn($text) {
    Write-Host "⚠ $text" -ForegroundColor Yellow
}

# Get current mode
function Get-CurrentMode {
    if (Test-Path ".env") {
        $content = Get-Content ".env" -Raw
        if ($content -match "RESOLVE_FROM_SOURCE=true") {
            return "local"
        } else {
            return "production"
        }
    }
    return "unknown"
}

# Switch to local development mode
function Switch-ToLocal {
    Write-Header "Switching to LOCAL mode (source packages)"
    
    Write-Info "Copying .env.docker to .env"
    Copy-Item ".env.docker" ".env" -Force
    
    Write-Info "Setting package resolution to SOURCE"
    $content = Get-Content ".env" -Raw
    $content = $content -replace "RESOLVE_FROM_SOURCE=false", "RESOLVE_FROM_SOURCE=true"
    $content = $content -replace "PACKAGE_MODE=production", "PACKAGE_MODE=local"
    $content = $content -replace "NODE_ENV=production", "NODE_ENV=development"
    Set-Content ".env" $content
    
    Write-Info "Stopping current containers"
    docker-compose down 2>$null
    
    Write-Info "Starting services with LOCAL mode"
    docker-compose -f docker-compose.yml up -d
    
    Write-Success "Switched to LOCAL mode"
    Write-Host ""
    Write-Host "Configuration:"
    Write-Host "  MODE: local"
    Write-Host "  Packages: Source (/packages/*/src)"
    Write-Host "  Hot Reload: Enabled"
    Write-Host "  Env File: .env"
}

# Switch to production mode
function Switch-ToProduction {
    Write-Header "Switching to PRODUCTION mode (pre-built packages)"
    
    Write-Info "Building packages first"
    yarn build:package
    
    Write-Info "Copying .env.production to .env"
    Copy-Item ".env.production" ".env" -Force
    
    Write-Info "Setting package resolution to NODE_MODULES"
    $content = Get-Content ".env" -Raw
    $content = $content -replace "RESOLVE_FROM_SOURCE=true", "RESOLVE_FROM_SOURCE=false"
    $content = $content -replace "PACKAGE_MODE=local", "PACKAGE_MODE=production"
    Set-Content ".env" $content
    
    Write-Info "Stopping current containers"
    docker-compose down 2>$null
    
    Write-Info "Starting services with PRODUCTION mode"
    docker-compose -f docker-compose.production.yml up -d
    
    Write-Success "Switched to PRODUCTION mode"
    Write-Host ""
    Write-Host "Configuration:"
    Write-Host "  MODE: production"
    Write-Host "  Packages: node_modules (pre-built)"
    Write-Host "  Hot Reload: Disabled"
    Write-Host "  Env File: .env"
}

# Show current mode
function Show-Status {
    Write-Header "Package Resolution Status"
    
    $mode = Get-CurrentMode
    
    if ($mode -eq "local") {
        Write-Host "Current Mode: LOCAL DEVELOPMENT" -ForegroundColor Green
        Write-Host "  Source: /packages/*/src"
        Write-Host "  Hot Reload: Enabled"
        Write-Host "  Env File: .env (from .env.docker)"
        Write-Host ""
        Write-Host "Features:"
        Write-Host "  ✓ Import from source packages"
        Write-Host "  ✓ Changes auto-reload"
        Write-Host "  ✓ Direct debugging"
        Write-Host "  ✓ No build step needed"
    } elseif ($mode -eq "production") {
        Write-Host "Current Mode: PRODUCTION" -ForegroundColor Yellow
        Write-Host "  Source: node_modules (pre-built)"
        Write-Host "  Hot Reload: Disabled"
        Write-Host "  Env File: .env (from .env.production)"
        Write-Host ""
        Write-Host "Features:"
        Write-Host "  ✓ Optimized bundle size"
        Write-Host "  ✓ Faster startup"
        Write-Host "  ✓ Pre-compiled code"
        Write-Host "  ✓ Production-ready"
    } else {
        Write-Host "Unknown Mode" -ForegroundColor Red
        Write-Host "No valid environment file found"
    }
    
    Write-Info "Running containers:"
    docker-compose ps 2>$null
}

# Show environment variables
function Show-Env {
    Write-Header "Current Environment Configuration"
    
    if (Test-Path ".env") {
        Write-Host "From .env:"
        Get-Content ".env" | Select-String -Pattern "NODE_ENV|PACKAGE_MODE|RESOLVE_FROM_SOURCE|NODE_PATH"
    } else {
        Write-Host "No .env file found"
    }
    
    Write-Host ""
    Write-Host "Database Configuration:"
    if (Test-Path ".env") {
        Get-Content ".env" | Select-String -Pattern "MONGODB_URL|REDIS_URL" | Select-Object -First 4
    }
}

# Show help
function Show-Help {
    Write-Host "Package Resolution Mode Switcher"
    Write-Host ""
    Write-Host "Usage: .\switch-package-mode.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  local              Switch to LOCAL mode (source packages)"
    Write-Host "  production         Switch to PRODUCTION mode (pre-built packages)"
    Write-Host "  status             Show current mode status"
    Write-Host "  env                Show current environment variables"
    Write-Host "  help               Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\switch-package-mode.ps1 local"
    Write-Host "  .\switch-package-mode.ps1 production"
    Write-Host "  .\switch-package-mode.ps1 status"
    Write-Host ""
    Write-Host "What's the difference?"
    Write-Host ""
    Write-Host "LOCAL MODE (source packages):" -ForegroundColor Green
    Write-Host "  - Imports from /packages/*/src"
    Write-Host "  - Hot-reload enabled"
    Write-Host "  - Great for development"
    Write-Host "  - Changes reflected immediately"
    Write-Host ""
    Write-Host "PRODUCTION MODE (pre-built packages):" -ForegroundColor Yellow
    Write-Host "  - Imports from node_modules"
    Write-Host "  - Optimized bundles"
    Write-Host "  - Fast startup"
    Write-Host "  - Ready for deployment"
}

# Main switch
switch ($Command) {
    "local" { Switch-ToLocal }
    "production" { Switch-ToProduction }
    "status" { Show-Status }
    "env" { Show-Env }
    "help" { Show-Help }
    default { Show-Help }
}
