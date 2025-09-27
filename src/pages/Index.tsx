import { ChatInterface } from '@/components/ChatInterface';
import { SettingsModal } from '@/components/SettingsModal';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import logo from "@/assets/mycity-logo.png";
import malaysiaSkyline from "@/assets/malaysia-skyline.jpg";

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="text-white hover:bg-white/20 border border-white/20"
          >
            <Settings className="h-5 w-5" />
          </Button>
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
