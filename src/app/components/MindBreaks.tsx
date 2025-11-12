'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Sparkles, Wind, Heart, Lock } from 'lucide-react'

type Language = 'pt' | 'en'

interface MindBreaksProps {
  language: Language
  isPremium: boolean
}

const translations = {
  pt: {
    title: 'Pausas Guiadas',
    subtitle: 'Respire, relaxe e recarregue suas energias',
    duration: 'Duração',
    start: 'Iniciar',
    pause: 'Pausar',
    resume: 'Continuar',
    restart: 'Reiniciar',
    breathe: 'Respire',
    inhale: 'Inspire',
    hold: 'Segure',
    exhale: 'Expire',
    complete: 'Pausa completa! ✨',
    affirmations: 'Frases Positivas',
    affirmationsList: [
      'Eu sou capaz de superar qualquer desafio',
      'Mereço amor, paz e felicidade',
      'Cada dia é uma nova oportunidade',
      'Confio no meu processo e no meu tempo',
      'Sou grata por tudo que tenho e sou',
      'Minha energia é valiosa e eu a protejo',
      'Estou no controle das minhas escolhas',
      'Aceito e amo quem eu sou'
    ],
    exercises: {
      quick: {
        name: 'Pausa Rápida',
        duration: '1 min',
        description: 'Respiração profunda para acalmar'
      },
      medium: {
        name: 'Relaxamento',
        duration: '3 min',
        description: 'Técnica 4-7-8 para reduzir ansiedade'
      },
      deep: {
        name: 'Meditação Guiada',
        duration: '5 min',
        description: 'Conexão profunda com você mesma',
        premium: true
      }
    },
    premiumOnly: 'Premium'
  },
  en: {
    title: 'Guided Breaks',
    subtitle: 'Breathe, relax and recharge your energy',
    duration: 'Duration',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    restart: 'Restart',
    breathe: 'Breathe',
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    complete: 'Break complete! ✨',
    affirmations: 'Positive Affirmations',
    affirmationsList: [
      'I am capable of overcoming any challenge',
      'I deserve love, peace and happiness',
      'Each day is a new opportunity',
      'I trust my process and my timing',
      'I am grateful for all I have and am',
      'My energy is valuable and I protect it',
      'I am in control of my choices',
      'I accept and love who I am'
    ],
    exercises: {
      quick: {
        name: 'Quick Break',
        duration: '1 min',
        description: 'Deep breathing to calm down'
      },
      medium: {
        name: 'Relaxation',
        duration: '3 min',
        description: '4-7-8 technique to reduce anxiety'
      },
      deep: {
        name: 'Guided Meditation',
        duration: '5 min',
        description: 'Deep connection with yourself',
        premium: true
      }
    },
    premiumOnly: 'Premium'
  }
}

type ExerciseType = 'quick' | 'medium' | 'deep'

export function MindBreaks({ language, isPremium }: MindBreaksProps) {
  const t = translations[language]
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>('quick')
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [currentAffirmation, setCurrentAffirmation] = useState(0)

  const durations = {
    quick: 60,
    medium: 180,
    deep: 300
  }

  useEffect(() => {
    setTimeLeft(durations[selectedExercise])
  }, [selectedExercise])

  useEffect(() => {
    if (!isActive || timeLeft === 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false)
          return 0
        }
        return prev - 1
      })

      // Breathing cycle
      const cycleTime = timeLeft % 18
      if (cycleTime >= 0 && cycleTime < 4) setPhase('inhale')
      else if (cycleTime >= 4 && cycleTime < 11) setPhase('hold')
      else setPhase('exhale')

      // Change affirmation every 15 seconds
      if (timeLeft % 15 === 0) {
        setCurrentAffirmation((prev) => (prev + 1) % t.affirmationsList.length)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timeLeft, t.affirmationsList.length])

  const handleStart = () => {
    if (selectedExercise === 'deep' && !isPremium) return
    setIsActive(true)
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleRestart = () => {
    setIsActive(false)
    setTimeLeft(durations[selectedExercise])
    setPhase('inhale')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return t.inhale
      case 'hold': return t.hold
      case 'exhale': return t.exhale
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Exercise Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['quick', 'medium', 'deep'] as ExerciseType[]).map((type) => {
          const exercise = t.exercises[type]
          const isPremiumExercise = type === 'deep' && !isPremium
          
          return (
            <button
              key={type}
              onClick={() => !isPremiumExercise && setSelectedExercise(type)}
              disabled={isPremiumExercise}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                selectedExercise === type
                  ? 'border-purple-400 bg-purple-50 shadow-lg scale-105'
                  : isPremiumExercise
                  ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
              }`}
            >
              {isPremiumExercise && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Wind className={`w-5 h-5 ${selectedExercise === type ? 'text-purple-500' : 'text-gray-400'}`} />
                <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
              <span className="text-xs font-medium text-purple-600">{exercise.duration}</span>
            </button>
          )
        })}
      </div>

      {/* Breathing Exercise */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg">
        <div className="max-w-md mx-auto space-y-8">
          {/* Timer Display */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Breathing Circle Animation */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 transition-all duration-1000 ${
                  isActive
                    ? phase === 'inhale'
                      ? 'scale-100 opacity-80'
                      : phase === 'hold'
                      ? 'scale-110 opacity-90'
                      : 'scale-90 opacity-70'
                    : 'scale-95 opacity-60'
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">{formatTime(timeLeft)}</div>
                  {isActive && (
                    <div className="text-white font-medium animate-pulse">{getPhaseText()}</div>
                  )}
                </div>
              </div>
            </div>

            {timeLeft === 0 && (
              <div className="text-2xl font-semibold text-purple-600 mb-4 animate-in fade-in duration-500">
                {t.complete}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isActive ? (
              <button
                onClick={handleStart}
                disabled={selectedExercise === 'deep' && !isPremium}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all duration-300 ${
                  selectedExercise === 'deep' && !isPremium
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                <Play className="w-5 h-5" />
                {t.start}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Pause className="w-5 h-5" />
                {t.pause}
              </button>
            )}
            
            <button
              onClick={handleRestart}
              className="p-4 rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Affirmations */}
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
          </div>
          <h3 className="font-semibold text-gray-800">{t.affirmations}</h3>
        </div>
        <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
          <p className="text-lg text-gray-800 text-center font-medium leading-relaxed">
            "{t.affirmationsList[currentAffirmation]}"
          </p>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {t.affirmationsList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAffirmation(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentAffirmation ? 'bg-purple-500 w-6' : 'bg-purple-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
