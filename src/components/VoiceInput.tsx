import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  isListening, 
  setIsListening 
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ms-MY'; // Malaysian language
      
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Mendengar...",
          description: "Sila bertutur sekarang. Saya akan mendengar dalam Bahasa Malaysia atau Inggeris.",
        });
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onTranscript(finalTranscript);
          setIsListening(false);
          toast({
            title: "Teks diterima!",
            description: `"${finalTranscript.substring(0, 50)}${finalTranscript.length > 50 ? '...' : ''}"`,
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Ralat semasa mendengar suara.";
        switch (event.error) {
          case 'network':
            errorMessage = "Tiada sambungan rangkaian untuk pengenalan suara.";
            break;
          case 'not-allowed':
            errorMessage = "Akses mikrofon dinafikan. Sila benarkan akses mikrofon.";
            break;
          case 'no-speech':
            errorMessage = "Tiada suara dikesan. Sila cuba lagi.";
            break;
        }
        
        toast({
          title: "Ralat Suara",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onTranscript, setIsListening]);

  const toggleListening = () => {
    if (!isSupported) {
      toast({
        title: "Tidak Disokong",
        description: "Pelayar anda tidak menyokong pengenalan suara. Sila gunakan Chrome atau Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        
        // Auto-stop after 10 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 10000);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Ralat",
          description: "Gagal memulakan pengenalan suara. Sila cuba lagi.",
          variant: "destructive",
        });
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`absolute right-2 top-2 h-8 w-8 p-0 ${
        isListening 
          ? 'text-destructive hover:text-destructive/80 bg-destructive/10 hover:bg-destructive/20' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
      onClick={toggleListening}
      title={isListening ? "Hentikan rakaman" : "Mula rakaman suara"}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};