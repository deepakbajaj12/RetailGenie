'use client'

import { useState } from 'react'
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Mail } from 'lucide-react'

type Feedback = {
  id: string
  customerName: string
  email: string
  rating: number
  comment: string
  date: string
  status: 'New' | 'Read' | 'Replied'
}

const MOCK_FEEDBACK: Feedback[] = [
  {
    id: "FB-001",
    customerName: "Alice Freeman",
    email: "alice@example.com",
    rating: 5,
    comment: "Excellent service! The staff was very helpful in finding the right product.",
    date: "2023-10-26",
    status: "New"
  },
  {
    id: "FB-002",
    customerName: "Bob Wilson",
    email: "bob@example.com",
    rating: 3,
    comment: "Product quality is good, but the checkout process was a bit slow.",
    date: "2023-10-25",
    status: "Read"
  },
  {
    id: "FB-003",
    customerName: "Charlie Brown",
    email: "charlie@example.com",
    rating: 1,
    comment: "Very disappointed. The item I reserved was sold to someone else.",
    date: "2023-10-24",
    status: "Replied"
  }
]

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(MOCK_FEEDBACK)

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              Customer Feedback
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Review and respond to customer comments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Average Rating</h3>
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">4.2</p>
            <p className="text-sm text-gray-500 mt-2">Based on 128 reviews</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Positive Feedback</h3>
              <ThumbsUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">85%</p>
            <p className="text-sm text-green-500 mt-2">Last 30 days</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Response Rate</h3>
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">92%</p>
            <p className="text-sm text-gray-500 mt-2">Within 24 hours</p>
          </div>
        </div>

        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-300">
                    {feedback.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{feedback.customerName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="h-3 w-3" />
                      {feedback.email}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(feedback.rating)}
                  <p className="text-xs text-gray-400 mt-1">{feedback.date}</p>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg italic">
                "{feedback.comment}"
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  feedback.status === 'New' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                  feedback.status === 'Replied' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {feedback.status}
                </span>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Reply to Customer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}