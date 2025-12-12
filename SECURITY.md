# Security Policy

We take security seriously and appreciate responsible disclosure.

## Reporting a Vulnerability
- Please do NOT open a public issue for security reports.
- Use GitHub Security Advisories to privately report a vulnerability to the maintainers:
  - In GitHub, go to "Security" > "Advisories" > "Report a vulnerability" for this repo.
- Include steps to reproduce, impact assessment, and any possible fixes.

## Supported Versions
- `main` is actively maintained.

## Secrets & Keys
- Never commit secrets to the repository. Use environment variables and `.env` files locally (see `backend/.env.example`).
- Rotate keys if you suspect exposure.
