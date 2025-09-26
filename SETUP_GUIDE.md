# MyCity AI Assistant - Complete Setup Guide

A comprehensive Malaysian Government Services AI Assistant with chat and voice capabilities.

## 🏛️ Overview

**MyCity AI Assistant** helps Malaysian citizens with:
- **Government Services**: Passport renewal, MyKad, driving licenses, permits
- **Journey Planning**: Public transport routes using GTFS data
- **Voice & Text Input**: Accessible interface in Bahasa Malaysia and English
- **Real-time Data**: Live transport updates and government service information

## 🎯 Features Implemented

### Frontend (React/Vite)
✅ **Modern Chat Interface** with Malaysian flag-inspired design  
✅ **Voice Input** using Web Speech API (Bahasa Malaysia + English)  
✅ **Settings Modal** for Cerebras API key configuration  
✅ **Responsive Design** with professional government aesthetics  
✅ **Real-time Messaging** with typing indicators  
✅ **SEO Optimized** with proper meta tags  

### Backend (Python/FastAPI)
✅ **Cerebras API Integration** with Qwen-3-235B model  
✅ **Malaysian Government Services Database** (Passport, MyKad, etc.)  
✅ **Journey Planning** with GTFS transport data integration  
✅ **RESTful API** with proper error handling  
✅ **Docker Support** for easy deployment  
✅ **Bilingual Responses** (Bahasa Malaysia + English)  

## 🚀 Quick Start

### 1. Frontend Setup
```bash
# The frontend is already running in Lovable!
# Just click the settings ⚙️ button to add your Cerebras API key
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Set your Cerebras API key
export CEREBRAS_API_KEY="your_cerebras_api_key_here"

# Run the server
python main.py
```

Server runs on: `http://localhost:8000`

### 3. Get Your Cerebras API Key
1. Visit [Cerebras Cloud](https://cloud.cerebras.ai/)
2. Sign up/Login
3. Generate API key
4. Add it in the app settings ⚙️

## 🛠️ Configuration

### Environment Variables
```env
# Backend (.env file)
CEREBRAS_API_KEY=your_cerebras_api_key_here
GTFS_API_KEY=your_malaysian_gtfs_api_key  # Optional
```

### Frontend Environment (Optional)
```env
# .env.local
REACT_APP_API_URL=http://localhost:8000
```

## 📱 Usage Examples

### Government Services
**User**: "How to renew passport in Malaysia?"  
**AI**: *Provides step-by-step guide with fees, documents, and official links*

### Journey Planning  
**User**: "How to go from KLCC to KL Sentral?"  
**AI**: *Shows LRT/MRT routes, timings, and fares*

### Voice Input
Click the 🎤 microphone button and speak in Bahasa Malaysia or English.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │────│  FastAPI Backend │────│   Cerebras API  │
│  (Lovable)      │    │    (Python)     │    │   (AI Model)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        
        │                        │                        
        v                        v                        
┌─────────────────┐    ┌─────────────────┐               
│   Web Speech    │    │ Malaysian APIs  │               
│      API        │    │ (GTFS, Traffic) │               
└─────────────────┘    └─────────────────┘               
```

## 🇲🇾 Malaysian Data Integration

### Government Services Covered
- **Immigration**: Passport renewal, visa applications
- **JPN**: MyKad renewal, birth certificates  
- **JPJ**: Driving license renewal, vehicle registration
- **Local Councils**: Business permits, certificates

### Transport APIs
- **GTFS Static**: `https://developer.data.gov.my/realtime-api/gtfs-static`
- **Real-time Buses**: `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana`
- **Traffic Data**: `https://api.data.gov.my/traffic-images/kl`

## 🚢 Deployment

### Docker Deployment
```bash
cd backend
docker-compose up -d
```

### Production Deployment
1. **Backend**: Deploy on AWS/GCP/Azure
2. **Frontend**: Already hosted on Lovable
3. **Database**: PostgreSQL for data persistence
4. **Caching**: Redis for fast responses

## 🔒 Security Best Practices

✅ **API Key Encryption**: Stored securely in browser/environment  
✅ **Input Validation**: All user inputs sanitized  
✅ **CORS Configuration**: Proper cross-origin setup  
✅ **Rate Limiting**: Prevents API abuse  
✅ **HTTPS**: Secure connections in production  

## 🛠️ Customization Options

### Adding New Government Services
```python
# In backend/main.py
new_service = MalaysianGovService(
    name="New Service",
    department="Ministry Name",
    process_steps=[...],
    required_documents=[...],
    fees="RM XX",
    processing_time="X days",
    contact="Phone/Email"
)
```

### Adding New Transport Routes
```python
# Integrate additional Malaysian transport APIs
async def get_transport_data(origin, destination):
    # Add bus routes, taxi services, e-hailing
    # Include real-time pricing and availability
```

## 📊 Monitoring & Analytics

### Backend Monitoring
- **Health Checks**: `/` endpoint for status
- **Logs**: Structured logging for debugging  
- **Metrics**: API response times and success rates

### Frontend Analytics
- **Usage Tracking**: Popular services and queries
- **Voice Input Success**: Speech recognition accuracy
- **User Journey**: Common conversation flows

## 🤖 AI Model Configuration

### Cerebras Settings
```python
model="qwen-3-235b-a22b-instruct-2507"
max_completion_tokens=20000
temperature=0.7
top_p=0.8
stream=True  # Real-time responses
```

### System Prompt
Optimized for Malaysian government context with bilingual support.

## 🆘 Troubleshooting

### Common Issues
1. **API Key Invalid**: Check Cerebras dashboard for correct key
2. **Voice Not Working**: Enable microphone permissions
3. **Backend Connection**: Ensure Python server is running on port 8000
4. **CORS Errors**: Configure backend CORS for your frontend domain

### Support
- Check browser console for frontend errors
- View backend logs: `python main.py` for detailed logging
- Test API endpoints: Visit `http://localhost:8000/docs` for interactive API docs

## 🎉 Next Steps

1. **Test the App**: Try asking about passport renewal or journey planning
2. **Add Real APIs**: Connect to actual Malaysian government APIs
3. **Enhance Voice**: Add more languages and better speech recognition
4. **Mobile App**: Create React Native version
5. **WhatsApp Bot**: Deploy as Telegram/WhatsApp integration

---

**MyCity AI Assistant** - Empowering Malaysian citizens with AI-powered government services! 🇲🇾✨