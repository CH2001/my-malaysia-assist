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

// Configuration - Using Lambda API
const LAMBDA_API_URL = 'https://gv4xpu0ks2.execute-api.us-east-1.amazonaws.com/chat';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export class MyCityAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Send chat message to AI assistant using Lambda API
   */
  async sendChatMessage(
    text: string,
    sessionId: string = 'session-001'
  ): Promise<any> {
    try {
      const response = await fetch(LAMBDA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'text',
          session_id: sessionId,
          text: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Lambda API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Parse the body field which contains the actual response
      if (result.body) {
        const parsedBody = JSON.parse(result.body);
        return parsedBody;
      }
      
      return result;
    } catch (error) {
      console.error('Lambda API error:', error);
      throw new Error('Failed to send message to Lambda API.');
    }
  }

  /**
   * Send voice message to AI assistant using Lambda API
   */
  async sendVoiceMessage(
    audioData: string,
    filename: string,
    language: string = 'ms',
    sessionId: string = 'session-001'
  ): Promise<any> {
    try {
      const response = await fetch(LAMBDA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'audio_base64',
          session_id: sessionId,
          filename: filename,
          language: language,
          audio_data: audioData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Lambda API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Parse the body field which contains the actual response
      if (result.body) {
        const parsedBody = JSON.parse(result.body);
        return parsedBody;
      }
      
      return result;
    } catch (error) {
      console.error('Lambda Voice API error:', error);
      throw new Error('Failed to send voice message to Lambda API.');
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