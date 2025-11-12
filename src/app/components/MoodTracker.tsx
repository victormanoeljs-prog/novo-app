'use client'

import { useState, useEffect } from 'react'
import { Smile, Meh, Frown, Battery, BatteryMedium, BatteryLow, Sparkles, TrendingUp, Lock } from 'lucide-react'

type Language = 'pt' | 'en'

interface MoodTrackerProps {
  language: Language
  isPremium: boolean
}

const translations = {
  pt: {
    title: 'Como você está se sentindo hoje?',
    subtitle: 'Registre seu humor e energia diária',
    mood: 'Humor',
    energy: 'Energia',
    moods: {
      happy: 'Feliz',
      neutral: 'Neutro',
      sad: 'Triste'
    },
    energyLevels: {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa'
    },
    save: 'Salvar Registro',
    saved: 'Registro salvo!',
    suggestions: 'Sugestões para você',
    suggestionsList: [
      'Que tal uma caminhada de 10 minutos ao ar livre?',
      'Beba um copo de água e respire fundo 3 vezes',
      'Ouça sua música favorita por alguns minutos',
      'Faça um alongamento suave',
      'Escreva 3 coisas pelas quais você é grata hoje'
    ],
    history: 'Histórico (últimos 7 dias)',
    premiumFeature: 'Histórico completo disponível no Premium',
    upgrade: 'Fazer upgrade'
  },
  en: {
    title: 'How are you feeling today?',
    subtitle: 'Track your daily mood and energy',
    mood: 'Mood',
    energy: 'Energy',
    moods: {
      happy: 'Happy',
      neutral: 'Neutral',
      sad: 'Sad'
    },
    energyLevels: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    save: 'Save Entry',
    saved: 'Entry saved!',
    suggestions: 'Suggestions for you',
    suggestionsList: [
      'How about a 10-minute walk outside?',
      'Drink a glass of water and take 3 deep breaths',
      'Listen to your favorite music for a few minutes',
      'Do some gentle stretching',
      'Write down 3 things you\'re grateful for today'
    ],
    history: 'History (last 7 days)',
    premiumFeature: 'Full history available in Premium',
    upgrade: 'Upgrade now'
  }
}

type MoodType = 'happy' | 'neutral' | 'sad' | null
type EnergyType = 'high' | 'medium' | 'low' | null

interface MoodEntry {
  date: string
  mood: MoodType
  energy: EnergyType
}

export function MoodTracker({ language, isPremium }: MoodTrackerProps) {
  const t = translations[language]
  const [selectedMood, setSelectedMood] = useState<MoodType>(null)
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyType>(null)
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState<MoodEntry[]>([])

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('moodHistory')
    if (stored) {
      setHistory(JSON.parse(stored))
    }
  }, [])

  const handleSave = () => {
    if (!selectedMood || !selectedEnergy) return

    const newEntry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      energy: selectedEnergy
    }

    const updatedHistory = [newEntry, ...history.filter(e => e.date !== newEntry.date)].slice(0, 30)
    setHistory(updatedHistory)
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory))
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case 'happy': return <Smile className="w-6 h-6" />
      case 'neutral': return <Meh className="w-6 h-6" />
      case 'sad': return <Frown className="w-6 h-6" />
      default: return null
    }
  }

  const getEnergyIcon = (energy: EnergyType) => {
    switch (energy) {
      case 'high': return <Battery className="w-6 h-6" />
      case 'medium': return <BatteryMedium className="w-6 h-6" />
      case 'low': return <BatteryLow className="w-6 h-6" />
      default: return null
    }
  }

  const getSuggestion = () => {
    if (!selectedMood || !selectedEnergy) return null
    
    if (selectedMood === 'sad' || selectedEnergy === 'low') {
      return t.suggestionsList[Math.floor(Math.random() * t.suggestionsList.length)]
    }
    return null
  }

  const suggestion = getSuggestion()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Mood Selection */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="space-y-6">
          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t.mood}</label>
            <div className="grid grid-cols-3 gap-3">
              {(['happy', 'neutral', 'sad'] as MoodType[]).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedMood === mood
                      ? 'border-rose-400 bg-rose-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-rose-200 hover:bg-rose-50/50'
                  }`}
                >
                  <div className={selectedMood === mood ? 'text-rose-500' : 'text-gray-400'}>
                    {getMoodIcon(mood)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {t.moods[mood as keyof typeof t.moods]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t.energy}</label>
            <div className="grid grid-cols-3 gap-3">
              {(['high', 'medium', 'low'] as EnergyType[]).map((energy) => (
                <button
                  key={energy}
                  onClick={() => setSelectedEnergy(energy)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedEnergy === energy
                      ? 'border-purple-400 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
                  }`}
                >
                  <div className={selectedEnergy === energy ? 'text-purple-500' : 'text-gray-400'}>
                    {getEnergyIcon(energy)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {t.energyLevels[energy as keyof typeof t.energyLevels]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!selectedMood || !selectedEnergy}
            className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 ${
              selectedMood && selectedEnergy
                ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saved ? t.saved : t.save}
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestion && (
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 shadow-lg animate-in slide-in-from-bottom duration-500">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">{t.suggestions}</h3>
              <p className="text-gray-700">{suggestion}</p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            {t.history}
          </h3>
          {!isPremium && (
            <Lock className="w-4 h-4 text-gray-400" />
          )}
        </div>

        {isPremium ? (
          <div className="space-y-3">
            {history.slice(0, 7).map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <span className="text-sm text-gray-600">
                  {new Date(entry.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
                </span>
                <div className="flex items-center gap-3">
                  <div className="text-rose-500">{getMoodIcon(entry.mood)}</div>
                  <div className="text-purple-500">{getEnergyIcon(entry.energy)}</div>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-center text-gray-400 py-4">Nenhum registro ainda</p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">{t.premiumFeature}</p>
            <button className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full font-medium hover:shadow-lg transition-all">
              {t.upgrade}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
