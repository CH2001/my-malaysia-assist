import { ChatInterface } from '@/components/ChatInterface';
import logo from "@/assets/mycity-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="MyCity AI" className="w-10 h-10 rounded-lg shadow-lg" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MyCity AI Assistant
            </h1>
            <p className="text-xs text-muted-foreground">Pembantu Digital Warganegara Malaysia</p>
          </div>
        </div>
      </header>
      <div className="h-[calc(100vh-80px)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
