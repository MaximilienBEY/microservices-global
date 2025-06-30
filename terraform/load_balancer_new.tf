# Load Balancer Configuration for Movie App

# External IP address
resource "google_compute_global_address" "external_ip" {
  name = "${var.project_name}-external-ip"
}

# SSL Certificate
resource "google_compute_managed_ssl_certificate" "ssl_cert" {
  name = "${var.project_name}-ssl-cert"

  managed {
    domains = [var.domain_name]
  }
}

# URL Map for HTTPS
resource "google_compute_url_map" "url_map" {
  name            = "${var.project_name}-url-map"
  default_service = google_compute_backend_service.backend_service.id

  host_rule {
    hosts        = [var.domain_name]
    path_matcher = "allpaths"
  }

  path_matcher {
    name            = "allpaths"
    default_service = google_compute_backend_service.backend_service.id

    path_rule {
      paths   = ["/auth/*"]
      service = google_compute_backend_service.auth_backend_service.id
    }

    path_rule {
      paths   = ["/api/users/*", "/users/*"]
      service = google_compute_backend_service.user_backend_service.id
    }

    path_rule {
      paths   = ["/api/movies/*", "/movies/*"]
      service = google_compute_backend_service.movie_backend_service.id
    }

    path_rule {
      paths   = ["/api/cinemas/*", "/cinemas/*"]
      service = google_compute_backend_service.cinema_backend_service.id
    }

    path_rule {
      paths   = ["/api/reservations/*", "/reservations/*"]
      service = google_compute_backend_service.reservation_backend_service.id
    }
  }
}

# URL Map for HTTP (redirects to HTTPS)
resource "google_compute_url_map" "redirect_url_map" {
  name = "${var.project_name}-redirect-url-map"

  default_url_redirect {
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
    https_redirect         = true
  }
}

# HTTPS Target Proxy
resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "${var.project_name}-https-proxy"
  url_map          = google_compute_url_map.url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl_cert.id]
}

# HTTP Target Proxy (for redirect)
resource "google_compute_target_http_proxy" "http_proxy" {
  name    = "${var.project_name}-http-proxy"
  url_map = google_compute_url_map.redirect_url_map.id
}

# Global forwarding rules
resource "google_compute_global_forwarding_rule" "https_forwarding_rule" {
  name       = "${var.project_name}-https-forwarding-rule"
  target     = google_compute_target_https_proxy.https_proxy.id
  port_range = "443"
  ip_address = google_compute_global_address.external_ip.address
}

resource "google_compute_global_forwarding_rule" "http_forwarding_rule" {
  name       = "${var.project_name}-http-forwarding-rule"
  target     = google_compute_target_http_proxy.http_proxy.id
  port_range = "80"
  ip_address = google_compute_global_address.external_ip.address
}

# Backend services for each microservice
resource "google_compute_backend_service" "backend_service" {
  name                            = "${var.project_name}-backend-service"
  connection_draining_timeout_sec = 10
  health_checks                   = [google_compute_health_check.health_check.id]
  load_balancing_scheme           = "EXTERNAL"
  port_name                       = "http"
  protocol                        = "HTTP"
  session_affinity                = "NONE"
  timeout_sec                     = 30

  # No backend configuration - will be managed by GKE ingress controller
}

resource "google_compute_backend_service" "auth_backend_service" {
  name                            = "${var.project_name}-auth-backend"
  connection_draining_timeout_sec = 10
  health_checks                   = [google_compute_health_check.auth_health_check.id]
  load_balancing_scheme           = "EXTERNAL"
  port_name                       = "http"
  protocol                        = "HTTP"
  session_affinity                = "NONE"
  timeout_sec                     = 30

  # No backend configuration - will be managed by GKE ingress controller
}

resource "google_compute_backend_service" "user_backend_service" {
  name                            = "${var.project_name}-user-backend"
  connection_draining_timeout_sec = 10
  health_checks                   = [google_compute_health_check.user_health_check.id]
  load_balancing_scheme           = "EXTERNAL"
  port_name                       = "http"
  protocol                        = "HTTP"
  session_affinity                = "NONE"
  timeout_sec                     = 30

  # No backend configuration - will be managed by GKE ingress controller
}

resource "google_compute_backend_service" "movie_backend_service" {
  name                            = "${var.project_name}-movie-backend"
  connection_draining_timeout_sec = 10
  health_checks                   = [google_compute_health_check.movie_health_check.id]
  load_balancing_scheme           = "EXTERNAL"
  port_name                       = "http"
  protocol                        = "HTTP"
  session_affinity                = "NONE"
  timeout_sec                     = 30

  # No backend configuration - will be managed by GKE ingress controller
}

resource "google_compute_backend_service" "cinema_backend_service" {
  name                            = "${var.project_name}-cinema-backend"
  connection_draining_timeout_sec = 10
  health_checks                   = [google_compute_health_check.cinema_health_check.id]
  load_balancing_scheme           = "EXTERNAL"
  port_name                       = "http"
  protocol                        = "HTTP"
  session_affinity                = "NONE"
  timeout_sec                     = 30

  # No backend configuration - will be managed by GKE ingress controller
}

resource "google_compute_backend_service" "reservation_backend_service" {
  name                            = "${var.project_name}-reservation-backend"
  connection_draining_timeout_sec = 10
  health_checks                   = [google_compute_health_check.reservation_health_check.id]
  load_balancing_scheme           = "EXTERNAL"
  port_name                       = "http"
  protocol                        = "HTTP"
  session_affinity                = "NONE"
  timeout_sec                     = 30

  # No backend configuration - will be managed by GKE ingress controller
}

# Health checks
resource "google_compute_health_check" "health_check" {
  name               = "${var.project_name}-health-check"
  check_interval_sec = 10
  timeout_sec        = 5

  http_health_check {
    port         = 80
    request_path = "/health"
  }
}

resource "google_compute_health_check" "auth_health_check" {
  name               = "${var.project_name}-auth-health-check"
  check_interval_sec = 10
  timeout_sec        = 5

  http_health_check {
    port         = 3001
    request_path = "/health"
  }
}

resource "google_compute_health_check" "user_health_check" {
  name               = "${var.project_name}-user-health-check"
  check_interval_sec = 10
  timeout_sec        = 5

  http_health_check {
    port         = 3002
    request_path = "/health"
  }
}

resource "google_compute_health_check" "movie_health_check" {
  name               = "${var.project_name}-movie-health-check"
  check_interval_sec = 10
  timeout_sec        = 5

  http_health_check {
    port         = 3003
    request_path = "/health"
  }
}

resource "google_compute_health_check" "cinema_health_check" {
  name               = "${var.project_name}-cinema-health-check"
  check_interval_sec = 10
  timeout_sec        = 5

  http_health_check {
    port         = 3004
    request_path = "/health"
  }
}

resource "google_compute_health_check" "reservation_health_check" {
  name               = "${var.project_name}-reservation-health-check"
  check_interval_sec = 10
  timeout_sec        = 5

  http_health_check {
    port         = 3005
    request_path = "/health"
  }
}
