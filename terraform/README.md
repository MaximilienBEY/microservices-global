# Terraform Configuration for Movie App on Google Cloud Platform

This Terraform configuration deploys a complete microservices application infrastructure on Google Cloud Platform (GCP). The infrastructure includes:

## Architecture Components

### Compute
- **Google Kubernetes Engine (GKE)** cluster with autoscaling node pools
- **Container Registry** for storing Docker images
- **Cloud Build** for CI/CD pipelines

### Database & Storage
- **Cloud SQL PostgreSQL** instance with private networking
- **Cloud Memorystore Redis** for caching and message queuing
- **Secret Manager** for secure credential storage

### Networking & Security
- **VPC** with custom subnets and firewall rules
- **Global Load Balancer** with SSL termination
- **Managed SSL Certificate** for HTTPS
- **Private service connections** for database access

### Identity & Access Management
- **Workload Identity** for secure pod-to-GCP service authentication
- **Service accounts** with least-privilege permissions
- **IAM roles** properly configured for all services

## Prerequisites

1. **Google Cloud Project**: Create a new GCP project or use an existing one
2. **Terraform**: Install Terraform >= 1.0
3. **Google Cloud SDK**: Install and configure `gcloud` CLI
4. **Domain**: Own a domain for SSL certificate (update `domain_name` variable)

## Setup Instructions

### 1. Configure Authentication

```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Required APIs

The Terraform configuration will automatically enable required APIs, but you can do it manually:

```bash
gcloud services enable \
  container.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  compute.googleapis.com \
  servicenetworking.googleapis.com
```

### 3. Configure Variables

Copy the example variables file and customize it:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set your values:

```hcl
project_id = "your-gcp-project-id"
domain_name = "your-domain.com"
# ... other variables
```

### 4. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
```

### 5. Configure kubectl

After deployment, configure kubectl to connect to your cluster:

```bash
# Get the kubectl configuration command from Terraform output
terraform output kubectl_config_command

# Run the command (example)
gcloud container clusters get-credentials movie-app-cluster-xxxx --region us-central1 --project your-project-id
```

## Post-Deployment Configuration

### 1. Update DNS

Point your domain to the external IP address:

```bash
# Get the external IP
terraform output external_ip_address
```

Add an A record in your DNS provider pointing your domain to this IP.

### 2. Wait for SSL Certificate

The managed SSL certificate may take 10-60 minutes to provision. Check status:

```bash
gcloud compute ssl-certificates describe movie-app-ssl-cert --global
```

### 3. Deploy Applications

After the infrastructure is ready, deploy your microservices to the GKE cluster using kubectl or Helm.

## Architecture Details

### Network Configuration
- **VPC CIDR**: 10.0.0.0/16 (main subnet)
- **Pod CIDR**: 10.1.0.0/16 (GKE pods)
- **Service CIDR**: 10.2.0.0/16 (GKE services)
- **Redis CIDR**: 10.3.0.0/29 (Redis instance)

### Security Features
- Private GKE cluster with authorized networks
- Private Cloud SQL instance (no public IP)
- Network policies enabled
- Workload Identity for secure service communication
- Secrets stored in Secret Manager

### Scaling Configuration
- **Node autoscaling**: 1-5 nodes (configurable)
- **Machine type**: e2-medium (configurable)
- **Disk size**: 50GB per node (configurable)

## Customization

### Variables

Key variables you can customize in `terraform.tfvars`:

- `project_id`: Your GCP project ID
- `region`: GCP region (default: us-central1)
- `domain_name`: Your domain for SSL certificate
- `node_count`: Initial number of GKE nodes
- `machine_type`: GKE node machine type
- `database_tier`: Cloud SQL instance tier
- `redis_memory_size_gb`: Redis memory allocation

### Services Configuration

The load balancer is configured with path-based routing:
- `/auth/*` → Auth service
- `/api/users/*`, `/users/*` → User service
- `/api/movies/*`, `/movies/*` → Movie service
- `/api/cinemas/*`, `/cinemas/*` → Cinema service
- `/api/reservations/*`, `/reservations/*` → Reservation service

## Monitoring and Maintenance

### Useful Commands

```bash
# Check cluster status
kubectl get nodes
kubectl get pods --all-namespaces

# Check Cloud SQL status
gcloud sql instances list

# Check Redis status
gcloud redis instances list --region us-central1

# View logs
gcloud logging read "resource.type=gke_container" --limit 50

# Check SSL certificate status
gcloud compute ssl-certificates list
```

### Backup Strategy

- **Database**: Automated daily backups (7-day retention)
- **Application state**: Store in external volumes or databases
- **Configuration**: Version controlled in Git

## Cost Optimization

- Use preemptible nodes for development environments
- Enable cluster autoscaling to scale down during low usage
- Monitor resource usage with GCP monitoring
- Consider using smaller machine types for non-production environments

## Troubleshooting

### Common Issues

1. **SSL Certificate not provisioning**: Ensure DNS is properly configured
2. **GKE cluster not accessible**: Check firewall rules and authorized networks
3. **Database connection issues**: Verify private service networking configuration
4. **High costs**: Review resource allocation and consider autoscaling settings

### Cleanup

To destroy all resources:

```bash
terraform destroy
```

**Warning**: This will permanently delete all resources including databases!

## Support

For issues or questions:
1. Check GCP documentation
2. Review Terraform logs
3. Check resource quotas in GCP console
4. Verify IAM permissions

## Security Considerations

- Regularly update node images
- Monitor security advisories
- Use least-privilege IAM roles
- Enable audit logging
- Keep Terraform state secure (consider remote backend)
