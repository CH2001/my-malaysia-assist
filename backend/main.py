"""
MyCity AI Assistant Backend
Malaysian Government Services AI Assistant using Lambda API

This backend proxies requests to the Lambda API:
https://gv4xpu0ks2.execute-api.us-east-1.amazonaws.com/chat

Requirements:
pip install fastapi uvicorn requests python-multipart aiofiles
"""

import json
import requests
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI(title="MyCity AI Assistant Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lambda API Configuration
LAMBDA_API_URL = "https://gv4xpu0ks2.execute-api.us-east-1.amazonaws.com/chat"

# Data models
class ChatRequest(BaseModel):
    type: str  # "text" or "audio_base64"
    session_id: str
    text: Optional[str] = None
    filename: Optional[str] = None
    language: Optional[str] = None
    audio_data: Optional[str] = None

@app.get("/")
async def root():
    return {
        "message": "MyCity AI Assistant Backend - Lambda Proxy",
        "version": "1.0.0",
        "description": "Malaysian Government Services AI Assistant using Lambda API",
        "lambda_api": LAMBDA_API_URL
    }

@app.post("/chat")
async def chat_completion(request: ChatRequest):
    """Proxy chat requests to Lambda API"""
    try:
        # Validate request
        if request.type == "text" and not request.text:
            raise HTTPException(status_code=400, detail="Text is required for text queries")
        
        # Prepare Lambda API request
        lambda_request = {
            "type": request.type,
            "session_id": request.session_id,
        }
        
        if request.type == "text":
            lambda_request["text"] = request.text
        elif request.type == "audio_base64":
            lambda_request["filename"] = request.filename
            lambda_request["language"] = request.language or "ms"
            lambda_request["audio_data"] = request.audio_data
        
        # Send request to Lambda API
        response = requests.post(LAMBDA_API_URL, json=lambda_request, timeout=30)
        
        if not response.ok:
            raise HTTPException(status_code=response.status_code, detail="Lambda API request failed")
        
        # Return Lambda API response
        return response.json()
        
    except requests.exceptions.RequestException as e:
        error_response = {
            "error": f"Lambda API connection error: {str(e)}",
            "meta": {
                "query_used": getattr(request, 'text', ''),
                "retries": 0,
                "session_id": getattr(request, 'session_id', '')
            }
        }
        return {"body": json.dumps(error_response)}
    except Exception as e:
        error_response = {
            "error": str(e),
            "meta": {
                "query_used": getattr(request, 'text', ''),
                "retries": 0,
                "session_id": getattr(request, 'session_id', '')
            }
        }
        return {"body": json.dumps(error_response)}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Lambda API connection
        test_request = {
            "type": "text",
            "session_id": "health-check",
            "text": "Hello"
        }
        response = requests.post(LAMBDA_API_URL, json=test_request, timeout=10)
        lambda_status = "connected" if response.ok else "failed"
    except:
        lambda_status = "failed"
    
    return {
        "status": "healthy",
        "lambda_api_status": lambda_status,
        "lambda_api_url": LAMBDA_API_URL
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)