'use client'

import { useState } from 'react'
import { Heart, Sparkles, Calendar, Users, Globe, Crown, Menu, X } from 'lucide-react'
import { MoodTracker } from './components/MoodTracker'
import { MindBreaks } from './components/MindBreaks'
import { DailyPlanner } from './components/DailyPlanner'
import { HerCircle } from './components/HerCircle'

type Language = 'pt' | 'en'
type Tab = 'mood' | 'breaks' | 'planner' | 'circle'

const translations = {
  pt: {
    appName: 'HerFlow',
    tagline: 'Seu espaço de bem-estar e organização',
    premium: 'Premium',
    premiumPrice: 'R$ 3,99/mês',
    tabs: {
      mood: 'Humor & Energia',
      breaks: 'Pausas',
      planner: 'Planner',
      circle: 'HerCircle'
    },
    menu: 'Menu'
  },
  en: {
    appName: 'HerFlow',
    tagline: 'Your wellness & organization space',
    premium: 'Premium',
    premiumPrice: '$3.99/month',
    tabs: {
      mood: 'Mood & Energy',
      breaks: 'Mind Breaks',
      planner: 'Daily Flow',
      circle: 'HerCircle'
    },
    menu: 'Menu'
  }
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('pt')
  const [activeTab, setActiveTab] = useState<Tab>('mood')
  const [isPremium, setIsPremium] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const t = translations[language]

  const tabs = [
    { id: 'mood' as Tab, icon: Heart, label: t.tabs.mood },
    { id: 'breaks' as Tab, icon: Sparkles, label: t.tabs.breaks },
    { id: 'planner' as Tab, icon: Calendar, label: t.tabs.planner },
    { id: 'circle' as Tab, icon: Users, label: t.tabs.circle }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-purple-400 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  {t.appName}
                </h1>
                <p className="text-xs text-gray-500">{t.tagline}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-rose-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-rose-200 hover:border-rose-300 transition-all"
              >
                <Globe className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-medium text-gray-700">{language.toUpperCase()}</span>
              </button>

              {/* Premium Badge */}
              <button
                onClick={() => setIsPremium(!isPremium)}
                className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${
                  isPremium
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg'
                    : 'bg-white border border-purple-200 text-purple-600 hover:border-purple-300'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">{t.premium}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-rose-100 transition-all"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2 space-y-2 animate-in slide-in-from-top duration-300">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-rose-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
              <button
                onClick={() => {
                  setIsPremium(!isPremium)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isPremium
                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg'
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Crown className="w-5 h-5" />
                <span className="font-medium">{t.premium} - {t.premiumPrice}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="animate-in fade-in duration-500">
          {activeTab === 'mood' && <MoodTracker language={language} isPremium={isPremium} />}
          {activeTab === 'breaks' && <MindBreaks language={language} isPremium={isPremium} />}
          {activeTab === 'planner' && <DailyPlanner language={language} isPremium={isPremium} />}
          {activeTab === 'circle' && <HerCircle language={language} isPremium={isPremium} />}
        </div>
      </main>
    </div>
  )
}
