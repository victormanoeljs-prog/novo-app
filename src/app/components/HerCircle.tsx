'use client'

import { useState, useEffect } from 'react'
import { Users, Heart, Briefcase, Baby, Sparkles, Send, Lock, MessageCircle } from 'lucide-react'

type Language = 'pt' | 'en'

interface HerCircleProps {
  language: Language
  isPremium: boolean
}

const translations = {
  pt: {
    title: 'HerCircle',
    subtitle: 'Comunidades seguras e acolhedoras',
    communities: 'Comunidades',
    join: 'Participar',
    joined: 'Participando',
    messages: 'Mensagens',
    sendMessage: 'Enviar mensagem',
    messagePlaceholder: 'Compartilhe algo positivo...',
    aiMessage: 'Mensagem da IA',
    premiumOnly: 'Premium',
    premiumFeature: 'Acesso completo às comunidades no Premium',
    upgrade: 'Fazer upgrade',
    categories: {
      career: {
        name: 'Carreira',
        description: 'Crescimento profissional e networking',
        icon: 'briefcase'
      },
      motherhood: {
        name: 'Maternidade',
        description: 'Apoio e experiências de mães',
        icon: 'baby'
      },
      selfcare: {
        name: 'Autocuidado',
        description: 'Bem-estar físico e mental',
        icon: 'heart'
      },
      wellness: {
        name: 'Bem-estar',
        description: 'Saúde integral e equilíbrio',
        icon: 'sparkles'
      }
    },
    aiMessages: {
      career: [
        'Lembre-se: seu valor não diminui pela opinião de alguém incapaz de reconhecê-lo.',
        'Cada "não" é um passo mais perto do seu "sim" perfeito.',
        'Você está exatamente onde precisa estar no seu caminho profissional.'
      ],
      motherhood: [
        'Você está fazendo um trabalho incrível, mesmo nos dias difíceis.',
        'Não existe mãe perfeita, mas existe a mãe perfeita para seus filhos: você.',
        'Cuidar de si mesma não é egoísmo, é necessidade.'
      ],
      selfcare: [
        'Você merece o mesmo amor e cuidado que oferece aos outros.',
        'Pequenos momentos de autocuidado criam grandes transformações.',
        'Sua saúde mental é tão importante quanto sua saúde física.'
      ],
      wellness: [
        'Equilíbrio não é perfeição, é saber quando descansar e quando agir.',
        'Seu corpo é seu templo, trate-o com amor e respeito.',
        'Bem-estar é uma jornada, não um destino.'
      ]
    }
  },
  en: {
    title: 'HerCircle',
    subtitle: 'Safe and welcoming communities',
    communities: 'Communities',
    join: 'Join',
    joined: 'Joined',
    messages: 'Messages',
    sendMessage: 'Send message',
    messagePlaceholder: 'Share something positive...',
    aiMessage: 'AI Message',
    premiumOnly: 'Premium',
    premiumFeature: 'Full access to communities in Premium',
    upgrade: 'Upgrade now',
    categories: {
      career: {
        name: 'Career',
        description: 'Professional growth and networking',
        icon: 'briefcase'
      },
      motherhood: {
        name: 'Motherhood',
        description: 'Support and experiences for mothers',
        icon: 'baby'
      },
      selfcare: {
        name: 'Self-Care',
        description: 'Physical and mental wellness',
        icon: 'heart'
      },
      wellness: {
        name: 'Wellness',
        description: 'Holistic health and balance',
        icon: 'sparkles'
      }
    },
    aiMessages: {
      career: [
        'Remember: your value doesn\'t decrease based on someone\'s inability to see your worth.',
        'Every "no" is one step closer to your perfect "yes".',
        'You are exactly where you need to be on your professional journey.'
      ],
      motherhood: [
        'You\'re doing an amazing job, even on the hard days.',
        'There\'s no perfect mother, but there\'s the perfect mother for your children: you.',
        'Taking care of yourself is not selfish, it\'s necessary.'
      ],
      selfcare: [
        'You deserve the same love and care you give to others.',
        'Small moments of self-care create big transformations.',
        'Your mental health is just as important as your physical health.'
      ],
      wellness: [
        'Balance isn\'t perfection, it\'s knowing when to rest and when to act.',
        'Your body is your temple, treat it with love and respect.',
        'Wellness is a journey, not a destination.'
      ]
    }
  }
}

type CommunityType = 'career' | 'motherhood' | 'selfcare' | 'wellness'

interface Message {
  id: string
  text: string
  isAI: boolean
  timestamp: Date
}

