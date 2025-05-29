
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, Play, Pause, RotateCcw, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export const SurgeryCountdownTimer = () => {
  const [selectedSurgery, setSelectedSurgery] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);

  const activeSurgeries = [
    { id: 1, patient: 'John Doe', procedure: 'CABG', room: 'OT-1', startTime: '09:00', estimatedDuration: 240 },
    { id: 2, patient: 'Jane Smith', procedure: 'Hip Replacement', room: 'OT-2', startTime: '08:00', estimatedDuration: 180 },
    { id: 3, patient: 'Mike Wilson', procedure: 'Appendectomy', room: 'OT-3', startTime: '14:00', estimatedDuration: 120 },
  ];

  const surgeryPhases = [
    { name: 'Anesthesia Induction', duration: 30, color: 'bg-blue-500' },
    { name: 'Patient Positioning', duration: 15, color: 'bg-green-500' },
    { name: 'Surgical Prep & Draping', duration: 20, color: 'bg-yellow-500' },
    { name: 'Incision & Primary Surgery', duration: 120, color: 'bg-red-500' },
    { name: 'Closure', duration: 30, color: 'bg-purple-500' },
    { name: 'Anesthesia Reversal', duration: 25, color: 'bg-orange-500' },
  ];

  const [phaseTimers, setPhaseTimers] = useState(
    surgeryPhases.map(phase => ({ ...phase, elapsed: 0, completed: false }))
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && selectedSurgery) {
      interval = setInterval(() => {
        setPhaseTimers(prev => {
          const updated = [...prev];
          if (currentPhase < updated.length) {
            updated[currentPhase] = {
              ...updated[currentPhase],
              elapsed: Math.min(updated[currentPhase].elapsed + 1, updated[currentPhase].duration)
            };

            if (updated[currentPhase].elapsed >= updated[currentPhase].duration) {
              updated[currentPhase].completed = true;
              if (currentPhase < updated.length - 1) {
                setCurrentPhase(currentPhase + 1);
              }
            }
          }
          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, selectedSurgery, currentPhase]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalElapsed = () => {
    return phaseTimers.reduce((total, phase) => total + phase.elapsed, 0);
  };

  const getTotalDuration = () => {
    return surgeryPhases.reduce((total, phase) => total + phase.duration, 0);
  };

  const getOverallProgress = () => {
    return (getTotalElapsed() / getTotalDuration()) * 100;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhase(0);
    setPhaseTimers(surgeryPhases.map(phase => ({ ...phase, elapsed: 0, completed: false })));
  };

  const selectedSurgeryData = activeSurgeries.find(s => s.patient === selectedSurgery);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Timer className="h-6 w-6 text-orange-600" />
          Surgery Countdown Timer
        </h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsRunning(!isRunning)} 
            disabled={!selectedSurgery}
            className={isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeSurgeries.map(surgery => (
          <Card 
            key={surgery.id} 
            className={`cursor-pointer transition-all ${selectedSurgery === surgery.patient ? 'ring-2 ring-orange-500' : ''}`}
            onClick={() => setSelectedSurgery(surgery.patient)}
          >
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{surgery.patient}</h3>
                  <Badge variant="outline">{surgery.room}</Badge>
                </div>
                <p className="text-sm text-gray-600">{surgery.procedure}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Started: {surgery.startTime}</span>
                  <span className="text-gray-600">{surgery.estimatedDuration}min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSurgery && selectedSurgeryData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Overall Progress: {selectedSurgery}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {formatTime(getTotalElapsed())}
                  </div>
                  <div className="text-gray-600">
                    Estimated: {formatTime(getTotalDuration())} | Remaining: {formatTime(getTotalDuration() - getTotalElapsed())}
                  </div>
                </div>
                <Progress value={getOverallProgress()} className="h-4" />
                <div className="text-center text-sm text-gray-600">
                  {Math.round(getOverallProgress())}% Complete
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Phase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-orange-600">
                    {currentPhase < surgeryPhases.length ? surgeryPhases[currentPhase].name : 'Surgery Complete'}
                  </h3>
                  {currentPhase < surgeryPhases.length && (
                    <div className="mt-2">
                      <div className="text-2xl font-bold">
                        {formatTime(phaseTimers[currentPhase]?.elapsed || 0)} / {formatTime(surgeryPhases[currentPhase].duration)}
                      </div>
                      <Progress 
                        value={(phaseTimers[currentPhase]?.elapsed || 0) / surgeryPhases[currentPhase].duration * 100} 
                        className="h-3 mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedSurgery && (
        <Card>
          <CardHeader>
            <CardTitle>Surgery Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {phaseTimers.map((phase, index) => (
                <div key={index} className={`border rounded-lg p-4 ${phase.completed ? 'bg-green-50 border-green-200' : index === currentPhase ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {phase.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : index === currentPhase ? (
                        <Timer className="h-5 w-5 text-orange-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={`font-medium ${phase.completed ? 'text-green-800' : index === currentPhase ? 'text-orange-800' : 'text-gray-600'}`}>
                        {phase.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatTime(phase.elapsed)} / {formatTime(phase.duration)}
                      </div>
                      <Badge variant={phase.completed ? "default" : index === currentPhase ? "secondary" : "outline"}>
                        {phase.completed ? "Complete" : index === currentPhase ? "In Progress" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={(phase.elapsed / phase.duration) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>

            {currentPhase >= surgeryPhases.length && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-800">Surgery Complete!</h3>
                <p className="text-green-600">Total Duration: {formatTime(getTotalElapsed())}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
