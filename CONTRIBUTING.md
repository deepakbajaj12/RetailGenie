# Contributing to RetailGenie

Thanks for your interest in improving RetailGenie! This guide helps you set up your environment, follow the workflow, and get your changes merged smoothly.

## Getting Started
- Clone and switch to a branch:
  - Naming: `feature/<slug>`, `fix/<slug>`, `docs/<slug>`
  - Example: `feature/inventory-forecast-endpoint`
- Install prerequisites:
  - Python 3.11+ (3.12 used in CI)
  - Redis (optional in dev; used for rate limiting/tasks)

## Local Setup (Backend)
From `backend/`:

```powershell
# Windows PowerShell
./scripts/start.ps1   # creates .venv, installs deps, runs app.py
```

```bash
# macOS/Linux
./scripts/start.sh    # or python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Environment config:
- Copy `backend/.env.example` to `backend/.env` and fill values.

## Pre-commit Hooks
We use Black, isort, Flake8, Mypy, and basic checks via pre-commit (see `backend/.pre-commit-config.yaml`).

```bash
cd backend
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

## Conventional Commits & PRs
- Commits follow: `type(scope): summary`
  - Types: feat, fix, docs, style, refactor, test, chore
  - Example: `feat(api): add demand forecast endpoint`
- Open a PR to `develop` (or as configured). The CI will run:
  - Code quality (pre-commit)
  - Unit/integration tests with coverage
  - Security scans (safety, bandit)

## Testing
```bash
cd backend
pytest -q
```
- Add tests for new behavior.
- Keep coverage from dropping where feasible.

## Code Style
- Python: Black (line length 88), isort, Flake8.
- Typing: Prefer type hints; Mypy runs in CI (permissive config).
- Keep functions small, clear, and tested.

## Documentation
- Update `README.md` and relevant docs under `backend/docs/` or root `docs/`.
- Include API changes in Swagger/OpenAPI if applicable.

## Security
- Never commit secrets. Use `.env` and secret managers.
- See `SECURITY.md` for reporting vulnerabilities.

## License & Ownership
- By contributing, you agree your contributions are under the repository’s license.

Thanks for helping make RetailGenie great! 🎉
