#!/bin/bash

# RetailGenie Git Workflow Setup Script
# This script sets up the local Git workflow with pre-commit hooks and conventions

echo "🔧 Setting up RetailGenie Git Workflow..."

# Check if we're in a Git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a Git repository"
    exit 1
fi

# Navigate to backend directory for Python setup
cd backend || {
    echo "❌ Error: backend directory not found"
    exit 1
}

echo "📦 Installing pre-commit and development tools..."

# Install pre-commit and tools
pip install pre-commit black flake8 isort mypy safety bandit > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Development tools installed successfully"
else
    echo "⚠️ Warning: Some tools may not have installed correctly"
fi

# Install pre-commit hooks
echo "🪝 Installing pre-commit hooks..."
pre-commit install

if [ $? -eq 0 ]; then
    echo "✅ Pre-commit hooks installed successfully"
else
    echo "❌ Error: Failed to install pre-commit hooks"
    exit 1
fi

# Test pre-commit hooks
echo "🧪 Testing pre-commit hooks..."
pre-commit run --all-files

echo ""
echo "🎯 Git Workflow Setup Complete!"
echo ""
echo "📋 Usage Guidelines:"
echo "==================="
echo ""
echo "1. 🌿 **Branch Naming Conventions:**"
echo "   - feature/description     (e.g., feature/product-search)"
echo "   - fix/description         (e.g., fix/auth-token-bug)"
echo "   - docs/description        (e.g., docs/api-guide)"
echo "   - test/description        (e.g., test/unit-coverage)"
echo "   - chore/description       (e.g., chore/update-deps)"
echo ""
echo "2. 📝 **Commit Message Format:**"
echo "   type(scope): description"
echo ""
echo "   Types:"
echo "   - feat:     new feature"
echo "   - fix:      bug fix"
echo "   - docs:     documentation"
echo "   - style:    formatting"
echo "   - refactor: code refactoring"
echo "   - test:     adding tests"
echo "   - chore:    maintenance"
echo ""
echo "3. 🔄 **Example Workflow:**"
echo "   git checkout -b feature/product-recommendations"
echo "   # Make changes..."
echo "   git add ."
echo "   git commit -m \"feat(products): implement recommendation engine\""
echo "   git push origin feature/product-recommendations"
echo "   # Create Pull Request on GitHub"
echo ""
echo "4. 🧪 **Running Checks Manually:**"
echo "   pre-commit run --all-files    # Run all hooks"
echo "   black .                       # Format code"
echo "   flake8 .                      # Lint code"
echo "   mypy . --ignore-missing-imports  # Type check"
echo "   pytest tests/                 # Run tests"
echo ""
echo "5. 🚀 **Pre-commit Features:**"
echo "   - ✅ Automatic code formatting (Black)"
echo "   - ✅ Code linting (Flake8)"
echo "   - ✅ Import sorting (isort)"
echo "   - ✅ Type checking (MyPy)"
echo "   - ✅ Security scanning"
echo "   - ✅ Trailing whitespace removal"
echo "   - ✅ YAML validation"
echo ""
echo "🎊 Happy coding! The workflow will automatically maintain code quality."

# Return to root directory
cd ..

echo ""
echo "💡 **Tips:**"
echo "   - Pre-commit hooks run automatically on every commit"
echo "   - If hooks fail, fix issues and commit again"
echo "   - Use 'git commit --no-verify' to skip hooks (not recommended)"
echo "   - GitHub Actions will validate all changes in PRs"
echo ""
echo "🔗 **Resources:**"
echo "   - See GITHUB_WORKFLOW_GUIDE.md for complete workflow documentation"
echo "   - Check .pre-commit-config.yaml for hook configuration"
echo "   - Review .github/workflows/ci.yml for CI/CD pipeline details"
