'use client'

import { useState } from 'react'
import { Play, CheckCircle, Lock, Award, BookOpen, Clock, ChevronRight } from 'lucide-react'

export default function TrainingPage() {
  const [activeModule, setActiveModule] = useState<number | null>(null)

  const modules = [
    {
      id: 1,
      title: 'Customer Service Basics',
      duration: '45 min',
      progress: 100,
      status: 'completed',
      lessons: [
        { title: 'Greeting Customers', completed: true },
        { title: 'Handling Complaints', completed: true },
        { title: 'Checkout Procedures', completed: true },
      ]
    },
    {
      id: 2,
      title: 'Inventory Management',
      duration: '60 min',
      progress: 35,
      status: 'in-progress',
      lessons: [
        { title: 'Receiving Stock', completed: true },
        { title: 'Stock Rotation (FIFO)', completed: false },
        { title: 'Using the Scanner', completed: false },
      ]
    },
    {
      id: 3,
      title: 'Safety & Security',
      duration: '30 min',
      progress: 0,
      status: 'locked',
      lessons: [
        { title: 'Emergency Exits', completed: false },
        { title: 'Loss Prevention', completed: false },
        { title: 'First Aid Basics', completed: false },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              Employee Training Portal
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Welcome back, Alex. You have 2 pending modules.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Score</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">1,250 XP</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module List */}
          <div className="lg:col-span-2 space-y-6">
            {modules.map((module) => (
              <div 
                key={module.id}
                className={`
                  bg-white dark:bg-gray-800 rounded-xl border transition-all
                  ${module.status === 'locked' ? 'opacity-75 border-gray-200 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'}
                `}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center
                        ${module.status === 'completed' ? 'bg-green-100 text-green-600' : 
                          module.status === 'locked' ? 'bg-gray-100 text-gray-400' : 
                          'bg-indigo-100 text-indigo-600'}
                      `}>
                        {module.status === 'completed' ? <CheckCircle className="h-6 w-6" /> :
                         module.status === 'locked' ? <Lock className="h-6 w-6" /> :
                         <Play className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{module.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {module.duration}
                          </span>
                          <span>{module.lessons.length} Lessons</span>
                        </div>
                      </div>
                    </div>
                    {module.status !== 'locked' && (
                      <button 
                        onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      >
                        {activeModule === module.id ? 'Hide Details' : 'View Details'}
                      </button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        module.status === 'completed' ? 'bg-green-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{module.progress}% Complete</span>
                    {module.status === 'completed' && <span className="text-green-600 font-medium">Certificate Earned</span>}
                  </div>

                  {/* Expanded Details */}
                  {activeModule === module.id && (
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 space-y-3">
                      {module.lessons.map((lesson, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg group cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border
                              ${lesson.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-gray-500'}
                            `}>
                              {lesson.completed ? <CheckCircle className="h-3 w-3" /> : idx + 1}
                            </div>
                            <span className={lesson.completed ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}>
                              {lesson.title}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                        </div>
                      ))}
                      <button className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Continue Learning
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Weekly Challenge</h3>
              <p className="text-indigo-100 text-sm mb-4">Complete the "Safety & Security" module by Friday to earn a bonus badge!</p>
              <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                  <p className="font-bold">Safety Star</p>
                  <p className="text-xs text-indigo-200">+500 XP Bonus</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Leaderboard</h3>
              <div className="space-y-4">
                {[
                  { name: 'Sarah J.', score: 2450, rank: 1 },
                  { name: 'Mike R.', score: 2100, rank: 2 },
                  { name: 'You', score: 1250, rank: 8 },
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`
                        w-6 text-center font-bold
                        ${user.rank === 1 ? 'text-yellow-500' : 
                          user.rank === 2 ? 'text-gray-400' : 'text-gray-600'}
                      `}>#{user.rank}</span>
                      <span className={user.name === 'You' ? 'font-bold text-indigo-600' : 'text-gray-700 dark:text-gray-300'}>
                        {user.name}
                      </span>
                    </div>
                    <span className="font-mono text-sm text-gray-500">{user.score} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
