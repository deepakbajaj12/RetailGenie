#!/usr/bin/env python3
"""
Simple Postman-style API testing script for RetailGenie Backend
This script mimics the Postman collection functionality using Python requests
"""

import json
import os
import subprocess
import sys
import time
from datetime import datetime

import requests


class PostmanRunner:
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.auth_token = None
        self.results = []

    def log_test(self, name, status, details=""):
        timestamp = datetime.now().strftime("%H:%M:%S")
        result = {
            "timestamp": timestamp,
            "name": name,
            "status": status,
            "details": details,
        }
        self.results.append(result)
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_icon} [{timestamp}] {name}: {status}")
        if details:
            print(f"   {details}")

    def start_api_if_needed(self):
        """Start API if not running"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=2)
            if response.status_code == 200:
                self.log_test("API Status", "PASS", "API is already running")
                return True
        except Exception:
            pass

        self.log_test("API Status", "WARN", "API not running, attempting to start...")
        try:
            # Start API in background
            subprocess.Popen(
                ["python", "app.py"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            time.sleep(5)  # Wait for startup

            # Test if it started
            response = requests.get(f"{self.base_url}/health", timeout=5)
            if response.status_code == 200:
                self.log_test("API Startup", "PASS", "API started successfully")
                return True
            else:
                self.log_test(
                    "API Startup", "FAIL", f"API responded with {response.status_code}"
                )
                return False
        except Exception as e:
            self.log_test("API Startup", "FAIL", f"Failed to start API: {e}")
            return False

    def test_health_check(self):
        """Test health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                status = data.get("status", "unknown")
                self.log_test("Health Check", "PASS", f"Status: {status}")
                return True
            else:
                self.log_test("Health Check", "FAIL", f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", "FAIL", str(e))
            return False

    def test_api_info(self):
        """Test API info endpoints"""
        endpoints = [
            ("/", "API Root"),
            ("/api/v1/info", "V1 Info"),
        ]

        for endpoint, name in endpoints:
            try:
                response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                if response.status_code == 200:
                    self.log_test(name, "PASS", f"HTTP {response.status_code}")
                elif response.status_code == 404:
                    self.log_test(
                        name,
                        "SKIP",
                        f"Endpoint not available (HTTP {response.status_code})",
                    )
                else:
                    self.log_test(name, "FAIL", f"HTTP {response.status_code}")
            except Exception as e:
                self.log_test(name, "FAIL", str(e))

    def test_authentication(self):
        """Test user registration and login"""
        # Test registration
        user_data = {
            "email": f"test_{int(time.time())}@example.com",
            "password": "testpassword123",
            "name": "Test User",
        }

        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/register", json=user_data, timeout=10
            )

            if response.status_code in [200, 201]:
                data = response.json()
                if "token" in data:
                    self.auth_token = data["token"]
                    self.session.headers.update(
                        {"Authorization": f"Bearer {self.auth_token}"}
                    )
                    self.log_test(
                        "User Registration",
                        "PASS",
                        "User registered and token received",
                    )
                else:
                    self.log_test("User Registration", "FAIL", "No token in response")
            else:
                self.log_test(
                    "User Registration", "FAIL", f"HTTP {response.status_code}"
                )
        except Exception as e:
            self.log_test("User Registration", "FAIL", str(e))

    def test_products(self):
        """Test product endpoints"""
        # Test get products
        try:
            response = self.session.get(f"{self.base_url}/api/v1/products", timeout=10)
            if response.status_code == 200:
                data = response.json()
                products_count = len(data.get("products", []))
                self.log_test(
                    "Get Products", "PASS", f"Found {products_count} products"
                )
            else:
                self.log_test("Get Products", "FAIL", f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Get Products", "FAIL", str(e))

        # Test create product (if authenticated)
        if self.auth_token:
            product_data = {
                "name": f"Test Product {int(time.time())}",
                "description": "Test product description",
                "price": 29.99,
                "category": "Electronics",
                "stock": 100,
            }

            try:
                response = self.session.post(
                    f"{self.base_url}/api/v1/products", json=product_data, timeout=10
                )

                if response.status_code in [200, 201]:
                    self.log_test(
                        "Create Product", "PASS", "Product created successfully"
                    )
                else:
                    self.log_test(
                        "Create Product", "FAIL", f"HTTP {response.status_code}"
                    )
            except Exception as e:
                self.log_test("Create Product", "FAIL", str(e))

    def test_ai_features(self):
        """Test AI assistant endpoints"""
        if not self.auth_token:
            self.log_test("AI Assistant", "SKIP", "No authentication token")
            return

        try:
            ai_data = {
                "query": "What products do you recommend?",
                "context": "customer looking for electronics",
            }

            response = self.session.post(
                f"{self.base_url}/api/v1/ai/chat", json=ai_data, timeout=15
            )

            if response.status_code == 200:
                self.log_test("AI Assistant", "PASS", "AI chat response received")
            else:
                self.log_test("AI Assistant", "FAIL", f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("AI Assistant", "FAIL", str(e))

    def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 RetailGenie Postman-style API Tests")
        print("=" * 50)
        print(f"Target URL: {self.base_url}")
        print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()

        # Start API if needed
        if not self.start_api_if_needed():
            print("❌ Cannot proceed without API running")
            return False

        # Run test suite
        self.test_health_check()
        self.test_api_info()
        self.test_authentication()
        self.test_products()
        self.test_ai_features()

        # Summary
        print("\n" + "=" * 50)
        print("📊 Test Summary")
        print("=" * 50)

        passed = len([r for r in self.results if r["status"] == "PASS"])
        failed = len([r for r in self.results if r["status"] == "FAIL"])
        warnings = len([r for r in self.results if r["status"] == "WARN"])
        skipped = len([r for r in self.results if r["status"] == "SKIP"])

        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"⚠️  Warnings: {warnings}")
        print(f"⏭️  Skipped: {skipped}")
        print(f"📋 Total: {len(self.results)}")

        # Show details for failed tests
        failed_tests = [r for r in self.results if r["status"] == "FAIL"]
        if failed_tests:
            print("\n❌ Failed Tests Details:")
            for test in failed_tests:
                print(f"   - {test['name']}: {test['details']}")

        if failed == 0:
            print("\n🎉 All tests passed! API is working correctly.")
            return True
        else:
            print(f"\n⚠️  {failed} tests failed. Check the details above.")
            return False


def main():
    """Main function"""
    base_url = "http://localhost:5000"

    # Check if custom URL provided
    if len(sys.argv) > 1:
        base_url = sys.argv[1]

    runner = PostmanRunner(base_url)
    success = runner.run_all_tests()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
