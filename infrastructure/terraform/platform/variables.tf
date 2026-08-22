variable "ai_world_env" {
  description = "AI World deployment environment represented by this state."
  type        = string

  validation {
    condition     = contains(["staging", "production"], var.ai_world_env)
    error_message = "ai_world_env must be either staging or production."
  }
}

variable "region" {
  description = "DigitalOcean infrastructure region."
  type        = string
  default     = "blr1"
}

variable "vpc_cidr" {
  description = "Dedicated VPC CIDR for this environment."
  type        = string

  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "vpc_cidr must be a valid IPv4 CIDR."
  }
}

variable "postgresql_major_version" {
  description = "Managed PostgreSQL major version."
  type        = string
  default     = "18"

  validation {
    condition     = var.postgresql_major_version == "18"
    error_message = "The P10-M03 compatibility baseline is PostgreSQL 18."
  }
}

variable "database_size" {
  description = "DigitalOcean managed database size slug; capacity is approved separately."
  type        = string

  validation {
    condition     = startswith(var.database_size, "db-")
    error_message = "database_size must be a DigitalOcean database size slug."
  }
}

variable "database_node_count" {
  description = "Managed PostgreSQL node count; production capacity is approved separately."
  type        = number

  validation {
    condition = (
      var.database_node_count >= 1 &&
      var.database_node_count <= 3 &&
      floor(var.database_node_count) == var.database_node_count
    )
    error_message = "database_node_count must be an integer from 1 through 3."
  }
}

variable "database_trusted_app_id" {
  description = "DigitalOcean App Platform application ID allowed by the database firewall; supplied by P10-M04."
  type        = string

  validation {
    condition     = length(trimspace(var.database_trusted_app_id)) > 0
    error_message = "database_trusted_app_id must be supplied before planning/applying infrastructure."
  }
}

variable "media_bucket_name" {
  description = "Globally unique private Spaces bucket name for AI World Media."
  type        = string

  validation {
    condition     = length(trimspace(var.media_bucket_name)) >= 3
    error_message = "media_bucket_name must be a non-empty globally unique Spaces bucket name."
  }
}
