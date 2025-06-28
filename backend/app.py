from flask import Flask
from flask_cors import CORS
from config import Config
from routes.product_routes import product_bp
from routes.feedback_routes import feedback_bp
from routes.auth_routes import auth_bp
from routes.inventory_routes import inventory_bp
from routes.ai_assistant_routes import ai_assistant_bp
from routes.pricing_routes import pricing_bp
from routes.analytics_routes import analytics_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(inventory_bp, url_prefix='/api/inventory')
    app.register_blueprint(ai_assistant_bp, url_prefix='/api/ai-assistant')
    app.register_blueprint(pricing_bp, url_prefix='/api/pricing')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    @app.route('/')
    def health_check():
        return {
            'status': 'RetailGenie AI-Powered Backend is running!', 
            'version': '2.0.0',
            'features': [
                'Smart AI Shopping Assistant',
                'Inventory Optimization',
                'Sentiment Analysis',
                'Dynamic Pricing',
                'Voice Assistant',
                'Sustainability Tracking'
            ]
        }
    
    @app.route('/api/health')
    def api_health():
        return {
            'api_status': 'healthy',
            'services': {
                'database': 'connected',
                'ai_engine': 'active',
                'email_service': 'available'
            }
        }
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Not found', 'message': str(error)}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error', 'message': str(error)}, 500

    @app.errorhandler(Exception)
    def unhandled_exception(error):
        return {'error': 'Unhandled exception', 'message': str(error)}, 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
