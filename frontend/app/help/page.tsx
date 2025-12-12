'use client'

import { useState } from 'react'
import { Search, Book, MessageCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react'

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the Profile page by clicking on your avatar in the top right corner. Click 'Edit Profile' and scroll down to the 'Change Password' section."
    },
    {
      question: "How can I export my sales data?",
      answer: "Navigate to the Analytics page. In the top right corner, you will find an 'Export CSV' button that allows you to download your sales reports."
    },
    {
      question: "Can I manage multiple store locations?",
      answer: "Currently, RetailGenie is optimized for single-store management. Multi-store support is planned for the Enterprise tier in Q4."
    },
    {
      question: "How does the AI forecasting work?",
      answer: "Our AI analyzes your historical sales data, seasonality, and trends to predict future demand. The more data you have, the more accurate the predictions become."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How can we help you?</h1>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search for help articles..." 
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-300">
              <Book className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">Documentation</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Detailed guides on how to use every feature.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-300">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">Live Chat</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Chat with our support team in real-time.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-300">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">API Reference</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Technical documentation for developers.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                <button 
                  className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Still need help?</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}