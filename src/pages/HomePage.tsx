import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getCurrentLocation, getTechnicianInfo } from '../lib/maps';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Shield, PenTool as Tool, SearchIcon, Check, Star, Info, X, ChevronRight, Store, Navigation, Phone } from 'lucide-react';

// --- PREMIUM MODAL: "What's the Difference?" ---
function DifferenceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Part Comparison</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="inline-flex px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">Original Quality</div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">Factory-grade OLED panels. Guaranteed color accuracy, peak brightness, and 100% FaceID compatibility.</p>
          </div>
          <div className="space-y-4">
            <div className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">Aftermarket</div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">High-quality LCD alternative. Rigorously tested for touch sensitivity. A reliable, budget-friendly fix.</p>
          </div>
        </div>
        <div className="p-8 bg-slate-50 flex justify-center border-t border-slate-100">
          <button onClick={onClose} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 transition-all">Understood</button>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const [devicePrices, setDevicePrices] = useState<DevicePrice[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('Iphone');
  const [selectedDevice, setSelectedDevice] = useState<DevicePrice | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [technicianInfo, setTechnicianInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDevicePrices();
    handleGetLocation();
  }, []);

  const fetchDevicePrices = async () => {
    const { data } = await supabase.from('screen_prices').select('*').order('brand', { ascending: true });
    setDevicePrices(data || []);
  };

  const handleGetLocation = async () => {
    try {
      const position = await getCurrentLocation();
      const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setUserLocation(loc);
      const tech = await getTechnicianInfo(loc.latitude, loc.longitude);
      setTechnicianInfo(tech);
    } catch (err) { console.error("Location blocked"); }
  };

  const getSelectedPrice = () => {
    if (!selectedDevice || !selectedOption) return 0;
    return selectedOption === 'original' ? selectedDevice.original_part : selectedDevice.aftermarket_part;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Helmet><title>Fyxters | Premium Repair Platform</title></Helmet>

      {/* --- SLIM NAV --- */}
      <nav className="fixed top-0 w-full z-[500] bg-white/80 backdrop-blur-lg border-b border-slate-100 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link to="/" className="text-xl font-black tracking-tighter uppercase text-slate-950">Fyxters</Link>
          <a href="tel:+15148652788" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
            <Phone className="w-4 h-4" /> (514) 865-2788
          </a>
        </div>
      </nav>

      {/* --- PRO HERO: Slate/Greyish-Blue --- */}
      <section className="pt-32 pb-20 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-slate-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-slate-800">
            <Shield className="w-3 h-3 text-blue-500" /> Platform Verified Repairs
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter">
            Instant Quotes. <br />
            <span className="text-slate-500">Vetted Fyxters.</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-xl mx-auto">
            Book professional repairs in seconds. We connect you with top-rated local shops, backed by our platform guarantee.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 -mt-10 relative z-20 space-y-24 pb-48">
        
        {/* STEP 1: DEVICE SELECTION (Minimalist) */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 lg:p-12 space-y-10">
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">01. Select Model</h2>
            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
              {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                <button key={b} onClick={() => setSelectedBrand(b)} className={`flex-1 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${selectedBrand === b ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400'}`}>{b}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                <button key={m.id} onClick={() => setSelectedDevice(m)} className={`py-4 rounded-xl border-2 font-black text-xs transition-all ${selectedDevice?.id === m.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>{m.model.replace(/_/g, ' ')}</button>
              ))}
            </div>
          </div>

          {/* STEP 2: ISSUE (Action-Oriented) */}
          {selectedDevice && (
            <div className="space-y-6 animate-in slide-in-from-top-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">02. Describe Problem</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setSelectedIssue('screen')} className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all group ${selectedIssue === 'screen' ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${selectedIssue === 'screen' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}><Tool className="w-5 h-5" /></div>
                    <div className="text-left"><div className="font-black text-xs uppercase tracking-tight">Broken Screen</div><div className="text-[10px] font-bold text-slate-400 uppercase">Display Replacement</div></div>
                  </div>
                  {selectedIssue === 'screen' && <Check className="w-5 h-5 text-slate-900" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STEP 3: FIND NEARBY (The Map Hook) */}
        {selectedIssue === 'screen' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <h2 className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">03. Local Fyxter Network</h2>
            <div className="bg-slate-50 p-3 rounded-[2.5rem] border border-slate-100">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                <div className="relative">
                  <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <input ref={searchInputRef} type="text" placeholder="Enter your address for nearest tech..." className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 font-bold placeholder:text-slate-300 transition-all" />
                </div>
                {technicianInfo && (
                  <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl shadow-xl animate-in zoom-in-95">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Store className="text-blue-400 w-6 h-6" /></div>
                      <div>
                        <div className="font-black text-sm uppercase tracking-tight">{technicianInfo.name}</div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase"><Navigation className="w-3 h-3" /> {technicianInfo.duration} Away</div>
                      </div>
                    </div>
                    <div className="text-right"><div className="flex text-yellow-400 mb-1 justify-end"><Star className="w-3 h-3 fill-yellow-400" /></div><div className="text-[10px] font-black text-slate-500 uppercase">Top Rated</div></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PART QUALITY */}
        {technicianInfo && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <h2 className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">04. Choose Part</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'aftermarket', label: 'Aftermarket', price: selectedDevice?.aftermarket_part, color: 'text-slate-950' },
                { id: 'original', label: 'Original Quality', price: selectedDevice?.original_part, color: 'text-blue-600' }
              ].map((opt) => (
                <button key={opt.id} onClick={() => setSelectedOption(opt.id as any)} className={`p-10 rounded-[2.5rem] border-4 text-left transition-all relative ${selectedOption === opt.id ? 'border-slate-950 bg-white shadow-2xl' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                  <div className="text-4xl font-black mb-4 tracking-tighter">${opt.price}</div>
                  <div className={`font-black text-xs uppercase tracking-widest mb-4 ${opt.color}`}>{opt.label}</div>
                  <div onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors underline decoration-slate-200 underline-offset-4 cursor-pointer">
                    <Info className="w-3.5 h-3.5" /> What's the difference?
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- NEAT STICKY BAR: High Contrast --- */}
      {selectedOption && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl bg-slate-950 text-white p-6 rounded-[2rem] shadow-2xl z-[500] animate-in slide-in-from-bottom-10 flex items-center justify-between border border-slate-800">
           <div className="flex items-center gap-8 pl-4">
              <div className="hidden sm:block">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Quote</div>
                 <div className="text-3xl font-black tracking-tighter">${getSelectedPrice()}</div>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="flex items-center gap-3">
                 <Shield className="w-5 h-5 text-blue-500" />
                 <div className="text-[10px] font-black uppercase tracking-widest leading-none">Platform<br/>Guaranteed</div>
              </div>
           </div>
           <button onClick={() => setCustomerInfo({ name: '', email: '', phone: '' })} className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-base uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">
              Book Repair
           </button>
        </div>
      )}

      <DifferenceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
