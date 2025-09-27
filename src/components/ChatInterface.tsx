import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Send, Mic, MicOff, MapPin, FileText, Bot, User, Hospital, MapIcon, FileTextIcon } from 'lucide-react';
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
  callToActions?: CallToAction[];
}

interface CallToAction {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
  icon?: string;
}

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  icon: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Selamat datang ke MyCity AI Assistant! Sanya boleh membantu anda dengan perkhidmatan kerajaan Malaysia, pelan perjalanan, dan soalan am mengenai khidmat awam. Bagaimana saya boleh membantu anda hari ini?',
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callToActions, setCallToActions] = useState<CallToAction[]>([]);
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
        callToActions: response.callToActions,
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (response.callToActions) {
        setCallToActions(response.callToActions);
      }
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (input: string): { content: string; type: 'text' | 'journey' | 'process'; callToActions?: CallToAction[] } => {
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
        type: 'process',
        callToActions: [
          {
            id: '1',
            title: 'Borang Online',
            description: 'Isi borang permohonan pasport online',
            buttonText: 'Isi Borang',
            link: 'https://www.imi.gov.my',
            icon: 'FileText'
          },
          {
            id: '2',
            title: 'Cari Pejabat',
            description: 'Cari pejabat Imigresen berdekatan',
            buttonText: 'Cari Lokasi',
            link: 'https://www.imi.gov.my/portal2017/index.php/ms/senarai-pejabat.html',
            icon: 'MapPin'
          }
        ]
      };
    }

    if (lowerInput.includes('hospital') || lowerInput.includes('kesihatan') || lowerInput.includes('klinik')) {
      return {
        content: `**Hospital dan Klinik Berdekatan:**

Berikut adalah maklumat hospital awam dan klinik di Malaysia:

**Hospital Kerajaan:**
- Hospital Kuala Lumpur
- Hospital Selayang
- Hospital Sungai Buloh
- Hospital Putrajaya

**Klinik Kesihatan:**
- Klinik Kesihatan tersedia di setiap daerah
- Perkhidmatan 24 jam di hospital utama
- Nombor kecemasan: 999

**Rujukan:** [Portal MyHEALTH](https://myhealth.gov.my)`,
        type: 'process',
        callToActions: [
          {
            id: '3',
            title: 'Cari Hospital',
            description: 'Cari hospital terdekat dengan lokasi anda',
            buttonText: 'Cari Hospital',
            link: 'https://myhealth.gov.my/portal-myhealth/aplikasi-mobile/healthnow/',
            icon: 'Hospital'
          },
          {
            id: '4',
            title: 'Kecemasan',
            description: 'Nombor kecemasan dan maklumat penting',
            buttonText: 'Hubungi 999',
            link: 'tel:999',
            icon: 'Phone'
          }
        ]
      };
    }

    if (lowerInput.includes('event') || lowerInput.includes('acara') || lowerInput.includes('festival')) {
      return {
        content: `**Acara dan Festival di Malaysia:**

**Acara Terkini:**
- Festival Musim Buah Durian (Jun - Ogos)
- Malaysia International Fireworks Competition
- George Town Festival
- Rainforest World Music Festival

**Platform Acara:**
- Eventbrite Malaysia
- Facebook Events
- Meetup Malaysia

**Rujukan:** [Tourism Malaysia](https://www.malaysia.travel)`,
        type: 'journey',
        callToActions: [
          {
            id: '5',
            title: 'Cari Acara',
            description: 'Temui acara menarik di kawasan anda',
            buttonText: 'Lihat Acara',
            link: 'https://www.eventbrite.com/d/malaysia--kuala-lumpur/events/',
            icon: 'Calendar'
          },
          {
            id: '6',
            title: 'Festival Guide',
            description: 'Panduan lengkap festival di Malaysia',
            buttonText: 'Panduan Festival',
            link: 'https://www.malaysia.travel/explore/festivals-events',
            icon: 'Music'
          }
        ]
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

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
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
    <div className="flex h-full relative">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Siri Mascot, Welcome Message at the top */}
        <div className="flex-shrink-0 p-6 text-center border-b border-cyan-400/20">
          <SiriMascot isActive={isLoading || isListening} size="large" />
          <p className="mt-4 text-white text-lg font-medium max-w-md mx-auto">
            Selamat datang ke MyCity AI Assistant
          </p>
          <p className="mt-2 text-white/70 text-sm max-w-lg mx-auto">
            Saya boleh membantu anda dengan perkhidmatan kerajaan Malaysia, pelan perjalanan, dan soalan am mengenai khidmat awam.
          </p>
          
          {/* Suggestion Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick("Cari hospital terdekat")}
              className="bg-white/10 border-cyan-400/40 text-white hover:bg-cyan-500/20 transition-all duration-300"
            >
              <Hospital className="h-4 w-4 mr-2" />
              Cari Hospital
            </Button>
            <Button
              variant="outline" 
              size="sm"
              onClick={() => handleSuggestionClick("Jalan ke KLCC dari KL Sentral")}
              className="bg-white/10 border-cyan-400/40 text-white hover:bg-cyan-500/20 transition-all duration-300"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Panduan Jalan
            </Button>
            <Button
              variant="outline"
              size="sm" 
              onClick={() => handleSuggestionClick("Bagaimana nak renew pasport?")}
              className="bg-white/10 border-cyan-400/40 text-white hover:bg-cyan-500/20 transition-all duration-300"
            >
              <FileTextIcon className="h-4 w-4 mr-2" />
              Renew Dokumen
            </Button>
          </div>
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
                        {message.content.split('\n').map((line, index) => {
                          // Handle reference links specially
                          if (line.includes('**Rujukan:**') || line.includes('**Rujukan**') || line.includes('**Reference:**')) {
                            const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
                            if (linkMatch) {
                              const [, linkText, linkUrl] = linkMatch;
                              return (
                                <Card key={index} className="mt-3 mb-4 p-3 bg-cyan-500/10 border-cyan-400/40">
                                  <div className="flex items-center justify-center">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs bg-cyan-500/20 border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30"
                                      onClick={() => window.open(linkUrl, '_blank')}
                                    >
                                      {linkText}
                                    </Button>
                                  </div>
                                </Card>
                              );
                            }
                          }
                          
                          // Handle bold text formatting
                          const formatText = (text: string) => {
                            const parts = text.split(/(\*\*[^*]+\*\*)/g);
                            return parts.map((part, partIndex) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <strong key={partIndex} className="font-bold text-cyan-300">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return part;
                            });
                          };
                          
                          // Skip empty lines
                          if (!line.trim()) return null;
                          
                          return (
                            <p key={index} className={`${
                              message.sender === 'user' 
                                ? 'text-white' 
                                : 'text-white'
                            } ${index === 0 ? 'mt-0' : 'mt-1'}`}>
                              {formatText(line)}
                            </p>
                          );
                        })}
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

      {/* Call to Action Sidebar */}
      <div className="w-80 border-l border-cyan-400/20 bg-black/20 backdrop-blur-sm">
        <div className="p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-cyan-400" />
            Tindakan Disyorkan
          </h3>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-3">
              {callToActions.length > 0 ? (
                callToActions.map((action) => (
                  <Card key={action.id} className="glass bg-white/10 border-cyan-400/30 p-4 hover:bg-white/15 transition-all duration-300">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-white font-medium text-sm">{action.title}</h4>
                        <p className="text-white/70 text-xs mt-1">{action.description}</p>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 border border-cyan-400/40 text-white text-xs"
                        onClick={() => window.open(action.link, '_blank')}
                      >
                        {action.buttonText}
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">
                    Tindakan akan muncul di sini berdasarkan soalan anda
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};