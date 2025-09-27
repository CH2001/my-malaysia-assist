import { ChatInterface } from '@/components/ChatInterface';
import { SettingsModal } from '@/components/SettingsModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, Cloud, Sun, CloudRain } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from "@/assets/mycity-logo.png";
import malaysiaSkyline from "@/assets/malaysia-skyline.jpg";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  icon: string;
}

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // Using OpenWeatherMap API for Malaysian weather (Kuala Lumpur)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Kuala%20Lumpur,MY&appid=your_api_key&units=metric`
      );
      
      if (!response.ok) {
        // Fallback mock data for demo
        setWeather({
          temperature: 28,
          description: 'Partly Cloudy',
          location: 'Kuala Lumpur',
          icon: 'partly-cloudy'
        });
        return;
      }
      
      const data = await response.json();
      setWeather({
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        location: data.name,
        icon: data.weather[0].icon
      });
    } catch (error) {
      // Fallback mock data
      setWeather({
        temperature: 28,
        description: 'Partly Cloudy',
        location: 'Kuala Lumpur',
        icon: 'partly-cloudy'
      });
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('rain') || iconCode.includes('drizzle')) {
      return <CloudRain className="h-4 w-4 text-cyan-400" />;
    } else if (iconCode.includes('cloud')) {
      return <Cloud className="h-4 w-4 text-cyan-400" />;
    } else {
      return <Sun className="h-4 w-4 text-yellow-400" />;
    }
  };
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Malaysia Skyline Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${malaysiaSkyline})`,
          filter: 'blur(2px)'
        }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Glassmorphism header */}
      <header className="relative z-10 glass border-b border-white/20">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="MyCity AI" className="w-10 h-10 rounded-lg shadow-lg" />
            <div>
              <h1 className="text-xl font-bold text-white">
                MyCity AI Assistant
              </h1>
              <p className="text-xs text-white/70">Pembantu Digital Warganegara Malaysia</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Weather Indicator */}
            {weather && (
              <Card className="glass bg-white/10 border-cyan-400/30 p-2">
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(weather.icon)}
                  <div className="text-xs">
                    <p className="text-white font-medium">{weather.temperature}°C</p>
                    <p className="text-cyan-300 text-[10px]">{weather.location}</p>
                  </div>
                </div>
              </Card>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="text-white hover:bg-white/20 border border-white/20"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <div className="relative z-10 h-[calc(100vh-80px)]">
        <ChatInterface />
      </div>
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
