"""
MyCity AI Assistant Backend
Malaysian Government Services AI Assistant using Cerebras API

This backend provides:
1. LLM processing with Cerebras API
2. Integration with Malaysian public APIs
3. Journey planning with GTFS data
4. Government process guidance

Requirements:
pip install fastapi uvicorn requests cerebras-cloud-sdk python-multipart aiofiles
"""

import os
import asyncio
import json
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Union
from dataclasses import dataclass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cerebras.cloud.sdk import Cerebras

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

# Data models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    api_key: str
    user_location: Optional[Dict[str, float]] = None  # {"lat": 3.1390, "lng": 101.6869}

class JourneyRequest(BaseModel):
    origin: str
    destination: str
    mode: str = "public_transport"  # public_transport, driving, walking

@dataclass
class MalaysianGovService:
    name: str
    department: str
    process_steps: List[str]
    required_documents: List[str]
    fees: str
    processing_time: str
    contact: str
    online_link: Optional[str] = None

class MyCityAIAssistant:
    def __init__(self):
        self.gov_services = self._load_government_services()
        self.public_transport_apis = {
            "gtfs_static": "https://developer.data.gov.my/realtime-api/gtfs-static",
            "bus_location": "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana",
            "kl_traffic": "https://api.data.gov.my/traffic-images/kl"
        }
    
    def _load_government_services(self) -> Dict[str, MalaysianGovService]:
        """Load Malaysian government services information"""
        return {
            "passport_renewal": MalaysianGovService(
                name="Passport Renewal",
                department="Immigration Department of Malaysia",
                process_steps=[
                    "Fill out online application at Immigration Malaysia website",
                    "Pay fees: RM200 (adults), RM100 (children)",
                    "Book appointment at nearest Immigration office",
                    "Attend appointment with required documents",
                    "Collect new passport after 3-5 working days"
                ],
                required_documents=[
                    "Old passport",
                    "MyKad (original & photocopy)",
                    "Passport-sized photographs (2 pieces)"
                ],
                fees="RM200 (adults), RM100 (children)",
                processing_time="3-5 working days",
                contact="Immigration Department: 03-8880 1000",
                online_link="https://www.imi.gov.my"
            ),
            "mykad_renewal": MalaysianGovService(
                name="MyKad Renewal",
                department="National Registration Department (JPN)",
                process_steps=[
                    "Visit any JPN office",
                    "Fill out form JPN.KP02",
                    "Pay RM10 fee",
                    "Submit required documents",
                    "Collect new MyKad same day (1 hour processing)"
                ],
                required_documents=[
                    "Old/damaged MyKad",
                    "Birth certificate (original)",
                    "Passport-sized photograph (1 piece)"
                ],
                fees="RM10",
                processing_time="Same day (1 hour)",
                contact="JPN Hotline: 03-8880 7077",
                online_link="https://www.jpn.gov.my"
            ),
            "driving_license": MalaysianGovService(
                name="Driving License Renewal",
                department="Road Transport Department (JPJ)",
                process_steps=[
                    "Visit JPJ office or authorized center",
                    "Fill application form",
                    "Pay renewal fees",
                    "Update photo if required",
                    "Collect renewed license"
                ],
                required_documents=[
                    "Current driving license",
                    "MyKad",
                    "Medical certificate (if over 65)"
                ],
                fees="RM30 (motorcycle), RM150 (car)",
                processing_time="Same day",
                contact="JPJ Hotline: 03-8000 8000",
                online_link="https://www.jpj.gov.my"
            )
        }
    
    async def get_cerebras_response(self, messages: List[ChatMessage], api_key: str) -> str:
        """Get response from Cerebras API"""
        try:
            client = Cerebras(api_key=api_key)
            
            # Prepare messages for Cerebras
            cerebras_messages = [
                {
                    "role": msg.role,
                    "content": msg.content
                }
                for msg in messages
            ]
            
            # Add system message for Malaysian context
            system_message = {
                "role": "system",
                "content": """You are MyCity AI Assistant, a helpful AI assistant for Malaysian citizens. 
                You help with:
                1. Malaysian government services and processes
                2. Journey planning within Malaysia  
                3. General citizen inquiries
                
                Always respond in both Bahasa Malaysia and English when appropriate.
                Be helpful, accurate, and provide step-by-step guidance.
                Include relevant contact information and official links when available."""
            }
            
            cerebras_messages.insert(0, system_message)
            
            # Create completion
            stream = client.chat.completions.create(
                messages=cerebras_messages,
                model="qwen-3-235b-a22b-instruct-2507",
                stream=True,
                max_completion_tokens=20000,
                temperature=0.7,
                top_p=0.8
            )
            
            # Collect streamed response
            response_text = ""
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    response_text += chunk.choices[0].delta.content
            
            return response_text
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Cerebras API error: {str(e)}")
    
    async def get_transport_data(self, origin: str, destination: str) -> Dict:
        """Get public transport data from Malaysian APIs"""
        try:
            # In a real implementation, you would:
            # 1. Geocode origin and destination
            # 2. Query GTFS data for routes
            # 3. Get real-time updates
            # 4. Calculate journey options
            
            # Mock response for demonstration
            return {
                "routes": [
                    {
                        "mode": "LRT",
                        "line": "Kelana Jaya Line",
                        "duration": "25 minutes",
                        "steps": [
                            f"Walk to nearest LRT station from {origin}",
                            "Take Kelana Jaya Line towards Gombak",
                            "Transfer at Masjid Jamek to Ampang Line",
                            f"Alight at station nearest to {destination}"
                        ],
                        "fare": "RM 2.50 - RM 4.20",
                        "next_departure": "5 minutes"
                    }
                ],
                "traffic_info": "Moderate traffic conditions",
                "last_updated": datetime.now().isoformat()
            }
        except Exception as e:
            return {"error": f"Transport data unavailable: {str(e)}"}
    
    def get_government_service_info(self, service_query: str) -> Optional[MalaysianGovService]:
        """Get information about Malaysian government services"""
        query_lower = service_query.lower()
        
        for key, service in self.gov_services.items():
            if any(term in query_lower for term in [
                key.replace("_", " "), 
                service.name.lower(),
                service.department.lower()
            ]):
                return service
        return None
    
    async def process_citizen_query(self, query: str, user_location: Optional[Dict] = None) -> Dict:
        """Process citizen query and provide structured response"""
        query_lower = query.lower()
        response = {
            "type": "general",
            "content": "",
            "structured_data": None,
            "suggestions": []
        }
        
        # Check for government services
        if any(term in query_lower for term in ["passport", "mykad", "license", "permit", "renew"]):
            service = self.get_government_service_info(query)
            if service:
                response["type"] = "government_service"
                response["structured_data"] = {
                    "service_name": service.name,
                    "department": service.department,
                    "steps": service.process_steps,
                    "documents": service.required_documents,
                    "fees": service.fees,
                    "processing_time": service.processing_time,
                    "contact": service.contact,
                    "online_link": service.online_link
                }
        
        # Check for journey planning
        elif any(term in query_lower for term in ["how to go", "journey", "travel", "transport", "bus", "lrt", "mrt"]):
            # Extract origin and destination from query (simplified)
            if "from" in query_lower and "to" in query_lower:
                parts = query_lower.split("from")[1].split("to")
                if len(parts) >= 2:
                    origin = parts[0].strip()
                    destination = parts[1].strip()
                    transport_data = await self.get_transport_data(origin, destination)
                    response["type"] = "journey"
                    response["structured_data"] = transport_data
        
        response["suggestions"] = [
            "Ask about government services (passport, MyKad, license)",
            "Plan a journey (How to go from KLCC to KL Sentral?)",
            "Get information about Malaysian public services"
        ]
        
        return response

