#!/bin/bash

# Deployment script for Movie App infrastructure on GCP
# This script automates the deployment process

set -e

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    if ! command -v gcloud &> /dev/null; then
        print_error "Google Cloud SDK is not installed. Please install gcloud first."
        exit 1
    fi
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    print_success "All requirements are met."
}

# Check if user is authenticated with gcloud
check_auth() {
    print_status "Checking Google Cloud authentication..."
    
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -1 > /dev/null; then
        print_error "Not authenticated with Google Cloud. Please run 'gcloud auth login'"
        exit 1
    fi
    
    print_success "Google Cloud authentication verified."
}

# Validate terraform.tfvars exists
check_config() {
    print_status "Checking configuration..."
    
    if [ ! -f "terraform.tfvars" ]; then
        print_warning "terraform.tfvars not found. Creating from example..."
        if [ -f "terraform.tfvars.example" ]; then
            cp terraform.tfvars.example terraform.tfvars
            print_warning "Please edit terraform.tfvars with your project details before continuing."
            read -p "Press Enter after updating terraform.tfvars..."
        else
            print_error "terraform.tfvars.example not found. Please create terraform.tfvars manually."
            exit 1
        fi
    fi
    
    print_success "Configuration file found."
}

# Initialize Terraform
init_terraform() {
    print_status "Initializing Terraform..."
    terraform init
    print_success "Terraform initialized."
}

# Plan Terraform deployment
plan_terraform() {
    print_status "Planning Terraform deployment..."
    terraform plan -out=tfplan
    print_success "Terraform plan completed."
}

# Apply Terraform deployment
apply_terraform() {
    print_status "Applying Terraform deployment..."
    print_warning "This will create resources in your GCP project and may incur costs."
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        terraform apply tfplan
        print_success "Infrastructure deployed successfully!"
    else
        print_warning "Deployment cancelled."
        exit 0
    fi
}

# Configure kubectl
configure_kubectl() {
    print_status "Configuring kubectl..."
    
    # Get the kubectl configuration command from Terraform output
    kubectl_cmd=$(terraform output -raw kubectl_config_command 2>/dev/null || echo "")
    
    if [ -n "$kubectl_cmd" ]; then
        print_status "Running: $kubectl_cmd"
        eval "$kubectl_cmd"
        print_success "kubectl configured successfully."
    else
        print_error "Could not get kubectl configuration from Terraform output."
        exit 1
    fi
}

# Display deployment information
show_deployment_info() {
    print_status "Deployment Information:"
    echo "========================"
    
    echo "GKE Cluster Name: $(terraform output -raw gke_cluster_name 2>/dev/null || echo 'N/A')"
    echo "GKE Cluster Location: $(terraform output -raw gke_cluster_location 2>/dev/null || echo 'N/A')"
    echo "External IP Address: $(terraform output -raw external_ip_address 2>/dev/null || echo 'N/A')"
    echo "Database Connection Name: $(terraform output -raw database_connection_name 2>/dev/null || echo 'N/A')"
    echo "Container Registry URL: $(terraform output -raw container_registry_url 2>/dev/null || echo 'N/A')"
    echo "Redis Host: $(terraform output -raw redis_host 2>/dev/null || echo 'N/A')"
    
    echo ""
    print_status "Next Steps:"
    echo "1. Point your domain to the external IP address"
    echo "2. Wait for SSL certificate to provision (10-60 minutes)"
    echo "3. Deploy your applications to the GKE cluster"
    echo "4. Check SSL certificate status: gcloud compute ssl-certificates list"
    
    echo ""
    print_warning "Important: Update your DNS records to point to the external IP address above."
}

# Main deployment function
main() {
    print_status "Starting Movie App infrastructure deployment..."
    
    check_requirements
    check_auth
    check_config
    init_terraform
    plan_terraform
    apply_terraform
    configure_kubectl
    show_deployment_info
    
    print_success "Deployment completed successfully!"
}

# Help function
show_help() {
    echo "Movie App GCP Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  deploy     Deploy the infrastructure (default)"
    echo "  destroy    Destroy the infrastructure"
    echo "  plan       Show deployment plan without applying"
    echo "  info       Show deployment information"
    echo "  help       Show this help message"
    echo ""
}

# Destroy infrastructure
destroy_infrastructure() {
    print_warning "This will destroy ALL infrastructure including databases!"
    print_warning "This action cannot be undone!"
    read -p "Are you absolutely sure? Type 'destroy' to confirm: " confirm
    
    if [ "$confirm" = "destroy" ]; then
        print_status "Destroying infrastructure..."
        terraform destroy
        print_success "Infrastructure destroyed."
    else
        print_warning "Destruction cancelled."
    fi
}

# Show deployment plan only
show_plan() {
    check_requirements
    check_auth
    check_config
    init_terraform
    terraform plan
}

# Show deployment info
show_info() {
    if [ -f "terraform.tfstate" ]; then
        show_deployment_info
    else
        print_error "No Terraform state found. Please deploy infrastructure first."
    fi
}

# Handle command line arguments
case "${1:-deploy}" in
    deploy)
        main
        ;;
    destroy)
        destroy_infrastructure
        ;;
    plan)
        show_plan
        ;;
    info)
        show_info
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
