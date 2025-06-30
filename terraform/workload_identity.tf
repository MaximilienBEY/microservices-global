# IAM Service Account for Workload Identity
resource "google_service_account" "workload_identity_sa" {
  account_id   = "${var.project_name}-workload-sa"
  display_name = "Workload Identity Service Account for ${var.project_name}"
}

# Grant necessary permissions to the workload identity service account
resource "google_project_iam_member" "workload_identity_sa_roles" {
  for_each = toset([
    "roles/secretmanager.secretAccessor",
    "roles/cloudsql.client"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.workload_identity_sa.email}"
}

# Allow the Kubernetes service account to impersonate the Google service account
# This will be configured after the GKE cluster is created and Workload Identity is properly set up
/*
resource "google_service_account_iam_member" "workload_identity_binding" {
  service_account_id = google_service_account.workload_identity_sa.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[default/movie-app-sa]"
}
*/
