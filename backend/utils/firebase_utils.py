class FirebaseUtils:
    def __init__(self):
        self.db = None  # No real Firebase yet
        print("⚠️ Firebase is not connected. Using mock instead.")

    def log_prediction(self, data):
        print(f"Mock log: {data}")

    def get_documents(self, collection_name):
        return []

    def get_document(self, collection_name, doc_id):
        return None

    def create_document(self, collection_name, data):
        return "mock_id"

    def update_document(self, collection_name, doc_id, data):
        return True

    def delete_document(self, collection_name, doc_id):
        return True

    def query_documents(self, collection_name, field, op, value):
        return []
