import { ChatInterface } from '@/components/ChatInterface';
import logo from "@/assets/mycity-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <header className="flex items-center justify-center py-6 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="MyCity AI" className="w-12 h-12 rounded-lg shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MyCity AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground">Pembantu Digital Warganegara Malaysia</p>
          </div>
        </div>
      </header>
      <ChatInterface />
    </div>
  );
};

export default Index;
