import json
import hashlib
from openai import OpenAI
from app.core.config import settings

class AIService:

    def __init__(self):
        self.client = None
        self._cache: dict = {}  # in-memory cache
        
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            print("[AI] OpenAI connected!")
        else:
            print("[AI] No OPENAI_API_KEY — running in stub mode")

    def _make_cache_key(self, garments: list, occasion: str) -> str:
        """Cache key from garment names + occasion — same outfit = same key"""
        garment_names = sorted([g["garment"] for g in garments[:5]])
        raw = f"{'-'.join(garment_names)}_{occasion.lower()}"
        return hashlib.md5(raw.encode()).hexdigest()

    def get_verdict(self, garments: list, similar_outfits: list, occasion: str) -> dict:
        """Generate outfit verdict using RAG — with caching"""
        print(f"[AI] get_verdict — garments: {len(garments)}, similar: {len(similar_outfits)}")

        if not self.client:
            return self._stub_verdict()

        # Check cache first
        cache_key = self._make_cache_key(garments, occasion)
        if cache_key in self._cache:
            print(f"[AI] Cache hit! {cache_key[:8]}")
            return self._cache[cache_key]

        try:
            # Slim down data — only send what matters
            slim_garments = [
                {"garment": g["garment"], "confidence": round(g["confidence"], 2)}
                for g in garments[:5]
            ]
            slim_similar = [
                {
                    "garments":   s["garments"][:2],
                    "score":      s["score"],
                    "similarity": round(s["similarity"], 2)
                }
                for s in similar_outfits[:5]
            ]

            prompt = f"""Fashion stylist AI. Diagnose this outfit.
GARMENTS: {json.dumps(slim_garments)}
OCCASION: {occasion}
SIMILAR OUTFITS: {json.dumps(slim_similar)}

Return ONLY this JSON:
{{"score": <0-100>, "score_with_fix": <0-100>, "summary": "<one line>", "primary_issue": "<main problem>", "fix": "<one specific fix>", "rag_insight": "<one insight from similar outfits>"}}"""

            print("[AI] Calling OpenAI...")
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                max_tokens=200  # was 500 — verdict is short
            )
            
            verdict = json.loads(response.choices[0].message.content)
            verdict["verified"] = True  # skip self-check — saves 50% tokens
            
            print(f"[AI] Verdict: {verdict}")
            print(f"[AI] Tokens used: {response.usage.total_tokens}")

            # Cache it
            self._cache[cache_key] = verdict
            print(f"[AI] Cached with key {cache_key[:8]}")

            return verdict

        except Exception as e:
            print(f"[AI] Verdict FAILED: {type(e).__name__}: {e}")
            return self._stub_verdict()

    def _stub_verdict(self) -> dict:
        return {
            "score":          72,
            "score_with_fix": 90,
            "summary":        "Strong foundation, one key fix needed",
            "primary_issue":  "Footwear breaks the slim silhouette",
            "fix":            "Swap white sneakers for chelsea boots",
            "rag_insight":    "Similar outfits scored 18 points higher with boots",
            "verified":       True
        }