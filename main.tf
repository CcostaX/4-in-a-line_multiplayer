terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
    google = {
      source = "hashicorp/google"
    }
  }
}

provider "docker" {}

provider "google" {
  credentials = file("cnlabs-380119-76e777010ed0.json")
  project     = var.project_id
  region      = var.region
  zone        = var.zone
}

resource "docker_image" "client_image" {
  name         = "client"
  keep_locally = false
  build {
    context    = "./client"
  }
}

resource "docker_image" "server_image" {
  name         = "server"
  keep_locally = false
  build {
    context    = "./server"
  }
}

resource "google_cloud_run_v2_service" "server" {
  name     = "server-service"
  location = var.region

  template {
    containers {
      image = "gcr.io/${var.project_id}/github.com/ccostax/4-in-a-line_multiplayer_server:latest"

      env {
        name  = "MONGODB_USERNAME"
        value = var.mongodb_username
      }

      env {
        name  = "MONGODB_PASSWORD"
        value = var.mongodb_password
      }

      env {
        name  = "MONGODB_CLUSTER"
        value = "clustercnn.yt5qi60.mongodb.net"
      }

      env {
        name  = "database_uri"
        value = "cloud"
      }
    }
  }
}

resource "google_cloud_run_v2_service" "client" {
  name     = "client-service"
  location = var.region

  template {
    containers {
      image = "gcr.io/${var.project_id}/github.com/ccostax/4-in-a-line_multiplayer_client:latest"

      env {
        name  = "SERVER_URI"
        value = google_cloud_run_v2_service.server.uri
      }
    }
    
  }
}

data "google_iam_policy" "public" {
  binding {
    role    = "roles/run.invoker"
    members = ["allUsers"]
  }
}

resource "google_cloud_run_v2_service_iam_policy" "server_policy" {
  location    = google_cloud_run_v2_service.server.location
  project     = google_cloud_run_v2_service.server.project
  name        = google_cloud_run_v2_service.server.name
  policy_data = data.google_iam_policy.public.policy_data
}

resource "google_cloud_run_v2_service_iam_policy" "client_policy" {
  location    = google_cloud_run_v2_service.client.location
  project     = google_cloud_run_v2_service.client.project
  name        = google_cloud_run_v2_service.client.name
  policy_data = data.google_iam_policy.public.policy_data
}



  /*
  terraform {
    required_providers {
      docker = {
        source = "kreuzwerker/docker"
      }
    }
  }

  provider "docker" {}

  resource "docker_image" "client_image" {
    name         = "client"
    keep_locally = false
    build {
      context    = "./client"
      dockerfile = "Dockerfile"  
    }
  }
  resource "docker_container" "client_container" {
    image = docker_image.client_image.name
    name  = "client_container"

    ports {
      internal = 8080
      external = 8080
    }
  }

  resource "docker_container" "server_container" {
    image = docker_image.server_image.name
    name  = "server_container"

    ports {
      internal = 3000
      external = 3000
    }

    env = [
      "DATABASE_URI=mongodb://localhost:27017/"
    ]

    depends_on = [docker_container.mongodb_container]
  }

  resource "docker_container" "mongodb_container" {
    image = "mongo:latest"
    name  = "mongodb_container"

    ports {
      internal = 27017
      external = 27017
    }
  }*/


