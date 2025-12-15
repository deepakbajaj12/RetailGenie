'use client'

import { useState } from 'react'
import { Calendar, MapPin, Users, Clock, Ticket, Share2, Heart, Plus } from 'lucide-react'

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const events = [
    { 
      id: 1, 
      title: 'Summer Style Workshop', 
      date: 'Sat, Jul 15', 
      time: '2:00 PM', 
      location: 'Store #1 - Community Space', 
      category: 'Fashion',
      attendees: 24,
      capacity: 30,
      image: '👗',
      price: 'Free'
    },
    { 
      id: 2, 
      title: 'Tech Talk: Smart Home 101', 
      date: 'Wed, Jul 19', 
      time: '6:30 PM', 
      location: 'Store #2 - Tech Hub', 
      category: 'Technology',
      attendees: 45,
      capacity: 50,
      image: '🏠',
      price: '$10'
    },
    { 
      id: 3, 
      title: 'Yoga & Wellness Morning', 
      date: 'Sun, Jul 23', 
      time: '9:00 AM', 
      location: 'Store #1 - Rooftop', 
      category: 'Wellness',
      attendees: 12,
      capacity: 20,
      image: '🧘‍♀️',
      price: '$15'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Community Events</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">Discover workshops, launches, and meetups at your local store.</p>
          </div>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-pink-200 dark:shadow-none transition-all flex items-center gap-2">
            <Plus className="h-5 w-5" /> Host an Event
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {['All', 'Fashion', 'Technology', 'Wellness', 'Food & Drink', 'Kids'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group cursor-pointer">
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center text-6xl relative">
                {event.image}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/50 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold">
                  {event.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-pink-600 font-bold text-sm uppercase tracking-wider mb-1">{event.date} • {event.time}</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">{event.title}</h3>
                  </div>
                  <button className="text-gray-400 hover:text-pink-500 transition-colors">
                    <Heart className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                    <Users className="h-4 w-4" />
                    {event.attendees} attending <span className="text-gray-300">•</span> {event.capacity - event.attendees} spots left
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{event.price}</span>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2">
                      <Ticket className="h-4 w-4" /> RSVP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
