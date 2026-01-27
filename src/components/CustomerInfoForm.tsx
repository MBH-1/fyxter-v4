import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Location } from '../lib/types';
import { Phone, Mail, User as UserIcon, Calendar, Clock, ChevronLeft, ShieldCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

type TechnicianInfo = {
  name: string;
  distance: string;
  duration: string;
  rating: number;
};

interface CustomerInfoFormProps {
  selectedOption: 'original' | 'aftermarket' | 'onsite' | 'diagnostic';
  deviceModel: string;
  price: number;
  userLocation: Location | null;
  technicianInfo: TechnicianInfo | null;
  onSubmit: (info: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
}

export function CustomerInfoForm({ selectedOption, deviceModel, price, userLocation, technicianInfo, onSubmit, onBack }: CustomerInfoFormProps) {
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
        .insert([{ 
          name, 
          email, 
          phone, 
          preferred_date: timing === 'later' ? selectedDate : null, 
          preferred_time: timing === 'later' ? selectedTime : null 
        }]);

      if (insertError) console.error('Error inserting customer info:', insertError);

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
          technician: technicianInfo,
          location: userLocation ? { latitude: userLocation.latitude, longitude: userLocation.longitude } : null,
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
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-black text-gray-900">Finalize Your Repair</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
            
            {/* PERSONAL INFO SECTION */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-600">1. Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Full Name" required />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="(514) 000-0000" required />
                </div>
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Email Address" required />
              </div>
            </div>

            {/* TIMING SELECTION */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-600">2. When should we come?</h3>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setTiming('now')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${timing === 'now' ? 'border-blue-600 bg-blue-50' : 'border-gray-50 bg-gray-50 text-gray-500'}`}>
                  <Clock className={`w-5 h-5 ${timing === 'now' ? 'text-blue-600' : ''}`} />
                  <span className="font-bold text-sm">Repair Now</span>
                </button>
                <button type="button" onClick={() => setTiming('later')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${timing === 'later' ? 'border-blue-600 bg-blue-50' : 'border-gray-50 bg-gray-50 text-gray-500'}`}>
                  <Calendar className={`w-5 h-5 ${timing === 'later' ? 'text-blue-600' : ''}`} />
                  <span className="font-bold text-sm">Schedule Later</span>
                </button>
              </div>

              {timing === 'later' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-in slide-in-from-top-2">
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-blue-500" min={new Date().toISOString().split('T')[0]} required />
                  <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select Time</option>
                    <option>10:00 AM</option>
                    <option>1:00 PM</option>
                    <option>4:00 PM</option>
                    <option>7:00 PM</option>
                  </select>
                </div>
              )}
            </div>

            {/* TERMS */}
            <div className="pt-6 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-sm text-gray-500 font-medium">
                  I agree to the <Link to="/terms" className="text-blue-600 font-bold hover:underline">Terms & Conditions</Link>. I understand I pay only after the repair is complete.
                </span>
              </label>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">{error}</div>}

            <button type="submit" disabled={loading || !termsAccepted} className="w-full py-5 bg-blue-600 text-white rounded-[20px] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50">
              {loading ? 'Processing...' : 'Secure My Booking'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: SUMMARY CARDS */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-20 h-20" /></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Order Summary</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Device</span>
                <span className="font-bold">{deviceModel.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Repair</span>
                <span className="font-bold capitalize">{selectedOption}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-gray-400 text-sm">Total Price</span>
                <span className="text-3xl font-black text-blue-400">${price}</span>
              </div>
            </div>
          </div>

          {technicianInfo && (
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Assigned Fyxter</h3>
              <div className="flex items-center gap-4">
                <img src={`https://ui-avatars.com/api/?name=${technicianInfo.name}&background=2563eb&color=fff&rounded=true`} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-black text-gray-900 leading-none mb-1">{technicianInfo.name}</div>
                  <div className="text-xs font-bold text-blue-600">{technicianInfo.rating.toFixed(1)} ⭐ (Verified)</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
            <CreditCard className="text-blue-600 w-5 h-5" />
            <p className="text-[11px] font-bold text-blue-800 leading-tight">No payment required now. You'll pay securely via Stripe after the job is done.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
{/* THE FYXTER GUARANTEE SECTION (REPAIRPAL STYLE) */}
<section className="py-20 bg-white rounded-[40px] my-12 border border-gray-100 shadow-sm overflow-hidden">
  <div className="max-w-3xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">The Fyxter Guarantee</h2>
      <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
        Finding a technician you can trust with your data and device is hard. 
        We’ve done the vetting for you.
      </p>
    </div>

    <div className="relative">
      {/* Central Connecting Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent -translate-x-1/2 hidden md:block" />

      <div className="space-y-16 relative">
        {/* Step 1: Expert Vetting */}
        <div className="flex flex-col md:flex-row items-center gap-8 group">
          <div className="md:w-1/2 md:text-right">
            <h4 className="text-xl font-black text-gray-900 mb-2">Expert Vetting</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              A comprehensive assessment of technical skills, specialized tools, and repair experience.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white z-10 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
            <Check className="w-6 h-6" />
          </div>
          <div className="md:w-1/2" />
        </div>

        {/* Step 2: Verified Track Record */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 group">
          <div className="md:w-1/2 md:text-left">
            <h4 className="text-xl font-black text-gray-900 mb-2">Verified Track Record</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Constant monitoring of customer feedback to ensure a 4.8+ star service standard.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white z-10 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
            <Check className="w-6 h-6" />
          </div>
          <div className="md:w-1/2" />
        </div>

        {/* Step 3: Fair Price Protection */}
        <div className="flex flex-col md:flex-row items-center gap-8 group">
          <div className="md:w-1/2 md:text-right">
            <h4 className="text-xl font-black text-gray-900 mb-2">Fair Price Protection</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              We audit local market rates to ensure you always get premium parts at a transparent price.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white z-10 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
            <Check className="w-6 h-6" />
          </div>
          <div className="md:w-1/2" />
        </div>

        {/* Step 4: The Fyxter Seal */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 group">
          <div className="md:w-1/2 md:text-left">
            <h4 className="text-xl font-black text-gray-900 mb-2">The Fyxter Seal</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Certification is only granted to elite technicians who pass every background and quality check.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white z-10 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
            <Check className="w-6 h-6" />
          </div>
          <div className="md:w-1/2" />
        </div>
      </div>

      {/* Final Action Button */}
      <div className="mt-20 flex flex-col items-center">
        <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
          View All Certified Locations
        </button>
      </div>
    </div>
  </div>
</section>
