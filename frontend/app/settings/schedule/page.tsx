'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Plus } from 'lucide-react'

type Shift = {
  id: string
  employeeId: string
  employeeName: string
  day: string // YYYY-MM-DD
  startTime: string
  endTime: string
  role: string
}

const MOCK_SHIFTS: Shift[] = [
  {
    id: "S-001",
    employeeId: "EMP-002",
    employeeName: "Jane Smith",
    day: "2023-10-23",
    startTime: "09:00",
    endTime: "17:00",
    role: "Manager"
  },
  {
    id: "S-002",
    employeeId: "EMP-003",
    employeeName: "Mike Johnson",
    day: "2023-10-23",
    startTime: "12:00",
    endTime: "20:00",
    role: "Cashier"
  },
  {
    id: "S-003",
    employeeId: "EMP-004",
    employeeName: "Sarah Williams",
    day: "2023-10-24",
    startTime: "08:00",
    endTime: "16:00",
    role: "Stock Clerk"
  }
]

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS)

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Helper to get dates for the current week
  const getWeekDates = (date: Date) => {
    const week = []
    const current = new Date(date)
    current.setDate(current.getDate() - current.getDay() + 1) // Start from Monday
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return week
  }

  const weekDates = getWeekDates(currentDate)

  const nextWeek = () => {
    const next = new Date(currentDate)
    next.setDate(next.getDate() + 7)
    setCurrentDate(next)
  }

  const prevWeek = () => {
    const prev = new Date(currentDate)
    prev.setDate(prev.getDate() - 7)
    setCurrentDate(prev)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              Shift Schedule
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage employee shifts and rosters</p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <button onClick={prevWeek} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="font-medium text-gray-900 dark:text-white min-w-[200px] text-center">
              {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
            </span>
            <button onClick={nextWeek} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
            <div className="p-4 font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              Employee
            </div>
            {weekDates.map((date, index) => (
              <div key={index} className="p-4 text-center border-r border-gray-200 dark:border-gray-700 last:border-0 bg-gray-50 dark:bg-gray-800">
                <div className="font-medium text-gray-900 dark:text-white">{days[index]}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{date.getDate()}</div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {['Jane Smith', 'Mike Johnson', 'Sarah Williams'].map((employee, empIndex) => (
              <div key={empIndex} className="grid grid-cols-8 min-h-[100px]">
                <div className="p-4 border-r border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-300">
                    {employee.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{employee}</span>
                </div>
                {weekDates.map((date, dayIndex) => {
                  // Find shift for this employee on this day
                  // Note: This is a simplified check. In a real app, compare full dates properly.
                  const shift = shifts.find(s => s.employeeName === employee && new Date(s.day).getDate() === date.getDate())
                  
                  return (
                    <div key={dayIndex} className="p-2 border-r border-gray-200 dark:border-gray-700 last:border-0 relative group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      {shift ? (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 text-xs cursor-pointer hover:shadow-md transition-shadow h-full">
                          <div className="font-bold text-blue-700 dark:text-blue-300 mb-1">{shift.startTime} - {shift.endTime}</div>
                          <div className="text-blue-600 dark:text-blue-400">{shift.role}</div>
                        </div>
                      ) : (
                        <button className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="h-6 w-6 text-gray-400 hover:text-blue-600" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}