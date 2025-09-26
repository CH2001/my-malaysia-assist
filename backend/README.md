# MyCity AI Assistant Backend

A Python backend service for the Malaysian Government Services AI Assistant using Cerebras API.

## Features

- **AI Chat Integration**: Uses Cerebras API with Qwen-3-235B model
- **Malaysian Government Services**: Comprehensive information about passport renewal, MyKad, driving licenses, etc.
- **Journey Planning**: Integration with Malaysian public transport APIs (GTFS data)
- **Real-time Data**: Bus locations, traffic conditions, and transport status
- **Bilingual Support**: Responses in Bahasa Malaysia and English

## Setup

1. **Install Python Dependencies**
```bash
pip install -r requirements.txt
```

2. **Environment Variables**
Create a `.env` file:
```env
CEREBRAS_API_KEY=your_cerebras_api_key_here
GTFS_API_KEY=your_gtfs_api_key_here  # Optional
```

3. **Run the Server**
```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Chat Completion
```http
POST /chat
Content-Type: application/json

{
  "messages": [
    {"role": "user", "content": "How to renew passport in Malaysia?"}
  ],
  "api_key": "your_cerebras_api_key",
  "user_location": {"lat": 3.1390, "lng": 101.6869}
}
```

### Journey Planning
```http
POST /journey
Content-Type: application/json

{
  "origin": "KLCC",
  "destination": "KL Sentral",
  "mode": "public_transport"
}
```

### Government Services
```http
GET /services
GET /services/passport_renewal
```

### Transport Status
```http
GET /transport/status
```

## Malaysian Data Sources

### Government Services
- Immigration Department (Passport services)
- National Registration Department (MyKad)
- Road Transport Department (Driving licenses)
- Local councils (Business permits)

### Public Transport APIs
- **GTFS Static Data**: `https://developer.data.gov.my/realtime-api/gtfs-static`
- **Real-time Bus Locations**: `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana`
- **Traffic Images**: `https://api.data.gov.my/traffic-images/kl`

### Integration Examples

#### 1. Real GTFS Integration
```python
import requests

# Get GTFS static data
response = requests.get("https://developer.data.gov.my/realtime-api/gtfs-static")
gtfs_data = response.json()

# Process routes, stops, and schedules
routes = gtfs_data.get("routes", [])
stops = gtfs_data.get("stops", [])
```

#### 2. Real-time Bus Locations
```python
# Get live bus positions
bus_response = requests.get("https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana")
bus_locations = bus_response.json()
```

## Cerebras API Integration

The backend uses the Cerebras Cloud SDK for AI responses:

```python
from cerebras.cloud.sdk import Cerebras

client = Cerebras(api_key=os.environ.get("CEREBRAS_API_KEY"))

stream = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": "You are MyCity AI Assistant for Malaysian citizens..."
        },
        {
            "role": "user", 
            "content": "How to renew passport?"
        }
    ],
    model="qwen-3-235b-a22b-instruct-2507",
    stream=True,
    max_completion_tokens=20000,
    temperature=0.7,
    top_p=0.8
)
```

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloud Deployment
- **AWS**: Deploy on EC2 or ECS
- **Google Cloud**: Use Cloud Run or Compute Engine  
- **Azure**: Deploy on Container Instances or App Service

## Security Considerations

1. **API Key Management**: Store Cerebras API key securely
2. **CORS Configuration**: Configure for production domains
3. **Rate Limiting**: Implement request rate limiting
4. **Input Validation**: Sanitize all user inputs
5. **Logging**: Implement proper logging and monitoring

## Contributing

1. Follow Malaysian government data standards
2. Support both Bahasa Malaysia and English
3. Include proper error handling
4. Add tests for new features

## License

This project is intended for Malaysian government services and citizen assistance.