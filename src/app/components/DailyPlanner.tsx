'use client'

import { useState, useEffect } from 'react'
import { Plus, Check, Trash2, Calendar as CalendarIcon, Lock } from 'lucide-react'

type Language = 'pt' | 'en'

interface DailyPlannerProps {
  language: Language
  isPremium: boolean
}

const translations = {
  pt: {
    title: 'Planner Diário',
    subtitle: 'Foque no que realmente importa hoje',
    today: 'Hoje',
    addTask: 'Adicionar tarefa',
    taskPlaceholder: 'O que você quer realizar hoje?',
    maxTasks: 'Máximo de 3 tarefas por dia',
    noTasks: 'Nenhuma tarefa ainda. Adicione até 3 prioridades!',
    completed: 'Concluída',
    delete: 'Excluir',
    stats: 'Estatísticas',
    tasksCompleted: 'Tarefas concluídas',
    completionRate: 'Taxa de conclusão',
    premiumFeature: 'Estatísticas completas no Premium',
    upgrade: 'Fazer upgrade',
    calendarSync: 'Sincronizar com calendário',
    calendarSynced: 'Calendário sincronizado!',
    premiumOnly: 'Disponível no Premium'
  },
  en: {
    title: 'Daily Planner',
    subtitle: 'Focus on what really matters today',
    today: 'Today',
    addTask: 'Add task',
    taskPlaceholder: 'What do you want to accomplish today?',
    maxTasks: 'Maximum 3 tasks per day',
    noTasks: 'No tasks yet. Add up to 3 priorities!',
    completed: 'Completed',
    delete: 'Delete',
    stats: 'Statistics',
    tasksCompleted: 'Tasks completed',
    completionRate: 'Completion rate',
    premiumFeature: 'Full statistics in Premium',
    upgrade: 'Upgrade now',
    calendarSync: 'Sync with calendar',
    calendarSynced: 'Calendar synced!',
    premiumOnly: 'Available in Premium'
  }
}

interface Task {
  id: string
  text: string
  completed: boolean
  date: string
}

export function DailyPlanner({ language, isPremium }: DailyPlannerProps) {
  const t = translations[language]
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [calendarSynced, setCalendarSynced] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    // Load tasks from localStorage
    const stored = localStorage.getItem('dailyTasks')
    if (stored) {
      const allTasks = JSON.parse(stored)
      setTasks(allTasks.filter((task: Task) => task.date === today))
    }
  }, [today])

  const saveTasks = (updatedTasks: Task[]) => {
    const stored = localStorage.getItem('dailyTasks')
    const allTasks = stored ? JSON.parse(stored) : []
    const otherDaysTasks = allTasks.filter((task: Task) => task.date !== today)
    const newAllTasks = [...otherDaysTasks, ...updatedTasks]
    localStorage.setItem('dailyTasks', JSON.stringify(newAllTasks))
    setTasks(updatedTasks)
  }

  const handleAddTask = () => {
    if (!newTask.trim() || tasks.length >= 3) return

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      date: today
    }

    saveTasks([...tasks, task])
    setNewTask('')
  }

  const handleToggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
    saveTasks(updatedTasks)
  }

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    saveTasks(updatedTasks)
  }

  const handleCalendarSync = () => {
    if (!isPremium) return
    setCalendarSynced(true)
    setTimeout(() => setCalendarSynced(false), 3000)
  }

  const completedCount = tasks.filter(t => t.completed).length
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Date Display */}
      <div className="bg-gradient-to-r from-rose-400 to-purple-400 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">{t.today}</p>
            <h3 className="text-xl font-bold capitalize">{formatDate(today)}</h3>
          </div>
          <button
            onClick={handleCalendarSync}
            disabled={!isPremium}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isPremium
                ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                : 'bg-white/10 cursor-not-allowed opacity-50'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
              {calendarSynced ? t.calendarSynced : t.calendarSync}
            </span>
            {!isPremium && <Lock className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Task Input */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder={t.taskPlaceholder}
            maxLength={100}
            disabled={tasks.length >= 3}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleAddTask}
            disabled={!newTask.trim() || tasks.length >= 3}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              newTask.trim() && tasks.length < 3
                ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {tasks.length >= 3 && (
          <p className="text-sm text-purple-600 mt-2 text-center">{t.maxTasks}</p>
        )}
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-gray-500">{t.noTasks}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  task.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
                }`}
              >
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    task.completed
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                
                <span
                  className={`flex-1 ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-purple-500" />
          {t.stats}
        </h3>

        {isPremium ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{completedCount}</div>
              <div className="text-sm text-gray-600">{t.tasksCompleted}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{completionRate}%</div>
              <div className="text-sm text-gray-600">{t.completionRate}</div>
            </div>
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
