import os
from flask_mail import Mail, Message
from flask import current_app

mail = Mail()

def send_welcome_email(user_email, user_name):
    try:
        msg = Message(
            subject="Welcome to RetailGenie!",
            sender=current_app.config.get("MAIL_USERNAME"),
            recipients=[user_email]
        )
        msg.body = f"Hello {user_name},\n\nWelcome to RetailGenie! We are excited to have you on board.\n\nBest regards,\nThe RetailGenie Team"
        msg.html = f"""
        <h3>Hello {user_name},</h3>
        <p>Welcome to <b>RetailGenie</b>! We are excited to have you on board.</p>
        <p>Best regards,<br>The RetailGenie Team</p>
        """
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
