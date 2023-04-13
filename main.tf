  terraform {
    required_providers {
      docker = {
        source = "kreuzwerker/docker"
      }
    }
  }

  provider "docker" {
  }

  resource "docker_image" "client_image" {
    name = "client"
    keep_locally = false
    build {
      context = "./client"
      dockerfile = "Dockerfile"
    }
  }

  resource "docker_image" "server_image" {
    name  = "server"
    keep_locally = false
    build {
      context = "./server"
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
  }
