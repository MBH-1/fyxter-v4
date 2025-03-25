import React from 'react';
import { Smartphone, MapPin, PenTool as Tool, Clock, Shield, Star } from 'lucide-react';

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Phone Repair Made Simple
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get your device fixed by expert technicians in three easy steps
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-blue-500 p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  Step 1
                </span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">
                Select Your Device
              </h3>
              <p className="text-gray-600 text-center">
                Choose your device model and the repair service you need. We offer both original and aftermarket parts to fit your budget.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-green-500 p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                  Step 2
                </span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">
                Share Your Location and Find the Nearest Fyxter
              </h3>
              <p className="text-gray-600 text-center">
                Pick between visiting our service center or having a certified technician come to your location for on-site repairs.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-purple-500 p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                <Tool className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                  Step 3
                </span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">
                Get Expert Repair
              </h3>
              <p className="text-gray-600 text-center">
                Our skilled technicians will fix your device using premium parts, backed by our satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Fyxters?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Service</h3>
              <p className="text-gray-400">
                Most repairs completed within 1-2 hours
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Guaranteed Quality</h3>
              <p className="text-gray-400">
                90-day warranty on all repairs
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Technicians</h3>
              <p className="text-gray-400">
                Certified and background-checked professionals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Fix Your Device?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get started now and have your device working like new in no time
          </p>
          <a
            href="/"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Repair
          </a>
        </div>
      </div>
    </div>
  );
}