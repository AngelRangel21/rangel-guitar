/** biome-ignore-all lint/suspicious/noExplicitAny: explain */
'use client'

import { Minus, Pause, Play, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SegmentedControl } from '@/components/layout/segmented-control'
import { Slider } from '@/components/ui/slider'
import { useI18n } from '@/context/i18n-context'
import { cn } from '@/lib/utils'

const MIN_BPM = 40
const MAX_BPM = 220
const BEAT_OPTIONS = [2, 3, 4, 6] as const

/**
 * Componente interactivo de metrónomo.
 * Permite a los usuarios establecer un tempo (BPM) y un compás para practicar.
 * @returns {JSX.Element} El componente del metrónomo.
 */
export function Metronome() {
  const { t } = useI18n()
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4)
  const [currentBeat, setCurrentBeat] = useState(0)

  // Referencias para manejar el audio y el temporizador.
  const audioContextRef = useRef<AudioContext | null>(null)
  const timerIdRef = useRef<number | null>(null)
  const nextBeatRef = useRef(1)

  /**
   * Inicia o detiene la reproducción del metrónomo.
   */
  const togglePlay = () => {
    if (!isPlaying) {
      // Inicializa el AudioContext solo cuando se presiona play por primera vez.
      if (!audioContextRef.current) {
        audioContextRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )()
      }
      // Reanuda el contexto de audio si está suspendido (política de autoplay de los navegadores).
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
      }
    }
    setIsPlaying(!isPlaying)
  }

  // Efecto principal que maneja la lógica del temporizador del metrónomo.
  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000 // Calcula el intervalo entre pulsos en milisegundos.
      timerIdRef.current = window.setInterval(() => {
        const beat = nextBeatRef.current
        setCurrentBeat(beat)

        // Genera el sonido del "clic".
        if (audioContextRef.current) {
          const osc = audioContextRef.current.createOscillator()
          const gain = audioContextRef.current.createGain()

          // El primer pulso del compás tiene un tono más alto.
          osc.frequency.value = beat === 1 ? 880 : 440
          gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContextRef.current.currentTime + 0.1
          )

          osc.connect(gain)
          gain.connect(audioContextRef.current.destination)

          osc.start(audioContextRef.current.currentTime)
          osc.stop(audioContextRef.current.currentTime + 0.1)
        }

        // Actualiza el siguiente pulso a reproducir.
        nextBeatRef.current = (beat % beatsPerMeasure) + 1
      }, interval)
    } else {
      // Si se detiene, limpia el intervalo y resetea los contadores.
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
      }
      setCurrentBeat(0)
      nextBeatRef.current = 1
    }

    // Función de limpieza para eliminar el intervalo cuando el componente se desmonta.
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
      }
    }
  }, [isPlaying, bpm, beatsPerMeasure])

  const changeBpm = (delta: number) =>
    setBpm((value) => Math.min(MAX_BPM, Math.max(MIN_BPM, value + delta)))

  const stepButtonClass =
    'inline-flex size-12 shrink-0 items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40'

  return (
    <div className='mx-auto flex w-full max-w-xl flex-col items-center gap-8 rounded-3xl border bg-card p-6 sm:p-10'>
      {/* Indicadores visuales de los pulsos (el 1º es el acento del compás) */}
      <div
        className='flex items-center justify-center gap-3 sm:gap-4'
        aria-hidden='true'
      >
        {Array.from({ length: beatsPerMeasure }, (_, i) => i + 1).map(
          (beat) => (
            <div
              key={beat}
              className={cn(
                'rounded-full transition-all duration-100',
                beat === 1 ? 'size-5 sm:size-6' : 'size-4 sm:size-5',
                currentBeat === beat
                  ? 'scale-125 bg-primary shadow-lg'
                  : 'bg-muted ring-1 ring-border'
              )}
            />
          )
        )}
      </div>

      {/* BPM actual con ajuste fino */}
      <div className='flex items-center gap-4 sm:gap-6'>
        <button
          type='button'
          onClick={() => changeBpm(-1)}
          disabled={isPlaying || bpm <= MIN_BPM}
          aria-label='-1 BPM'
          className={stepButtonClass}
        >
          <Minus aria-hidden='true' className='size-5' />
        </button>
        <div className='w-36 text-center'>
          <p className='text-7xl font-bold leading-none tabular-nums tracking-tight text-foreground'>
            {bpm}
          </p>
          <p className='mt-1 text-sm font-medium uppercase tracking-widest text-muted-foreground'>
            {t('bpm')}
          </p>
        </div>
        <button
          type='button'
          onClick={() => changeBpm(1)}
          disabled={isPlaying || bpm >= MAX_BPM}
          aria-label='+1 BPM'
          className={stepButtonClass}
        >
          <Plus aria-hidden='true' className='size-5' />
        </button>
      </div>

      <div className='w-full space-y-6'>
        <div className='grid gap-3'>
          <label htmlFor='bpm-slider' className='sr-only'>
            {t('bpm')}
          </label>
          <Slider
            id='bpm-slider'
            min={MIN_BPM}
            max={MAX_BPM}
            step={1}
            value={[bpm]}
            onValueChange={(value) =>
              setBpm(typeof value === 'number' ? value : value[0])
            }
            disabled={isPlaying}
          />
          <div className='flex justify-between text-xs text-muted-foreground tabular-nums'>
            <span>{MIN_BPM}</span>
            <span>{MAX_BPM}</span>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-3'>
          <span className='text-sm font-medium text-foreground'>
            {t('beatsPerMeasure')}
          </span>
          <SegmentedControl<string>
            label={t('beatsPerMeasure')}
            value={String(beatsPerMeasure)}
            onChange={(value) => {
              if (!isPlaying) setBeatsPerMeasure(Number(value))
            }}
            options={BEAT_OPTIONS.map((beats) => ({
              value: String(beats),
              label: String(beats)
            }))}
          />
        </div>
      </div>

      <button
        type='button'
        onClick={togglePlay}
        aria-label={isPlaying ? t('stop') : t('play')}
        className='inline-flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring active:scale-95'
      >
        {isPlaying ? (
          <Pause aria-hidden='true' className='size-10' />
        ) : (
          <Play aria-hidden='true' className='ml-1 size-10' />
        )}
      </button>
    </div>
  )
}
