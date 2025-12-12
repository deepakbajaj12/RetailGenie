import hashlib
import json
import os
from typing import Any, Dict, List, Optional, Tuple


INDEX_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "embeddings_index.json")
)


def _ensure_dir():
    os.makedirs(os.path.dirname(INDEX_PATH), exist_ok=True)


def _load_index() -> Dict[str, Any]:
    _ensure_dir()
    if not os.path.exists(INDEX_PATH):
        return {"items": []}
    try:
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"items": []}


def _save_index(index: Dict[str, Any]) -> None:
    _ensure_dir()
    tmp = INDEX_PATH + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    os.replace(tmp, INDEX_PATH)


def _text_key(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def upsert_embeddings(items: List[Dict[str, Any]]) -> int:
    """
    Upsert embedding items into the index.
    Each item: {id, text, embedding: List[float], metadata: {...}}
    Returns number of items written/updated.
    """
    index = _load_index()
    existing = {it.get("key"): it for it in index.get("items", [])}

    written = 0
    for it in items:
        text = it.get("text", "")
        key = _text_key(text)
        payload = {
            "key": key,
            "id": it.get("id"),
            "text": text,
            "embedding": it.get("embedding", []),
            "metadata": it.get("metadata", {}),
        }
        existing[key] = payload
        written += 1

    index["items"] = list(existing.values())
    _save_index(index)
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


def query_similar(embedding: List[float], top_k: int = 5, filter_meta: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    index = _load_index()
    items = index.get("items", [])
    results: List[Tuple[float, Dict[str, Any]]] = []
    for it in items:
        if filter_meta:
            mismatch = False
            for k, v in filter_meta.items():
                if it.get("metadata", {}).get(k) != v:
                    mismatch = True
                    break
            if mismatch:
                continue
        score = _cosine(embedding, it.get("embedding", []))
        results.append((score, it))

    results.sort(key=lambda x: x[0], reverse=True)
    return [
        {"score": round(score, 6), **item}
        for score, item in results[: max(1, top_k)]
    ]


def clear_index():
    _save_index({"items": []})
