import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, AlertCircle } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          
          <div className="text-gray-500 mb-6 text-center">
            <p>Last updated: June 15, 2025</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Lock className="w-5 h-5 text-blue-600 mr-2 mt-1" />
                <p className="text-blue-800">
                  At Fyxters, we take your privacy seriously. This policy outlines the types of information we collect, 
                  how we use it, and the measures we take to protect your data.
                </p>
              </div>
            </div>
            
            <h2 className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-gray-700" />
              Information We Collect
            </h2>
            <p>
              When you use our services, we may collect the following information:
            </p>
            <ul>
              <li><strong>Personal Information</strong>: Name, email address, phone number, and mailing address</li>
              <li><strong>Device Information</strong>: Model, serial number, IMEI, and details about the condition of your device</li>
              <li><strong>Payment Information</strong>: Credit card details, billing address, and payment history</li>
              <li><strong>Location Data</strong>: Your physical location when using our on-site service</li>
              <li><strong>Service History</strong>: Records of past repairs, service requests, and interactions with our technicians</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>To provide and improve our repair services</li>
              <li>To process payments and maintain billing records</li>
              <li>To communicate with you about your repair status and updates</li>
              <li>To match you with the nearest available technician</li>
              <li>To send you promotional offers and updates about our services (you may opt out)</li>
              <li>To analyze and improve our business operations and website performance</li>
            </ul>
            
            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. These measures include:
            </p>
            <ul>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Strict access controls for our staff and technicians</li>
              <li>Physical security measures at our service centers</li>
            </ul>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-1" />
                <p className="text-yellow-800">
                  <strong>Important Note</strong>: While we take all reasonable precautions to protect your data, 
                  we recommend backing up your device before repair to prevent any potential data loss during the repair process.
                </p>
              </div>
            </div>
            
            <h2>Data Sharing and Third Parties</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Our authorized technicians who will perform your repair service</li>
              <li>Payment processors to complete transactions</li>
              <li>Service providers who assist with our business operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>
              We do not sell or rent your personal information to third parties for marketing purposes.
            </p>
            
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict our processing of your data</li>
              <li>Data portability (receiving your data in a machine-readable format)</li>
              <li>Withdraw consent at any time</li>
            </ul>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions or concerns about our Privacy Policy or data practices, please contact us at:
            </p>
            <p>
              Email: privacy@fyxters.com<br />
              Phone: (123) 456-7890<br />
              Address: 123 Repair Avenue, Tech City, TX 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}