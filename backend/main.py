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
from urllib.parse import quote

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
    type: str  # "text" or "audio_base64"
    session_id: str
    text: Optional[str] = None
    filename: Optional[str] = None
    language: Optional[str] = None
    audio_data: Optional[str] = None

class JourneyRequest(BaseModel):
    origin: str
    destination: str
    mode: str = "public_transport"  # public_transport, driving, walking

class ActionItem(BaseModel):
    type: str  # "link"
    subtype: str  # "map", "website"
    label: str
    url: str

class SourceItem(BaseModel):
    title: str
    url: str

class ChatResponse(BaseModel):
    answer: str
    actions: List[ActionItem]
    sources: List[SourceItem]
    meta: Dict

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
    
    async def search_web(self, query: str) -> Dict:
        """Search web for relevant information using mock data"""
        # In production, you would integrate with Tavily API or similar
        # For now, return mock search results based on common queries
        
        search_results = {
            "sources": [],
            "context": ""
        }
        
        query_lower = query.lower()
        
        if "cafe" in query_lower and "cyberjaya" in query_lower:
            search_results["sources"] = [
                {
                    "title": "THE 10 BEST Cafés in Cyberjaya (Updated 2025) - Tripadvisor",
                    "url": "https://www.tripadvisor.com/Restaurants-g298312-c8-Cyberjaya_Sepang_District_Selangor.html"
                },
                {
                    "title": "September, 2025 - Laptop Friendly Cafes In Cyberjaya - UPDATED",
                    "url": "https://laptopfriendlycafe.com/cities/cyberjaya"
                }
            ]
            search_results["context"] = "Based on available information, Cyberjaya has several cafes with The Botanist being the highest-rated option."
        
        return search_results

    async def get_cerebras_response(self, query: str, session_id: str, context: str = "") -> str:
        """Get response from Cerebras API with enhanced context"""
        try:
            # Mock Cerebras API call - in production, use actual API
            system_prompt = f"""You are MyCity AI Assistant, specifically designed for Cyberjaya and Malaysia. 
            You help with:
            1. Local recommendations and information about Cyberjaya
            2. Malaysian government services and processes
            3. Journey planning within Malaysia
            4. General citizen inquiries

            Context from web search: {context}
            
            Provide detailed, helpful responses with specific recommendations.
            Include practical details like ratings, locations, and tips when available.
            Format your response in markdown with clear sections and bullet points."""
            
            # For demo purposes, return structured response based on query
            if "cafe" in query.lower() and "cyberjaya" in query.lower():
                return """Based on the available information, Cyberjaya has several cafes with The Botanist being the highest-rated option. However, the laptop-friendly cafe source appears to require access to view specific recommendations.

## Top Cafes in Cyberjaya:

• **The Botanist** - Highest rated at 4.7/5 with 27 reviews, categorized as cafe with quick bites

• **Monjo Coffee** - Rated 3.8/5 with 40 reviews on TripAdvisor

• **Starbucks** - Rated 3.7/5 with 49 reviews, chain known for accommodating laptop users

• **It's A Grind** - Listed among top cafes on TripAdvisor (full rating not shown in context)

## Unknowns to check:
• Specific cafe names from the laptop-friendly source (appears login-gated)
• Wi-Fi quality and speed at each location
• Power outlet availability and placement
• Operating hours for each cafe
• Seating arrangements suitable for laptop work
• Noise levels during different times

**Pro tip:** The laptop-friendly cafe source mentions hand-picked cafes with comfortable seating, high-speed Wi-Fi, and power outlets, but requires direct access to view the actual recommendations."""
            
            return f"I understand you're asking about: {query}. As MyCity AI Assistant, I'm here to help with information about Cyberjaya and Malaysia. How can I assist you further?"
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI response error: {str(e)}")

    def generate_actions(self, query: str) -> List[ActionItem]:
        """Generate relevant actions based on the query"""
        actions = []
        query_lower = query.lower()
        
        if "cafe" in query_lower and "cyberjaya" in query_lower:
            actions.extend([
                ActionItem(
                    type="link",
                    subtype="map",
                    label="Open in Google Maps",
                    url=f"https://www.google.com/maps/search/?api=1&query={quote(query)}"
                ),
                ActionItem(
                    type="link",
                    subtype="website",
                    label="THE 10 BEST Cafés in Cyberjaya (Updated 2025) - Tripadvisor",
                    url="https://www.tripadvisor.com/Restaurants-g298312-c8-Cyberjaya_Sepang_District_Selangor.html"
                ),
                ActionItem(
                    type="link",
                    subtype="map",
                    label="Map: THE 10 BEST Cafés in Cyberjaya",
                    url="https://www.google.com/maps/search/?api=1&query=THE%2010%20BEST%20Caf%C3%A9s%20in%20Cyberjaya%20Cyberjaya"
                ),
                ActionItem(
                    type="link",
                    subtype="map",
                    label="Map: September, 2025",
                    url="https://www.google.com/maps/search/?api=1&query=September%2C%202025%20Cyberjaya"
                )
            ])
        else:
            # Default map action for general queries
            actions.append(ActionItem(
                type="link",
                subtype="map",
                label="Open in Google Maps",
                url=f"https://www.google.com/maps/search/?api=1&query={quote(query)}"
            ))
        
        return actions
    
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
    """Handle chat completion requests in Lambda API format"""
    try:
        # Validate request
        if request.type == "text" and not request.text:
            raise HTTPException(status_code=400, detail="Text is required for text queries")
        
        query = request.text if request.type == "text" else ""
        
        # Search web for context
        search_results = await assistant.search_web(query)
        
        # Get AI response
        ai_response = await assistant.get_cerebras_response(
            query, 
            request.session_id,
            search_results.get("context", "")
        )
        
        # Generate actions
        actions = assistant.generate_actions(query)
        
        # Return response in Lambda API format
        response = ChatResponse(
            answer=ai_response,
            actions=actions,
            sources=search_results.get("sources", []),
            meta={
                "query_used": query,
                "retries": 0,
                "session_id": request.session_id
            }
        )
        
        return {"body": json.dumps(response.dict())}
        
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