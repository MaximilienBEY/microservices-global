#!/bin/bash

# Terraform validation script
# Run this before deploying to catch configuration errors

set -e

echo "🔍 Validating Terraform configuration..."

# Initialize Terraform
echo "📦 Initializing Terraform..."
terraform init

# Validate configuration
echo "✅ Validating configuration..."
terraform validate

# Format check
echo "🎨 Checking formatting..."
terraform fmt -check=true -diff=true || {
    echo "⚠️  Files need formatting. Run 'terraform fmt' to fix."
    terraform fmt
    echo "✅ Files formatted."
}

echo "✅ All validation checks passed!"
echo ""
echo "Next steps:"
echo "1. Copy terraform.tfvars.example to terraform.tfvars"
echo "2. Edit terraform.tfvars with your project details"
echo "3. Run './deploy.sh plan' to see what will be created"
echo "4. Run './deploy.sh deploy' to create infrastructure"
