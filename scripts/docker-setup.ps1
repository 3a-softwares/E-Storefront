# E-Commerce Platform - Docker Setup Script for Windows
# =====================================================

param(
    [switch]$Help,
    [switch]$Quick
)

function Show-Banner {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "   E-Commerce Platform - Docker Setup" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Help {
    Write-Host "Usage: .\docker-setup.ps1 [options]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Help    Show this help message"
    Write-Host "  -Quick   Quick start (run all services)"
    Write-Host ""
    Write-Host "Interactive mode will be used if no options are provided."
    exit 0
}

function Test-DockerInstalled {
    try {
        docker --version | Out-Null
        Write-Host "✓ Docker is installed" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Docker is not installed. Please install Docker Desktop:" -ForegroundColor Red
        Write-Host "   https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        return $false
    }
}

function Test-DockerRunning {
    try {
        docker ps | Out-Null
        Write-Host "✓ Docker daemon is running" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Docker daemon is not running. Please start Docker Desktop." -ForegroundColor Red
        return $false
    }
}

function Test-DockerComposeInstalled {
    try {
        docker compose version | Out-Null
        Write-Host "✓ Docker Compose is available" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Docker Compose is not available." -ForegroundColor Red
        return $false
    }
}

function Start-AllServices {
    Write-Host ""
    Write-Host "Starting all services (MongoDB, Redis, Backend, Frontend)..." -ForegroundColor Green
    Write-Host "This may take a few minutes on first run." -ForegroundColor Yellow
    Write-Host ""
    docker compose up --build
}

function Start-DevServices {
    Write-Host ""
    Write-Host "Starting development services (separate backend/frontend)..." -ForegroundColor Green
    docker compose -f docker-compose.dev.yml up --build
}

function Start-BackendOnly {
    Write-Host ""
    Write-Host "Starting backend services only..." -ForegroundColor Green
    docker compose -f docker-compose.dev.yml up mongodb redis backend --build
}

function Start-FrontendOnly {
    Write-Host ""
    Write-Host "Starting frontend services only..." -ForegroundColor Green
    Write-Host "Note: Backend must be running first!" -ForegroundColor Yellow
    docker compose -f docker-compose.dev.yml up frontend --build
}

function Start-InfrastructureOnly {
    Write-Host ""
    Write-Host "Starting infrastructure only (MongoDB, Redis)..." -ForegroundColor Green
    docker compose up mongodb redis
}

function Start-Production {
    Write-Host ""
    Write-Host "Starting production environment..." -ForegroundColor Green
    Write-Host "⚠️  Make sure .env.production is configured!" -ForegroundColor Yellow
    
    if (-not (Test-Path ".env.production")) {
        Write-Host "❌ .env.production not found! Copy from .env.production.example" -ForegroundColor Red
        return
    }
    
    docker compose -f docker-compose.production.yml --env-file .env.production up --build -d
}

function Stop-AllServices {
    Write-Host ""
    Write-Host "Stopping all services..." -ForegroundColor Yellow
    docker compose down
    docker compose -f docker-compose.dev.yml down
    docker compose -f docker-compose.production.yml down
}

function Show-Logs {
    Write-Host ""
    Write-Host "Select service to view logs:" -ForegroundColor Yellow
    Write-Host "1) All services"
    Write-Host "2) Backend only"
    Write-Host "3) Frontend only"
    Write-Host "4) MongoDB"
    Write-Host "5) Redis"
    Write-Host ""
    
    $logChoice = Read-Host "Enter choice (1-5)"
    
    switch ($logChoice) {
        "1" { docker compose logs -f }
        "2" { docker compose -f docker-compose.dev.yml logs -f backend }
        "3" { docker compose -f docker-compose.dev.yml logs -f frontend }
        "4" { docker compose logs -f mongodb }
        "5" { docker compose logs -f redis }
        default { docker compose logs -f }
    }
}

function Rebuild-Services {
    Write-Host ""
    Write-Host "Rebuilding all images (no cache)..." -ForegroundColor Yellow
    docker compose build --no-cache
    Write-Host ""
    Write-Host "Rebuild complete! Run the setup script again to start services." -ForegroundColor Green
}

function Clean-Docker {
    Write-Host ""
    Write-Host "⚠️  This will remove all containers, images, and volumes!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (yes/no)"
    
    if ($confirm -eq "yes") {
        Write-Host "Stopping all containers..." -ForegroundColor Yellow
        docker compose down -v
        docker compose -f docker-compose.dev.yml down -v
        
        Write-Host "Removing unused images..." -ForegroundColor Yellow
        docker image prune -af
        
        Write-Host "Removing unused volumes..." -ForegroundColor Yellow
        docker volume prune -f
        
        Write-Host "✓ Cleanup complete!" -ForegroundColor Green
    } else {
        Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    }
}

function Show-Status {
    Write-Host ""
    Write-Host "Container Status:" -ForegroundColor Cyan
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    Write-Host ""
    Write-Host "Service URLs:" -ForegroundColor Cyan
    Write-Host "  Shell App:       http://localhost:3000" -ForegroundColor White
    Write-Host "  Admin App:       http://localhost:3001" -ForegroundColor White
    Write-Host "  Seller App:      http://localhost:3002" -ForegroundColor White
    Write-Host "  Storefront:      http://localhost:3003" -ForegroundColor White
    Write-Host "  GraphQL Gateway: http://localhost:4000/graphql" -ForegroundColor White
    Write-Host "  Storybook:       http://localhost:6006" -ForegroundColor White
    Write-Host ""
}

# Main execution
if ($Help) {
    Show-Help
}

Show-Banner

# Pre-flight checks
if (-not (Test-DockerInstalled)) { exit 1 }
if (-not (Test-DockerRunning)) { exit 1 }
if (-not (Test-DockerComposeInstalled)) { exit 1 }

Write-Host ""

if ($Quick) {
    Start-AllServices
    exit 0
}

# Interactive menu
Write-Host "Select an option:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Development:" -ForegroundColor Cyan
Write-Host "  1) Start all services (simple mode)"
Write-Host "  2) Start all services (dev mode - separate backend/frontend)"
Write-Host "  3) Start backend only"
Write-Host "  4) Start frontend only"
Write-Host "  5) Start infrastructure only (MongoDB, Redis)"
Write-Host ""
Write-Host "  Production:" -ForegroundColor Cyan
Write-Host "  6) Start production environment"
Write-Host ""
Write-Host "  Management:" -ForegroundColor Cyan
Write-Host "  7) View logs"
Write-Host "  8) Stop all services"
Write-Host "  9) Rebuild images (no cache)"
Write-Host "  10) Show status"
Write-Host "  11) Clean up (remove all)"
Write-Host ""

$choice = Read-Host "Enter choice (1-11)"

switch ($choice) {
    "1" { Start-AllServices }
    "2" { Start-DevServices }
    "3" { Start-BackendOnly }
    "4" { Start-FrontendOnly }
    "5" { Start-InfrastructureOnly }
    "6" { Start-Production }
    "7" { Show-Logs }
    "8" { Stop-AllServices }
    "9" { Rebuild-Services }
    "10" { Show-Status }
    "11" { Clean-Docker }
    default {
        Write-Host "Invalid option" -ForegroundColor Red
        exit 1
    }
}
