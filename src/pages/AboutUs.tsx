import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Medal, Shield, Clock, Users, Phone as PhoneIcon, Map } from 'lucide-react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-white hover:text-gray-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Fyxters</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Redefining repair—fast, reliable, and built for all Challenges
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
            Fyxters was founded because we were frustrated with the traditional device repair experience.
            Long waiting times, inconsistent quality, and a lack of transparency left customers feeling let down and underserved.
            </p>
            <p className="text-gray-600 mb-4">
            We knew there had to be a better way. Drawing on our extensive experience in parts wholesale, we built a team of expert technicians who could deliver reliable, efficient, and honest repair services
            Our goal was to become the trusted name for all your daily repair needs—your heroes in a world where nothing should slow you down.
            </p>
            <p className="text-gray-600">
            Our vision goes beyond just fixing devices. By leveraging our expertise and commitment to excellence, we aim to broaden our services to tackle everyday repair challenges and help make the world greener—reducing waste and promoting a more sustainable future for everyone.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-6">Why We're Different</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Medal className="w-6 h-6 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Expert Technicians</h4>
                  <p>All our technicians are certified and undergo rigorous training before joining our network.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="w-6 h-6 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Quality Guarantee</h4>
                  <p>We stand behind our work with a 6-month warranty on all repairs.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-6 h-6 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Fast Service</h4>
                  <p>Most repairs are completed within 1-2 hours, getting you back to your day quickly.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Map className="w-6 h-6 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Convenient Options</h4>
                  <p>Choose between on-site repair at your location or visit one of our service centers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Contact CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join the Fyxters Family</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Whether you're looking for expert repair services or interested in joining our team of technicians, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                Get a Repair
              </Link>
              <Link 
                to="/become-technician" 
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Users className="w-5 h-5 mr-2" />
                Become a Fyxter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}