
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Volume2,
  Settings,
  Download,
  Edit,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const VoiceToTextInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const intervalRef = useRef(null);

  const activeTranscriptions = [
    {
      id: 1,
      speaker: 'Dr. Smith',
      status: 'recording',
      duration: '02:34',
      confidence: 94.2,
      text: 'Patient presents with acute onset chest pain radiating to left arm. Blood pressure elevated at 160 over 95. EKG shows ST elevation in leads V2 through V4...'
    },
    {
      id: 2,
      speaker: 'Nurse Johnson',
      status: 'completed',
      duration: '01:47',
      confidence: 97.8,
      text: 'Vital signs stable. Temperature 98.6, pulse 72, respirations 16. Patient reports pain level of 3 out of 10. Administered ordered medications...'
    }
  ];

  const medicalTerms = [
    'Hypertension', 'Myocardial Infarction', 'Electrocardiogram', 'Stethoscope',
    'Auscultation', 'Palpitation', 'Dyspnea', 'Tachycardia', 'Bradycardia'
  ];

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setTranscription('');
    
    // Simulate real-time transcription
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
      
      // Simulate incoming transcription
      if (Math.random() > 0.7) {
        const samplePhrases = [
          'Patient presents with ',
          'chief complaint of ',
          'blood pressure ',
          'heart rate ',
          'temperature ',
          'examination reveals ',
          'assessment and plan '
        ];
        const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        setTranscription(prev => prev + randomPhrase);
        setConfidence(85 + Math.random() * 15);
      }
    }, 2000);
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      clearInterval(intervalRef.current);
    } else {
      startRecording();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    setIsProcessing(true);
    
    // Simulate final processing
    setTimeout(() => {
      setIsProcessing(false);
      setTranscription(prev => prev + '\n\n[Final processed transcription with medical vocabulary corrections]');
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Recording
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recording Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                <div>
                  <div className="font-medium">
                    {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready to Record'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isRecording && `Duration: ${formatTime(recordingTime)}`}
                    {confidence > 0 && ` • Confidence: ${confidence.toFixed(1)}%`}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={pauseRecording}
                      className="flex items-center gap-2"
                    >
                      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={stopRecording}
                      className="flex items-center gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Live Transcription */}
            {(isRecording || transcription) && (
              <div className="border rounded-lg p-4 min-h-32 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Live Transcription</h4>
                  {isProcessing && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  )}
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {transcription || (isRecording ? 'Listening...' : 'No transcription yet')}
                </div>
              </div>
            )}

            {/* Medical Vocabulary Recognition */}
            <div className="space-y-2">
              <h4 className="font-medium">Recognized Medical Terms</h4>
              <div className="flex flex-wrap gap-2">
                {medicalTerms.slice(0, 6).map((term, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-50"
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Transcriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Transcriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTranscriptions.map((transcription) => (
              <div key={transcription.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {transcription.status === 'recording' ? (
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <span className="font-medium">{transcription.speaker}</span>
                    </div>
                    <Badge variant={transcription.status === 'recording' ? 'destructive' : 'default'}>
                      {transcription.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{transcription.duration}</span>
                    <span className="text-sm text-green-600">{transcription.confidence}% accuracy</span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="text-gray-700 text-sm line-clamp-2">
                  {transcription.text}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings and Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Recognition Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <select className="w-full p-2 border rounded">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <select className="w-full p-2 border rounded">
                <option>General Medicine</option>
                <option>Cardiology</option>
                <option>Radiology</option>
                <option>Surgery</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Audio Quality</label>
              <select className="w-full p-2 border rounded">
                <option>High (32kHz)</option>
                <option>Medium (16kHz)</option>
                <option>Low (8kHz)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Auto-punctuation</label>
              <select className="w-full p-2 border rounded">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
