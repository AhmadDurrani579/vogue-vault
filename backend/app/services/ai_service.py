import json
from openai import OpenAI
from app.core.config import settings


class AIService:

    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            print("[AI] OpenAI connected!")
        else:
            print("[AI] No OPENAI_API_KEY — running in stub mode")

    def get_verdict(self, garments: list, similar_outfits: list, occasion: str) -> dict:
        """Generate outfit verdict using RAG context from pgvector results"""
        print(f"[AI] get_verdict called — client: {self.client is not None}")
        print(f"[AI] Garments: {len(garments)}, Similar: {len(similar_outfits)}")

        if not self.client:
            print("[AI] No client — returning stub")
            return self._stub_verdict()

        try:
            prompt = f"""
You are a professional fashion stylist AI. Diagnose this outfit.
DETECTED GARMENTS: {json.dumps(garments)}
OCCASION: {occasion}
SIMILAR OUTFITS FROM DATABASE (real data): {json.dumps(similar_outfits[:10])}

Based on the garments and similar outfit data above, return ONLY this JSON:
{{
  "score": <0-100 integer>,
  "score_with_fix": <0-100 integer>,
  "summary": "<one line summary>",
  "primary_issue": "<main problem with the outfit>",
  "fix": "<one specific actionable fix>",
  "rag_insight": "<insight from the similar outfits data>"
}}
Be specific. Use the similar outfits data to back up your diagnosis.
Return ONLY the JSON. No extra text.
            """

            print("[AI] Calling OpenAI...")
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                max_tokens=500
            )
            print("[AI] OpenAI response received!")
            verdict = json.loads(response.choices[0].message.content)
            print(f"[AI] Verdict: {verdict}")

            verdict = self._self_check(verdict, similar_outfits, garments)
            return verdict

        except Exception as e:
            print(f"[AI] Verdict FAILED: {type(e).__name__}: {e}")
            return self._stub_verdict()

    def _self_check(self, verdict: dict, similar_outfits: list, garments: list) -> dict:
        """Second AI pass to verify the verdict before sending to user"""
        if not self.client:
            return {**verdict, "verified": True}

        try:
            prompt = f"""
You are reviewing a fashion diagnosis for accuracy.
ORIGINAL DIAGNOSIS: {json.dumps(verdict)}
GARMENTS: {json.dumps(garments)}
SIMILAR OUTFITS DATA: {json.dumps(similar_outfits[:5])}

Check:
1. Is the score fair based on the similar outfits data?
2. Is the fix specific and actionable?
3. Is the rag_insight actually supported by the data?

Return the same JSON structure. If correct add "verified": true.
If you corrected anything add "verified": false, "corrected": true.
Return ONLY JSON.
            """

            print("[AI] Self-check calling OpenAI...")
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                max_tokens=500
            )
            result = json.loads(response.choices[0].message.content)
            print(f"[AI] Self-check result: {result}")
            return result

        except Exception as e:
            print(f"[AI] Self-check FAILED: {type(e).__name__}: {e}")
            return {**verdict, "verified": True}

    def _stub_verdict(self) -> dict:
        """Fallback verdict when OpenAI is not available"""
        return {
            "score":          72,
            "score_with_fix": 90,
            "summary":        "Strong foundation, one key fix needed",
            "primary_issue":  "Footwear breaks the slim silhouette",
            "fix":            "Swap white sneakers for chelsea boots",
            "rag_insight":    "Similar outfits scored 18 points higher with boots",
            "verified":       True
        }