import os
from datetime import datetime, timezone
from typing import Dict, Any
from flask import Blueprint, request, jsonify

try:
    from openai import OpenAI  # SDK v1.x
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore

try:
    import google.generativeai as genai
except Exception:
    genai = None

from utils.firebase_utils import FirebaseUtils
from utils.vector_store import upsert_embeddings as upsert_json
from utils.vector_store import query_similar as query_json
try:
    from utils.vector_store_sqlite import upsert_embeddings as upsert_sqlite
    from utils.vector_store_sqlite import query_similar as query_sqlite
    SQLITE_AVAILABLE = True
except Exception:
    upsert_sqlite = None  # type: ignore
    query_sqlite = None  # type: ignore
    SQLITE_AVAILABLE = False


def _use_sqlite_store() -> bool:
    pref = os.getenv("VECTOR_STORE", "sqlite").lower()
    return SQLITE_AVAILABLE and pref == "sqlite"

ai_bp = Blueprint("ai", __name__)


def _get_llm_client():
    # Check OpenAI first
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key and OpenAI:
        try:
            return "openai", OpenAI(api_key=openai_key)
        except Exception:
            pass

    # Check Gemini
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key and genai:
        try:
            genai.configure(api_key=gemini_key)
            return "gemini", None
        except Exception:
            pass

    return None, None


def _chat_complete(provider_info, system_prompt: str, user_prompt: str) -> str:
    provider, client = provider_info

    if provider == "openai":
        try:
            resp = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
                max_tokens=400,
            )
            return resp.choices[0].message.content or ""
        except Exception as e:  # pragma: no cover
            return f"OpenAI error: {e}"

    elif provider == "gemini":
        try:
            model_name = os.getenv("GEMINI_MODEL", "gemini-pro")
            model = genai.GenerativeModel(model_name)
            # Gemini doesn't have system prompts in the same way, usually prepended
            full_prompt = f"System: {system_prompt}\n\nUser: {user_prompt}"
            response = model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            return f"Gemini error: {e}"

    return "No LLM provider configured."


@ai_bp.route("/ai/summarize-feedback", methods=["POST"])
def summarize_feedback():
    data = request.get_json(silent=True) or {}
    product_id = data.get("product_id")
    feedback_items = data.get("feedback", [])

    firebase = FirebaseUtils()
    if not feedback_items and product_id:
        try:
            feedback_items = firebase.query_documents(
                "feedback", "product_id", "==", product_id
            ) or []
        except Exception:
            feedback_items = []

    # Normalize to list of {rating:int, comment:str}
    normalized = []
    for f in feedback_items:
        rating = f.get("rating") if isinstance(f, dict) else None
        comment = f.get("comment", "") if isinstance(f, dict) else str(f)
        try:
            rating = int(rating) if rating is not None else None
        except Exception:
            rating = None
        normalized.append({"rating": rating, "comment": comment})

    # Heuristic fallback in case no LLM
    avg_rating = (
        round(
            sum([x["rating"] for x in normalized if isinstance(x.get("rating"), int)])
            / max(1, len([x for x in normalized if isinstance(x.get("rating"), int)])),
            2,
        )
        if normalized
        else None
    )

    provider_info = _get_llm_client()
    if provider_info[0]:
        system_prompt = (
            "You summarize customer feedback for retail products, returning a brief "
            "summary, key themes, and 3-5 actionable recommendations. Be concise."
        )
        bullets = "\n".join(
            [
                f"- rating: {f['rating']}, comment: {f['comment']}"
                for f in normalized[:100]
            ]
        )
        user_prompt = (
            f"Product: {product_id or 'N/A'}\n"
            f"Average rating (approx): {avg_rating}\n"
            f"Feedback items (sample up to 100):\n{bullets}\n\n"
            "Return JSON with keys: summary, key_themes (array of strings), "
            "recommended_actions (array of strings), sentiment ('positive'|'mixed'|'negative')."
        )
        content = _chat_complete(provider_info, system_prompt, user_prompt)
        # Best-effort parse if JSON, else wrap in structure
        try:
            import json

            payload = json.loads(content)
        except Exception:
            payload = {
                "summary": content,
                "key_themes": [],
                "recommended_actions": [],
                "sentiment": "mixed",
            }
    else:
        # Fallback summary without LLM
        total = len(normalized)
        negatives = len([x for x in normalized if (x["rating"] or 0) <= 2])
        positives = len([x for x in normalized if (x["rating"] or 0) >= 4])
        sentiment = (
            "negative" if negatives > positives else ("positive" if positives > negatives else "mixed")
        )
        payload = {
            "summary": f"{total} feedback items analyzed. Avg rating ~ {avg_rating}. Sentiment: {sentiment}.",
            "key_themes": ["price", "quality", "availability"],
            "recommended_actions": [
                "Address top recurring issue in next sprint",
                "Improve product description and visuals",
                "Consider promo for low-rated segments",
            ],
            "sentiment": sentiment,
        }

    return (
        jsonify(
            {
                "product_id": product_id,
                "generated_at": datetime.now(timezone.utc).isoformat(),
                **payload,
            }
        ),
        200,
    )


