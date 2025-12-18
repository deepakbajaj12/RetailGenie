# Authentication & Email System Implementation

## Overview
We have implemented a complete user authentication system with email notifications.

### Features
1.  **User Registration**:
    -   Endpoint: `POST /api/auth/register`
    -   Hashes passwords using `bcrypt`.
    -   Stores users in the database (Firebase/Mock).
    -   Sends a **Welcome Email** via SMTP.
2.  **User Login**:
    -   Endpoint: `POST /api/auth/login`
    -   Verifies credentials.
    -   Returns a JWT token for session management.
3.  **Frontend Integration**:
    -   Connected to existing Next.js Auth Context.
    -   Login and Register pages are fully functional.

## Configuration
To enable email sending, you must configure the following environment variables in your `.env` file or deployment settings (e.g., Render/Vercel).

### Environment Variables
```env
# Security
SECRET_KEY=your-super-secret-key-change-this

# Email Configuration (SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
```

### Notes
-   If using Gmail, you need to generate an **App Password** (not your regular password) if 2FA is enabled.
-   The database is currently using a Mock implementation if Firebase credentials are not provided. To persist users, ensure Firebase is configured.

## Testing
1.  Go to `/register` on the frontend.
2.  Sign up with a valid email.
3.  Check your inbox for the Welcome Email.
4.  Go to `/login` and sign in with your new credentials.
