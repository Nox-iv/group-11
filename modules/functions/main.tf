terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.14.1"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.14.1"
    }
  }
}

resource "google_service_account" "function_sa" {
  account_id   = "${var.function_name}-sa"
  display_name = "${var.function_name} Service Account"
}

resource "google_project_iam_member" "function_storage_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.function_sa.email}"
}

resource "google_project_iam_member" "function_logging_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.function_sa.email}"
}

locals {
  ingress_settings = var.public ? "ALLOW_ALL" : "ALLOW_INTERNAL_ONLY"
}

data "archive_file" "source_archive" {
  type        = "zip"
  source_dir  = var.source_archive_bucket
  output_path = "/tmp/${var.function_name}.zip"
}

resource "google_storage_bucket_object" "source_archive" {
  name   = "${var.function_name}.zip"
  bucket = var.source_archive_bucket
  source = data.archive_file.source_archive.output_path
}

resource "google_cloudfunctions2_function" "function" {
  name        = var.function_name
  location    = var.region
  build_config {
    entry_point = var.entry_point
    runtime     = var.runtime
    source {
      storage_source {
        bucket = var.source_archive_bucket
        object = google_storage_bucket_object.source_archive.name
      }
    }
    environment_variables = var.env_vars
  }

  service_config {
    service_account_email = google_service_account.function_sa.email
    ingress_settings      = local.ingress_settings
  }

  depends_on = [google_service_account.function_sa]
}

resource "google_cloud_run_service_iam_member" "public_invoker" {
  count   = var.public ? 1 : 0
  service = google_cloudfunctions2_function.function.name
  location = var.region
  role    = "roles/run.invoker"
  member  = "allUsers"
}
