import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Mail, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CustomerInfoFormProps {
  selectedOption: 'original' | 'aftermarket' | 'onsite' | 'diagnostic';
  deviceModel: string;
  price: number;
  onSubmit: (info: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
}

export function CustomerInfoForm({ selectedOption, deviceModel, price, onSubmit, onBack }: CustomerInfoFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [timing, setTiming] = useState<'now' | 'later'>('now');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setError('You must agree to the Terms and Conditions to continue');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('customer_info')
        .insert([{ name, email, phone, preferred_date: timing === 'later' ? selectedDate : null, preferred_time: timing === 'later' ? selectedTime : null }]);

      if (insertError) {
        console.error('Error inserting customer info:', insertError);
      }

      await fetch('/.netlify/functions/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
  name,
  email,
  phone,
  device: deviceModel,
  repair_type: selectedOption,
  price,
  preferred_date: timing === 'later' ? selectedDate : null,
  preferred_time: timing === 'later' ? selectedTime : null,
}),

      });

      onSubmit({ name, email, phone });
    } catch (err) {
      console.error('Error processing customer info:', err);
      setError('There was a problem processing your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
  <h2 className="text-2xl font-semibold mb-6">Enter Your Information</h2>

  {/* Repair Summary */}
  <div className="mb-6 rounded-lg border bg-gray-50 p-4">
    <h3 className="text-sm font-medium text-gray-700 mb-2">
      Repair summary
    </h3>

    <div className="text-sm text-gray-600 space-y-1">
      <div>
        <strong>Device:</strong> {deviceModel}
      </div>
      <div>
        <strong>Repair type:</strong> {selectedOption}
      </div>
      <div>
        <strong>Price:</strong> ${price}
      </div>
    </div>
  </div>

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Full Name
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <UserIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          placeholder="John Doe"
          required
        />
      </div>
    </div>


        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              placeholder="(123) 456-7890"
              required
            />
          </div>
        </div>

        {/* Timing Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">When would you like the repair?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="now"
                checked={timing === 'now'}
                onChange={() => setTiming('now')}
              />
              Repair Now
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="later"
                checked={timing === 'later'}
                onChange={() => setTiming('later')}
              />
              Choose Date & Time
            </label>
          </div>

          {timing === 'later' && (
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border p-2 rounded"
                min={new Date().toISOString().split('T')[0]}
              />
              <label className="text-sm font-medium text-gray-700">Select Time</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Time</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>1:00 PM</option>
                <option>3:00 PM</option>
                <option>5:00 PM</option>
              </select>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="border-t pt-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-5 w-5 mt-0.5 text-black rounded border-gray-300 focus:ring-black"
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> of Fyxters repair services.
            </span>
          </label>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you acknowledge that your information will be used to process your repair request in accordance with our privacy policy.
        </p>
      </form>
    </div>
  );
}

