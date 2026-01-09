#!/bin/bash

# E-Commerce Platform Health Check Script
# This script checks the health of all services, frontend apps, and packages

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Parse arguments
CHECK_SERVICES=false
CHECK_FRONTEND=false
CHECK_PACKAGES=false
VERBOSE=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --services|-s) CHECK_SERVICES=true ;;
        --frontend|-f) CHECK_FRONTEND=true ;;
        --packages|-p) CHECK_PACKAGES=true ;;
        --verbose|-v) VERBOSE=true ;;
        --all|-a) CHECK_SERVICES=true; CHECK_FRONTEND=true; CHECK_PACKAGES=true ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# If no specific flag is provided, run all checks
if ! $CHECK_SERVICES && ! $CHECK_FRONTEND && ! $CHECK_PACKAGES; then
    CHECK_SERVICES=true
    CHECK_FRONTEND=true
    CHECK_PACKAGES=true
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Helper functions
print_success() { echo -e "  ${GREEN}✓${NC} $1"; }
print_failure() { echo -e "  ${RED}✗${NC} $1"; }
print_info() { echo -e "  ${CYAN}ℹ${NC} $1"; }
print_header() {
    echo ""
    echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${MAGENTA}  $1${NC}"
    echo -e "${MAGENTA}═══════════════════════════════════════════════════════════${NC}"
}

# Service configurations
declare -A SERVICES=(
    ["auth-service"]="3011"
    ["category-service"]="3012"
    ["coupon-service"]="3013"
    ["product-service"]="3014"
    ["order-service"]="3015"
    ["graphql-gateway"]="4000"
)

# Frontend app configurations
declare -A FRONTEND_APPS=(
    ["shell-app"]="3000"
    ["admin-app"]="3001"
    ["seller-app"]="3002"
    ["storefront-app"]="3003"
)

# Package configurations
PACKAGES=("types" "utils" "ui-library")

# ============================================================
# SERVICE HEALTH CHECKS
# ============================================================
check_services() {
    print_header "BACKEND SERVICES HEALTH CHECK"
    
    local running_count=0
    local total_count=${#SERVICES[@]}

    for service in "${!SERVICES[@]}"; do
        port="${SERVICES[$service]}"
        url="http://localhost:${port}/health"
        
        if response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>/dev/null); then
            if [ "$response" = "200" ]; then
                print_success "$service is running on port $port"
                ((running_count++))
                if $VERBOSE; then
                    health_response=$(curl -s "$url" 2>/dev/null)
                    print_info "  Response: $health_response"
                fi
            else
                print_failure "$service returned status $response on port $port"
            fi
        else
            print_failure "$service is not running on port $port"
        fi
    done

    echo ""
    if [ $running_count -eq $total_count ]; then
        echo -e "  Summary: ${GREEN}$running_count/$total_count services running${NC}"
        return 0
    else
        echo -e "  Summary: ${YELLOW}$running_count/$total_count services running${NC}"
        return 1
    fi
}

# ============================================================
# FRONTEND APP CHECKS
# ============================================================
check_frontend() {
    print_header "FRONTEND APPS STATUS CHECK"
    
    local running_count=0
    local total_count=${#FRONTEND_APPS[@]}

    for app in "${!FRONTEND_APPS[@]}"; do
        port="${FRONTEND_APPS[$app]}"
        url="http://localhost:${port}"
        
        if response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>/dev/null); then
            if [ "$response" = "200" ]; then
                print_success "$app is running on port $port"
                ((running_count++))
            else
                print_failure "$app returned status $response on port $port"
            fi
        else
            print_failure "$app is not running on port $port"
        fi
    done

    echo ""
    if [ $running_count -eq $total_count ]; then
        echo -e "  Summary: ${GREEN}$running_count/$total_count frontend apps running${NC}"
        return 0
    else
        echo -e "  Summary: ${YELLOW}$running_count/$total_count frontend apps running${NC}"
        return 1
    fi
}

# ============================================================
# PACKAGE BUILD CHECKS
# ============================================================
check_packages() {
    print_header "PACKAGES BUILD STATUS CHECK"
    
    local built_count=0
    local total_count=${#PACKAGES[@]}

    for pkg in "${PACKAGES[@]}"; do
        dist_path="$ROOT_DIR/packages/$pkg/dist"
        
        if [ -d "$dist_path" ]; then
            file_count=$(find "$dist_path" -type f | wc -l)
            if [ "$file_count" -gt 0 ]; then
                latest_file=$(find "$dist_path" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
                if [ -n "$latest_file" ]; then
                    mod_time=$(stat -c %Y "$latest_file" 2>/dev/null || stat -f %m "$latest_file" 2>/dev/null)
                    current_time=$(date +%s)
                    hours_ago=$(( (current_time - mod_time) / 3600 ))
                    print_success "$pkg is built ($file_count files, last build: ${hours_ago}h ago)"
                else
                    print_success "$pkg is built ($file_count files)"
                fi
                ((built_count++))
            else
                print_failure "$pkg dist folder is empty"
            fi
        else
            print_failure "$pkg is not built (no dist folder)"
        fi

        if $VERBOSE; then
            pkg_json="$ROOT_DIR/packages/$pkg/package.json"
            if [ -f "$pkg_json" ]; then
                version=$(grep '"version"' "$pkg_json" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
                print_info "  Version: $version"
            fi
        fi
    done

    echo ""
    if [ $built_count -eq $total_count ]; then
        echo -e "  Summary: ${GREEN}$built_count/$total_count packages built${NC}"
        return 0
    else
        echo -e "  Summary: ${YELLOW}$built_count/$total_count packages built${NC}"
        return 1
    fi
}

# ============================================================
# MAIN EXECUTION
# ============================================================
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       E-COMMERCE PLATFORM HEALTH CHECK                    ║${NC}"
echo -e "${CYAN}║       $(date '+%Y-%m-%d %H:%M:%S')                              ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"

all_passed=true

if $CHECK_SERVICES; then
    if ! check_services; then
        all_passed=false
    fi
fi

if $CHECK_FRONTEND; then
    if ! check_frontend; then
        all_passed=false
    fi
fi

if $CHECK_PACKAGES; then
    if ! check_packages; then
        all_passed=false
    fi
fi

# Final Summary
print_header "FINAL SUMMARY"
if $all_passed; then
    echo -e "  ${GREEN}✓ All checks passed!${NC}"
else
    echo -e "  ${YELLOW}⚠ Some checks failed. Review the output above.${NC}"
fi

echo ""
echo -e "${NC}Usage:${NC}"
echo "  ./health-check.sh              # Run all checks"
echo "  ./health-check.sh --services   # Check only backend services"
echo "  ./health-check.sh --frontend   # Check only frontend apps"
echo "  ./health-check.sh --packages   # Check only packages"
echo "  ./health-check.sh --verbose    # Show detailed output"
echo ""

if $all_passed; then
    exit 0
else
    exit 1
fi
