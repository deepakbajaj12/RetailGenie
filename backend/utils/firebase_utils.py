import firebase_admin
from firebase_admin import credentials, firestore
import os
import logging
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

class FirebaseUtils:
    def __init__(self):
        """Initialize Firebase connection"""
        try:
            # Check if Firebase is already initialized
            if not firebase_admin._apps:
                # Initialize Firebase
                cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
                
                if cred_path and os.path.exists(cred_path):
                    # Use service account key file
                    cred = credentials.Certificate(cred_path)
                    firebase_admin.initialize_app(cred)
                else:
                    # Use default credentials (for Google Cloud environment)
                    firebase_admin.initialize_app()
                
                logger.info("Firebase initialized successfully")
            
            # Get Firestore client
            self.db = firestore.client()
            
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {str(e)}")
            # Create a mock database for development/testing
            self.db = None
            self._mock_data = {}
            logger.warning("Using mock database - Firebase not available")
    
    def create_document(self, collection_name: str, data: Dict[str, Any], 
                       document_id: Optional[str] = None) -> str:
        """
        Create a new document in Firestore
        
        Args:
            collection_name (str): Name of the collection
            data (Dict[str, Any]): Document data
            document_id (str, optional): Custom document ID
            
        Returns:
            str: Document ID
        """
        try:
            if self.db:
                # Use Firestore
                if document_id:
                    doc_ref = self.db.collection(collection_name).document(document_id)
                    doc_ref.set(data)
                    return document_id
                else:
                    doc_ref = self.db.collection(collection_name).add(data)
                    if isinstance(doc_ref, tuple):
                        return doc_ref[1].id
                    return doc_ref.id
            else:
                # Use mock database
                import uuid
                doc_id = document_id or str(uuid.uuid4())
                
                if collection_name not in self._mock_data:
                    self._mock_data[collection_name] = {}
                
                data_with_id = data.copy()
                data_with_id['id'] = doc_id
                self._mock_data[collection_name][doc_id] = data_with_id
                
                return doc_id
                
        except Exception as e:
            logger.error(f"Error creating document: {str(e)}")
            raise
    
    def get_document(self, collection_name: str, document_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a document by ID
        
        Args:
            collection_name (str): Name of the collection
            document_id (str): Document ID
            
        Returns:
            Optional[Dict[str, Any]]: Document data or None if not found
        """
        try:
            if self.db:
                # Use Firestore
                doc_ref = self.db.collection(collection_name).document(document_id)
                doc = doc_ref.get()
                
                if doc.exists:
                    data = doc.to_dict()
                    data['id'] = doc.id
                    return data
                return None
            else:
                # Use mock database
                if collection_name in self._mock_data:
                    return self._mock_data[collection_name].get(document_id)
                return None
                
        except Exception as e:
            logger.error(f"Error getting document: {str(e)}")
            raise
    
    def get_documents(self, collection_name: str, 
                     filters: Optional[Dict[str, Any]] = None,
                     limit: Optional[int] = None,
                     order_by: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get documents from a collection with optional filters
        
        Args:
            collection_name (str): Name of the collection
            filters (Dict[str, Any], optional): Filters to apply
            limit (int, optional): Maximum number of documents to return
            order_by (str, optional): Field to order by
            
        Returns:
            List[Dict[str, Any]]: List of documents
        """
        try:
            if self.db:
                # Use Firestore
                query = self.db.collection(collection_name)
                
                # Apply filters
                if filters:
                    for field, value in filters.items():
                        query = query.where(field, '==', value)
                
                # Apply ordering
                if order_by:
                    query = query.order_by(order_by)
                
                # Apply limit
                if limit:
                    query = query.limit(limit)
                
                docs = query.stream()
                result = []
                
                for doc in docs:
                    data = doc.to_dict()
                    data['id'] = doc.id
                    result.append(data)
                
                return result
            else:
                # Use mock database
                if collection_name not in self._mock_data:
                    return []
                
                documents = list(self._mock_data[collection_name].values())
                
                # Apply filters
                if filters:
                    filtered_docs = []
                    for doc in documents:
                        match = True
                        for field, value in filters.items():
                            if doc.get(field) != value:
                                match = False
                                break
                        if match:
                            filtered_docs.append(doc)
                    documents = filtered_docs
                
                # Apply ordering (simple implementation)
                if order_by:
                    documents.sort(key=lambda x: x.get(order_by, ''))
                
                # Apply limit
                if limit:
                    documents = documents[:limit]
                
                return documents
                
        except Exception as e:
            logger.error(f"Error getting documents: {str(e)}")
            raise
    
    def update_document(self, collection_name: str, document_id: str, 
                       data: Dict[str, Any]) -> bool:
        """
        Update a document
        
        Args:
            collection_name (str): Name of the collection
            document_id (str): Document ID
            data (Dict[str, Any]): Data to update
            
        Returns:
            bool: Success status
        """
        try:
            if self.db:
                # Use Firestore
                doc_ref = self.db.collection(collection_name).document(document_id)
                doc_ref.update(data)
                return True
            else:
                # Use mock database
                if (collection_name in self._mock_data and 
                    document_id in self._mock_data[collection_name]):
                    self._mock_data[collection_name][document_id].update(data)
                    return True
                return False
                
        except Exception as e:
            logger.error(f"Error updating document: {str(e)}")
            return False
    
    def delete_document(self, collection_name: str, document_id: str) -> bool:
        """
        Delete a document
        
        Args:
            collection_name (str): Name of the collection
            document_id (str): Document ID
            
        Returns:
            bool: Success status
        """
        try:
            if self.db:
                # Use Firestore
                doc_ref = self.db.collection(collection_name).document(document_id)
                doc_ref.delete()
                return True
            else:
                # Use mock database
                if (collection_name in self._mock_data and 
                    document_id in self._mock_data[collection_name]):
                    del self._mock_data[collection_name][document_id]
                    return True
                return False
                
        except Exception as e:
            logger.error(f"Error deleting document: {str(e)}")
            return False
    
    def query_documents(self, collection_name: str, 
                       field: str, operator: str, value: Any,
                       limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Query documents with specific conditions
        
        Args:
            collection_name (str): Name of the collection
            field (str): Field to query
            operator (str): Query operator ('==', '>', '<', '>=', '<=', '!=', 'in', 'array-contains')
            value (Any): Value to compare
            limit (int, optional): Maximum number of documents to return
            
        Returns:
            List[Dict[str, Any]]: List of matching documents
        """
        try:
            if self.db:
                # Use Firestore
                query = self.db.collection(collection_name).where(field, operator, value)
                
                if limit:
                    query = query.limit(limit)
                
                docs = query.stream()
                result = []
                
                for doc in docs:
                    data = doc.to_dict()
                    data['id'] = doc.id
                    result.append(data)
                
                return result
            else:
                # Use mock database (simplified implementation)
                if collection_name not in self._mock_data:
                    return []
                
                documents = list(self._mock_data[collection_name].values())
                result = []
                
                for doc in documents:
                    field_value = doc.get(field)
                    
                    if operator == '==' and field_value == value:
                        result.append(doc)
                    elif operator == '>' and field_value and field_value > value:
                        result.append(doc)
                    elif operator == '<' and field_value and field_value < value:
                        result.append(doc)
                    elif operator == '>=' and field_value and field_value >= value:
                        result.append(doc)
                    elif operator == '<=' and field_value and field_value <= value:
                        result.append(doc)
                    elif operator == '!=' and field_value != value:
                        result.append(doc)
                    elif operator == 'in' and field_value in value:
                        result.append(doc)
                    elif operator == 'array-contains' and isinstance(field_value, list) and value in field_value:
                        result.append(doc)
                
                if limit:
                    result = result[:limit]
                
                return result
                
        except Exception as e:
            logger.error(f"Error querying documents: {str(e)}")
            raise
    
    def batch_write(self, operations: List[Dict[str, Any]]) -> bool:
        """
        Perform batch write operations
        
        Args:
            operations (List[Dict[str, Any]]): List of operations
                Each operation should have: 
                - 'type': 'create', 'update', or 'delete'
                - 'collection': collection name
                - 'document_id': document ID
                - 'data': data (for create/update operations)
        
        Returns:
            bool: Success status
        """
        try:
            if self.db:
                # Use Firestore batch
                batch = self.db.batch()
                
                for operation in operations:
                    op_type = operation.get('type')
                    collection = operation.get('collection')
                    doc_id = operation.get('document_id')
                    data = operation.get('data', {})
                    
                    doc_ref = self.db.collection(collection).document(doc_id)
                    
                    if op_type == 'create':
                        batch.set(doc_ref, data)
                    elif op_type == 'update':
                        batch.update(doc_ref, data)
                    elif op_type == 'delete':
                        batch.delete(doc_ref)
                
                batch.commit()
                return True
            else:
                # Use mock database
                for operation in operations:
                    op_type = operation.get('type')
                    collection = operation.get('collection')
                    doc_id = operation.get('document_id')
                    data = operation.get('data', {})
                    
                    if op_type == 'create':
                        self.create_document(collection, data, doc_id)
                    elif op_type == 'update':
                        self.update_document(collection, doc_id, data)
                    elif op_type == 'delete':
                        self.delete_document(collection, doc_id)
                
                return True
                
        except Exception as e:
            logger.error(f"Error in batch write: {str(e)}")
            return False
    
    def get_collection_stats(self, collection_name: str) -> Dict[str, Any]:
        """
        Get basic statistics about a collection
        
        Args:
            collection_name (str): Name of the collection
            
        Returns:
            Dict[str, Any]: Collection statistics
        """
        try:
            documents = self.get_documents(collection_name)
            
            stats = {
                'total_documents': len(documents),
                'collection_name': collection_name,
                'timestamp': firestore.SERVER_TIMESTAMP if self.db else None
            }
            
            # Add more specific stats based on collection type
            if collection_name == 'products':
                total_value = sum(doc.get('price', 0) for doc in documents)
                stats['total_inventory_value'] = total_value
                stats['average_price'] = total_value / max(1, len(documents))
            
            elif collection_name == 'feedback':
                ratings = [doc.get('rating', 0) for doc in documents if doc.get('rating')]
                if ratings:
                    stats['average_rating'] = sum(ratings) / len(ratings)
                    stats['total_reviews'] = len(ratings)
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting collection stats: {str(e)}")
            return {'error': str(e)}
