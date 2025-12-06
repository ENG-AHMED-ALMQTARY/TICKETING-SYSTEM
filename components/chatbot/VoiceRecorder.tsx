import React, { useState, useEffect } from 'react';
import { Mic, Square, Loader2, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  onRecordingComplete: (text: string) => void;
}

// Extend Window interface for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const { SpeechRecognition, webkitSpeechRecognition } = window as unknown as IWindow;
    const SpeechRecognitionAPI = SpeechRecognition || webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsRecording(true);
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onRecordingComplete(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
    }
  }, [onRecordingComplete]);

  const toggleRecording = () => {
    if (!isSupported) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  if (!isSupported) {
    return (
      <button 
        type="button" 
        disabled 
        className="p-2 text-slate-600 cursor-not-allowed"
        title="Voice input not supported"
      >
        <MicOff className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="relative">
      {isRecording && (
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-red-500 rounded-full"
        />
      )}
      <button
        type="button"
        onClick={toggleRecording}
        className={`relative z-10 p-2 rounded-full transition-colors ${
          isRecording ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-indigo-400'
        }`}
        title={isRecording ? "Stop listening" : "Start voice input"}
      >
        {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
      </button>
    </div>
  );
};