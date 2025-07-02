
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n-context';
import { Volume2, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Frequencies for C Major scale notes
const noteFrequencies: { [key: string]: number } = {
  'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
  'G': 392.00, 'A': 440.00, 'B': 493.88,
};
const notes = Object.keys(noteFrequencies);

export function EarTrainer() {
  const { t } = useI18n();
  const [currentNote, setCurrentNote] = useState('');
  const [gameState, setGameState] = useState<'playing' | 'feedback'>('playing');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const setupAudioContext = () => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playNote = useCallback((note: string) => {
    setupAudioContext();
    if (!audioContextRef.current) return;

    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const frequency = noteFrequencies[note];
    if (!frequency) return;
    
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    
    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);
    
    const now = audioContextRef.current.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
    
    osc.start(now);
    osc.stop(now + 1);
  }, []);

  const startNewRound = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * notes.length);
    const newNote = notes[randomIndex];
    setCurrentNote(newNote);
    setGameState('playing');
    setFeedback(null);
    setTimeout(() => playNote(newNote), 300);
  }, [playNote]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleGuess = (guess: string) => {
    if (gameState !== 'playing') return;

    if (guess === currentNote) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('incorrect');
      setScore(0);
    }
    setGameState('feedback');
    
    setTimeout(() => {
      startNewRound();
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('earTrainerPageTitle')}</CardTitle>
        <CardDescription>{t('earTrainerDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <div className="text-center">
            <p className="text-muted-foreground">{t('score')}</p>
            <p className="text-4xl font-bold">{score}</p>
        </div>
        
        <Button onClick={() => playNote(currentNote)} size="lg" variant="outline" aria-label={t('playNote')}>
            <Volume2 className="h-6 w-6 mr-2"/>
            {t('playNote')}
        </Button>
        
        <div className="grid grid-cols-4 gap-2 w-full">
            {notes.map(note => (
                <Button 
                    key={note} 
                    onClick={() => handleGuess(note)}
                    disabled={gameState === 'feedback'}
                    className="h-14 text-lg"
                >
                    {note}
                </Button>
            ))}
        </div>
        
        <div className="h-12 flex items-center justify-center">
            {feedback === 'correct' && <CheckCircle className="h-10 w-10 text-green-500 animate-fade-in-up" />}
            {feedback === 'incorrect' && <XCircle className="h-10 w-10 text-destructive animate-fade-in-up" />}
        </div>

      </CardContent>
    </Card>
  );
}
