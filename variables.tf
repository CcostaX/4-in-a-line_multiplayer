variable "project_id" {
  description = "The project ID to deploy to."
  default = "cnlabs-380119"
}

variable "region" {
  description = "The region to deploy to."
  default     = "us-central1"
}

variable "zone" {
  description = "The zone to deploy to."
  default     = "us-central1-a"
}



variable "mongodb_username" {
  description = "MongoDB Atlas username"
  type        = string
}

variable "mongodb_password" {
  description = "MongoDB Atlas password"
  type        = string
}
