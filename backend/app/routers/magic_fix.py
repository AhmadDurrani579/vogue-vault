import json
from fastapi import APIRouter, Request
from openai import OpenAI
from app.core.config import settings

router = APIRouter()

@router.post("/magic-fix")
async def magic_fix(request: Request, data: dict):
    verdict  = data.get("verdict", {})
    garments = data.get("garments", [])
    occasion = data.get("occasion", "casual")

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    prompt = f"""Fashion stylist. Suggest 3 specific products to fix this outfit.

PRIMARY ISSUE: {verdict.get('primary_issue')}
FIX: {verdict.get('fix')}
OCCASION: {occasion}
GARMENTS: {[g['garment'] for g in garments[:4]]}

Return ONLY JSON:
{{"products": [
  {{
    "name": "<specific product name>",
    "category": "<category>",
    "brand": "<realistic brand>",
    "description": "<one line>",
    "why": "<why this fixes the issue>",
    "price_range": "<realistic price like £40-£80>",
    "search_term": "<amazon search term>"
  }}
]}}
Rules:
- Return exactly 3 products
- Prices must be realistic UK prices in £
- Brands must be real (Zara, ASOS, H&M, Thursday Boot Co, etc)
- search_term must be specific enough to find on Amazon"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        max_tokens=400
    )

    products = json.loads(response.choices[0].message.content).get("products", [])

    for product in products:
        search = product.get("search_term", product.get("name", "")).replace(" ", "+")
        product["amazon_url"] = f"https://www.amazon.co.uk/s?k={search}"
        product["asos_url"]   = f"https://www.asos.com/search/?q={search}"

    return {"products": products}