@ai_bp.route("/ai/generate-description", methods=["POST"])
def generate_description():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "Unnamed Product")
    category = data.get("category", "General")
    features = data.get("features", [])
    tone = data.get("tone", "concise")

    provider_info = _get_llm_client()
    if not provider_info[0]:
        desc = f"{name} is a great {category} product. Key features: {', '.join(features)}."
        return jsonify({"description": desc, "model": None}), 200

    system_prompt = (
        "You are a product marketing writer. Write a 3-4 sentence product "
        "description that is clear, benefits-oriented, and avoids fluff."
    )
    user_prompt = (
        f"Name: {name}\nCategory: {category}\nFeatures: {', '.join(features)}\nTone: {tone}\n"
        "Return only the description text."
    )
    content = _chat_complete(provider_info, system_prompt, user_prompt)
    return jsonify({"description": content, "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini")}), 200


def _get_embeddings_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or not OpenAI:
        return None
    try:
        return OpenAI(api_key=api_key)
    except Exception:
        return None


def _embed_texts(client, texts: list) -> list:
    # Batches could be added later; simple single-call for clarity
    if not texts:
        return []
    model = os.getenv("EMBEDDINGS_MODEL", "text-embedding-3-small")
    try:
        resp = client.embeddings.create(model=model, input=texts)
        return [d.embedding for d in resp.data]
    except Exception as e:  # pragma: no cover
        # Fallback: return zero vectors if embeddings fail
        dim = 1536
        return [[0.0] * dim for _ in texts]


@ai_bp.route("/ai/index-products", methods=["POST"])
def index_products():
    """
    Index product descriptions into the local vector store.
    Body (optional): { products: [{id, name, description, category, ...}] }
    If not provided, attempts to read from Firebase.
    """
    payload = request.get_json(silent=True) or {}
    products = payload.get("products")

    firebase = FirebaseUtils()
    if not products:
        try:
            products = firebase.get_documents("products") or []
        except Exception:
            products = []

    # Build texts to embed
    to_index = []
    for p in products:
        pid = p.get("id") or p.get("_id") or p.get("sku")
        name = p.get("name", "")
        desc = p.get("description", "")
        category = p.get("category", "Unknown")
        text = f"Name: {name}\nCategory: {category}\nDescription: {desc}"
        to_index.append((pid, text, {"category": category, "name": name}))

    client = _get_embeddings_client()
    texts = [t for _, t, _ in to_index]
    embeddings = _embed_texts(client, texts) if client else [[0.0] * 1536 for _ in texts]

    items = []
    for (pid, text, meta), emb in zip(to_index, embeddings):
        items.append({"id": pid, "text": text, "embedding": emb, "metadata": meta})

    if _use_sqlite_store() and upsert_sqlite:
        written = upsert_sqlite(items)
    else:
        written = upsert_json(items)
    return jsonify({"indexed": written}), 200


@ai_bp.route("/ai/semantic-search", methods=["POST"])
def semantic_search():
    """
    Body: { query: string, top_k?: int, category?: string }
    Returns: top_k similar products from local index.
    """
    data = request.get_json(silent=True) or {}
    query = data.get("query", "").strip()
    top_k = int(data.get("top_k", 5))
    category = data.get("category")

    if not query:
        return jsonify({"error": "query is required"}), 400

    client = _get_embeddings_client()
    q_emb = _embed_texts(client, [query])[0] if client else [0.0] * 1536

    filters = {"category": category} if category else None
    if _use_sqlite_store() and query_sqlite:
        hits = query_sqlite(q_emb, top_k=top_k, filter_meta=filters)
    else:
        hits = query_json(q_emb, top_k=top_k, filter_meta=filters)
    return jsonify({"results": hits}), 200


@ai_bp.route("/ai/recommendations", methods=["POST"])
def recommendations():
    """
    Body: { product: {...} } or { product_id: "..." }
    Strategy: filter by same category, then rank by embedding similarity.
    """
    data = request.get_json(silent=True) or {}
    product = data.get("product")
    product_id = data.get("product_id")

    firebase = FirebaseUtils()
    if not product and product_id:
        try:
            product = firebase.get_document("products", product_id)
        except Exception:
            product = None
    if not product:
        return jsonify({"error": "product or product_id required"}), 400

    category = product.get("category", "Unknown")
    base_text = f"Name: {product.get('name','')}\nCategory: {category}\nDescription: {product.get('description','')}"

    client = _get_embeddings_client()
    base_emb = _embed_texts(client, [base_text])[0] if client else [0.0] * 1536

    # Retrieve similar within same category
    if _use_sqlite_store() and query_sqlite:
        hits = query_sqlite(base_emb, top_k=int(data.get("top_k", 5)), filter_meta={"category": category})
    else:
        hits = query_json(base_emb, top_k=int(data.get("top_k", 5)), filter_meta={"category": category})
    # Remove self if present by id match
    pid = product.get("id") or product.get("_id") or product.get("sku")
    filtered = [h for h in hits if h.get("id") != pid]
    return jsonify({"recommendations": filtered}), 200


