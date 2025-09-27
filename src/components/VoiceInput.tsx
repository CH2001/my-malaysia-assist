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
  const [useWebAPI, setUseWebAPI] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if OpenAI API key is available for Whisper API
    const openaiApiKey = localStorage.getItem('openai_api_key');
    
    // Check if browser speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (openaiApiKey || SpeechRecognition) {
      setIsSupported(true);
      setUseWebAPI(!openaiApiKey); // Use web API if no OpenAI key
      
      if (!openaiApiKey && SpeechRecognition) {
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
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onTranscript, setIsListening]);

  const transcribeWithWhisper = async (audioBlob: Blob) => {
    const openaiApiKey = localStorage.getItem('openai_api_key');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'ms'); // Malaysian language

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    return result.text;
  };

  const startWhisperRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          toast({
            title: "Memproses audio...",
            description: "Sedang menukar audio kepada teks...",
          });
          
          const transcript = await transcribeWithWhisper(audioBlob);
          onTranscript(transcript);
          setIsListening(false);
          
          toast({
            title: "Teks diterima!",
            description: `"${transcript.substring(0, 50)}${transcript.length > 50 ? '...' : ''}"`,
          });
        } catch (error) {
          console.error('Whisper transcription error:', error);
          setIsListening(false);
          toast({
            title: "Ralat Transkripsi",
            description: "Gagal menukar audio kepada teks. Sila cuba lagi.",
            variant: "destructive",
          });
        }
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      setIsListening(true);
      mediaRecorderRef.current.start();
      
      toast({
        title: "Mendengar...",
        description: "Sila bertutur sekarang. Menggunakan Whisper API untuk pengenalan suara.",
      });

      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsListening(false);
      toast({
        title: "Ralat Mikrofon",
        description: "Gagal mengakses mikrofon. Sila benarkan akses mikrofon.",
        variant: "destructive",
      });
    }
  };

  const toggleListening = () => {
    if (!isSupported) {
      toast({
        title: "Tidak Disokong",
        description: "Pengenalan suara tidak tersedia. Sila tetapkan kunci API OpenAI atau gunakan pelayar yang menyokong.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      if (useWebAPI && recognitionRef.current) {
        recognitionRef.current.stop();
      } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (useWebAPI && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          
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
      } else {
        startWhisperRecording();
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