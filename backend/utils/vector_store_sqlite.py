import json
import os
import sqlite3
from typing import Any, Dict, List, Optional, Tuple


DEFAULT_DB_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "embeddings_index.sqlite")
)


def _get_db_path() -> str:
    return os.getenv("VECTOR_DB_PATH", DEFAULT_DB_PATH)


def _connect() -> sqlite3.Connection:
    path = _get_db_path()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    return conn


def init_db() -> None:
    with _connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS embeddings (
              key TEXT PRIMARY KEY,
              id TEXT,
              text TEXT,
              embedding TEXT, -- JSON array for portability
              category TEXT,
              name TEXT
            );
            """
        )
        conn.commit()


def _key_for(text: str) -> str:
    # Avoid extra hashlib; sqlite PK uniqueness on text is enough combined with id
    # but we keep key as text hash-equivalent by content to dedupe by text.
    # Use simple prefix to avoid collisions with empty values.
    return f"k:{abs(hash(text))}"


def upsert_embeddings(items: List[Dict[str, Any]]) -> int:
    """
    Upsert items into sqlite store.
    Each item: {id, text, embedding: List[float], metadata: {category, name}}
    Returns number of items written/updated.
    """
    init_db()
    with _connect() as conn:
        cur = conn.cursor()
        written = 0
        for it in items:
            text = it.get("text", "")
            key = _key_for(text)
            pid = it.get("id")
            emb_json = json.dumps(it.get("embedding", []))
            meta = it.get("metadata", {})
            category = meta.get("category")
            name = meta.get("name")
            cur.execute(
                """
                INSERT INTO embeddings (key, id, text, embedding, category, name)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                  id=excluded.id,
                  text=excluded.text,
                  embedding=excluded.embedding,
                  category=excluded.category,
                  name=excluded.name
                """,
                (key, pid, text, emb_json, category, name),
            )
            written += 1
        conn.commit()
        return written


def _cosine(a: List[float], b: List[float]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = 0.0
    na = 0.0
    nb = 0.0
    for x, y in zip(a, b):
        dot += x * y
        na += x * x
        nb += y * y
    if na == 0.0 or nb == 0.0:
        return 0.0
    return dot / ((na ** 0.5) * (nb ** 0.5))


def query_similar(
    embedding: List[float],
    top_k: int = 5,
    filter_meta: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    init_db()
    with _connect() as conn:
        cur = conn.cursor()
        if filter_meta and filter_meta.get("category"):
            cur.execute(
                "SELECT key, id, text, embedding, category, name FROM embeddings WHERE category=?",
                (filter_meta.get("category"),),
            )
        else:
            cur.execute("SELECT key, id, text, embedding, category, name FROM embeddings")
        rows = cur.fetchall()

    results: List[Tuple[float, Dict[str, Any]]] = []
    for key, pid, text, emb_json, category, name in rows:
        try:
            emb = json.loads(emb_json or "[]")
        except Exception:
            emb = []
        score = _cosine(embedding, emb)
        results.append(
            (
                score,
                {
                    "key": key,
                    "id": pid,
                    "text": text,
                    "embedding": emb,
                    "metadata": {"category": category, "name": name},
                },
            )
        )
    results.sort(key=lambda x: x[0], reverse=True)
    return [
        {"score": round(score, 6), **item}
        for score, item in results[: max(1, top_k)]
    ]
