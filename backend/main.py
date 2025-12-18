from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents import WeatherAgent
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI(
    title="Weather Assistant API",
    description="AI-powered weather assistant backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

weather_agent = WeatherAgent()

# -----------------------------
# Conversation Memory (SAFE)
# -----------------------------
conversation_memory = {
    "last_city": None
}

# -----------------------------
# Models
# -----------------------------

class QueryRequest(BaseModel):
    query: str


class WeatherInsights(BaseModel):
    temperature: str
    rain: str
    advice: str
    clothing: str
    caution: str


class QueryResponse(BaseModel):
    response: str
    weather_type: str | None = None
    insights: WeatherInsights | None = None
    success: bool
    error: str | None = None


# -----------------------------
# Utility: Detect Weather Type
# -----------------------------

def detect_weather_type(text: str) -> str:
    text = text.lower()

    if "clear" in text or "sunny" in text:
        return "clear"
    if "rain" in text or "drizzle" in text or "shower" in text:
        return "rain"
    if "cloud" in text or "overcast" in text:
        return "cloudy"
    if "smoke" in text or "haze" in text or "mist" in text:
        return "smoke"
    if "snow" in text:
        return "snow"

    return "default"


# -----------------------------
# Routes
# -----------------------------

@app.get("/")
async def root():
    return {"message": "Weather Assistant API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        if not request.query or not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")

        query = request.query

        # 🔹 Conversation memory (non-breaking)
        if conversation_memory["last_city"] and "weather" not in query.lower():
            query = f"{query} in {conversation_memory['last_city']}"

        response_text = await weather_agent.process_query(query)

        weather_type = detect_weather_type(response_text)

        # 🔹 Extract city name (safe heuristic)
        for word in response_text.split():
            if word.istitle():
                conversation_memory["last_city"] = word
                break

        # 🔹 Simple AI insight layer (safe defaults)
        insights = WeatherInsights(
            temperature="Moderate",
            rain="Rain expected" if weather_type == "rain" else "Low chance",
            advice="Carry an umbrella" if weather_type == "rain" else "No special advice",
            clothing="Light cotton clothing recommended",
            caution="Stay hydrated" if weather_type == "clear" else "No major caution"
        )

        return QueryResponse(
            response=response_text,
            weather_type=weather_type,
            insights=insights,
            success=True,
            error=None,
        )

    except HTTPException as http_error:
        return QueryResponse(
            response="",
            weather_type=None,
            insights=None,
            success=False,
            error=http_error.detail,
        )

    except Exception as e:
        return QueryResponse(
            response="",
            weather_type=None,
            insights=None,
            success=False,
            error=str(e),
        )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
