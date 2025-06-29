# RetailGenie Backend - Perfect Structure ✨

## 🚀 Professional Backend Architecture

This is a **production-ready, perfectly structured** Flask backend application following industry best practices and clean architecture principles.

RetailGenie is a comprehensive AI-powered retail management system that provides intelligent shopping assistance, inventory optimization, and advanced analytics. This backend serves as the core API layer with real-time communication, background processing, and AI integration capabilities.

## 📁 Project Structure

### Core Application Files
- **`app.py`** - Main Flask application with CORS, middleware, and route registration
- **`config.py`** - Configuration management for different environments (dev/test/prod)
- **`requirements.txt`** - Python dependencies and package versions
- **`Dockerfile`** - Docker containerization configuration
- **`docker-compose.yml`** - Multi-service deployment configuration
- **`render.yaml`** - Render.com deployment configuration

### API Structure
- **`routes/`** - API route definitions organized by functionality
  - `auth_routes.py` - Authentication and user management endpoints
  - `product_routes.py` - Product CRUD operations and search
  - `feedback_routes.py` - Customer feedback collection and analysis
  - Additional route modules for specific features

### Business Logic
- **`controllers/`** - Business logic and data processing
  - `ai_engine.py` - AI/ML engine for recommendations and analysis
  - `auth_controller.py` - Authentication and authorization logic
  - `product_controller.py` - Product management operations
  - `feedback_controller.py` - Feedback processing and analytics
  - Additional controllers for specific business domains

### Data Layer
- **`models/`** - Data models and schemas
  - `user_model.py` - User data structure and validation
  - Additional model files for different entities

### Utilities
- **`utils/`** - Shared utility functions and helpers
  - `firebase_utils.py` - Firebase/Firestore database integration
  - `email_utils.py` - Email notification services
  - `pdf_utils.py` - PDF report generation utilities
  - Additional utility modules

### Supporting Components
- **`middleware/`** - Custom middleware for authentication, logging, rate limiting
- **`tests/`** - Test files and test utilities (if present)

## 🚀 Key Features

### Core Functionality
- **RESTful API** - Complete CRUD operations for retail management
- **AI-Powered Recommendations** - Intelligent product suggestions and insights
- **Real-time Communication** - WebSocket support for live updates
- **Authentication System** - Secure user authentication and authorization
- **CORS Support** - Cross-origin resource sharing for frontend integration

### AI & Analytics
- **Smart Product Recommendations** - AI-driven personalized suggestions
- **Inventory Optimization** - Intelligent stock level management
- **Customer Analytics** - Behavioral analysis and insights
- **Feedback Analysis** - Sentiment analysis and trend detection
- **Report Generation** - Automated PDF reports and analytics

### Supported Operations
- **User Management** - Registration, authentication, profile management
- **Product Management** - Add, update, delete, search products
- **Feedback System** - Collect, analyze, and respond to customer feedback
- **Analytics & Reporting** - Generate insights and downloadable reports
- **Email Notifications** - Automated email communications

## 🛠 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Firebase project with Firestore database
- OpenAI API key (for AI features)
- SMTP email service (for notifications)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd RetailGenie/backend
pip install -r requirements.txt
```

### 2. Environment Configuration
Create a `.env` file in the backend directory:
```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DEBUG=True

# Firebase Configuration
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
FIREBASE_PROJECT_ID=your-firebase-project-id

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com

# API Configuration
API_BASE_URL=http://localhost:5000
PORT=5000
```

### 3. Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore database
3. Create a service account:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `firebase-credentials.json` in the backend directory
4. Update `FIREBASE_PROJECT_ID` in your `.env` file

### 4. OpenAI API Setup
1. Sign up at https://openai.com/api
2. Generate an API key
3. Add the key to your `.env` file as `OPENAI_API_KEY`

## 🚀 Running the Application

### Development Mode
```bash
# Install dependencies
pip install -r requirements.txt

# Start the Flask application
python app.py
```

The API will be available at:
- **Main API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Documentation**: Available through the configured endpoints

### Production Deployment

#### Using Docker
```bash
# Build the Docker image
docker build -t retailgenie-backend .

# Run with Docker Compose
docker-compose up -d
```

#### Using Render.com
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the provided `render.yaml` configuration
4. Set environment variables in the Render dashboard
5. Deploy automatically on git push

#### Manual Deployment
```bash
# Set production environment
export FLASK_ENV=production
export DEBUG=False

# Install production dependencies
pip install -r requirements.txt

