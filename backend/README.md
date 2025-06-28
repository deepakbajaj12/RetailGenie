# RetailGenie Backend

**AI-Powered Smart Assistant for Personalized Shopping, Inventory Optimization & Store Analytics**

This is the backend API for the RetailGenie intelligent retail system that enhances customer experience and empowers store managers with AI-driven insights.

## Project Structure

```
backend/
├── app.py                      # Main Flask application
├── config.py                   # Configuration settings
├── requirements.txt            # Python dependencies
├── routes/                     # API route definitions
│   ├── auth_routes.py         # Authentication endpoints
│   ├── feedback_routes.py     # Feedback management endpoints
│   └── product_routes.py      # Product management endpoints
├── controllers/               # Business logic controllers
│   ├── ai_engine.py          # AI/ML engine for recommendations and analysis
│   ├── auth_controller.py    # Authentication logic
│   ├── feedback_controller.py # Feedback processing logic
│   └── product_controller.py # Product management logic
├── models/                   # Data models
│   └── user_model.py        # User data model
└── utils/                   # Utility modules
    ├── email_utils.py       # Email sending utilities
    ├── firebase_utils.py    # Firebase/Firestore integration
    └── pdf_utils.py         # PDF report generation
```

## Features

### 🛍️ Core Customer Features
- **Smart AI Shopping Assistant**: GPT-powered chatbot for product discovery and FAQs
- **Product Substitution Engine**: AI-suggested alternatives for out-of-stock items
- **Voice Assistant**: Native language support and accessibility
- **Dynamic Pricing**: Real-time price optimization based on demand
- **AI Coupon Optimizer**: Personalized coupon matching

### 📈 Store Management Features
- **Inventory Optimization**: LSTM/ARIMA demand forecasting
- **Sentiment Analysis**: Customer feedback sentiment extraction
- **Geo-Intelligent Maps**: Location-based inventory optimization
- **Manager Gamification**: Performance tracking and rewards
- **Sustainability Tracker**: Eco-score tracking and green suggestions

### 🤖 AI-Powered Features
- **Smart Search**: Natural language product discovery
- **Personalized Recommendations**: AI-driven product suggestions based on behavior
- **Sentiment Analysis**: Real-time feedback sentiment detection
- **Demand Forecasting**: LSTM models for inventory prediction
- **Price Optimization**: Dynamic pricing based on market conditions

### 📊 Analytics & Reporting
- **Real-time Dashboard**: Store performance metrics
- **PDF Reports**: Automated daily/weekly reports via email
- **Customer Insights**: Shopping pattern analysis
- **Inventory Analytics**: Stock optimization recommendations

### Utilities
- **Email Notifications**: Automated email sending for various events
- **PDF Reports**: Generate detailed feedback and product reports
- **Firebase Integration**: Real-time database and authentication
- **Security**: JWT-based authentication, password hashing

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Firebase project with Firestore enabled
- OpenAI API key (for AI features)
- Email account for notifications (Gmail recommended)

### Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   # Flask Configuration
   SECRET_KEY=your-super-secret-key
   JWT_SECRET_KEY=your-jwt-secret-key
   FLASK_ENV=development

   # Firebase Configuration
   FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
   FIREBASE_PROJECT_ID=your-firebase-project-id

   # Email Configuration
   SENDER_EMAIL=your-email@gmail.com
   SENDER_PASSWORD=your-app-password
   ADMIN_EMAIL=admin@yourcompany.com

   # AI Configuration
   OPENAI_API_KEY=your-openai-api-key

   # CORS Configuration
   CORS_ORIGINS=http://localhost:3000
   ```

5. **Set up Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore database
   - Generate a service account key and download the JSON file
   - Update `FIREBASE_CREDENTIALS_PATH` in your `.env` file

6. **Run the application**
   ```bash
   python app.py
   ```

   The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Products (`/api/products`)
- `GET /` - Get all products (with filters)
- `GET /{id}` - Get specific product
- `POST /search` - AI-powered product search
- `POST /recommendations` - Get personalized recommendations

### Feedback (`/api/feedback`)
- `POST /` - Submit feedback
- `GET /product/{id}` - Get product feedback
- `GET /user/{id}` - Get user feedback
- `GET /analyze/{id}` - Analyze product feedback
- `GET /export/{id}` - Export feedback report as PDF

### 🤖 AI Assistant (`/api/ai-assistant`)
- `POST /chat` - Chat with AI shopping assistant
- `POST /voice` - Process voice commands (multilingual)
- `POST /substitute` - Find product substitutes
- `POST /coupons/optimize` - Get optimized coupon recommendations
- `POST /sustainability/score` - Calculate cart sustainability score

### 📦 Inventory Management (`/api/inventory`)
- `POST /forecast` - Generate demand forecast (LSTM/ARIMA)
- `POST /optimization` - Get inventory optimization recommendations
- `GET /stock-alerts` - Get low stock and overstock alerts
- `GET /geo-insights` - Get geographic inventory insights

### 💰 Dynamic Pricing (`/api/pricing`)
- `POST /optimize` - Get dynamic pricing recommendations
- `GET /competitor-analysis` - Analyze competitor pricing
- `POST /demand-based` - Calculate demand-based pricing

### 📊 Analytics & Dashboard (`/api/analytics`)
- `GET /dashboard` - Get manager dashboard data
- `GET /customer-insights` - Get customer behavior insights
- `GET /performance/manager` - Get manager performance metrics
- `POST /reports/generate` - Generate and email analytics reports
- `GET /gamification/leaderboard` - Get manager gamification leaderboard

## Configuration

The application uses environment variables for configuration. Key settings include:

- **Security**: Secret keys, JWT configuration
- **Database**: Firebase project settings
- **Email**: SMTP server configuration
- **AI**: OpenAI API key
- **CORS**: Allowed origins for cross-origin requests

See `config.py` for all available configuration options.

## Development

### Code Structure
- **Routes**: Define API endpoints and request/response handling
- **Controllers**: Contain business logic and data processing
- **Models**: Define data structures and validation
- **Utils**: Provide reusable utility functions

### Testing
```bash
# Run tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_auth.py
```

### Code Quality
```bash
# Format code
black .

# Sort imports
isort .

# Lint code
flake8 .
```

## Production Deployment

### Using Gunicorn
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Environment Variables for Production
- Set `FLASK_ENV=production`
- Use strong secret keys
- Configure proper SMTP settings
- Set up proper CORS origins
- Enable HTTPS

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Password Security**: Bcrypt hashing
3. **CORS**: Configured allowed origins
4. **Input Validation**: Request data validation
5. **Rate Limiting**: API rate limiting (optional)
6. **HTTPS**: Use HTTPS in production

## Monitoring and Logging

- Application logs are configured via `LOG_LEVEL` environment variable
- Health check endpoint available at `/`
- Consider adding monitoring tools for production

## Support

For issues and questions:
1. Check the logs for error details
2. Verify environment variables are set correctly
3. Ensure Firebase and external services are accessible
4. Review API documentation for correct usage

## License

[Add your license information here]
