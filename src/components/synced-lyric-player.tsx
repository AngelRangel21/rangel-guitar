'use client';

import type { Song, TimedLine } from '@/lib/types';
import { useState, useRef, useEffect } from 'react';
import { useInterval } from 'usehooks-ts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChordSheet } from './chord-sheet';
import { Play, Pause, Repeat, FastForward, Rewind } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/i18n-context';

interface SyncedLyricPlayerProps {
    song: Song;
    transpose?: number;
}

export function SyncedLyricPlayer({ song, transpose = 0 }: SyncedLyricPlayerProps) {
    const { t } = useI18n();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeLineIndex, setActiveLineIndex] = useState(-1);

    const audioRef = useRef<HTMLAudioElement>(null);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

    // Effect to setup audio player
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const setAudioData = () => {
                setDuration(audio.duration);
                setCurrentTime(audio.currentTime);
            }
            const setAudioTime = () => setCurrentTime(audio.currentTime);

            audio.addEventListener('loadeddata', setAudioData);
            audio.addEventListener('timeupdate', setAudioTime);

            return () => {
                audio.removeEventListener('loadeddata', setAudioData);
                audio.removeEventListener('timeupdate', setAudioTime);
            }
        }
    }, []);

    // Custom hook for polling active line
    useInterval(() => {
        if (isPlaying && song.timedLines) {
            const newIndex = song.timedLines.findIndex(line => currentTime >= line.startTime && currentTime <= line.endTime);
            if (newIndex !== -1 && newIndex !== activeLineIndex) {
                setActiveLineIndex(newIndex);
            }
        }
    }, 100);

    // Effect to scroll active line into view
    useEffect(() => {
        if (activeLineIndex !== -1 && lyricsContainerRef.current) {
            const activeElement = lyricsContainerRef.current.querySelector(`[data-line-index="${activeLineIndex}"]`) as HTMLElement;
            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    }, [activeLineIndex]);


    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (value: number[]) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };
    
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSkip = (amount: number) => {
        const audio = audioRef.current;
        if(audio) {
            audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + amount));
        }
    }

    const handleRestart = () => {
        const audio = audioRef.current;
        if(audio) {
            audio.currentTime = 0;
            if(!isPlaying) {
                audio.play();
                setIsPlaying(true);
            }
        }
    }

    if (!song.timedLines || !song.audioUrl) {
        return null; // Should not happen if used correctly
    }

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div ref={lyricsContainerRef} className="h-96 overflow-y-auto p-4 rounded-md bg-muted/50 border relative">
                    {song.chords?.split('\n').map((line, index) => {
                        // Find the corresponding timed line
                        const timedLine = song.timedLines?.find(tl => tl.line.trim() === line.trim());
                        const isLineActive = timedLine ? (currentTime >= timedLine.startTime && currentTime <= timedLine.endTime) : false;

                        return (
                            <div key={index} data-line-index={index}
                                className={cn(
                                'transition-all duration-200',
                                isLineActive ? 'text-accent font-bold scale-105' : 'text-muted-foreground'
                                )}
                            >
                                <ChordSheet text={line} transpose={transpose} />
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-3">
                    <audio ref={audioRef} src={song.audioUrl} preload="metadata" />
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <Slider
                            value={[currentTime]}
                            max={duration}
                            step={1}
                            onValueChange={handleSeek}
                        />
                        <span>{formatTime(duration)}</span>
                    </div>

                    <div className="flex justify-center items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleRestart} aria-label={t('restart')}>
                            <Repeat className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleSkip(-10)} aria-label={t('rewind10s')}>
                            <Rewind className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="default"
                            size="lg"
                            className="w-16 h-16 rounded-full"
                            onClick={handlePlayPause}
                            aria-label={isPlaying ? t('pause') : t('play')}
                        >
                            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleSkip(10)} aria-label={t('fastForward10s')}>
                            <FastForward className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
