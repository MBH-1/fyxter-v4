import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock } from 'lucide-react';

export function ShippingPolicy() {
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
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="w-10 h-10 text-yellow-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Shipping Policy Coming Soon</h1>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're currently updating our shipping policy to better serve you. Our team is working to provide clear guidelines on shipping 
            options, delivery timeframes, and tracking procedures for device repairs and parts.
          </p>
          
          <div className="bg-yellow-50 p-6 rounded-lg mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 mr-2 text-yellow-600" />
              <h2 className="text-xl font-semibold">In the meantime</h2>
            </div>
            <p className="text-gray-700">
              For any shipping or delivery inquiries regarding your repair, please contact our customer support team directly. 
              We're happy to assist with any questions about parts availability, repair timelines, and shipping options.
            </p>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-medium mb-3">Contact Customer Support</h3>
            <p className="text-gray-700 mb-4">
              Our team is available Monday through Saturday to assist with your shipping questions.
            </p>
            <div className="space-y-2 text-gray-700">
              <p>Phone: (514) 865-2788</p>
              <p>Email: info@fyxters.com</p>
              <p>Hours: Monday - Friday: 9AM - 7PM, Saturday: 10AM - 5PM</p>
            </div>
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
