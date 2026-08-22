output "project_id" {
  description = "DigitalOcean Project ID for the environment."
  value       = digitalocean_project.environment.id
}

output "vpc_id" {
  description = "DigitalOcean VPC ID for the environment."
  value       = digitalocean_vpc.environment.id
}

output "database_cluster_id" {
  description = "Managed PostgreSQL cluster ID."
  value       = digitalocean_database_cluster.postgres.id
}

output "database_private_host" {
  description = "Private PostgreSQL host for later deployment wiring."
  value       = digitalocean_database_cluster.postgres.private_host
}

output "media_bucket_name" {
  description = "Private Media Spaces bucket name."
  value       = digitalocean_spaces_bucket.media.name
}

output "media_bucket_endpoint" {
  description = "Spaces endpoint for later storage-client wiring."
  value       = digitalocean_spaces_bucket.media.endpoint
}
