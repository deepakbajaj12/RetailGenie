from datetime import datetime
from typing import Optional, Dict, Any
import uuid

class User:
    def __init__(self, email: str, name: str, password: str, user_id: Optional[str] = None):
        """
        User model
        
        Args:
            email (str): User email address
            name (str): User full name
            password (str): User password (will be hashed)
            user_id (str, optional): User ID (auto-generated if not provided)
        """
        self.id = user_id or str(uuid.uuid4())
        self.email = email
        self.name = name
        self.password = password
        self.created_at = datetime.now().isoformat()
        self.updated_at = datetime.now().isoformat()
        self.is_active = True
        self.profile_image = None
        self.phone = None
        self.address = {}
        self.preferences = {}
        self.purchase_history = []
        self.last_login = None
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert user object to dictionary
        
        Returns:
            Dict[str, Any]: User data as dictionary
        """
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'password': self.password,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'is_active': self.is_active,
            'profile_image': self.profile_image,
            'phone': self.phone,
            'address': self.address,
            'preferences': self.preferences,
            'purchase_history': self.purchase_history,
            'last_login': self.last_login
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        """
        Create user object from dictionary
        
        Args:
            data (Dict[str, Any]): User data dictionary
            
        Returns:
            User: User object
        """
        user = cls(
            email=data.get('email'),
            name=data.get('name'),
            password=data.get('password'),
            user_id=data.get('id')
        )
        
        user.created_at = data.get('created_at', user.created_at)
        user.updated_at = data.get('updated_at', user.updated_at)
        user.is_active = data.get('is_active', True)
        user.profile_image = data.get('profile_image')
        user.phone = data.get('phone')
        user.address = data.get('address', {})
        user.preferences = data.get('preferences', {})
        user.purchase_history = data.get('purchase_history', [])
        user.last_login = data.get('last_login')
        
        return user
    
    def update_profile(self, **kwargs):
        """
        Update user profile fields
        
        Args:
            **kwargs: Fields to update
        """
        allowed_fields = [
            'name', 'phone', 'profile_image', 'address', 'preferences'
        ]
        
        for key, value in kwargs.items():
            if key in allowed_fields:
                setattr(self, key, value)
        
        self.updated_at = datetime.now().isoformat()
    
    def add_to_purchase_history(self, product_id: str, purchase_data: Dict[str, Any]):
        """
        Add a purchase to user's history
        
        Args:
            product_id (str): Product ID
            purchase_data (Dict[str, Any]): Purchase details
        """
        purchase_entry = {
            'product_id': product_id,
            'purchase_date': datetime.now().isoformat(),
            **purchase_data
        }
        
        self.purchase_history.append(purchase_entry)
        self.updated_at = datetime.now().isoformat()
    
    def update_preferences(self, preferences: Dict[str, Any]):
        """
        Update user preferences
        
        Args:
            preferences (Dict[str, Any]): New preferences
        """
        self.preferences.update(preferences)
        self.updated_at = datetime.now().isoformat()
    
    def deactivate(self):
        """Deactivate user account"""
        self.is_active = False
        self.updated_at = datetime.now().isoformat()
    
    def activate(self):
        """Activate user account"""
        self.is_active = True
        self.updated_at = datetime.now().isoformat()
    
    def __str__(self) -> str:
        return f"User(id={self.id}, email={self.email}, name={self.name})"
    
    def __repr__(self) -> str:
        return self.__str__()


class Product:
    """Product model for reference"""
    def __init__(self, name: str, description: str, price: float, category: str, product_id: Optional[str] = None):
        self.id = product_id or str(uuid.uuid4())
        self.name = name
        self.description = description
        self.price = price
        self.category = category
        self.created_at = datetime.now().isoformat()
        self.updated_at = datetime.now().isoformat()
        self.is_active = True
        self.images = []
        self.tags = []
        self.brand = None
        self.stock_quantity = 0
        self.rating = 0.0
        self.review_count = 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'is_active': self.is_active,
            'images': self.images,
            'tags': self.tags,
            'brand': self.brand,
            'stock_quantity': self.stock_quantity,
            'rating': self.rating,
            'review_count': self.review_count
        }


class Feedback:
    """Feedback model for reference"""
    def __init__(self, user_id: str, product_id: str, rating: int, comment: str, feedback_id: Optional[str] = None):
        self.id = feedback_id or str(uuid.uuid4())
        self.user_id = user_id
        self.product_id = product_id
        self.rating = rating
        self.comment = comment
        self.timestamp = datetime.now().isoformat()
        self.sentiment = None
        self.is_verified = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'rating': self.rating,
            'comment': self.comment,
            'timestamp': self.timestamp,
            'sentiment': self.sentiment,
            'is_verified': self.is_verified
        }
