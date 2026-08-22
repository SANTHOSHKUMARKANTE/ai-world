terraform {
  required_version = "~> 1.15.0"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.99.1"
    }
  }
}
