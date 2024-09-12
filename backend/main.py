import uuid

import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from requests import Response

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXTERNAL_API_URL = "<API_KEY_INTEGRATION_URL>"
API_KEY = "<API_KEY>"


class QuestionRequest(BaseModel):
    question: str


@app.post("/ask")
async def ask_question(question_request: QuestionRequest):
    session_id = str(uuid.uuid4())
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "question": question_request.question,
        "sessionId": session_id
    }

    try:
        response: Response
        response = requests.post(
            EXTERNAL_API_URL, json=payload, headers=headers)
        response.raise_for_status()
    except requests.HTTPError as exc:
        print(exc)
        raise HTTPException(
            status_code=response.status_code, detail=str(exc))
    except Exception as exc:
        print(exc)
        raise HTTPException(status_code=500, detail=str(exc))

    return response.json()
