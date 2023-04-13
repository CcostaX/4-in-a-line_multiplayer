variable "external_client_port" { 
    type = number
    description = "External client"
    default = 8080
}

variable "external_server_port" { 
    type = number
    description = "External server"
    default = 3000
}

variable "external_database_port" { 
    type = number
    description = "External mongodb"
    default = 8080
}

variable "database_uri" { 
    type = string
    description = "Database_uri"
    default = "host.docker.internal"
}