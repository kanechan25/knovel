#!/bin/bash

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! docker ps > /dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Function to create environment files if they don't exist
create_env_files() {
    print_status "Checking environment files..."
    
    if [ ! -f "apps/backend/.env" ]; then
        print_warning "Backend .env file not found. Creating with default values..."
        cat > apps/backend/.env << 'EOF'
DATABASE_URL="postgresql://user:password@postgres:5432/task_management?schema=public"
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_here_please_change_in_production_very_long_and_secure_key_123456789

FRONTEND_URL=http://localhost:5173
EOF
        print_warning "Please update the JWT_SECRET in apps/backend/.env before production deployment!"
        print_status "CORS automatically allows ports 5173, 3000, 3001 for both dev and Docker"
    fi
    
    if [ ! -f "apps/frontend/.env" ]; then
        print_warning "Frontend .env file not found. Creating with default values..."
        cat > apps/frontend/.env << 'EOF'
VITE_API_URL=http://localhost:5000
EOF
    fi
    
    print_success "Environment files are ready!"
}

# Function to clean up previous deployments
cleanup() {
    print_status "Cleaning up previous deployments..."
    docker-compose down > /dev/null 2>&1 || true
    if [ "$1" = "--clean-images" ]; then
        print_status "Removing unused Docker images..."
        docker image prune -f > /dev/null 2>&1 || true
    fi
    print_success "Cleanup completed!"
}

# Function to build and start services
deploy() {
    print_status "Building and starting services..."
    if docker-compose up --build -d; then
        print_success "All services started successfully!"
    else
        print_error "Failed to start services!"
        exit 1
    fi
}

# Function to wait for services to be healthy
wait_for_health() {
    print_status "Waiting for services to be healthy..."
    
    local max_wait=300  # 5 minutes
    local wait_time=0
    local interval=5
    
    while [ $wait_time -lt $max_wait ]; do
        if docker-compose ps | grep -q "unhealthy"; then
            print_status "Some services are still starting... ($wait_time/$max_wait seconds)"
            sleep $interval
            wait_time=$((wait_time + interval))
        else
            break
        fi
    done
    
    if [ $wait_time -ge $max_wait ]; then
        print_error "Services did not become healthy within $max_wait seconds!"
        print_status "Checking service status..."
        docker-compose ps
        print_status "Showing logs for troubleshooting..."
        docker-compose logs --tail=50
        exit 1
    fi
    
    print_success "All services are healthy!"
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo "=================================="
    docker-compose ps
    echo "=================================="
    
    print_success "🚀 Task Management App is now running!"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:5000"
    echo "Database: localhost:5432"
    echo ""
    echo "Default Login Credentials:"
    echo "Employer: employer1 / knovel123@"
    echo "Employee: employee1 / knovel123@"
    echo ""
    echo "Useful Commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop app: docker-compose down"
    echo "   Restart: docker-compose restart"
}

# Function to show help
show_help() {
    echo "Task Management App Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help              Show this help message"
    echo "  --clean-images      Remove unused Docker images during cleanup"
    echo "  --no-cleanup        Skip cleanup step"
    echo "  --quick             Skip health checks (faster but less safe)"
    echo ""
    echo "Examples:"
    echo "  $0                  Standard deployment"
    echo "  $0 --clean-images   Deploy with image cleanup"
    echo "  $0 --quick          Quick deployment without health checks"
}

# Main execution
main() {
    local clean_images=false
    local skip_cleanup=false
    local skip_health=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --help)
                show_help
                exit 0
                ;;
            --clean-images)
                clean_images=true
                shift
                ;;
            --no-cleanup)
                skip_cleanup=true
                shift
                ;;
            --quick)
                skip_health=true
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    print_success "🚀 Starting Task Management App Deployment"
    echo "============================================="
    
    # Run deployment steps
    check_prerequisites
    create_env_files
    
    if [ "$skip_cleanup" = false ]; then
        if [ "$clean_images" = true ]; then
            cleanup --clean-images
        else
            cleanup
        fi
    fi
    
    deploy
    
    if [ "$skip_health" = false ]; then
        wait_for_health
    fi
    
    show_status
    
    print_success "🎉 Deployment completed successfully!"
}

main "$@" 