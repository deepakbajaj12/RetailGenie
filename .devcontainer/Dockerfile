# Dev container for RetailGenie
FROM mcr.microsoft.com/devcontainers/python:3.12-bullseye

# System deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl git \
    && rm -rf /var/lib/apt/lists/*

# Workdir
WORKDIR /workspaces/RetailGenie

# Keep container alive for VS Code
CMD ["sleep", "infinity"]