# Run with gunicorn (recommended for production)
gunicorn --bind 0.0.0.0:$PORT app:app
```

## 🔗 Frontend Integration

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Products
- `GET /api/products` - Get all products with pagination
- `POST /api/products` - Create new product (admin only)
- `GET /api/products/{id}` - Get specific product
- `PUT /api/products/{id}` - Update product (admin only)
- `DELETE /api/products/{id}` - Delete product (admin only)
- `GET /api/products/search` - Search products with filters
- `GET /api/products/recommendations` - Get AI-powered recommendations

#### Feedback
- `POST /api/feedback` - Submit customer feedback
- `GET /api/feedback` - Get feedback list (admin only)
- `GET /api/feedback/{id}` - Get specific feedback
- `PUT /api/feedback/{id}` - Update feedback status
- `GET /api/feedback/analytics` - Get feedback analytics

#### Reports
- `GET /api/reports/products` - Product performance report
- `GET /api/reports/feedback` - Feedback analysis report
- `GET /api/reports/users` - User activity report

### Frontend Configuration

Configure your frontend to connect to the backend:

```javascript
// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API Client Setup
const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor for Authentication
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor for Error Handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `http://localhost:3001` (Alternative React port)
- Your production frontend domain (configure in `.env`)

## 📊 API Response Format

### Success Response
```json
{
    "success": true,
    "data": { ... },
    "message": "Operation completed successfully",
    "timestamp": "2025-06-29T10:30:00Z"
}
```

### Error Response
```json
{
    "success": false,
    "error": "Error description",
    "code": "ERROR_CODE",
    "timestamp": "2025-06-29T10:30:00Z"
}
```

### Pagination Response
```json
{
    "success": true,
    "data": [...],
    "pagination": {
        "page": 1,
        "per_page": 10,
        "total": 100,
        "pages": 10,
        "has_next": true,
        "has_prev": false
    }
}
```

## 🔧 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `FLASK_ENV` | Application environment | `development` | No |
| `SECRET_KEY` | Flask secret key | None | Yes |
| `DEBUG` | Debug mode | `False` | No |
| `FIREBASE_CREDENTIALS_PATH` | Firebase credentials file path | `./firebase-credentials.json` | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | None | Yes |
| `OPENAI_API_KEY` | OpenAI API key | None | Yes |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` | No |
| `SMTP_SERVER` | Email SMTP server | `smtp.gmail.com` | No |
| `SMTP_PORT` | Email SMTP port | `587` | No |
| `EMAIL_USERNAME` | Email username | None | No |
| `EMAIL_PASSWORD` | Email password | None | No |
| `FROM_EMAIL` | From email address | None | No |
| `API_BASE_URL` | API base URL | `http://localhost:5000` | No |
| `PORT` | Server port | `5000` | No |

## 🛡 Security Features

- **Authentication** - JWT-based secure authentication
- **CORS Protection** - Configured for specific origins
- **Input Validation** - Request data validation and sanitization
- **Rate Limiting** - Protection against abuse
- **Environment Variables** - Secure configuration management
- **HTTPS Ready** - Production HTTPS configuration

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   ```bash
   # Check if credentials file exists
   ls -la firebase-credentials.json

   # Verify Firebase project ID
   grep FIREBASE_PROJECT_ID .env
   ```

2. **CORS Errors**
   ```bash
   # Check CORS configuration
   grep CORS_ORIGINS .env

   # Verify frontend URL is included
   ```

3. **Authentication Issues**
   ```bash
   # Check if secret key is set
   grep SECRET_KEY .env

   # Verify token format in frontend
   ```

4. **Email Service Issues**
   ```bash
   # Check email configuration
   grep EMAIL .env

   # Test SMTP connection
   python -c "import smtplib; print('SMTP available')"
   ```

### Debug Mode
To run in debug mode with detailed error messages:
```bash
export FLASK_ENV=development
export DEBUG=True
python app.py
```

### Logs and Monitoring
```bash
# Check application logs
tail -f logs/app.log  # if logging to file

# Monitor API requests
# Enable logging in config.py
```

## 📈 Performance Optimization

### Recommended Production Settings
```env
# Production Environment
FLASK_ENV=production
DEBUG=False
WORKERS=4
TIMEOUT=30
```

### Caching
- Implement Redis caching for frequently accessed data
- Use CDN for static assets
- Enable database query optimization

### Database Optimization
- Use Firestore indexes for complex queries
- Implement pagination for large datasets
- Use connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 style guidelines
- Write comprehensive tests
- Update documentation for new features
- Use type hints where appropriate

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**RetailGenie Backend** - Empowering retail with AI-driven insights and intelligent automation.
