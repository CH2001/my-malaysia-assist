import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Send, Mic, MicOff, MapPin, FileText, Bot, User } from 'lucide-react';
import { SettingsModal } from './SettingsModal';
import { VoiceInput } from './VoiceInput';
import { SiriMascot } from './SiriMascot';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'journey' | 'process';
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Selamat datang ke MyCity AI Assistant! Saya boleh membantu anda dengan perkhidmatan kerajaan Malaysia, pelan perjalanan, dan soalan am mengenai khidmat awam. Bagaimana saya boleh membantu anda hari ini?',
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response with Malaysian government context
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'assistant',
        timestamp: new Date(),
        type: response.type,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (input: string): { content: string; type: 'text' | 'journey' | 'process' } => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('passport') || lowerInput.includes('pasport')) {
      return {
        content: `**Proses Membaharui Pasport Malaysia:**

**Langkah 1:** Isi borang permohonan online di laman web Imigresen Malaysia
**Langkah 2:** Bayar yuran RM200 (dewasa) atau RM100 (kanak-kanak)
**Langkah 3:** Tempah temujanji di pejabat Imigresen berdekatan
**Langkah 4:** Hadiri temujanji dengan dokumen:
- Pasport lama
- MyKad (asal & salinan)
- Gambar berukuran pasport (2 keping)

**Tempoh pemprosesan:** 3-5 hari bekerja

**Rujukan:** [Portal Rasmi Jabatan Imigresen Malaysia](https://www.imi.gov.my)`,
        type: 'process'
      };
    }

    if (lowerInput.includes('mykad') || lowerInput.includes('ic') || lowerInput.includes('identity')) {
      return {
        content: `**Proses Membaharui MyKad:**

**Langkah 1:** Kunjungi mana-mana pejabat Jabatan Pendaftaran Negara (JPN)
**Langkah 2:** Isi borang JPN.KP02
**Langkah 3:** Bayar yuran RM10
**Langkah 4:** Serahkan dokumen:
- MyKad lama/rosak
- Sijil lahir (asal)
- Gambar berukuran pasport (1 keping)

**Tempoh pemprosesan:** 1 jam (selesai pada hari yang sama)

**Rujukan:** [Portal JPN](https://www.jpn.gov.my)`,
        type: 'process'
      };
    }

    if (lowerInput.includes('kuala lumpur') || lowerInput.includes('kl') || lowerInput.includes('journey') || lowerInput.includes('travel')) {
      return {
        content: `**Panduan Perjalanan ke Kuala Lumpur:**

**Dari KLIA/KLIA2:**
1. Naik KLIA Ekspres ke KL Sentral (28 minit)
2. Dari KL Sentral, sambung dengan:
   - LRT/MRT ke destinasi akhir
   - Grab/Taxi
   - Bas RapidKL

**Dari Stesen Bas:**
- TBS (Terminal Bersepadu Selatan): Naik LRT ke KL Sentral
- Pudu Sentral: Naik LRT Kelana Jaya Line

**Pilihan Transport Tempatan:**
- Touch 'n Go untuk semua transport awam
- MyRapid app untuk jadual bas & keretapi
- Grab untuk perjalanan point-to-point

**Rujukan:** [Prasarana Malaysia](https://www.prasarana.com.my)`,
        type: 'journey'
      };
    }

    // Default response
    return {
      content: `Saya memahami pertanyaan anda mengenai "${input}". Saya boleh membantu dengan:

🏛️ **Perkhidmatan Kerajaan:**
- Pembaharuan dokumen (MyKad, Pasport, Lesen)
- Proses permohonan permit dan lesen
- Maklumat agensi kerajaan

🗺️ **Panduan Perjalanan:**
- Petunjuk ke destinasi
- Transport awam
- Jadual bas & keretapi

💡 **Tips:** Cuba tanya "Bagaimana nak renew pasport?" atau "Jalan ke KLCC dari KL Sentral?"`,
      type: 'text'
    };
  };

  const handleVoiceInput = (transcript: string) => {
    setInputValue(transcript);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Siri Mascot and Welcome Message at the top */}
      <div className="flex-shrink-0 p-6 text-center">
        <SiriMascot isActive={isLoading || isListening} size="large" />
        <p className="mt-4 text-white text-lg font-medium max-w-md mx-auto">
          Selamat datang ke MyCity AI Assistant
        </p>
        <p className="mt-2 text-white/70 text-sm max-w-lg mx-auto">
          Saya boleh membantu anda dengan perkhidmatan kerajaan Malaysia, pelan perjalanan, dan soalan am mengenai khidmat awam.
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[80%] p-4 glass border-cyan-400/30 ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-white border-cyan-300/40' 
                  : 'bg-white/10 text-white border-white/20'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {message.sender === 'user' ? (
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                        <User className="h-4 w-4 text-cyan-300" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-cyan-400" />
                      </div>
                    )}
                  </div>
                  {message.sender === 'assistant' && message.type && (
                    <div className="mt-2">
                      {message.type === 'journey' && <MapPin className="h-4 w-4 text-cyan-400" />}
                      {message.type === 'process' && <FileText className="h-4 w-4 text-cyan-300" />}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                      {message.content.split('\n').map((line, index) => (
                        <p key={index} className={`${
                          message.sender === 'user' 
                            ? 'text-white' 
                            : 'text-white'
                        } ${index === 0 ? 'mt-0' : ''}`}>
                          {line}
                        </p>
                      ))}
                    </div>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' 
                        ? 'text-white/70' 
                        : 'text-white/60'
                    }`}>
                      {message.timestamp.toLocaleTimeString('ms-MY', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="glass bg-white/10 p-4 border-cyan-400/20">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-white/70">Sedang berfikir...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area with glassmorphism */}
      <div className="p-4 glass border-t border-cyan-400/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tanya saya tentang perkhidmatan kerajaan atau panduan perjalanan..."
                className="min-h-[60px] max-h-32 resize-none pr-16 bg-white/10 border-cyan-400/30 text-white placeholder:text-white/50 focus:border-cyan-300/60 focus:ring-cyan-400/20"
                disabled={isLoading}
              />
              {/* Voice Input Component */}
              <VoiceInput 
                onTranscript={handleVoiceInput}
                isListening={isListening}
                setIsListening={setIsListening}
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 border border-cyan-400/40 text-white disabled:opacity-50 cyan-glow"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};