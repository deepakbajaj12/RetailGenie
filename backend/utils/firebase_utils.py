class FirebaseUtils:
    _mock_storage = {} # Class-level storage to persist across instances

    def __init__(self):
        self.db = None  # No real Firebase yet
        print("⚠️ Firebase is not connected. Using mock instead.")

    def log_prediction(self, data):
        print(f"Mock log: {data}")

    def get_documents(self, collection_name):
        return self._mock_storage.get(collection_name, [])

    def get_document(self, collection_name, doc_id):
        collection = self._mock_storage.get(collection_name, [])
        for doc in collection:
            if doc.get('id') == doc_id:
                return doc
        return None

    def create_document(self, collection_name, data):
        if collection_name not in self._mock_storage:
            self._mock_storage[collection_name] = []
        
        # Add a mock ID
        import uuid
        doc_id = str(uuid.uuid4())
        data['id'] = doc_id
        
        self._mock_storage[collection_name].append(data)
        print(f"Mock DB: Created document in {collection_name} with ID {doc_id}")
        return doc_id

    def update_document(self, collection_name, doc_id, data):
        collection = self._mock_storage.get(collection_name, [])
        for i, doc in enumerate(collection):
            if doc.get('id') == doc_id:
                collection[i].update(data)
                return True
        return False

    def delete_document(self, collection_name, doc_id):
        collection = self._mock_storage.get(collection_name, [])
        self._mock_storage[collection_name] = [d for d in collection if d.get('id') != doc_id]
        return True

    def query_documents(self, collection_name, field, op, value):
        # Simple mock query implementation
        collection = self._mock_storage.get(collection_name, [])
        results = []
        for doc in collection:
            doc_val = doc.get(field)
            if op == '==' and doc_val == value:
                results.append(doc)
            # Add other ops if needed
        return results
