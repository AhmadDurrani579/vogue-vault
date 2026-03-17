# StyleCheck — AI Fashion Diagnosis Tool

> Upload your outfit. Get a data-backed style score, garment-level analysis, RAG-grounded recommendations, and an AI-generated visualisation of the fix — in under 30 seconds.

**Live Demo:** [stylecheck-six.vercel.app](https://stylecheck-six.vercel.app)  
**Backend API:** [AhmadDurrani/vogue-vault-api](https://huggingface.co/spaces/AhmadDurrani/vogue-vault-api)

---

## What is StyleCheck?

StyleCheck is an AI-powered outfit diagnostic tool that provides specific, data-backed fashion feedback rather than generic advice. Unlike typical "vision to text" fashion tools, StyleCheck uses a RAG (Retrieval-Augmented Generation) pipeline grounded in a database of 5,000+ indexed outfits to give recommendations that are actually comparable to real-world fashion.

### Key Features

- **Real-time outfit analysis** via WebSocket streaming — watch the 5-step pipeline live
- **FashionCLIP garment detection** — identifies up to 6 specific garments with confidence scores
- **pgvector similarity search** — finds the 20 most similar outfits from a 5,000+ outfit index
- **RAG-grounded verdict** — OpenAI verdict anchored to real similar outfit data, not hallucinated
- **Style score** — 0-100 score with per-occasion calibration
- **Magic Fix** — 3 specific product recommendations with UK price estimates and shop links
- **Visualise Fix** — AI-generated before/after visualisation using FLUX.1-schnell
- **Result caching** — 87% token cost reduction via MD5-keyed in-memory cache
- **Recent Diagnoses** — localStorage history with score trend tracking

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                     │
│         React + TypeScript + Tailwind CSS                │
│  Screen 1: Upload → Screen 2: Analyzing → Screen 3: Results │
└────────────────────┬────────────────────────────────────┘
                     │ WebSocket (wss://)
                     │ HTTP POST (magic-fix, visualise-fix)
┌────────────────────▼────────────────────────────────────┐
│              Backend (HuggingFace Spaces)                │
│                FastAPI + Uvicorn                         │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ FashionCLIP │  │   pgvector   │  │    OpenAI      │  │
│  │ (ViT-B/32)  │  │  similarity  │  │  gpt-4o-mini   │  │
│  │  35 labels  │  │    search    │  │  RAG verdict   │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
│                                                          │
│  ┌─────────────┐  ┌──────────────────────────────────┐  │
│  │  Magic Fix  │  │        Visualise Fix              │  │
│  │ gpt-4o-mini │  │  FLUX.1-schnell (HF Router API)  │  │
│  │ + price est │  │  Before/after image generation   │  │
│  └─────────────┘  └──────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Neon PostgreSQL                        │
│              pgvector extension                          │
│         5,000+ outfit embeddings indexed                 │
│         512-dim FashionCLIP embeddings                   │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Styling |
| Vite | 7 | Build tool |
| Lucide React | 0.263 | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | latest | REST + WebSocket API |
| Uvicorn | latest | ASGI server |
| Python | 3.10 | Runtime |
| httpx | latest | Async HTTP client |
| Pillow | latest | Image processing |
| asyncpg | latest | Async PostgreSQL |
| pydantic-settings | latest | Config management |

### AI Models
| Model | Provider | Purpose |
|-------|----------|---------|
| `Marqo/marqo-fashionCLIP` (ViT-B/32) | HuggingFace | Garment detection + 512-dim embeddings |
| `gpt-4o-mini` | OpenAI | RAG-grounded outfit verdict |
| `gpt-4o-mini` | OpenAI | Magic Fix product recommendations |
| `black-forest-labs/FLUX.1-schnell` | HF Router API | Outfit visualisation generation |

### Infrastructure
| Service | Purpose |
|---------|---------|
| HuggingFace Spaces (CPU) | Backend hosting |
| Vercel | Frontend hosting + CDN |
| Neon (PostgreSQL + pgvector) | Vector similarity search |
| Cloudinary | Outfit image storage and CDN |
| GitHub Actions | CI/CD pipeline |

---

## CI/CD Pipeline

```
Developer pushes to main branch
        ↓
GitHub Actions triggered
        ↓
┌───────────────────────────────┐
│  Job 1: Deploy Backend        │
│  git push → HuggingFace Space │
│  Space rebuilds Docker image  │
│  Uvicorn restarts             │
└───────────────────────────────┘
        ↓
┌───────────────────────────────┐
│  Job 2: Deploy Frontend       │
│  vercel --prod                │
│  Vite builds static assets    │
│  Deployed to Vercel CDN       │
└───────────────────────────────┘
```

GitHub Actions workflow pushes backend to HuggingFace Spaces via git remote. Frontend deploys to Vercel automatically on push to main.

---

## Project Structure

```
ai-fashion-police/
├── frontend/                    # React TypeScript app
│   ├── src/
│   │   ├── pages/
│   │   │   └── diagnosis/
│   │   │       ├── ScreenUpload.tsx      # Screen 1 — upload + occasion
│   │   │       ├── ScreenAnalyzing.tsx   # Screen 2 — live pipeline
│   │   │       └── ScreenResults.tsx     # Screen 3 — verdict + features
│   │   ├── features/
│   │   │   ├── camera/                   # LeftCameraPanel + garment list
│   │   │   ├── memory/                   # VisualMemoryPanel (similar outfits)
│   │   │   └── upload/                   # RecentDiagnoses + StatsRow
│   │   ├── hooks/
│   │   │   └── useAnalysis.ts            # WebSocket state machine
│   │   ├── utils/
│   │   │   └── storage.ts                # localStorage utilities
│   │   └── types/                        # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── core/
│   │   │   ├── ai_engine.py              # FashionCLIP model loader
│   │   │   └── config.py                 # Pydantic settings
│   │   ├── routers/
│   │   │   ├── websocket.py              # Main WS pipeline + caching
│   │   │   ├── magic_fix.py              # Product recommendations
│   │   │   └── visualise_fix.py          # FLUX image generation
│   │   └── services/
│   │       ├── clip_service.py           # FashionCLIP inference
│   │       ├── db_service.py             # pgvector similarity search
│   │       └── ai_service.py             # OpenAI verdict + caching
│   ├── scripts/
│   │   └── index_outfits.py              # Dataset indexing script
│   ├── requirements.txt
│   ├── Dockerfile
│   └── main.py
│
└── .github/
    └── workflows/
        └── deploy.yml                    # CI/CD pipeline
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL with pgvector extension (or Neon account)
- OpenAI API key
- HuggingFace account + token

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file (never commit this)
cat > .env << EOF
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
HF_TOKEN=hf_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EOF

uvicorn main:app --reload --port 7860
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Neon PostgreSQL connection string |
| `OPENAI_API_KEY` | ✅ | OpenAI API key (gpt-4o-mini) |
| `HF_TOKEN` | ✅ | HuggingFace token (for FLUX API) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |

---

## WebSocket Pipeline

The analysis runs as a 5-step streaming pipeline over WebSocket:

```
Client connects → sends { image: base64, occasion: "casual" }

Step 1: FashionCLIP inference
        → Detects garments (up to 6), generates 512-dim embedding
        → Streams: { step: 1, status: "done", garments: [...] }

Step 2: pgvector similarity search
        → Finds 20 most similar outfits from 5,000+ index
        → Streams: { step: 2, status: "done", matches: [...] }

Step 3: OpenAI verdict (RAG-grounded)
        → gpt-4o-mini with slim garment + similar outfit context
        → Streams: { step: 3, status: "done", detail: summary }

Step 4: Verification
        → No second API call — verified: true
        → Streams: { step: 4, status: "done" }

Step 5: Complete
        → Streams: { type: "complete", verdict: {...}, matches: [...] }
```

### Caching Strategy

```
Cache Key = MD5(image_bytes) + occasion + timestamp_version
Cache Hit  → streams all 5 steps instantly, returns cached result
Cache Miss → full pipeline, saves to app.state.cache
Token Cost → ~$0.0001 per request (~500 tokens)
Cache Hit  → $0.00
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Health check (used for pre-warm) |
| `/ws` | WebSocket | Main analysis pipeline |
| `/magic-fix` | POST | Product recommendations |
| `/visualise-fix` | POST | FLUX outfit visualisation |
| `/docs` | GET | Swagger UI |

### POST /magic-fix
```json
{
  "verdict": { "primary_issue": "...", "fix": "..." },
  "garments": [{ "garment": "leather jacket", "confidence": 0.85 }],
  "occasion": "casual"
}
```

### POST /visualise-fix
```json
{
  "fix": "swap white sneakers for chelsea boots",
  "garment": "white sneakers",
  "occasion": "casual"
}
```

---

## Performance Optimisations

| Optimisation | Impact |
|-------------|--------|
| Image resize to 224×224 before CLIP | 3× faster inference |
| Result caching (MD5 key) | $0 cost on repeat uploads |
| Slim data to OpenAI (top 5 garments, top 5 similar) | 87% token reduction |
| Removed self-check second API call | 50% fewer OpenAI calls |
| WebSocket pre-warm on Screen 1 load | Eliminates cold start delay |
| Auto-reconnect on dropped connection | Resilient to HF Space restarts |

---

## Dataset

The outfit index was built from the **Marqo/deepfashion-multimodal** dataset:

- 5,000+ outfit images indexed
- Each outfit: FashionCLIP 512-dim embedding + garment labels + occasion tag + Cloudinary image URL
- Stored in Neon PostgreSQL with pgvector extension
- Cosine similarity search at query time

---

## Deployment

### Backend (HuggingFace Spaces)

```bash
cd backend
git remote add hf https://huggingface.co/spaces/AhmadDurrani/vogue-vault-api
git push hf main
```

All secrets are stored in HuggingFace Space Settings → Secrets. Never commit `.env` to git.

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

Auto-deploys on push to main via GitHub Actions.

---

## What's Next

- [ ] GPU upgrade on HF Space for faster CLIP inference
- [ ] Expand outfit index from 5,000 to 50,000+
- [ ] Custom domain (stylecheck.app)
- [ ] Style Profile — aggregate insights from diagnosis history
- [ ] Occasion Score Preview — show score across all 4 occasions
- [ ] Amazon Product API integration for real product images in Magic Fix

---

## Author

**Ahmad Yar**  
Robotics & AI Engineer 
[LinkedIn](https://www.linkedin.com/in/ahmad-yar-98990690) · [HuggingFace](https://huggingface.co/AhmadDurrani)

---

## License

MIT License — see [LICENSE](LICENSE) for details.
