variable "project_id" {
  type = string
}

variable "function_name" {
  type = string
}

variable "region" {
  type    = string
  default = "europe-west2"
}

variable "runtime" {
  type    = string
  default = "nodejs20"
}

variable "entry_point" {
  type = string
}

variable "source_archive_bucket" {
  type = string
}

variable "public" {
  type    = bool
  default = false
}

variable "env_vars" {
  type    = map(string)
  default = {}
}