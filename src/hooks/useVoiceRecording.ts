import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface VoiceRecordingOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useVoiceRecording = (options: VoiceRecordingOptions = {}) => {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if speech recognition is supported
  const checkSupport = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      return true;
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
      return false;
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!checkSupport()) {
      toast.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = continuous;
    recognitionRef.current.interimResults = interimResults;
    recognitionRef.current.lang = language;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      toast.success('Recording started');
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      setTranscript(prev => prev + finalTranscript);
      setInterimTranscript(interim);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsRecording(false);
      
      switch (event.error) {
        case 'no-speech':
          toast.error('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          toast.error('Microphone not accessible. Please check permissions.');
          break;
        case 'not-allowed':
          toast.error('Microphone permission denied. Please allow microphone access.');
          break;
        default:
          toast.error('Speech recognition error. Please try again.');
      }
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (transcript.trim()) {
        toast.success('Recording completed');
      }
    };

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Failed to start recording');
      toast.error('Failed to start recording');
    }
  }, [checkSupport, continuous, interimResults, language, transcript]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  const getFinalTranscript = useCallback(() => {
    return transcript + (interimTranscript ? ' ' + interimTranscript : '');
  }, [transcript, interimTranscript]);

  return {
    isRecording,
    isSupported,
    transcript: getFinalTranscript(),
    interimTranscript,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    checkSupport
  };
};
