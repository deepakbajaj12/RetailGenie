#!/usr/bin/env python3
"""
Advanced Features Test Suite
Tests Celery, WebSocket, and Swagger functionality
"""

import json
import threading
import time
from datetime import datetime
from typing import Any, Dict, List

import requests
import websocket


class AdvancedFeaturesTest:
    def __init__(self):
        self.base_url = "http://localhost:5000"
        self.websocket_url = "ws://localhost:5001/socket.io"
        self.swagger_url = "http://localhost:5002"
        self.results = []

    def test_result(
        self, test_name: str, success: bool, message: str, details: Dict = None
    ):
        """Record test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {},
        }
        self.results.append(result)

        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {message}")

        return result

    def test_celery_integration(self) -> List[Dict]:
        """Test Celery background tasks"""
        print("\n🔄 Testing Celery Background Tasks...")
        celery_results = []

        # Test 1: Email task
        try:
            response = requests.post(
                f"{self.base_url}/api/tasks/email",
                json={
                    "recipient": "test@example.com",
                    "subject": "Test Email",
                    "body": "This is a test email from Celery",
                    "email_type": "test",
                },
                timeout=5,
            )

            if response.status_code == 202:
                task_data = response.json()
                task_id = task_data.get("task_id")
                celery_results.append(
                    self.test_result(
                        "Celery Email Task",
                        True,
                        f"Email task queued successfully: {task_id}",
                        {"task_id": task_id},
                    )
                )

                # Check task status
                time.sleep(2)
                status_response = requests.get(f"{self.base_url}/api/tasks/{task_id}")
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    celery_results.append(
                        self.test_result(
                            "Celery Task Status",
                            True,
                            f"Task status retrieved: {status_data.get('state', 'Unknown')}",
                            status_data,
                        )
                    )
                else:
                    celery_results.append(
                        self.test_result(
                            "Celery Task Status",
                            False,
                            f"Failed to get task status: {status_response.status_code}",
                        )
                    )
            else:
                celery_results.append(
                    self.test_result(
                        "Celery Email Task",
                        False,
                        f"Failed to queue email task: {response.status_code}",
                    )
                )

        except requests.exceptions.RequestException as e:
            celery_results.append(
                self.test_result(
                    "Celery Email Task", False, f"Request failed: {str(e)}"
                )
            )

        # Test 2: Report generation task
        try:
            response = requests.post(
                f"{self.base_url}/api/tasks/report",
                json={
                    "report_type": "test_report",
                    "date_range": {
                        "start": "2025-06-01T00:00:00Z",
                        "end": "2025-06-30T23:59:59Z",
                    },
                },
                timeout=5,
            )

            if response.status_code == 202:
                task_data = response.json()
                celery_results.append(
                    self.test_result(
                        "Celery Report Task",
                        True,
                        f"Report task queued successfully: {task_data.get('task_id')}",
                        task_data,
                    )
                )
            else:
                celery_results.append(
                    self.test_result(
                        "Celery Report Task",
                        False,
                        f"Failed to queue report task: {response.status_code}",
                    )
                )

        except requests.exceptions.RequestException as e:
            celery_results.append(
                self.test_result(
                    "Celery Report Task", False, f"Request failed: {str(e)}"
                )
            )

        return celery_results

    def test_websocket_functionality(self) -> List[Dict]:
        """Test WebSocket real-time features"""
        print("\n🔗 Testing WebSocket Functionality...")
        websocket_results = []

        # Test WebSocket connection
        try:
            # First, test HTTP endpoint
            response = requests.get(f"http://localhost:5001/", timeout=5)
            if response.status_code == 200:
                websocket_results.append(
                    self.test_result(
                        "WebSocket Server",
                        True,
                        "WebSocket server is running",
                        response.json(),
                    )
                )
            else:
                websocket_results.append(
                    self.test_result(
                        "WebSocket Server",
                        False,
                        f"WebSocket server not responding: {response.status_code}",
                    )
                )

        except requests.exceptions.RequestException as e:
            websocket_results.append(
                self.test_result(
                    "WebSocket Server",
                    False,
                    f"WebSocket server not accessible: {str(e)}",
                )
            )

        # Test WebSocket stats endpoint
        try:
            response = requests.get(f"http://localhost:5001/ws-stats", timeout=5)
            if response.status_code == 200:
                stats_data = response.json()
                websocket_results.append(
                    self.test_result(
                        "WebSocket Stats",
                        True,
                        f"WebSocket stats retrieved: {stats_data.get('connected_users', 0)} users",
                        stats_data,
                    )
                )
            else:
                websocket_results.append(
                    self.test_result(
                        "WebSocket Stats",
                        False,
                        f"Failed to get WebSocket stats: {response.status_code}",
                    )
                )

        except requests.exceptions.RequestException as e:
            websocket_results.append(
                self.test_result(
                    "WebSocket Stats",
                    False,
                    f"WebSocket stats request failed: {str(e)}",
                )
            )

        # Test broadcast functionality
        try:
            response = requests.post(
                f"http://localhost:5001/broadcast/general",
                json={"message": "Test broadcast message", "type": "test"},
                timeout=5,
            )

            if response.status_code == 200:
                broadcast_data = response.json()
                websocket_results.append(
                    self.test_result(
                        "WebSocket Broadcast",
                        True,
                        f"Broadcast sent successfully: {broadcast_data.get('recipients', 0)} recipients",
                        broadcast_data,
                    )
                )
            else:
                websocket_results.append(
                    self.test_result(
                        "WebSocket Broadcast",
                        False,
                        f"Broadcast failed: {response.status_code}",
                    )
                )

        except requests.exceptions.RequestException as e:
            websocket_results.append(
                self.test_result(
                    "WebSocket Broadcast", False, f"Broadcast request failed: {str(e)}"
                )
            )

        return websocket_results

    def test_swagger_documentation(self) -> List[Dict]:
        """Test Swagger API documentation"""
        print("\n📚 Testing Swagger Documentation...")
        swagger_results = []

        # Test Swagger UI
        try:
            response = requests.get(f"{self.swagger_url}/docs/", timeout=10)
            if response.status_code == 200:
                swagger_results.append(
                    self.test_result(
                        "Swagger UI",
                        True,
                        "Swagger documentation UI is accessible",
                        {"content_length": len(response.content)},
                    )
                )
            else:
                swagger_results.append(
                    self.test_result(
                        "Swagger UI",
                        False,
                        f"Swagger UI not accessible: {response.status_code}",
                    )
                )

        except requests.exceptions.RequestException as e:
            swagger_results.append(
                self.test_result(
                    "Swagger UI", False, f"Swagger UI request failed: {str(e)}"
                )
            )

        # Test API spec
        try:
            response = requests.get(f"{self.swagger_url}/api/swagger.json", timeout=5)
            if response.status_code == 200:
                spec_data = response.json()
                swagger_results.append(
                    self.test_result(
                        "Swagger Spec",
                        True,
                        f"API specification retrieved: {spec_data.get('info', {}).get('title', 'Unknown')}",
                        {"version": spec_data.get("info", {}).get("version")},
                    )
                )
            else:
                swagger_results.append(
                    self.test_result(
                        "Swagger Spec",
                        False,
                        f"API spec not accessible: {response.status_code}",
                    )
                )

        except requests.exceptions.RequestException as e:
            swagger_results.append(
                self.test_result(
                    "Swagger Spec", False, f"API spec request failed: {str(e)}"
                )
            )

        # Test documented endpoints
        documented_endpoints = ["/api/health/", "/api/products/", "/api/admin/stats"]

        for endpoint in documented_endpoints:
            try:
                response = requests.get(f"{self.swagger_url}{endpoint}", timeout=5)
                if response.status_code in [200, 201]:
                    swagger_results.append(
                        self.test_result(
                            f"Swagger Endpoint {endpoint}",
                            True,
                            f"Endpoint {endpoint} is functional",
                            {"status_code": response.status_code},
                        )
                    )
                else:
                    swagger_results.append(
                        self.test_result(
                            f"Swagger Endpoint {endpoint}",
                            False,
                            f"Endpoint {endpoint} returned: {response.status_code}",
                        )
                    )

            except requests.exceptions.RequestException as e:
                swagger_results.append(
                    self.test_result(
                        f"Swagger Endpoint {endpoint}",
                        False,
                        f"Endpoint {endpoint} request failed: {str(e)}",
                    )
                )

        return swagger_results

    def test_integration_features(self) -> List[Dict]:
        """Test integration between advanced features"""
        print("\n🔗 Testing Feature Integration...")
        integration_results = []

        # Test if all services are responding
        services = [
            ("Main API", f"{self.base_url}/health"),
            ("WebSocket", "http://localhost:5001/"),
            ("Swagger", f"{self.swagger_url}/api/health/"),
        ]

        all_services_up = True
        for service_name, service_url in services:
            try:
                response = requests.get(service_url, timeout=5)
                if response.status_code == 200:
                    integration_results.append(
                        self.test_result(
                            f"Service {service_name}",
                            True,
                            f"{service_name} is responding",
                        )
                    )
                else:
                    all_services_up = False
                    integration_results.append(
                        self.test_result(
                            f"Service {service_name}",
                            False,
                            f"{service_name} returned: {response.status_code}",
                        )
                    )
            except requests.exceptions.RequestException as e:
                all_services_up = False
                integration_results.append(
                    self.test_result(
                        f"Service {service_name}",
                        False,
                        f"{service_name} not accessible: {str(e)}",
                    )
                )

        # Overall integration test
        integration_results.append(
            self.test_result(
                "Services Integration",
                all_services_up,
                (
                    "All services are integrated and running"
                    if all_services_up
                    else "Some services are not responding"
                ),
            )
        )

        return integration_results

    def run_comprehensive_test(self):
        """Run all advanced features tests"""
        print("=" * 80)
        print("RetailGenie Advanced Features Test Suite")
        print("=" * 80)

        start_time = time.time()

        # Run all test suites
        celery_results = self.test_celery_integration()
        websocket_results = self.test_websocket_functionality()
        swagger_results = self.test_swagger_documentation()
        integration_results = self.test_integration_features()

        # Combine all results
        all_results = (
            celery_results + websocket_results + swagger_results + integration_results
        )
        self.results.extend(all_results)

        end_time = time.time()
        duration = end_time - start_time

        # Print summary
        self.print_test_summary(duration)

        # Save results
        self.save_test_results()

        return self.results

    def print_test_summary(self, duration: float):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("ADVANCED FEATURES TEST SUMMARY")
        print("=" * 80)

        total_tests = len(self.results)
        passed_tests = len([r for r in self.results if r["success"]])
        failed_tests = total_tests - passed_tests

        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        print(f"Duration: {duration:.2f} seconds")

        if failed_tests > 0:
            print(f"\n❌ Failed Tests:")
            for result in self.results:
                if not result["success"]:
                    print(f"   • {result['test']}: {result['message']}")

        print(f"\nTest completed at: {datetime.now().isoformat()}")

    def save_test_results(self):
        """Save test results to file"""
        results_data = {
            "test_suite": "Advanced Features",
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_tests": len(self.results),
                "passed_tests": len([r for r in self.results if r["success"]]),
                "failed_tests": len([r for r in self.results if not r["success"]]),
                "success_rate": len([r for r in self.results if r["success"]])
                / len(self.results)
                * 100,
            },
            "results": self.results,
        }

        with open("advanced_features_test_results.json", "w") as f:
            json.dump(results_data, f, indent=2)

        print(f"\n📊 Detailed results saved to: advanced_features_test_results.json")


def main():
    """Main function to run advanced features tests"""
    tester = AdvancedFeaturesTest()

    # Check if services are accessible
    services_to_check = [
        ("Main API", "http://localhost:5000/health"),
        ("WebSocket", "http://localhost:5001/"),
        ("Swagger", "http://localhost:5002/api/health/"),
    ]

    print("🔍 Checking service availability...")
    available_services = 0

    for service_name, service_url in services_to_check:
        try:
            response = requests.get(service_url, timeout=3)
            if response.status_code == 200:
                print(f"✅ {service_name}: Available")
                available_services += 1
            else:
                print(
                    f"❌ {service_name}: Not responding (Status: {response.status_code})"
                )
        except requests.exceptions.RequestException:
            print(f"❌ {service_name}: Not accessible")

    if available_services == 0:
        print("\n❌ No services are running. Please start the services first:")
        print("   ./start_advanced.sh")
        return

    print(f"\n📊 {available_services}/{len(services_to_check)} services available")
    print("Proceeding with tests...\n")

    # Run comprehensive tests
    tester.run_comprehensive_test()


if __name__ == "__main__":
    main()
