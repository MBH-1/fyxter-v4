import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Clock, PenTool as Tool } from 'lucide-react';

export function WarrantyPolicy() {
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
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Warranty Policy</h1>
            <p className="text-gray-600 mt-2">
              Our commitment to quality repairs and your peace of mind
            </p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-green-50 p-4 rounded-lg mb-8">
              <div className="flex">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <p className="text-green-800">
                  Every repair service from Fyxters comes with our standard warranty to ensure your complete satisfaction. 
                  We stand behind the quality of our work and parts.
                </p>
              </div>
            </div>
            
            <h2 className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-700" />
              Standard Warranty Coverage
            </h2>
            <p>
              All repairs performed by Fyxters come with a <strong>3-month standard warranty</strong> that covers:
            </p>
            <ul>
              <li>Parts defects</li>
              <li>Manufacturing defects</li>
              <li>Workmanship issues</li>
              <li>Installation errors</li>
            </ul>
            <p>
              If your repaired device experiences issues related to our parts or service within the warranty period, 
              we will repair it at no additional cost. This includes parts and labor.
            </p>
            
            <h2 className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-gray-700" />
              Extended Warranty Option
            </h2>
            <p>
              For additional peace of mind, we offer an optional <strong>12-month extended warranty</strong> for only $10.
              This extended warranty provides the same coverage as our standard warranty for a full year from the date of repair.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg my-4">
              <h3 className="font-medium mb-2">Extended Warranty Benefits:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-px" />
                  <span>Longer coverage period (12 months vs. 3 months)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-px" />
                  <span>Priority service for warranty claims</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-px" />
                  <span>One-time screen protector replacement (if applicable)</span>
                </li>
              </ul>
            </div>
            
            <h2 className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-gray-700" />
              Warranty Limitations
            </h2>
            <p>
              Our warranty does not cover:
            </p>
            <ul>
              <li>Damage from accidents, drops, or misuse after the repair</li>
              <li>Water or liquid damage occurring after the repair</li>
              <li>Damage from attempted self-repair or third-party repair</li>
              <li>Software issues unrelated to our hardware repair</li>
              <li>Normal wear and tear</li>
              <li>Cosmetic damage that doesn't affect functionality</li>
            </ul>
            
            <div className="bg-yellow-50 p-4 rounded-lg my-6">
              <div className="flex">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                <p className="text-yellow-800">
                  <strong>Important:</strong> Removing any tamper-evident seals placed by our technicians or 
                  opening the device after our repair will void your warranty.
                </p>
              </div>
            </div>
            
            <h2 className="flex items-center">
              <Tool className="w-5 h-5 mr-2 text-gray-700" />
              How to Claim Your Warranty
            </h2>
            <p>
              If you experience an issue with your repaired device that you believe is covered under warranty:
            </p>
            <ol>
              <li>Contact our customer service team at (123) 456-7890 or support@fyxters.com</li>
              <li>Provide your order number or the email address used for the original repair</li>
              <li>Describe the issue you're experiencing in detail</li>
              <li>Our team will verify your warranty coverage and schedule a warranty service</li>
            </ol>
            <p>
              For qualifying warranty repairs:
            </p>
            <ul>
              <li>No diagnostic fee will be charged</li>
              <li>Parts and labor covered under warranty will be provided at no cost</li>
              <li>We offer expedited service for warranty claims</li>
            </ul>
            
            <h2>Data Protection During Warranty Service</h2>
            <p>
              While we make every effort to preserve your data during a warranty repair, we recommend backing up 
              your device before bringing it in for service. Fyxters is not responsible for data loss during the 
              warranty repair process.
            </p>
            
            <h2>Questions About Your Warranty?</h2>
            <p>
              If you have any questions about your warranty coverage or need assistance with a warranty claim, 
              our customer support team is available:
            </p>
            <ul>
              <li>Phone: (123) 456-7890</li>
              <li>Email: support@fyxters.com</li>
              <li>Hours: Monday-Friday: 9AM-7PM, Saturday: 10AM-5PM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}