import argparse
import json
import os
from typing import Any, Dict, List

try:
    from openai import OpenAI  # SDK v1.x
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore

from utils.vector_store import upsert_embeddings as upsert_json
try:
    from utils.vector_store_sqlite import upsert_embeddings as upsert_sqlite
    SQLITE_AVAILABLE = True
except Exception:
    upsert_sqlite = None  # type: ignore
    SQLITE_AVAILABLE = False


def get_embeddings_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or not OpenAI:
        return None
    try:
        return OpenAI(api_key=api_key)
    except Exception:
        return None


def embed_texts(client, texts: List[str]) -> List[List[float]]:
    if not texts:
        return []
    model = os.getenv("EMBEDDINGS_MODEL", "text-embedding-3-small")
    if not client:
        dim = 1536
        return [[0.0] * dim for _ in texts]
    try:
        resp = client.embeddings.create(model=model, input=texts)
        return [d.embedding for d in resp.data]
    except Exception:  # pragma: no cover
        dim = 1536
        return [[0.0] * dim for _ in texts]


def build_items(products: List[Dict[str, Any]], embeddings: List[List[float]]):
    items = []
    for p, emb in zip(products, embeddings):
        pid = p.get("id") or p.get("_id") or p.get("sku")
        name = p.get("name", "")
        desc = p.get("description", "")
        category = p.get("category", "Unknown")
        text = f"Name: {name}\nCategory: {category}\nDescription: {desc}"
        items.append({
            "id": pid,
            "text": text,
            "embedding": emb,
            "metadata": {"category": category, "name": name},
        })
    return items


def main():
    parser = argparse.ArgumentParser(description="Index products into local vector store")
    parser.add_argument("--file", type=str, default=os.path.join("data", "sample_products.json"), help="Path to products JSON file")
    parser.add_argument("--store", type=str, choices=["sqlite", "json"], default=os.getenv("VECTOR_STORE", "sqlite"), help="Vector store backend")
    args = parser.parse_args()

    path = args.file
    if not os.path.isabs(path):
        path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", path))

    with open(path, "r", encoding="utf-8") as f:
        products = json.load(f)
        if isinstance(products, dict) and "products" in products:
            products = products["products"]

    client = get_embeddings_client()
    texts = [f"Name: {p.get('name','')}\nCategory: {p.get('category','Unknown')}\nDescription: {p.get('description','')}" for p in products]
    embs = embed_texts(client, texts)
    items = build_items(products, embs)
    if args.store == "sqlite" and SQLITE_AVAILABLE and upsert_sqlite:
        written = upsert_sqlite(items)
        backend = "sqlite"
    else:
        written = upsert_json(items)
        backend = "json"
    print(f"Indexed {written} items into vector store ({backend})")


if __name__ == "__main__":
    main()
