import logging
import random
from datetime import datetime

from utils.firebase_utils import FirebaseUtils

logger = logging.getLogger(__name__)


class PricingController:
    """Controller for dynamic pricing and competitor analysis."""

    def __init__(self):
        self.firebase = FirebaseUtils()
        self.products_collection = "products"

    def optimize_prices(self, product_ids: list, market_conditions: dict) -> dict:
        """
        Compute optimal prices for a list of products using demand-elasticity
        heuristics and market condition factors.

        Args:
            product_ids (list): List of product IDs to optimise
            market_conditions (dict): e.g. {"season": "peak", "demand_index": 1.2}

        Returns:
            dict: Recommended prices per product id
        """
        try:
            demand_index = float(market_conditions.get("demand_index", 1.0))
            season = market_conditions.get("season", "normal")

            season_multiplier = {
                "peak": 1.15,
                "off-peak": 0.90,
                "normal": 1.0,
            }.get(season, 1.0)

            results = {}
            for product_id in product_ids:
                product = self.firebase.get_document(
                    self.products_collection, product_id
                )
                if not product:
                    results[product_id] = {
                        "error": "Product not found",
                        "recommended_price": None,
                    }
                    continue

                base_price = float(product.get("price", 0))
                stock = int(product.get("stock", product.get("stock_quantity", 0)))

                # Low stock → raise price slightly; high stock → slight discount
                stock_factor = 1.0
                if stock < 10:
                    stock_factor = 1.10
                elif stock > 200:
                    stock_factor = 0.95

                recommended_price = round(
                    base_price * demand_index * season_multiplier * stock_factor, 2
                )
                change_pct = round(
                    (
                        ((recommended_price - base_price) / base_price * 100)
                        if base_price
                        else 0
                    ),
                    1,
                )

                results[product_id] = {
                    "product_id": product_id,
                    "product_name": product.get("name", ""),
                    "current_price": base_price,
                    "recommended_price": recommended_price,
                    "change_percent": change_pct,
                    "reason": self._build_reason(
                        season, demand_index, stock, stock_factor
                    ),
                    "confidence": "high" if abs(change_pct) < 20 else "medium",
                }

            return results
        except Exception as e:
            logger.error(f"Error optimising prices: {str(e)}")
            raise

    def analyze_competitor_pricing(self, product_id: str) -> dict:
        """
        Return competitor pricing analysis for a product.
        Generates realistic comparison data relative to the product's actual price.

        Args:
            product_id (str): Product ID to analyse

        Returns:
            dict: Competitor analysis with trend indicators
        """
        try:
            product = self.firebase.get_document(self.products_collection, product_id)
            if not product:
                raise ValueError(f"Product {product_id} not found")

            base_price = float(product.get("price", 100))
            name = product.get("name", "Product")

            # Simulated competitor data (realistic spread around base price)
            competitors = [
                {
                    "name": "CompetitorA",
                    "price": round(base_price * random.uniform(0.88, 1.12), 2),
                    "rating": round(random.uniform(3.8, 4.9), 1),
                    "in_stock": True,
                },
                {
                    "name": "CompetitorB",
                    "price": round(base_price * random.uniform(0.85, 1.08), 2),
                    "rating": round(random.uniform(3.5, 4.7), 1),
                    "in_stock": random.choice([True, True, False]),
                },
                {
                    "name": "CompetitorC",
                    "price": round(base_price * random.uniform(0.92, 1.20), 2),
                    "rating": round(random.uniform(4.0, 5.0), 1),
                    "in_stock": True,
                },
            ]

            prices = [c["price"] for c in competitors]
            avg_competitor_price = round(sum(prices) / len(prices), 2)
            min_price = min(prices)
            max_price = max(prices)

            position = "competitive"
            if base_price < min_price:
                position = "cheapest"
            elif base_price > max_price:
                position = "most_expensive"

            return {
                "product_id": product_id,
                "product_name": name,
                "our_price": base_price,
                "avg_competitor_price": avg_competitor_price,
                "min_competitor_price": min_price,
                "max_competitor_price": max_price,
                "market_position": position,
                "competitors": competitors,
                "recommendation": self._price_recommendation(
                    base_price, avg_competitor_price
                ),
                "analyzed_at": datetime.utcnow().isoformat(),
            }
        except Exception as e:
            logger.error(f"Error analysing competitor pricing: {str(e)}")
            raise

    def calculate_demand_based_pricing(
        self, product_id: str, demand_data: dict
    ) -> dict:
        """
        Calculate surge / markdown price based on demand metrics.

        Args:
            product_id (str): Product ID
            demand_data (dict): e.g. {"views_last_hour": 120, "purchases_last_hour": 8,
                                       "stock": 5, "elasticity": -1.5}

        Returns:
            dict: Demand-based pricing recommendation
        """
        try:
            product = self.firebase.get_document(self.products_collection, product_id)
            if not product:
                raise ValueError(f"Product {product_id} not found")

            base_price = float(product.get("price", 0))
            views = int(demand_data.get("views_last_hour", 0))
            purchases = int(demand_data.get("purchases_last_hour", 0))
            stock = int(
                demand_data.get(
                    "stock", product.get("stock", product.get("stock_quantity", 50))
                )
            )
            elasticity = float(demand_data.get("elasticity", -1.2))

            # Conversion rate as demand signal
            conversion = (purchases / views) if views > 0 else 0.0
            demand_factor = 1.0

            if conversion > 0.15:  # Very high demand
                demand_factor = 1.12
            elif conversion > 0.08:  # High demand
                demand_factor = 1.06
            elif conversion < 0.02 and stock > 100:  # Low demand + high stock
                demand_factor = 0.92

            # Scarcity surcharge
            if stock < 5:
                demand_factor *= 1.10
            elif stock < 15:
                demand_factor *= 1.05

            recommended_price = round(base_price * demand_factor, 2)
            change_pct = round(
                (
                    ((recommended_price - base_price) / base_price * 100)
                    if base_price
                    else 0
                ),
                1,
            )

            return {
                "product_id": product_id,
                "product_name": product.get("name", ""),
                "base_price": base_price,
                "recommended_price": recommended_price,
                "change_percent": change_pct,
                "demand_factor": round(demand_factor, 3),
                "signals": {
                    "views_last_hour": views,
                    "purchases_last_hour": purchases,
                    "conversion_rate": round(conversion, 4),
                    "stock_level": stock,
                    "price_elasticity": elasticity,
                },
                "strategy": self._demand_strategy(demand_factor),
                "calculated_at": datetime.utcnow().isoformat(),
            }
        except Exception as e:
            logger.error(f"Error calculating demand-based pricing: {str(e)}")
            raise

    # ------------------------------------------------------------------ #
    # Private helpers
    # ------------------------------------------------------------------ #

    def _build_reason(
        self,
        season: str,
        demand_index: float,
        stock: int,
        stock_factor: float,
    ) -> str:
        parts = []
        if season == "peak":
            parts.append("peak season demand")
        elif season == "off-peak":
            parts.append("off-peak markdown applied")
        if demand_index > 1.05:
            parts.append(f"elevated market demand (index {demand_index:.2f})")
        if stock < 10:
            parts.append(f"low stock ({stock} units) — scarcity premium")
        elif stock > 200:
            parts.append(f"excess inventory ({stock} units) — clearance discount")
        return "; ".join(parts) if parts else "Standard market pricing"

    def _price_recommendation(self, our_price: float, avg_price: float) -> str:
        diff_pct = (our_price - avg_price) / avg_price * 100 if avg_price else 0
        if diff_pct > 10:
            return (
                "Consider lowering price — you are significantly above market average"
            )
        elif diff_pct < -10:
            return "Room to increase price — you are well below market average"
        else:
            return "Your price is competitive with the market"

    def _demand_strategy(self, factor: float) -> str:
        if factor > 1.08:
            return "surge_pricing"
        elif factor > 1.0:
            return "mild_increase"
        elif factor < 0.95:
            return "markdown"
        else:
            return "hold"