export function HerCircle({ language, isPremium }: HerCircleProps) {
  const t = translations[language]
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityType | null>(null)
  const [joinedCommunities, setJoinedCommunities] = useState<CommunityType[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    // Load joined communities
    const stored = localStorage.getItem('joinedCommunities')
    if (stored) {
      setJoinedCommunities(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (selectedCommunity) {
      // Load messages for selected community
      const stored = localStorage.getItem(`messages_${selectedCommunity}`)
      if (stored) {
        const parsedMessages = JSON.parse(stored)
        setMessages(parsedMessages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })))
      } else {
        // Add welcome AI message
        addAIMessage()
      }
    }
  }, [selectedCommunity])

  const addAIMessage = () => {
    if (!selectedCommunity) return
    
    const aiMessages = t.aiMessages[selectedCommunity]
    const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)]
    
    const aiMsg: Message = {
      id: Date.now().toString(),
      text: randomMessage,
      isAI: true,
      timestamp: new Date()
    }
    
    setMessages([aiMsg])
  }

  const handleJoinCommunity = (community: CommunityType) => {
    if (!isPremium && joinedCommunities.length >= 1) return

    const updated = joinedCommunities.includes(community)
      ? joinedCommunities.filter(c => c !== community)
      : [...joinedCommunities, community]
    
    setJoinedCommunities(updated)
    localStorage.setItem('joinedCommunities', JSON.stringify(updated))
    
    if (!joinedCommunities.includes(community)) {
      setSelectedCommunity(community)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCommunity || !isPremium) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      isAI: false,
      timestamp: new Date()
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setNewMessage('')

    // Save messages
    localStorage.setItem(
      `messages_${selectedCommunity}`,
      JSON.stringify(updatedMessages)
    )

    // Add AI response after 2 seconds
    setTimeout(() => {
      const aiMessages = t.aiMessages[selectedCommunity]
      const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)]
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: randomMessage,
        isAI: true,
        timestamp: new Date()
      }
      
      const withAI = [...updatedMessages, aiMsg]
      setMessages(withAI)
      localStorage.setItem(
        `messages_${selectedCommunity}`,
        JSON.stringify(withAI)
      )
    }, 2000)
  }

  const getCommunityIcon = (type: CommunityType) => {
    switch (type) {
      case 'career': return <Briefcase className="w-5 h-5" />
      case 'motherhood': return <Baby className="w-5 h-5" />
      case 'selfcare': return <Heart className="w-5 h-5" />
      case 'wellness': return <Sparkles className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(t.categories) as CommunityType[]).map((type) => {
          const category = t.categories[type]
          const isJoined = joinedCommunities.includes(type)
          const canJoin = isPremium || joinedCommunities.length === 0
          
          return (
            <div
              key={type}
              className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
                isJoined
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              {!canJoin && !isJoined && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isJoined ? 'bg-purple-400 text-white' : 'bg-purple-100 text-purple-500'
                }`}>
                  {getCommunityIcon(type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleJoinCommunity(type)}
                  disabled={!canJoin && !isJoined}
                  className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                    isJoined
                      ? 'bg-purple-400 text-white'
                      : canJoin
                      ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isJoined ? t.joined : t.join}
                </button>
                
                {isJoined && (
                  <button
                    onClick={() => setSelectedCommunity(type)}
                    className="px-4 py-2 rounded-xl bg-white border-2 border-purple-200 hover:border-purple-300 transition-all"
                  >
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Messages Section */}
      {selectedCommunity && (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                {getCommunityIcon(selectedCommunity)}
              </div>
              <div>
                <h3 className="font-semibold">{t.categories[selectedCommunity].name}</h3>
                <p className="text-sm opacity-90">{t.messages}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {isPremium ? (
            <>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.isAI
                          ? 'bg-gradient-to-br from-purple-100 to-pink-100'
                          : 'bg-gradient-to-br from-rose-400 to-purple-400 text-white'
                      }`}
                    >
                      {message.isAI && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span className="text-xs font-medium text-purple-600">{t.aiMessage}</span>
                        </div>
                      )}
                      <p className={message.isAI ? 'text-gray-800' : 'text-white'}>
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t.messagePlaceholder}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      newMessage.trim()
                        ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">{t.premiumFeature}</p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full font-medium hover:shadow-lg transition-all">
                {t.upgrade}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Premium Upsell */}
      {!isPremium && joinedCommunities.length >= 1 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">
                {language === 'pt' ? 'Desbloqueie todas as comunidades' : 'Unlock all communities'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'pt' 
                  ? 'Com o Premium, você pode participar de todas as comunidades e ter acesso ilimitado às conversas.'
                  : 'With Premium, you can join all communities and have unlimited access to conversations.'}
              </p>
              <button className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full font-medium hover:shadow-lg transition-all">
                {t.upgrade}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
