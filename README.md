# AI Dating Platform

An AI-powered dating and people networking platform designed to optimize for meaningful connections, deep compatibility, trust, and relationship quality rather than superficial swipes or engagement maximization.

---

## Foundation Architecture Overview

* **Frontend**: React 19 + TypeScript + Vite.
* **Backend**: Python FastAPI with async I/O.
* **AI Integration**: Google Gemini API via official `google-genai` SDK.
* **Database**: Dual-ready SQLAlchemy 2.0 configuration (SQLite locally, zero-code transition to PostgreSQL).
* **Validation & Settings**: Pydantic v2 and `pydantic-settings`.
* **Security**: Absolute secret isolation (AI keys and secrets reside strictly server-side), strict CORS, and structured error responses.

---

## Repository Structure

```text
ai-dating-platform/
├── docs/                 # Architectural specifications and setup guides
│   ├── ARCHITECTURE.md   # System architecture, database migration, and design roadmap
│   └── SETUP.md          # Step-by-step Windows/cross-platform setup instructions
├── prompts/              # Centralized prompt engineering assets
│   └── profile_intelligence_v1.md  # Tested Gemini Profile Intelligence prompt
├── backend/              # Python FastAPI REST service
│   ├── app/              # Application source (core, db, api, schemas, services)
│   │   ├── api/          # REST endpoints (health, profile_intelligence)
│   │   ├── core/         # Settings, logging, and security
│   │   ├── db/           # SQLAlchemy database session and models
│   │   ├── schemas/      # Pydantic schemas and response models
│   │   └── services/     # Business logic & AI integration (gemini_service.py)
│   ├── tests/            # Automated test suite (pytest + unittest.mock)
│   ├── .env.example      # Backend configuration template
│   └── requirements.txt  # Pinned backend dependencies
└── frontend/             # React 19 + TypeScript + Vite web client
    ├── src/              # Application source (api, components, types)
    ├── .env.example      # Frontend configuration template
    └── package.json      # Frontend dependencies and build scripts
```

---

## AI Feature: Profile Intelligence

The **AI Profile Intelligence** engine analyzes user-submitted raw profile texts to extract evidence-grounded insights:
1. **Personality Insights**: Behavioral traits supported by verbatim user citations.
2. **Core Values**: Principles, moral anchors, and beliefs.
3. **Interests & Lifestyle**: Hobbies, routines, activity levels, and passions.
4. **Relationship Expectations**: Partnership intentions and mutual effort standards.
5. **Communication Preferences**: Desired cadence, depth, and conversational tone.
6. **Personal Boundaries**: Expressed boundaries, comfort zones, and dealbreakers.
7. **Missing Information & Follow-Up Questions**: Constructive unknown areas with engaging follow-up prompts to enrich the profile.

### Obtaining a Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API key** (select an existing Google Cloud project or create a new one).
4. Copy the generated key and paste it into `backend/.env` under `GEMINI_API_KEY`.

---

## Quick Start (Windows)

### 1. Backend Setup & Startup
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Edit .env and insert your GEMINI_API_KEY if testing live API calls
pytest -v
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run build
npm run dev
```

---

## Testing Profile Intelligence API

### Automated Unit & Integration Tests (Mocked AI Responses)
All automated tests mock external Gemini API calls and consume **zero real API credits**:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pytest -v
```

The test suite covers:
- Successful analysis & nested JSON unpacking
- Empty profile submission handling (422 validation error)
- Malformed outer/inner Gemini JSON handling (502 Bad Gateway)
- Missing outer `response` envelope (502 Bad Gateway)
- Gemini API communication failure (502 Bad Gateway)
- Pydantic schema validation failures on AI output (502 Bad Gateway)
- Missing Gemini API configuration (500 Internal Server Error)
- Isolated parser verification (handling markdown code fences and whitespace)

### Manual Request Example (cURL / PowerShell)
Once FastAPI is running (`http://127.0.0.1:8000`):

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/profile-intelligence/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "profile_text": "I enjoy travelling, technology and football. I value honesty and meaningful conversations."
  }'
```

### Example Structured Response
```json
{
  "response": {
    "personality_insights": [
      {
        "trait": "Curious and tech-enthusiast",
        "evidence": "I enjoy technology and football",
        "confidence": "explicit"
      }
    ],
    "core_values": [
      {
        "value": "Honesty and Authenticity",
        "evidence": "I value honesty and meaningful conversations",
        "is_explicit": true
      }
    ],
    "interests_and_lifestyle": [
      {
        "interest": "Travelling",
        "category": "lifestyle",
        "evidence": "I enjoy travelling"
      },
      {
        "interest": "Football",
        "category": "sports",
        "evidence": "and football"
      }
    ],
    "relationship_expectations": [
      {
        "expectation": "Meaningful and authentic connection",
        "evidence": "meaningful conversations"
      }
    ],
    "communication_preferences": [
      {
        "preference": "Deep, meaningful conversations over small talk",
        "evidence": "meaningful conversations"
      }
    ],
    "personal_boundaries": [],
    "missing_information": {
      "unknown_aspects": [
        "Specific relationship goals (e.g. casual vs. long-term)"
      ],
      "recommended_follow_up_questions": [
        "What kind of travel destinations inspire you the most?"
      ]
    }
  }
}
```

For full details, see [docs/SETUP.md](file:///c:/Users/Anamika%20J/ai-dating-platform/docs/SETUP.md) and [docs/ARCHITECTURE.md](file:///c:/Users/Anamika%20J/ai-dating-platform/docs/ARCHITECTURE.md).
