// API integration for MyCity AI Assistant Backend
// This file provides functions to connect with the Python backend

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  response: string;
  structured_data?: any;
  response_type: 'general' | 'government_service' | 'journey';
  suggestions: string[];
  timestamp: string;
}

interface JourneyRequest {
  origin: string;
  destination: string;
  mode?: string;
}

interface GovernmentService {
  id: string;
  name: string;
  department: string;
  process_steps: string[];
  required_documents: string[];
  fees: string;
  processing_time: string;
  contact: string;
  online_link?: string;
}

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export class MyCityAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Send chat message to AI assistant
   */
  async sendChatMessage(
    messages: ChatMessage[], 
    userLocation?: { lat: number; lng: number }
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          api_key: this.apiKey,
          user_location: userLocation,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat API error:', error);
      throw new Error('Failed to send message. Please check your connection and API key.');
    }
  }

  /**
   * Plan journey between two locations
   */
  async planJourney(request: JourneyRequest): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/journey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Journey planning failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Journey API error:', error);
      throw new Error('Failed to plan journey. Please try again.');
    }
  }

  /**
   * Get list of available government services
   */
  async getGovernmentServices(): Promise<{ services: GovernmentService[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Services API error:', error);
      throw new Error('Failed to fetch government services.');
    }
  }

  /**
   * Get detailed information about a specific government service
   */
  async getServiceDetails(serviceId: string): Promise<GovernmentService> {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch service details: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Service details API error:', error);
      throw new Error('Failed to fetch service details.');
    }
  }

  /**
   * Get current public transport status
   */
  async getTransportStatus(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/transport/status`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transport status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Transport status API error:', error);
      throw new Error('Failed to fetch transport status.');
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Utility functions for local storage API key management
export const apiKeyStorage = {
  get: (): string | null => {
    return localStorage.getItem('cerebras_api_key');
  },
  
  set: (apiKey: string): void => {
    localStorage.setItem('cerebras_api_key', apiKey);
  },
  
  remove: (): void => {
    localStorage.removeItem('cerebras_api_key');
  },
  
  exists: (): boolean => {
    return !!localStorage.getItem('cerebras_api_key');
  }
};

// Create API instance with stored API key
export const createMyCityAPI = (): MyCityAPI | null => {
  const apiKey = apiKeyStorage.get();
  if (!apiKey) {
    return null;
  }
  return new MyCityAPI(apiKey);
};

export type { ChatMessage, ChatResponse, JourneyRequest, GovernmentService };