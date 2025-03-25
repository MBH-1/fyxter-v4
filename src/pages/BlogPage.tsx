import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Pencil } from 'lucide-react';

export function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Our Blog is Coming Soon!</h1>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're working hard to bring you helpful articles, repair tips, and the latest news in mobile device technology. 
            Check back soon for valuable content to help you get the most out of your devices.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <Pencil className="w-5 h-5 mr-2 text-blue-600" />
              What to Expect
            </h2>
            <ul className="text-left text-gray-700 space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Step-by-step repair guides for common device issues</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Tips to extend your device's battery life and overall performance</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Reviews of the latest protective cases and accessories</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Fyxter stories and testimonials from satisfied customers</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}