# Artifact Registry for storing Docker images
resource "google_artifact_registry_repository" "registry" {
  repository_id = "${var.project_name}-repo"
  location      = var.region
  format        = "DOCKER"
  description   = "Docker repository for ${var.project_name}"

  depends_on = [google_project_service.required_apis]
}

# Service Account for Cloud Build
resource "google_service_account" "cloudbuild_service_account" {
  account_id   = "${var.project_name}-cloudbuild-sa"
  display_name = "Cloud Build Service Account for ${var.project_name}"
}

resource "google_project_iam_member" "cloudbuild_service_account_roles" {
  for_each = toset([
    "roles/cloudbuild.builds.builder",
    "roles/container.developer",
    "roles/storage.admin"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.cloudbuild_service_account.email}"
}

# Cloud Build triggers for each microservice (commented out - configure manually in GCP Console)
# Uncomment and update GitHub details when ready to set up CI/CD

/*
resource "google_cloudbuild_trigger" "auth_trigger" {
  name        = "${var.project_name}-auth-trigger"
  description = "Trigger for auth service"

  github {
    owner = "your-github-username" # Update this with your GitHub username
    name  = "movie-app"            # Update this with your repository name
    push {
      branch = "^main$"
    }
  }

  substitutions = {
    _SERVICE_NAME = "auth"
    _IMAGE_NAME   = "${var.region}-docker.pkg.dev/${var.project_id}/${var.project_name}-repo/${var.project_name}-auth"
  }

  filename = "cloudbuild-auth.yaml"

  depends_on = [google_project_service.required_apis]
}

resource "google_cloudbuild_trigger" "user_trigger" {
  name        = "${var.project_name}-user-trigger"
  description = "Trigger for user service"

  github {
    owner = "your-github-username" # Update this with your GitHub username
    name  = "movie-app"            # Update this with your repository name
    push {
      branch = "^main$"
    }
  }

  substitutions = {
    _SERVICE_NAME = "user"
    _IMAGE_NAME   = "${var.region}-docker.pkg.dev/${var.project_id}/${var.project_name}-repo/${var.project_name}-user"
  }

  filename = "cloudbuild-user.yaml"

  depends_on = [google_project_service.required_apis]
}

resource "google_cloudbuild_trigger" "movie_trigger" {
  name        = "${var.project_name}-movie-trigger"
  description = "Trigger for movie service"

  github {
    owner = "your-github-username" # Update this with your GitHub username
    name  = "movie-app"            # Update this with your repository name
    push {
      branch = "^main$"
    }
  }

  substitutions = {
    _SERVICE_NAME = "movie"
    _IMAGE_NAME   = "${var.region}-docker.pkg.dev/${var.project_id}/${var.project_name}-repo/${var.project_name}-movie"
  }

  filename = "cloudbuild-movie.yaml"

  depends_on = [google_project_service.required_apis]
}

resource "google_cloudbuild_trigger" "cinema_trigger" {
  name        = "${var.project_name}-cinema-trigger"
  description = "Trigger for cinema service"

  github {
    owner = "your-github-username" # Update this with your GitHub username
    name  = "movie-app"            # Update this with your repository name
    push {
      branch = "^main$"
    }
  }

  substitutions = {
    _SERVICE_NAME = "cinema"
    _IMAGE_NAME   = "${var.region}-docker.pkg.dev/${var.project_id}/${var.project_name}-repo/${var.project_name}-cinema"
  }

  filename = "cloudbuild-cinema.yaml"

  depends_on = [google_project_service.required_apis]
}

resource "google_cloudbuild_trigger" "reservation_trigger" {
  name        = "${var.project_name}-reservation-trigger"
  description = "Trigger for reservation service"

  github {
    owner = "your-github-username" # Update this with your GitHub username
    name  = "movie-app"            # Update this with your repository name
    push {
      branch = "^main$"
    }
  }

  substitutions = {
    _SERVICE_NAME = "reservation"
    _IMAGE_NAME   = "${var.region}-docker.pkg.dev/${var.project_id}/${var.project_name}-repo/${var.project_name}-reservation"
  }

  filename = "cloudbuild-reservation.yaml"

  depends_on = [google_project_service.required_apis]
}
*/
