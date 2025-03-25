import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Smartphone, Battery, Cpu, Wifi, Camera, Lock, Droplets, Clock, Zap, PenTool as Tool, Shield } from 'lucide-react';

export function Services() {
  const serviceSections = [
    {
      title: "Screen Repairs",
      icon: <Smartphone className="w-8 h-8 text-purple-600" />,
      description: "Expert screen replacement for all major device brands using original or high-quality aftermarket parts.",
      features: [
        "Original manufacturer screens",
        "Premium aftermarket options",
        "Full feature support (True Tone, Face ID)",
        "Same-day service in most cases"
      ],
      devices: "iPhone, Samsung, Google Pixel, iPad, and more",
      time: "1-2 hours",
      pricing: "Starting at $67 (varies by device model)"
    },
    {
      title: "Battery Replacement",
      icon: <Battery className="w-8 h-8 text-green-600" />,
      description: "Restore your device's battery life with high-capacity, certified replacement batteries.",
      features: [
        "Genuine batteries with full capacity",
        "Battery health calibration",
        "Safe installation process",
        "Old battery recycling"
      ],
      devices: "All smartphone and tablet models",
      time: "30-60 minutes",
      pricing: "Starting at $49 (varies by device model)"
    },
    {
      title: "Water Damage Recovery",
      icon: <Droplets className="w-8 h-8 text-blue-600" />,
      description: "Specialized treatment for water-damaged devices to prevent corrosion and restore functionality.",
      features: [
        "Ultrasonic cleaning",
        "Component-level diagnostics",
        "Corrosion removal",
        "Circuit repair"
      ],
      devices: "All smartphones and tablets",
      time: "24-48 hours",
      pricing: "Starting at $99 (based on damage assessment)"
    },
    {
      title: "Charging Port Repair",
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      description: "Fix charging issues with precision port replacement or cleaning services.",
      features: [
        "Deep port cleaning",
        "Port replacement",
        "Motherboard repair if needed",
        "Charging test verification"
      ],
      devices: "All major brands",
      time: "30-90 minutes",
      pricing: "Starting at $59"
    },
    {
      title: "Camera Repairs",
      icon: <Camera className="w-8 h-8 text-red-600" />,
      description: "Restore picture perfect clarity with our camera module replacement services.",
      features: [
        "Front and rear camera replacement",
        "Lens cleaning and replacement",
        "Focus issue resolution",
        "Quality testing"
      ],
      devices: "All major smartphone models",
      time: "30-60 minutes",
      pricing: "Starting at $49"
    },
    {
      title: "Diagnostic Service",
      icon: <Tool className="w-8 h-8 text-gray-600" />,
      description: "Comprehensive analysis to identify hardware or software issues with your device.",
      features: [
        "Complete system diagnostics",
        "Detailed problem report",
        "Repair recommendations",
        "Cost estimates"
      ],
      devices: "All devices",
      time: "30-60 minutes",
      pricing: "$30 (credited toward repair cost)"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-white hover:text-blue-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Repair Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Expert repair solutions for all your device needs, performed by certified technicians using premium parts.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Fyxters</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            When it comes to your valuable devices, you deserve nothing but the best repair service.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tool className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert Technicians</h3>
            <p className="text-gray-600">
              All our technicians are certified and undergo rigorous training, ensuring your device is in capable hands.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Same-Day Service</h3>
            <p className="text-gray-600">
              Most repairs are completed within 1-2 hours, getting your device back in your hands as quickly as possible.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">
              All repairs come with a 3-month warranty, with the option to extend to 12 months for added peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Repair Services</h2>
          
          <div className="grid gap-8">
            {serviceSections.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="bg-gray-50 p-6 md:w-1/3">
                    <div className="flex items-center mb-4">
                      {service.icon}
                      <h3 className="text-xl font-bold ml-3">{service.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        <span><strong>Devices:</strong> {service.devices}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span><strong>Time:</strong> {service.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Cpu className="w-4 h-4 mr-2" />
                        <span><strong>Pricing:</strong> {service.pricing}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 md:w-2/3">
                    <h4 className="font-medium mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <div className="text-green-500 mr-2">✓</div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    *Prices may vary based on device model and condition
                  </span>
                  <Link 
                    to="/" 
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Request this service <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* On-Site Repair Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="p-8 md:w-2/3 text-white">
              <h2 className="text-3xl font-bold mb-4">On-Site Repair Service</h2>
              <p className="text-purple-100 text-lg mb-6">
                Can't come to us? No problem! Our expert technicians will come to your home or office to perform the repair.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span>Convenient scheduling — choose a time that works for you</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <Tool className="w-4 h-4 text-white" />
                  </div>
                  <span>Same expert technicians and premium parts as our service centers</span>
                </li>
                <li className="flex items-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span>Full warranty coverage on all on-site repairs</span>
                </li>
              </ul>
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 bg-white text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Schedule On-Site Repair <ArrowLeft className="ml-2 w-4 h-4 transform rotate-180" />
              </Link>
            </div>
            <div className="hidden md:block md:w-1/3 bg-purple-700">
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    $100
                  </div>
                  <p className="text-purple-200 mb-2">Convenience Fee</p>
                  <p className="text-xs text-purple-300">Added to standard repair cost</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Services */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Business Repair Solutions</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Keep your business running smoothly with our enterprise device repair services. Special rates available for bulk repairs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Enterprise Support Plan</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Priority repair service for business clients</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Volume discounts for 5+ devices</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Extended business hours support</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Dedicated account manager</span>
                </li>
              </ul>
              <Link 
                to="/contact" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full text-center"
              >
                Contact for Business Rates
              </Link>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">On-Site Business Services</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Technicians dispatched to your office</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Bulk repair scheduling for employee devices</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Minimal disruption to business operations</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Custom repair schedules to fit your needs</span>
                </li>
              </ul>
              <Link 
                to="/contact" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full text-center"
              >
                Schedule Business Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Fix Your Device?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Whether you need a simple screen replacement or complex board-level repair, our expert technicians are ready to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/" 
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started Now
            </Link>
            <Link 
              to="/faq" 
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}