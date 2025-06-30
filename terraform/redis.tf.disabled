# Redis instance for RabbitMQ alternative (or you can use Cloud Pub/Sub)
resource "google_redis_instance" "redis" {
  name           = "${var.project_name}-redis-${random_string.default.result}"
  tier           = "BASIC"  # Use BASIC tier to avoid HA complexity
  memory_size_gb = var.redis_memory_size_gb
  region         = var.region

  authorized_network = google_compute_network.vpc_network.id
  connect_mode       = "PRIVATE_SERVICE_ACCESS"

  redis_version     = "REDIS_6_X"
  display_name      = "${var.project_name} Redis Instance"
  reserved_ip_range = google_compute_global_address.redis_ip_range.name

  depends_on = [
    google_service_networking_connection.private_vpc_connection,
    google_project_service.required_apis
  ]
}

# Store Redis connection details in Secret Manager
resource "google_secret_manager_secret" "redis_host" {
  secret_id = "${var.project_name}-redis-host"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "redis_host" {
  secret      = google_secret_manager_secret.redis_host.id
  secret_data = google_redis_instance.redis.host
}

resource "google_secret_manager_secret" "redis_port" {
  secret_id = "${var.project_name}-redis-port"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }

  depends_on = [google_project_service.required_apis]
}

resource "google_secret_manager_secret_version" "redis_port" {
  secret      = google_secret_manager_secret.redis_port.id
  secret_data = tostring(google_redis_instance.redis.port)
}