# Initialize the assistant
assistant = MyCityAIAssistant()

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "MyCity AI Assistant Backend",
        "version": "1.0.0",
        "description": "Malaysian Government Services AI Assistant"
    }

@app.post("/chat")
async def chat_completion(request: ChatRequest):
    """Handle chat completion requests"""
    try:
        # Process query for structured data
        if request.messages:
            last_message = request.messages[-1].content
            structured_response = await assistant.process_citizen_query(
                last_message, 
                request.user_location
            )
        
        # Get AI response from Cerebras
        ai_response = await assistant.get_cerebras_response(request.messages, request.api_key)
        
        return {
            "response": ai_response,
            "structured_data": structured_response.get("structured_data"),
            "response_type": structured_response.get("type", "general"),
            "suggestions": structured_response.get("suggestions", []),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/journey")
async def plan_journey(request: JourneyRequest):
    """Plan journey using Malaysian transport data"""
    try:
        transport_data = await assistant.get_transport_data(
            request.origin, 
            request.destination
        )
        return transport_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/services")
async def get_government_services():
    """Get list of available government services"""
    return {
        "services": [
            {
                "id": key,
                "name": service.name,
                "department": service.department,
                "fees": service.fees
            }
            for key, service in assistant.gov_services.items()
        ]
    }

@app.get("/services/{service_id}")
async def get_service_details(service_id: str):
    """Get detailed information about a specific government service"""
    service = assistant.gov_services.get(service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return {
        "id": service_id,
        "name": service.name,
        "department": service.department,
        "process_steps": service.process_steps,
        "required_documents": service.required_documents,
        "fees": service.fees,
        "processing_time": service.processing_time,
        "contact": service.contact,
        "online_link": service.online_link
    }

@app.get("/transport/status")
async def get_transport_status():
    """Get current public transport status"""
    # In real implementation, this would query live APIs
    return {
        "lrt_status": "Normal operations",
        "mrt_status": "Normal operations", 
        "bus_status": "Minor delays on certain routes",
        "last_updated": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)