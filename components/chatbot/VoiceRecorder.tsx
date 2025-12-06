import React, { useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  onRecordingComplete: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Mock completion
      setTimeout(() => onRecordingComplete("This is a simulated voice-to-text transcript."), 500);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="relative">
      {isRecording && (
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute inset-0 bg-red-500 rounded-full"
        />
      )}
      <button
        type="button"
        onClick={toggleRecording}
        className={`relative z-10 p-2 rounded-full transition-colors ${
          isRecording ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-indigo-400'
        }`}
      >
        {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
      </button>
    </div>
  );
};
