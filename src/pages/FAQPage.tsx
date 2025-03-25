import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Phone as PhoneIcon, Mail, Calendar, CreditCard, Clock, Truck, Shield } from 'lucide-react';

export function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-12 text-white text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Find answers to common questions about our repair services, pricing, warranty, and more.
            </p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid gap-6 md:gap-8">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Booking & Appointments
                </h2>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">How do I schedule a repair service?</h3>
                  <p className="text-gray-600">
                    You can schedule a repair directly through our website by selecting your device model, repair type, and choosing whether you want to bring your device to our service center or request on-site service. Follow the steps, select a time slot, and complete your booking.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">How long will my repair take?</h3>
                  <p className="text-gray-600">
                    Most common repairs like screen replacements and battery replacements are completed within 1-2 hours. More complex repairs may take up to 24 hours. You'll receive an estimated completion time when you book your repair.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Can I cancel or reschedule my appointment?</h3>
                  <p className="text-gray-600">
                    Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time without any charge. For cancellations less than 2 hours before your appointment, a small cancellation fee may apply.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Pricing & Payment
                </h2>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">How much will my repair cost?</h3>
                  <p className="text-gray-600">
                    Repair costs vary depending on your device model, the type of repair, and whether you choose original or aftermarket parts. You can see exact pricing when you select your device on our website. We provide transparent pricing with no hidden fees.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
                  <p className="text-gray-600">
                    We accept all major credit and debit cards, Apple Pay, Google Pay, and PayPal. For in-person repairs, we also accept cash payments.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Do you offer any discounts?</h3>
                  <p className="text-gray-600">
                    Yes! We offer a 10% student discount with valid ID. We also have special promotions throughout the year. Sign up for our newsletter to stay informed about our latest offers.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Warranty & Guarantees
                </h2>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">What warranty do you offer on repairs?</h3>
                  <p className="text-gray-600">
                    All repairs come with a standard 3-month warranty covering parts and labor. If you experience any issues with the repaired component within this period, we'll fix it for free. We also offer an optional 12-month extended warranty for an additional fee.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">What if my device can't be repaired?</h3>
                  <p className="text-gray-600">
                    If we determine that your device cannot be repaired, you'll only be charged for the diagnostic fee ($30), which will be clearly communicated before any work begins. We'll provide recommendations for your options, including potential replacement.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Do you guarantee data preservation?</h3>
                  <p className="text-gray-600">
                    While we take great care during the repair process, we cannot guarantee data preservation in all cases. We strongly recommend backing up your device before bringing it in for repair. If data recovery is specifically needed, please discuss this with our technicians beforehand.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-blue-600" />
                  On-Site Services
                </h2>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">What areas do you serve for on-site repairs?</h3>
                  <p className="text-gray-600">
                    We currently offer on-site repair services in major metropolitan areas. When you enter your location on our website, we'll show you if on-site service is available in your area and the nearest available technician.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">How quickly can a technician come to my location?</h3>
                  <p className="text-gray-600">
                    In most areas where we offer on-site service, we can dispatch a technician within 2-3 hours of booking. During peak times, it may take longer. You'll see the estimated arrival time when you book.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Is there an extra charge for on-site service?</h3>
                  <p className="text-gray-600">
                    Yes, on-site services include a convenience fee of $100 on top of the standard repair cost. This covers the technician's travel time and ensures you receive priority service at your preferred location.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Still have questions?</h2>
              <p className="text-gray-600 mb-6">
                Our customer support team is ready to help with any other questions you might have.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="tel:+15145550123" 
                  className="flex items-center justify-center p-4 bg-white rounded-lg border hover:border-blue-500 transition-colors"
                >
                  <PhoneIcon className="w-5 h-5 mr-2 text-blue-600" />
                  <span>Call (123) 456-7890</span>
                </a>
                <a 
                  href="mailto:support@fyxters.com" 
                  className="flex items-center justify-center p-4 bg-white rounded-lg border hover:border-blue-500 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  <span>support@fyxters.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}