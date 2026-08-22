locals {
  name_prefix = "ai-world-${var.ai_world_env}"

  project_environment = {
    staging    = "Staging"
    production = "Production"
  }[var.ai_world_env]
}

resource "digitalocean_project" "environment" {
  name        = local.name_prefix
  description = "AI World ${var.ai_world_env} production-operations resources."
  purpose     = "Web Application"
  environment = local.project_environment
}

resource "digitalocean_vpc" "environment" {
  name        = "${local.name_prefix}-vpc"
  description = "Private network for AI World ${var.ai_world_env}."
  region      = var.region
  ip_range    = var.vpc_cidr
}

resource "digitalocean_database_cluster" "postgres" {
  name                 = "${local.name_prefix}-postgres"
  engine               = "pg"
  version              = var.postgresql_major_version
  size                 = var.database_size
  region               = var.region
  node_count           = var.database_node_count
  private_network_uuid = digitalocean_vpc.environment.id

  tags = [
    "ai-world",
    var.ai_world_env,
    "canonical-persistence",
  ]

  lifecycle {
    prevent_destroy = true
  }
}

resource "digitalocean_database_db" "ai_world" {
  cluster_id = digitalocean_database_cluster.postgres.id
  name       = "ai_world"
}

resource "digitalocean_database_firewall" "postgres" {
  cluster_id = digitalocean_database_cluster.postgres.id

  rule {
    type  = "app"
    value = var.database_trusted_app_id
  }
}

resource "digitalocean_spaces_bucket" "media" {
  name          = var.media_bucket_name
  region        = var.region
  acl           = "private"
  force_destroy = false

  lifecycle {
    prevent_destroy = true
  }
}

resource "digitalocean_project_resources" "environment" {
  project = digitalocean_project.environment.id

  resources = [
    digitalocean_database_cluster.postgres.urn,
    digitalocean_spaces_bucket.media.urn,
  ]
}
