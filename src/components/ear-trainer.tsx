
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n-context';
import { Volume2, CheckCircle, XCircle, Lock, Trophy, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { levels as allLevels } from '@/lib/ear-trainer-levels';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Frequencies for C Major scale notes
const noteFrequencies: { [key: string]: number } = {
  'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
  'G': 392.00, 'A': 440.00, 'B': 493.88,
  'C#': 277.18, 'D#': 311.13, 'F#': 369.99, 'G#': 415.30, 'A#': 466.16
};

const flattenedLevels = allLevels.flatMap(d => d.subLevels);

export function EarTrainer() {
  const { t } = useI18n();
  const [gameState, setGameState] = useState<'level-select' | 'playing' | 'level-complete'>('level-select');
  const [unlockedLevelIndex, setUnlockedLevelIndex] = useState(0);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number | null>(null);
  
  const [currentNote, setCurrentNote] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem('earTrainerProgress');
    if (savedProgress) {
        const progress = parseInt(savedProgress, 10);
        if (!isNaN(progress)) {
            setUnlockedLevelIndex(progress);
        }
    }
  }, []);

  const setupAudioContext = () => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playNote = useCallback((note: string) => {
    setupAudioContext();
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const frequency = noteFrequencies[note];
    if (!frequency) return;
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
    
    osc.start(now);
    osc.stop(now + 1);
  }, []);

  const startNewRound = useCallback(() => {
    if (selectedLevelIndex === null) return;
    const level = flattenedLevels[selectedLevelIndex];
    if (!level) return;

    const randomIndex = Math.floor(Math.random() * level.notes.length);
    const newNote = level.notes[randomIndex];
    setCurrentNote(newNote);
    setFeedback(null);
    setTimeout(() => playNote(newNote), 300);
  }, [selectedLevelIndex, playNote]);

  const handleGuess = (guess: string) => {
    if (gameState !== 'playing' || feedback) return;

    if (guess === currentNote) {
      setFeedback('correct');
      const newScore = score + 1;
      setScore(newScore);

      const level = flattenedLevels[selectedLevelIndex!];
      if (newScore >= level.notesToGuess) {
        setGameState('level-complete');
        const nextLevelIndex = selectedLevelIndex! + 1;
        if (nextLevelIndex > unlockedLevelIndex && nextLevelIndex < flattenedLevels.length) {
          setUnlockedLevelIndex(nextLevelIndex);
          localStorage.setItem('earTrainerProgress', String(nextLevelIndex));
        }
      } else {
        setTimeout(() => startNewRound(), 1000);
      }
    } else {
      setFeedback('incorrect');
      setTimeout(() => startNewRound(), 1000);
    }
  };
  
  const handleLevelSelect = (levelIndex: number) => {
    setSelectedLevelIndex(levelIndex);
    setScore(0);
    setGameState('playing');
    startNewRound();
  }

  const handleBackToMenu = () => {
    setSelectedLevelIndex(null);
    setScore(0);
    setGameState('level-select');
  }

  if (gameState === 'level-select') {
    let globalLevelIndex = 0;
    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>{t('earTrainerPageTitle')}</CardTitle>
                <CardDescription>{t('earTrainerSelectLevel')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="item-0">
                    {allLevels.map((difficulty, diffIndex) => (
                        <AccordionItem value={`item-${diffIndex}`} key={difficulty.name}>
                            <AccordionTrigger className="text-xl font-bold">{t(difficulty.name)}</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {difficulty.subLevels.map((level) => {
                                        const levelIndex = globalLevelIndex;
                                        const isLocked = levelIndex > unlockedLevelIndex;
                                        const isCompleted = levelIndex < unlockedLevelIndex;
                                        globalLevelIndex++;

                                        return (
                                            <Button
                                                key={level.name}
                                                variant="outline"
                                                className="h-24 flex flex-col gap-1 relative"
                                                disabled={isLocked}
                                                onClick={() => handleLevelSelect(levelIndex)}
                                            >
                                                {isLocked ? (
                                                    <Lock className="h-6 w-6 text-muted-foreground" />
                                                ) : isCompleted ? (
                                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                                ) : (
                                                    <Trophy className="h-6 w-6 text-accent" />
                                                )}
                                                <span className="font-semibold">{t('level')} {level.name}</span>
                                                <span className="text-xs text-muted-foreground">{level.notes.join(', ')}</span>
                                            </Button>
                                        )
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
  }

  const level = flattenedLevels[selectedLevelIndex!];
  const progress = (score / level.notesToGuess) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackToMenu} className="h-8 w-8">
                <ArrowLeft />
            </Button>
            <div>
                <CardTitle>{t('level')} {level.name}</CardTitle>
                <CardDescription>{t('earTrainerDescription')}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('progress')}</span>
                <span>{score} / {level.notesToGuess}</span>
            </div>
            <Progress value={progress} />
        </div>
        
        <Button onClick={() => playNote(currentNote)} size="lg" variant="outline" aria-label={t('playNote')} disabled={!!feedback}>
            <Volume2 className="h-6 w-6 mr-2"/>
            {t('playNote')}
        </Button>
        
        <div className="grid grid-cols-4 gap-2 w-full">
            {level.notes.map(note => (
                <Button 
                    key={note} 
                    onClick={() => handleGuess(note)}
                    disabled={!!feedback}
                    className="h-14 text-lg"
                >
                    {note}
                </Button>
            ))}
        </div>
        
        <div className="h-12 flex items-center justify-center">
            {feedback === 'correct' && <CheckCircle className="h-10 w-10 text-green-500 animate-content-in" />}
            {feedback === 'incorrect' && <XCircle className="h-10 w-10 text-destructive animate-content-in" />}
        </div>
        
         {gameState === 'level-complete' && (
            <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <h3 className="text-xl font-bold text-green-500">{t('levelComplete')}</h3>
                <p className="text-muted-foreground mb-4">{t('levelCompleteDescription')}</p>
                 {selectedLevelIndex! < flattenedLevels.length - 1 ? (
                    <Button onClick={() => handleLevelSelect(selectedLevelIndex! + 1)}>
                        {t('nextLevel')}
                    </Button>
                ) : (
                    <Button onClick={handleBackToMenu}>
                        {t('backToLevels')}
                    </Button>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
