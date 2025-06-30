#!/bin/bash

# Movie App Deployment Script
set -e

echo "🚀 Starting Movie App Deployment..."

# Set variables
PROJECT_ID="movie-app-464210"
REGION="us-central1"
REGISTRY_URL="us-central1-docker.pkg.dev/movie-app-464210/movie-app-repo"
SERVICES=("auth" "user" "movie" "cinema" "reservation")

echo "📦 Building and pushing Docker images..."

# Build and push each service
for service in "${SERVICES[@]}"; do
    echo "Building $service service..."
    
    # Build the Docker image from root context with service-specific Dockerfile for linux/amd64
    docker build --platform linux/amd64 -f ./apps/$service/Dockerfile -t $REGISTRY_URL/$service:latest .
    
    # Push to Artifact Registry
    docker push $REGISTRY_URL/$service:latest
    
    echo "✅ $service image built and pushed"
done

echo "🔑 Setting up Kubernetes secrets..."

# Get database password from Secret Manager
DB_PASSWORD=$(gcloud secrets versions access latest --secret="movie-app-db-password" --project=$PROJECT_ID)

# Create namespace if it doesn't exist
kubectl create namespace default --dry-run=client -o yaml | kubectl apply -f -

# Create database secret with actual password
kubectl create secret generic database-config \
  --from-literal=url="postgresql://movie:$DB_PASSWORD@10.91.0.3:5432/movie" \
  --from-literal=host="10.91.0.3" \
  --from-literal=port="5432" \
  --from-literal=database="movie" \
  --from-literal=username="movie" \
  --from-literal=password="$DB_PASSWORD" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "📝 Applying Kubernetes manifests..."

# Apply configuration
kubectl apply -f terraform/k8s/secrets-updated.yaml

# Deploy all services
echo "Deploying Auth service..."
kubectl apply -f terraform/k8s/auth-service.yaml

echo "Deploying User service..."
kubectl apply -f terraform/k8s/user-service.yaml

echo "Deploying Movie service..."
kubectl apply -f terraform/k8s/movie-service.yaml

echo "Deploying Cinema service..."
kubectl apply -f terraform/k8s/cinema-service.yaml

echo "Deploying Reservation service..."
kubectl apply -f terraform/k8s/reservation-service.yaml

echo "🔄 Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/auth-service
kubectl wait --for=condition=available --timeout=300s deployment/user-service
kubectl wait --for=condition=available --timeout=300s deployment/movie-service
kubectl wait --for=condition=available --timeout=300s deployment/cinema-service
kubectl wait --for=condition=available --timeout=300s deployment/reservation-service

echo "📊 Checking deployment status..."
kubectl get pods
kubectl get services

echo "✅ All services deployed!"
echo ""
echo "🌐 Next steps:"
echo "1. Check pod logs: kubectl logs -l app=<service-name>"
echo "2. Port forward to test: kubectl port-forward service/<service-name> <port>:<port>"
echo "3. Set up ingress for external access"
echo "4. Configure domain and SSL"
