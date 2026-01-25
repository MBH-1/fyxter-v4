import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getCurrentLocation, getTechnicianInfo } from '../lib/maps';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Shield, PenTool as Tool, SearchIcon, Check, Star, Zap, Info, X, ChevronRight, Store, Navigation } from 'lucide-react';

export function HomePage() {
  const [devicePrices, setDevicePrices] = useState<DevicePrice[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('Iphone');
  const [selectedDevice, setSelectedDevice] = useState<DevicePrice | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | 'onsite' | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [technicianInfo, setTechnicianInfo] = useState<any>(null);
  
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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <Helmet><title>Fyxters | The Evolution of Device Repair</title></Helmet>

      {/* --- PHENOMENAL HERO (Fresha Style) --- */}
      <section className="bg-slate-900 pt-20 pb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 animate-fade-in">
            <Zap className="w-3 h-3 fill-blue-400" /> Vetted Shops. Guaranteed Parts.
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-white leading-tight tracking-tighter">
            Repairing the <br />
            <span className="text-blue-500 underline decoration-blue-500/30">Industry.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Book top-rated repair shops instantly. No calling, no guesswork—just professional Fyxters backed by our platform guarantee.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[120px]" />
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 -mt-16 relative z-20 space-y-24 pb-40">
        
        {/* STEP 1: DEVICE & SERVICE */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <span className="w-6 h-px bg-slate-200" /> 01. What are we fixing?
              </h2>
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                  <button key={b} onClick={() => setSelectedBrand(b)} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedBrand === b ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>{b}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                  <button key={m.id} onClick={() => setSelectedDevice(m)} className={`py-4 rounded-2xl border-2 font-black text-sm transition-all ${selectedDevice?.id === m.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>{m.model.replace(/_/g, ' ')}</button>
                ))}
              </div>
            </div>

            {selectedDevice && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <span className="w-6 h-px bg-slate-200" /> 02. The Issue
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => setSelectedIssue('screen')} className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all group ${selectedIssue === 'screen' ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}>
                    <div className="flex items-center gap-4 text-left">
                      <div className={`p-3 rounded-xl ${selectedIssue === 'screen' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}><Tool className="w-5 h-5" /></div>
                      <div>
                        <div className="font-black text-sm uppercase tracking-tight">Broken Screen</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Glass & Display repair</div>
                      </div>
                    </div>
                    {selectedIssue === 'screen' && <Check className="text-blue-600" />}
                  </button>
                  {/* Additional categories would go here */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: FIND A FYXTER (Better than Google Maps) */}
        {selectedIssue === 'screen' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black tracking-tighter">Nearby Fyxter Centers</h2>
              <p className="text-slate-500 font-medium">Select a certified location to see instant pricing.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-[2.5rem] border border-slate-100">
               <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                  <div className="relative">
                    <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input ref={searchInputRef} type="text" placeholder="Enter your address for the closest tech..." className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold placeholder:text-slate-300" />
                  </div>
                  
                  {technicianInfo && (
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-6 bg-white rounded-3xl border-2 border-blue-600 shadow-xl shadow-blue-100">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg"><Store className="text-blue-500 w-6 h-6" /></div>
                            <div>
                               <div className="font-black text-lg tracking-tight uppercase">{technicianInfo.name}</div>
                               <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                  <Navigation className="w-3 h-3" /> {technicianInfo.duration} Away
                               </div>
                            </div>
                          </div>
                          <div className="text-right">
                             <div className="flex text-yellow-400 mb-1 justify-end"><Star className="w-3 h-3 fill-yellow-400" /><Star className="w-3 h-3 fill-yellow-400" /><Star className="w-3 h-3 fill-yellow-400" /><Star className="w-3 h-3 fill-yellow-400" /><Star className="w-3 h-3 fill-yellow-400" /></div>
                             <div className="text-[10px] font-black text-slate-400 uppercase">Top Rated Fyxter</div>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* STEP 3: PART QUALITY (Transparency) */}
        {technicianInfo && selectedIssue && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
            <h2 className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-400">Select Part Quality</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => setSelectedOption('aftermarket')} className={`group relative p-10 rounded-[2.5rem] border-4 transition-all text-left ${selectedOption === 'aftermarket' ? 'border-blue-600 bg-white shadow-2xl' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                <div className="text-4xl font-black mb-4 tracking-tighter">${selectedDevice?.aftermarket_part}</div>
                <div className="font-black text-sm uppercase tracking-widest mb-2">Aftermarket Display</div>
                <p className="text-xs text-slate-500 font-medium">Reliable performance with a 6-month platform guarantee.</p>
              </button>

              <button onClick={() => setSelectedOption('original')} className={`group relative p-10 rounded-[2.5rem] border-4 transition-all text-left ${selectedOption === 'original' ? 'border-blue-600 bg-white shadow-2xl' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                <div className="absolute -top-4 right-8 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Recommended</div>
                <div className="text-4xl font-black mb-4 tracking-tighter">${selectedDevice?.original_part}</div>
                <div className="font-black text-sm uppercase tracking-widest mb-2 text-blue-600">Original Quality</div>
                <p className="text-xs text-slate-500 font-medium">Factory-standard OLED for the most demanding users.</p>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* --- PHENOMENAL STICKY BAR --- */}
      {selectedOption && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl shadow-blue-900/40 z-[500] animate-in slide-in-from-bottom-20 duration-500 flex items-center justify-between border border-slate-800">
           <div className="flex items-center gap-6 pl-4">
              <div className="hidden sm:block">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Quote</div>
                 <div className="text-3xl font-black tracking-tighter">${getSelectedPrice()}</div>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><Shield className="w-4 h-4" /></div>
                 <div className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-400">Guaranteed by Fyxters</div>
              </div>
           </div>
           <button onClick={() => setCustomerInfo({ name: '', email: '', phone: '' })} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-[1.5rem] font-black text-lg transition-all active:scale-95 shadow-xl shadow-blue-600/20">
              Confirm Booking
           </button>
        </div>
      )}
    </div>
  );
}
