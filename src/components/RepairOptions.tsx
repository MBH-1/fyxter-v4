import React, { useState } from 'react';
import { Clock, Shield, MapPin, PenTool as Tool, Check, Gift, Cable, Search, Ticket } from 'lucide-react';
import { DevicePrice } from '../lib/types';

interface RepairOptionsProps {
  devicePrice: DevicePrice;
  onOptionSelect: (option: 'original' | 'aftermarket' | 'onsite' | 'diagnostic') => void;
  technicianInfo: {
    distance: string;
    duration: string;
    name: string;
    rating: number;
  } | null;
}

export function RepairOptions({ devicePrice, onOptionSelect, technicianInfo }: RepairOptionsProps) {
  const [originalExtended, setOriginalExtended] = useState(false);
  const [aftermarketExtended, setAftermarketExtended] = useState(false);
  const [onsiteExtended, setOnsiteExtended] = useState(false);
  const [diagnosticExtended, setDiagnosticExtended] = useState(false);

  const EXTENDED_GUARANTEE_PRICE = 10;
  const baseOnsitePrice = devicePrice.original_part + 100;
  const DIAGNOSTIC_PRICE = 30;

  const getPrice = (basePrice: number, hasExtended: boolean) => {
    return basePrice + (hasExtended ? EXTENDED_GUARANTEE_PRICE : 0);
  };

  // Check if we're in diagnostic mode
  const isDiagnosticMode = devicePrice.model === 'Device Diagnostic';

  // If in diagnostic mode, only show the diagnostic option
  if (isDiagnosticMode) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Device Diagnostic Service</h2>
        <div className="max-w-xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg border hover:border-black transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">Professional Device Diagnostic</h3>
                <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm mt-2">
                  <Search className="w-4 h-4 mr-1" />
                  Expert Analysis
                </div>
                <div className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded-full text-sm mt-2 ml-2">
                  <Ticket className="w-4 h-4 mr-1" />
                  Student Discount -10%
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Our technicians will perform a complete diagnostic of your device to identify any hardware or software issues, including problems with power, display, camera, battery, and more.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-sm mb-2">What You Get:</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 mr-2 text-blue-600" />
                  Complete device analysis by certified technicians
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 mr-2 text-blue-600" />
                  Detailed report of identified issues
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 mr-2 text-blue-600" />
                  Repair quote with options and pricing
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 mr-2 text-blue-600" />
                  <strong>Diagnostic fee deducted from final repair cost</strong>
                </li>
              </ul>
            </div>

            <div className="text-center mb-6">
              <div className="text-3xl font-bold">
                ${getPrice(DIAGNOSTIC_PRICE, diagnosticExtended)}
              </div>
              <div className="text-sm text-gray-600">Total Price</div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Available in 1 hour
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                Detailed diagnostic report
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                Nearest technician: {technicianInfo ? technicianInfo.distance : 'Calculating...'}
              </div>
            </div>

            <label className="flex items-center mb-4 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="mr-2"
                checked={diagnosticExtended}
                onChange={(e) => setDiagnosticExtended(e.target.checked)}
              />
              Add 12-month extended guarantee (+$10) if repair is performed
            </label>

            <button
              onClick={() => onOptionSelect('diagnostic')}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Choose This Option
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular repair options
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Choose Your Repair Option</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Original Screen */}
        {getPrice(devicePrice.original_part, originalExtended) > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg border hover:border-black transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Original Screen</h3>
              <div className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm mt-2">
                <Tool className="w-4 h-4 mr-1" />
                Factory Original
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded-full text-sm mt-2 ml-2">
                <Ticket className="w-4 h-4 mr-1" />
                Student Discount -10%
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Original manufacturer screen, identical to what came with your device. Ensures perfect color accuracy, brightness, and touch response.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-sm mb-2">What You Get:</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-green-600" />
                100% genuine manufacturer parts
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Full feature support (True Tone, Face ID)
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Original display quality & brightness
              </li>
            </ul>
          </div>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold">
              ${getPrice(devicePrice.original_part, originalExtended)}
            </div>
            <div className="text-sm text-gray-600">Total Price</div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Available in 1 hour
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              3 months Fyxters guarantee
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              Nearest technician: {technicianInfo ? technicianInfo.distance : 'Calculating...'}
            </div>
          </div>

          <label className="flex items-center mb-4 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={originalExtended}
              onChange={(e) => setOriginalExtended(e.target.checked)}
            />
            Add 12-month extended guarantee (+$10)
          </label>

          <button
            onClick={() => onOptionSelect('original')}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Choose This Option
          </button>
        </div>
)}
        {/* Aftermarket Screen */}
        {getPrice(devicePrice.aftermarket_part, aftermarketExtended) > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg border hover:border-black transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Aftermarket Screen</h3>
              <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm mt-2">
                <Tool className="w-4 h-4 mr-1" />
                Premium Alternative
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded-full text-sm mt-2 ml-2">
                <Ticket className="w-4 h-4 mr-1" />
                Student Discount -10%
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            High-quality alternative screen with excellent display quality and full feature compatibility at a more affordable price.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-sm mb-2">What You Get:</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-blue-600" />
                Premium quality alternative screen
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-blue-600" />
                True Tone & Face ID support
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-blue-600" />
                Great value for money
              </li>
            </ul>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-3xl font-bold">
              ${getPrice(devicePrice.aftermarket_part, aftermarketExtended)}
            </div>
            <div className="text-sm text-gray-600">Total Price</div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Available in 1 hour
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              3 months Fyxters guarantee
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              Nearest technician: {technicianInfo ? technicianInfo.distance : 'Calculating...'}
            </div>
          </div>

          <label className="flex items-center mb-4 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={aftermarketExtended}
              onChange={(e) => setAftermarketExtended(e.target.checked)}
            />
            Add 12-month extended guarantee (+$10)
          </label>

          <button
            onClick={() => onOptionSelect('aftermarket')}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Choose This Option
          </button>
        </div>
        )}

        {/* On-Site Repair */}
        {getPrice(baseOnsitePrice, onsiteExtended) > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg border hover:border-black transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">On-Site Repair</h3>
              <div className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm mt-2">
                <Tool className="w-4 h-4 mr-1" />
                Premium Service
              </div>
              <div className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded-full text-sm mt-2 ml-2">
                <Ticket className="w-4 h-4 mr-1" />
                Student Discount -10%
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Expert repair service at your location with original manufacturer screen. Perfect for busy professionals and businesses.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-sm mb-2">What You Get:</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-purple-600" />
                Repair at your location
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-purple-600" />
                Original manufacturer screen
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 mr-2 text-purple-600" />
                Premium service experience
              </li>
            </ul>
          </div>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold">
              ${getPrice(baseOnsitePrice, onsiteExtended)}
            </div>
            <div className="text-sm text-gray-600">Total Price</div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Technician arrives in {technicianInfo ? technicianInfo.duration : '2 hours'}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              3 months Fyxters guarantee
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              Technician comes to you
            </div>
          </div>

          <label className="flex items-center mb-4 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={onsiteExtended}
              onChange={(e) => setOnsiteExtended(e.target.checked)}
            />
            Add 12-month extended guarantee (+$10)
          </label>

          <button
            onClick={() => onOptionSelect('onsite')}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Choose This Option
          </button>
        </div>
       )}
      </div>
      {/* New Protection and Charging Cable Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg p-6 mt-8 transition-transform duration-500 hover:scale-105">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 text-white mb-6 md:mb-0 md:mr-8">
            <div className="flex items-center mb-3">
              <Gift className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold">Free Bonus with Every Repair!</h3>
            </div>
            <p className="text-emerald-50 mb-4">
              We go above and beyond to ensure your device stays protected and charged.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-emerald-200" />
                <span>Free screen protector ($19.99 value)</span>
              </li>
              <li className="flex items-center">
                <Cable className="w-5 h-5 mr-2 text-emerald-200" />
                <span>Complimentary charging cable ($14.99 value)</span>
              </li>
            </ul>
          </div>
          <div className="text-center bg-white bg-opacity-10 rounded-lg p-4 md:p-6">
            <div className="text-3xl font-bold text-white mb-1">$34.98</div>
            <div className="text-emerald-100 text-sm mb-3">Total Value</div>
            <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <Gift className="w-4 h-4 mr-1" />
              Included Free
            </div>
          </div>
        </div>
      </div>
  {/* Testimonials Section */}
  <div className="mt-10">
        <h2 className="text-2xl font-semibold text-center mb-6">What Our Customers Say</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex-shrink-0 min-w-[280px] sm:w-80 snap-start transition-transform duration-500 hover:scale-105">
            <img
              src="https://res.cloudinary.com/dqwxexsra/image/upload/v1743545535/Screenshot_20250401_181011_WhatsAppBusiness_lxtun1.jpg"
              alt="Customer 1"
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold">Abdel</p>
            <p className="text-gray-600 italic mb-4">
              “Was Really quick, Service and Price exceeded my expectations.”
            </p>
            <div className="flex justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.285 3.967a1 1 0 00.95.69h4.168c.969 0 1.372 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.285 3.966c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.84-.196-1.54-1.118l1.285-3.966a1 1 0 00-.364-1.118l-3.37-2.449c-.784-.57-.38-1.81.589-1.81h4.168a1 1 0 00.95-.69l1.285-3.967z" />
                </svg>
              ))}
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex-shrink-0 min-w-[280px] sm:w-80 snap-start transition-transform duration-500 hover:scale-105">
            <img
              src="https://via.placeholder.com/80"
              alt="Customer 2"
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold">Jane Smith</p>
            <p className="text-gray-600 italic mb-4">
              “Easy to use, great results. Would recommend!”
            </p>
            <div className="flex justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.285 3.967a1 1 0 00.95.69h4.168c.969 0 1.372 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.285 3.966c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.84-.196-1.54-1.118l1.285-3.966a1 1 0 00-.364-1.118l-3.37-2.449c-.784-.57-.38-1.81.589-1.81h4.168a1 1 0 00.95-.69l1.285-3.967z" />
                </svg>
              ))}
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex-shrink-0 min-w-[280px] sm:w-80 snap-start transition-transform duration-500 hover:scale-105">
            <img
              src="https://via.placeholder.com/80"
              alt="Customer 3"
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <p className="font-semibold">Alex Johnson</p>
            <p className="text-gray-600 italic mb-4">
              “Helped me solve my problem quickly and easily!”
            </p>
            <div className="flex justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.285 3.967a1 1 0 00.95.69h4.168c.969 0 1.372 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.285 3.966c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.84-.196-1.54-1.118l1.285-3.966a1 1 0 00-.364-1.118l-3.37-2.449c-.784-.57-.38-1.81.589-1.81h4.168a1 1 0 00.95-.69l1.285-3.967z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}