import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Mail, User as UserIcon, Check } from 'lucide-react';
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
      console.log("Collecting customer info:", { name, email, phone });
      
      // Now try to insert into customer_info table
      const { error: insertError } = await supabase
        .from('customer_info')
        .insert([{ name, email, phone }]);

      if (insertError) {
        console.error('Error inserting customer info:', insertError);
        // Continue with the flow even if database insert fails
      } else {
        console.log("Customer info saved to database successfully");
      }
      
      // Pass the information to the parent component
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
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