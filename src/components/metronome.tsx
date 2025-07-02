'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/context/i18n-context';
import { Play, Pause } from 'lucide-react';

export function Metronome() {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const nextBeatRef = useRef(1);

  const togglePlay = () => {
    if (!isPlaying) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      timerIdRef.current = window.setInterval(() => {
        const beat = nextBeatRef.current;
        setCurrentBeat(beat);

        if (audioContextRef.current) {
          const osc = audioContextRef.current.createOscillator();
          const gain = audioContextRef.current.createGain();
          
          osc.frequency.value = beat === 1 ? 880 : 440;
          gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.1);
          
          osc.connect(gain);
          gain.connect(audioContextRef.current.destination);

          osc.start(audioContextRef.current.currentTime);
          osc.stop(audioContextRef.current.currentTime + 0.1);
        }
        
        nextBeatRef.current = (beat % beatsPerMeasure) + 1;
      }, interval);
    } else {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
      setCurrentBeat(0);
      nextBeatRef.current = 1;
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [isPlaying, bpm, beatsPerMeasure]);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('metronomePageTitle')}</CardTitle>
        <CardDescription>{t('metronomeDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-center gap-4 w-full">
            {Array.from({ length: beatsPerMeasure }, (_, i) => i + 1).map(beat => (
                <div key={beat} className={`w-8 h-8 rounded-full transition-all duration-100 ${currentBeat === beat ? 'bg-accent scale-125' : 'bg-muted'}`} />
            ))}
        </div>

        <div className="text-center">
            <p className="text-6xl font-bold tabular-nums text-foreground">{bpm}</p>
            <p className="text-muted-foreground">{t('bpm')}</p>
        </div>

        <div className="w-full space-y-6">
            <div className="grid gap-2">
                <label htmlFor="bpm-slider" className="text-sm font-medium">{t('bpm')}</label>
                <Slider
                    id="bpm-slider"
                    min={40}
                    max={220}
                    step={1}
                    value={[bpm]}
                    onValueChange={(value) => setBpm(value[0])}
                    disabled={isPlaying}
                />
            </div>

            <div className="grid gap-2">
                <label htmlFor="beats-select" className="text-sm font-medium">{t('beatsPerMeasure')}</label>
                 <Select
                    value={String(beatsPerMeasure)}
                    onValueChange={(value) => setBeatsPerMeasure(Number(value))}
                    disabled={isPlaying}
                >
                    <SelectTrigger id="beats-select">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <Button onClick={togglePlay} size="lg" className="w-24 h-24 rounded-full">
            {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
            <span className="sr-only">{isPlaying ? t('stop') : t('play')}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