@ai_bp.route("/ai/insights", methods=["POST"])
def ai_insights():
    """
    Combine sales, inventory, and feedback into weekly action items.
    Body optional:
    {
      sales: [{product_id, units, revenue, date}],
      inventory: [{product_id, stock, reorder_point}],
      feedback: [{product_id, rating, comment}]
    }
    Falls back to pulling from Firebase collections if available.
    """
    data = request.get_json(silent=True) or {}
    firebase = FirebaseUtils()

    sales = data.get("sales")
    inv = data.get("inventory")
    fb = data.get("feedback")

    # Try to load from Firebase if not provided
    try:
        if not sales:
            sales = firebase.get_documents("sales") or []
        if not inv:
            inv = firebase.get_documents("inventory") or []
        if not fb:
            fb = firebase.get_documents("feedback") or []
    except Exception:
        pass

    # Aggregate simple metrics
    by_pid: Dict[str, Dict[str, Any]] = {}
    for s in sales or []:
        pid = s.get("product_id")
        if not pid:
            continue
        d = by_pid.setdefault(pid, {"units": 0, "revenue": 0.0, "stock": None, "ratings": []})
        d["units"] += int(s.get("units", 0))
        d["revenue"] += float(s.get("revenue", 0))
    for i in inv or []:
        pid = i.get("product_id")
        if not pid:
            continue
        d = by_pid.setdefault(pid, {"units": 0, "revenue": 0.0, "stock": None, "ratings": []})
        d["stock"] = int(i.get("stock", 0))
        d["reorder_point"] = int(i.get("reorder_point", 0))
    for f in fb or []:
        pid = f.get("product_id")
        if not pid:
            continue
        d = by_pid.setdefault(pid, {"units": 0, "revenue": 0.0, "stock": None, "ratings": []})
        if f.get("rating") is not None:
            try:
                d["ratings"].append(int(f.get("rating")))
            except Exception:
                pass

    # Heuristic actions
    actions = []
    for pid, stats in by_pid.items():
        avg_rating = round(sum(stats["ratings"]) / max(1, len(stats["ratings"])), 2) if stats["ratings"] else None
        stock = stats.get("stock")
        reorder = stats.get("reorder_point", 0)
        note = []
        if stock is not None and reorder and stock <= reorder:
            note.append("Reorder suggested")
        if avg_rating is not None and avg_rating < 3:
            note.append("Investigate low ratings")
        if stats["units"] > 100:
            note.append("Top seller: consider upsell/bundle")
        if not note:
            note.append("Monitor performance")
        actions.append({
            "product_id": pid,
            "units": stats["units"],
            "revenue": round(stats["revenue"], 2),
            "avg_rating": avg_rating,
            "stock": stock,
            "recommendations": note,
        })

    # Optional LLM shrink/summarize of the weekly plan
    provider_info = _get_llm_client()
    summary = None
    if provider_info[0]:
        import json as _json
        sys_prompt = "Summarize weekly retail insights into 5-8 concise bullets."
        usr_prompt = f"Data: {_json.dumps(actions)[:6000]}"
        summary = _chat_complete(provider_info, sys_prompt, usr_prompt)

    return jsonify({
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "actions": actions,
        "summary": summary,
    }), 200


@ai_bp.route("/ai/chat", methods=["POST"])
def chat_assistant():
    """
    General purpose retail assistant chat.
    """
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    provider_info = _get_llm_client()
    
    # Mock response if no LLM key
    if not provider_info[0]:
        # Simple keyword matching for demo purposes
        msg = user_message.lower()
        if "revenue" in msg:
            return jsonify({"reply": "Based on current data, total revenue is trending up by 12% this week."})
        elif "sales" in msg:
            return jsonify({"reply": "Sales have increased by 15% compared to last month. Top performing category: Electronics."})
        elif "marketing" in msg:
            return jsonify({"reply": "Consider running a promotion on slow-moving inventory to boost sales."})
        elif "stock" in msg or "inventory" in msg:
            return jsonify({"reply": "We have 5 items currently low in stock. Check the dashboard for details."})
        elif "hello" in msg or "hi" in msg:
            return jsonify({"reply": "Hello! I'm RetailGenie. Ask me about sales, inventory, or product performance."})
        else:
            return jsonify({"reply": "I'm running in offline mode. Configure OpenAI or Gemini API key for full intelligence."})

    # Real AI response
    system_prompt = (
        "You are RetailGenie, an expert retail analytics assistant. "
        "Answer questions about store performance, inventory management, and retail strategy. "
        "Be professional, concise, and helpful."
    )
    
    reply = _chat_complete(provider_info, system_prompt, user_message)
    return jsonify({"reply": reply})
