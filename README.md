 """# AI Weather Assistant

An AI-powered Weather Assistant built using FastAPI, LangChain, and React that provides intelligent weather insights with a modern, dynamic user interface.

This project goes beyond basic weather applications by combining large language model reasoning, tool-based weather data retrieval, and responsive UI design.

---

## Project Demo

Watch the full demo on YouTube:

[AI Weather Assistant Demo](https://youtu.be/cbJtf-tMfUw?si=gRFOfj0-JBiSC2v5)


---

## Features

### AI Weather Intelligence
- Natural language weather queries (e.g. "Weather in Pune")
- Uses LangChain ReAct agent for reasoning
- Tool-based weather API integration

### Smart Weather Insight Cards
Instead of plain text responses, the AI returns structured insights:
- Temperature summary
- Rain advisory
- Clothing suggestions
- Health or travel caution

### Dynamic Weather-Based UI
The user interface adapts automatically based on weather conditions:
- Clear weather → warm gradient
- Rain → cool blue / dark tones
- Cloudy → neutral gray theme
- Smoke / haze → muted colors
- Snow → light minimal theme

### Animated Weather Effects
- Rain animation during rainy conditions
- Smooth UI transitions using Framer Motion

### Dark Mode
- Manual dark mode toggle
- Fully Tailwind CSS compatible

### Conversational Memory
- Maintains context across user queries
- Allows follow-up weather questions

---

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons

### Backend
- FastAPI
- LangChain
- OpenRouter LLM API
- OpenWeather API

---

## Architecture Overview

User  
↓  
React Frontend (Chat UI)  
↓  
FastAPI Backend (/query)  
↓  
LangChain ReAct Agent  
↓  
Weather Tool (API)  
↓  
AI Response + Weather Insights

---


## API Example

### Request
{
  "query": "Weather in Pune"
}

### Response
{
  "response": "Light rain expected today in Pune.",
  "weather_type": "rain",
  "insights": {
    "temperature": "Moderate",
    "rain": "Light showers",
    "advice": "Carry an umbrella",
    "clothing": "Light cotton clothing",
    "caution": "Avoid waterlogged areas"
  },
  "success": true,
  "error": null
}

---

## Running the Project Locally

### Backend
cd backend  
python -m venv venv  
venv\\Scripts\\activate  
pip install -r requirements.txt  
python main.py  

### Frontend
npm install  
npm run dev  

Open http://localhost:5173 in your browser.

---

## Environment Variables

Create a backend/.env file:

OPENROUTER_API_KEY=your_openrouter_key  
OPENWEATHER_API_KEY=your_openweather_key  

---

## Why This Project Stands Out

- Uses LLM agents instead of simple API calls
- Dynamic UI driven by backend intelligence
- Real-world full-stack AI architecture
- Strong demonstration of AI + frontend skills

---

## Author

Ayush Chorge  
Maharashtra, India
"""



p
