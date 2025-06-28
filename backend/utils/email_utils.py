import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
import logging
from typing import Optional, List

logger = logging.getLogger(__name__)

class EmailUtils:
    def __init__(self):
        """Initialize email utilities with SMTP configuration"""
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.sender_email = os.getenv('SENDER_EMAIL', 'your-email@gmail.com')
        self.sender_password = os.getenv('SENDER_PASSWORD', 'your-app-password')
        self.admin_email = os.getenv('ADMIN_EMAIL', 'admin@retailgenie.com')
    
    def send_email(self, to_email: str, subject: str, body: str, 
                   html_body: Optional[str] = None, 
                   attachments: Optional[List[str]] = None) -> bool:
        """
        Send email to recipient
        
        Args:
            to_email (str): Recipient email address
            subject (str): Email subject
            body (str): Email body (plain text)
            html_body (str, optional): HTML email body
            attachments (List[str], optional): List of file paths to attach
            
        Returns:
            bool: Success status
        """
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.sender_email
            message["To"] = to_email
            
            # Add plain text part
            text_part = MIMEText(body, "plain")
            message.attach(text_part)
            
            # Add HTML part if provided
            if html_body:
                html_part = MIMEText(html_body, "html")
                message.attach(html_part)
            
            # Add attachments if provided
            if attachments:
                for file_path in attachments:
                    if os.path.isfile(file_path):
                        with open(file_path, "rb") as attachment:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(attachment.read())
                        
                        encoders.encode_base64(part)
                        
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {os.path.basename(file_path)}'
                        )
                        
                        message.attach(part)
            
            # Create secure connection and send email
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.sender_email, self.sender_password)
                text = message.as_string()
                server.sendmail(self.sender_email, to_email, text)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def send_welcome_email(self, user_email: str, user_name: str) -> bool:
        """
        Send welcome email to new user
        
        Args:
            user_email (str): User email address
            user_name (str): User name
            
        Returns:
            bool: Success status
        """
        subject = "Welcome to RetailGenie!"
        
        body = f"""
        Hi {user_name},

        Welcome to RetailGenie! We're excited to have you join our community.

        With RetailGenie, you can:
        - Discover products with AI-powered search
        - Get personalized recommendations
        - Share feedback and reviews
        - Track your purchase history

        If you have any questions or need assistance, please don't hesitate to contact our support team.

        Best regards,
        The RetailGenie Team
        """
        
        html_body = f"""
        <html>
          <body>
            <h2>Welcome to RetailGenie!</h2>
            <p>Hi {user_name},</p>
            <p>Welcome to RetailGenie! We're excited to have you join our community.</p>
            
            <h3>With RetailGenie, you can:</h3>
            <ul>
              <li>Discover products with AI-powered search</li>
              <li>Get personalized recommendations</li>
              <li>Share feedback and reviews</li>
              <li>Track your purchase history</li>
            </ul>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>
            The RetailGenie Team</p>
          </body>
        </html>
        """
        
        return self.send_email(user_email, subject, body, html_body)
    
    def send_password_reset_email(self, user_email: str, reset_token: str) -> bool:
        """
        Send password reset email
        
        Args:
            user_email (str): User email address
            reset_token (str): Password reset token
            
        Returns:
            bool: Success status
        """
        subject = "Password Reset Request - RetailGenie"
        
        reset_url = f"https://retailgenie.com/reset-password?token={reset_token}"
        
        body = f"""
        Hi,

        You requested a password reset for your RetailGenie account.

        Please click the link below to reset your password:
        {reset_url}

        This link will expire in 1 hour for security reasons.

        If you didn't request this password reset, please ignore this email.

        Best regards,
        The RetailGenie Team
        """
        
        html_body = f"""
        <html>
          <body>
            <h2>Password Reset Request</h2>
            <p>Hi,</p>
            <p>You requested a password reset for your RetailGenie account.</p>
            
            <p>Please click the button below to reset your password:</p>
            <a href="{reset_url}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p>{reset_url}</p>
            
            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
            
            <p>If you didn't request this password reset, please ignore this email.</p>
            
            <p>Best regards,<br>
            The RetailGenie Team</p>
          </body>
        </html>
        """
        
        return self.send_email(user_email, subject, body, html_body)
    
    def send_notification(self, subject: str, body: str, to_email: Optional[str] = None) -> bool:
        """
        Send notification email to admin or specified email
        
        Args:
            subject (str): Email subject
            body (str): Email body
            to_email (str, optional): Recipient email (defaults to admin)
            
        Returns:
            bool: Success status
        """
        recipient = to_email or self.admin_email
        return self.send_email(recipient, subject, body)
    
    def send_feedback_notification(self, product_id: str, user_email: str, rating: int, comment: str) -> bool:
        """
        Send feedback notification to admin
        
        Args:
            product_id (str): Product ID
            user_email (str): User email
            rating (int): Rating given
            comment (str): Feedback comment
            
        Returns:
            bool: Success status
        """
        subject = f"New Feedback Received - Product {product_id}"
        
        body = f"""
        New feedback has been received for Product ID: {product_id}

        User: {user_email}
        Rating: {rating}/5
        Comment: {comment}

        Please review and take appropriate action if needed.

        - RetailGenie System
        """
        
        return self.send_notification(subject, body)
    
    def send_low_stock_alert(self, product_id: str, product_name: str, current_stock: int) -> bool:
        """
        Send low stock alert to admin
        
        Args:
            product_id (str): Product ID
            product_name (str): Product name
            current_stock (int): Current stock level
            
        Returns:
            bool: Success status
        """
        subject = f"Low Stock Alert - {product_name}"
        
        body = f"""
        Low stock alert for product: {product_name}

        Product ID: {product_id}
        Current Stock: {current_stock}

        Please restock this item to avoid stockouts.

        - RetailGenie System
        """
        
        return self.send_notification(subject, body)
    
    def send_order_confirmation(self, user_email: str, order_id: str, order_details: dict) -> bool:
        """
        Send order confirmation email
        
        Args:
            user_email (str): User email address
            order_id (str): Order ID
            order_details (dict): Order details
            
        Returns:
            bool: Success status
        """
        subject = f"Order Confirmation - #{order_id}"
        
        body = f"""
        Thank you for your order!

        Order ID: {order_id}
        Order Date: {order_details.get('order_date', 'N/A')}
        Total Amount: ${order_details.get('total_amount', 'N/A')}

        Your order is being processed and you will receive a shipping confirmation shortly.

        Best regards,
        The RetailGenie Team
        """
        
        return self.send_email(user_email, subject, body)
