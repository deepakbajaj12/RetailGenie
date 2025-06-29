#!/usr/bin/env python3
"""
Performance Monitoring and Testing Script
Tests the optimized RetailGenie API performance
"""

import concurrent.futures
import json
import statistics
import time
from datetime import datetime
from typing import Any, Dict, List

import requests


class PerformanceMonitor:
    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url
        self.results = []

    def measure_request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Measure a single request performance"""
        url = f"{self.base_url}{endpoint}"
        start_time = time.time()

        try:
            if method.upper() == "GET":
                response = requests.get(url, **kwargs)
            elif method.upper() == "POST":
                response = requests.post(url, **kwargs)
            else:
                raise ValueError(f"Unsupported method: {method}")

            end_time = time.time()
            duration = end_time - start_time

            return {
                "method": method,
                "endpoint": endpoint,
                "status_code": response.status_code,
                "duration": duration,
                "response_size": len(response.content),
                "success": 200 <= response.status_code < 400,
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as e:
            end_time = time.time()
            duration = end_time - start_time

            return {
                "method": method,
                "endpoint": endpoint,
                "status_code": 0,
                "duration": duration,
                "response_size": 0,
                "success": False,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
            }

    def load_test(
        self, endpoint: str, concurrent_users: int = 10, requests_per_user: int = 5
    ) -> Dict[str, Any]:
        """Perform load testing on an endpoint"""
        print(f"Load testing {endpoint} with {concurrent_users} concurrent users...")

        def make_requests(user_id):
            user_results = []
            for i in range(requests_per_user):
                result = self.measure_request("GET", endpoint)
                result["user_id"] = user_id
                result["request_num"] = i + 1
                user_results.append(result)
                time.sleep(0.1)  # Small delay between requests
            return user_results

        start_time = time.time()
        all_results = []

        with concurrent.futures.ThreadPoolExecutor(
            max_workers=concurrent_users
        ) as executor:
            futures = [
                executor.submit(make_requests, i) for i in range(concurrent_users)
            ]

            for future in concurrent.futures.as_completed(futures):
                all_results.extend(future.result())

        end_time = time.time()
        total_duration = end_time - start_time

        # Calculate statistics
        successful_requests = [r for r in all_results if r["success"]]
        failed_requests = [r for r in all_results if not r["success"]]

        durations = [r["duration"] for r in successful_requests]

        return {
            "endpoint": endpoint,
            "total_requests": len(all_results),
            "successful_requests": len(successful_requests),
            "failed_requests": len(failed_requests),
            "success_rate": len(successful_requests) / len(all_results) * 100,
            "total_duration": total_duration,
            "requests_per_second": len(all_results) / total_duration,
            "response_times": {
                "min": min(durations) if durations else 0,
                "max": max(durations) if durations else 0,
                "avg": statistics.mean(durations) if durations else 0,
                "median": statistics.median(durations) if durations else 0,
                "p95": (
                    statistics.quantiles(durations, n=20)[18]
                    if len(durations) > 10
                    else 0
                ),
            },
            "concurrent_users": concurrent_users,
            "requests_per_user": requests_per_user,
        }

    def test_caching(self, endpoint: str) -> Dict[str, Any]:
        """Test caching effectiveness"""
        print(f"Testing caching for {endpoint}...")

        # First request (cache miss)
        first_request = self.measure_request("GET", endpoint)
        time.sleep(0.1)

        # Second request (should be cache hit)
        second_request = self.measure_request("GET", endpoint)

        cache_speedup = (
            first_request["duration"] / second_request["duration"]
            if second_request["duration"] > 0
            else 1
        )

        return {
            "endpoint": endpoint,
            "first_request_time": first_request["duration"],
            "second_request_time": second_request["duration"],
            "cache_speedup": cache_speedup,
            "cache_effective": cache_speedup > 1.5,  # Consider effective if 50% faster
        }

    def test_rate_limiting(
        self, endpoint: str, rapid_requests: int = 25
    ) -> Dict[str, Any]:
        """Test rate limiting functionality"""
        print(f"Testing rate limiting for {endpoint}...")

        results = []
        for i in range(rapid_requests):
            result = self.measure_request("GET", endpoint)
            results.append(result)
            if i < rapid_requests - 1:
                time.sleep(0.05)  # Very short delay

        rate_limited = [r for r in results if r["status_code"] == 429]
        successful = [r for r in results if r["success"]]

        return {
            "endpoint": endpoint,
            "total_requests": len(results),
            "successful_requests": len(successful),
            "rate_limited_requests": len(rate_limited),
            "rate_limiting_active": len(rate_limited) > 0,
        }

    def comprehensive_test(self) -> Dict[str, Any]:
        """Run comprehensive performance tests"""
        print("=" * 60)
        print("RetailGenie API Performance Test Suite")
        print("=" * 60)

        results = {
            "test_start": datetime.now().isoformat(),
            "base_url": self.base_url,
            "tests": {},
        }

        # Test health endpoint
        print("\n1. Testing health endpoint...")
        health_result = self.measure_request("GET", "/health")
        results["tests"]["health_check"] = health_result

        # Test basic endpoints
        endpoints_to_test = [
            "/api/v1/products",
            "/api/v2/products",
            "/api/v2/products?category=Food",
            "/api/v2/products?sort_by=price&sort_order=desc",
        ]

        print("\n2. Testing basic endpoints...")
        for endpoint in endpoints_to_test:
            result = self.measure_request("GET", endpoint)
            results["tests"][
                f'basic_{endpoint.replace("/", "_").replace("?", "_")}'
            ] = result
            print(
                f"   {endpoint}: {result['duration']:.3f}s (Status: {result['status_code']})"
            )

        # Load testing
        print("\n3. Running load tests...")
        load_test_endpoints = ["/api/v1/products", "/api/v2/products"]

        for endpoint in load_test_endpoints:
            load_result = self.load_test(
                endpoint, concurrent_users=5, requests_per_user=3
            )
            results["tests"][f'load_test_{endpoint.replace("/", "_")}'] = load_result
            print(
                f"   {endpoint}: {load_result['requests_per_second']:.2f} req/s, "
                f"{load_result['success_rate']:.1f}% success rate"
            )

        # Cache testing
        print("\n4. Testing caching...")
        cache_endpoints = ["/api/v1/products", "/api/v2/products"]

        for endpoint in cache_endpoints:
            cache_result = self.test_caching(endpoint)
            results["tests"][f'cache_test_{endpoint.replace("/", "_")}'] = cache_result
            print(
                f"   {endpoint}: {cache_result['cache_speedup']:.2f}x speedup "
                f"({'Effective' if cache_result['cache_effective'] else 'Not effective'})"
            )

        # Rate limiting testing
        print("\n5. Testing rate limiting...")
        rate_limit_result = self.test_rate_limiting("/api/v1/products")
        results["tests"]["rate_limiting"] = rate_limit_result
        print(
            f"   Rate limiting: {'Active' if rate_limit_result['rate_limiting_active'] else 'Not active'} "
            f"({rate_limit_result['rate_limited_requests']}/{rate_limit_result['total_requests']} requests limited)"
        )

        # Test metrics endpoint
        print("\n6. Testing metrics endpoint...")
        metrics_result = self.measure_request("GET", "/metrics")
        results["tests"]["metrics"] = metrics_result

        results["test_end"] = datetime.now().isoformat()

        return results

    def print_summary(self, results: Dict[str, Any]):
        """Print a summary of test results"""
        print("\n" + "=" * 60)
        print("PERFORMANCE TEST SUMMARY")
        print("=" * 60)

        total_tests = len(results["tests"])
        successful_tests = sum(
            1
            for test in results["tests"].values()
            if isinstance(test, dict) and test.get("success", True)
        )

        print(f"Total Tests: {total_tests}")
        print(f"Successful: {successful_tests}")
        print(f"Failed: {total_tests - successful_tests}")

        # Show slowest endpoints
        endpoint_times = []
        for test_name, test_result in results["tests"].items():
            if isinstance(test_result, dict) and "duration" in test_result:
                endpoint_times.append((test_name, test_result["duration"]))

        if endpoint_times:
            endpoint_times.sort(key=lambda x: x[1], reverse=True)
            print(f"\nSlowest Endpoints:")
            for name, duration in endpoint_times[:5]:
                print(f"  {name}: {duration:.3f}s")

        print(f"\nTest completed at: {results['test_end']}")


def main():
    """Main function to run performance tests"""
    monitor = PerformanceMonitor()

    # Check if server is running
    try:
        response = requests.get(f"{monitor.base_url}/health", timeout=5)
        if response.status_code != 200:
            print("❌ Server is not healthy. Please start the server first.")
            return
    except requests.exceptions.RequestException:
        print("❌ Cannot connect to server. Please start the server first.")
        print("   Run: python app_optimized.py")
        return

    # Run comprehensive tests
    results = monitor.comprehensive_test()

    # Print summary
    monitor.print_summary(results)

    # Save results to file
    with open("performance_test_results.json", "w") as f:
        json.dump(results, f, indent=2)

    print(f"\n📊 Detailed results saved to: performance_test_results.json")


if __name__ == "__main__":
    main()
