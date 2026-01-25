import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getCurrentLocation, getTechnicianInfo } from '../lib/maps';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone as PhoneIcon, MapPin, Shield, PenTool as Tool, SearchIcon, Check, Star, Zap, Info, X, CreditCard, ChevronRight } from 'lucide-react';

// --- NEAT MODAL DESIGN ---
function ScreenInfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Part Comparison</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 font-black uppercase text-xs tracking-widest">Original Screen</div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">Factory-grade OLED/Retina panel. Perfect color accuracy and 100% FaceID reliability.</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-xs tracking-widest">Aftermarket Screen</div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">High-quality LCD alternative. Rigorously tested for touch responsiveness and durability.</p>
          </div>
        </div>
        <div className="p-6 bg-slate-50 flex justify-center border-t border-slate-100">
          <button onClick={onClose} className="px-10 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Close</button>
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
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | 'onsite' | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [technicianInfo, setTechnicianInfo] = useState<any>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
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
      initializeMap(loc);
    } catch (err) { console.error("Location blocked"); }
  };

  const initializeMap = async (loc: Location) => {
    const google = await loader.load();
    if (searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const newLoc = { latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() };
          setUserLocation(newLoc);
        }
      });
    }
    const tech = await getTechnicianInfo(loc.latitude, loc.longitude);
    if (tech) setTechnicianInfo(tech);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  const getSelectedPrice = () => {
    if (!selectedDevice || !selectedOption) return 0;
    if (selectedOption === 'original') return selectedDevice.original_part;
    if (selectedOption === 'aftermarket') return selectedDevice.aftermarket_part;
    if (selectedOption === 'onsite') return selectedDevice.original_part + 100;
    return 0;
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet><title>Fyxters – Professional Mobile Phone Repair</title></Helmet>

      {/* --- STICKY NAV --- */}
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <Tool className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Fyxters</span>
          </Link>
          <a href="tel:+15148652788" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-100">
            (514) 865-2788
          </a>
        </div>
      </nav>

      {!orderComplete && !showPayment && !customerInfo && (
        <>
          {/* --- SLATE-GRAY HERO SECTION --- */}
          <section className="bg-slate-900 py-20 lg:py-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
                <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20">
                  <Zap className="w-3 h-3 fill-blue-400" /> Montreal On-Demand
                </div>
                <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                  The Heroes <br />
                  <span className="text-blue-500">of Repairs.</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-lg">
                  Professional Fyxters delivered to your doorstep. Original parts, transparent pricing, and a 6-month guarantee.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button onClick={() => scrollToSection('step-1')} className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                    Start Repair <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="text-yellow-400 flex"><Star className="w-4 h-4 fill-yellow-400" /><Star className="w-4 h-4 fill-yellow-400" /><Star className="w-4 h-4 fill-yellow-400" /><Star className="w-4 h-4 fill-yellow-400" /><Star className="w-4 h-4 fill-yellow-400" /></div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l pl-3 border-slate-700">5.0 Star Rated</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-slate-800">
                  <img src="https://res.cloudinary.com/dqwxexsra/image/upload/v1739746162/DALL_E_2025-02-16_16.24.24_-_A_superhero_with_a_bold_letter_F_on_his_chest_wearing_a_modern_and_sleek_superhero_suit._He_is_holding_a_smartphone_in_one_hand_and_smiling_confide_o56dxv.webp" alt="Superhero" className="w-full h-auto" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4 border border-slate-50">
                   <Shield className="text-blue-600 w-8 h-8" />
                   <div><div className="font-black text-slate-900 text-sm italic">6-Month Warranty</div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parts & Labor</div></div>
                </div>
              </div>
            </div>
          </section>

          {/* --- SELECTION FLOW --- */}
          <main id="step-1" className="max-w-7xl mx-auto px-4 py-24 space-y-32">
            
            {/* 1. SELECT DEVICE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">1. Select Your Device</h2>
                <div className="space-y-8">
                  <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
                    {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                      <button key={b} onClick={() => setSelectedBrand(b)} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedBrand === b ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{b}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                    {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                      <button key={m.id} onClick={() => setSelectedDevice(m)} className={`py-4 rounded-2xl border-2 font-black text-sm transition-all ${selectedDevice?.id === m.id ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'border-slate-50 bg-slate-50 text-slate-600 hover:border-slate-200'}`}>{m.model.replace(/_/g, ' ')}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. LOCATION */}
              <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-10">
                  <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">2. Repair Location</h2>
                  <div className="relative">
                    <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input ref={searchInputRef} type="text" placeholder="Montreal Street Address..." className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-900" />
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center text-slate-300 italic">
                  <MapPin className="w-12 h-12 mb-4" />
                </div>
              </div>
            </div>

            {/* 3. WHAT IS THE ISSUE (FYXTER WORDING) */}
            {selectedDevice && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">3. What's the problem?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button onClick={() => setSelectedIssue('screen')} className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all text-left group ${selectedIssue === 'screen' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors ${selectedIssue === 'screen' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}><Tool className="w-6 h-6" /></div>
                    <div className="font-black text-slate-900 uppercase text-xs tracking-widest">Broken or Cracked Screen</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1">Glass replacement & display repair</div>
                  </button>
                  <button className="flex flex-col p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50/50 cursor-not-allowed opacity-60 text-left" disabled>
                    <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-slate-200 text-slate-400"><Zap className="w-6 h-6" /></div>
                    <div className="font-black text-slate-900 uppercase text-xs tracking-widest">Battery & Power Issues</div>
                    <div className="text-[10px] font-black uppercase text-blue-600 tracking-widest mt-1">Coming Soon</div>
                  </button>
                  <button className="flex flex-col p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50/50 cursor-not-allowed opacity-60 text-left" disabled>
                    <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-slate-200 text-slate-400"><Shield className="w-6 h-6" /></div>
                    <div className="font-black text-slate-900 uppercase text-xs tracking-widest">Rear Glass & Chassis</div>
                    <div className="text-[10px] font-black uppercase text-blue-600 tracking-widest mt-1">Coming Soon</div>
                  </button>
                </div>
              </div>
            )}

            {/* 4. REPAIR OPTIONS (SCREEN ONLY) */}
            {selectedIssue === 'screen' && selectedDevice && (
              <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-12 text-center">4. Choose Your Screen Quality</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* AFTERMARKET */}
                  <div onClick={() => setSelectedOption('aftermarket')} className={`p-10 rounded-[2.5rem] border-4 cursor-pointer transition-all ${selectedOption === 'aftermarket' ? 'border-blue-600 bg-white shadow-2xl scale-105' : 'border-slate-100 bg-slate-50'}`}>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Premium Alt</span>
                    <h3 className="text-xl font-black mt-6 text-slate-900">Aftermarket Screen</h3>
                    <div className="text-5xl font-black my-8 text-slate-900 tracking-tighter">${selectedDevice.aftermarket_part}</div>
                    <ul className="space-y-4 mb-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <li className="flex gap-3"><Check className="text-blue-500 w-4 h-4" /> Quality Display</li>
                      <li className="flex gap-3"><Check className="text-blue-500 w-4 h-4" /> 6-Month Warranty</li>
                    </ul>
                    <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline"><Info className="w-3.5 h-3.5" /> What's the difference?</button>
                  </div>

                  {/* ORIGINAL SCREEN */}
                  <div onClick={() => setSelectedOption('original')} className={`relative p-10 rounded-[2.5rem] border-4 cursor-pointer transition-all ${selectedOption === 'original' ? 'border-blue-600 bg-white shadow-2xl scale-105' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Most Popular</div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Factory Quality</span>
                    <h3 className="text-xl font-black mt-6 text-slate-900">Original Screen</h3>
                    <div className="text-5xl font-black my-8 text-slate-900 tracking-tighter">${selectedDevice.original_part}</div>
                    <ul className="space-y-4 mb-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <li className="flex gap-3"><Check className="text-green-500 w-4 h-4" /> Genuine OLED</li>
                      <li className="flex gap-3"><Check className="text-green-500 w-4 h-4" /> Color Perfect</li>
                      <li className="flex gap-3"><Check className="text-green-500 w-4 h-4" /> 6-Month Warranty</li>
                    </ul>
                    <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline"><Info className="w-3.5 h-3.5" /> What's the difference?</button>
                  </div>

                  {/* ON-SITE */}
                  <div onClick={() => setSelectedOption('onsite')} className={`p-10 rounded-[2.5rem] border-4 cursor-pointer transition-all ${selectedOption === 'onsite' ? 'border-blue-600 bg-white shadow-2xl scale-105' : 'border-slate-100 bg-slate-50'}`}>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">VIP Service</span>
                    <h3 className="text-xl font-black mt-6 text-slate-900">On-Site Service</h3>
                    <div className="text-5xl font-black my-8 text-slate-900 tracking-tighter">${selectedDevice.original_part + 100}</div>
                    <ul className="space-y-4 mb-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <li className="flex gap-3"><Check className="text-purple-500 w-4 h-4" /> We Come To You</li>
                      <li className="flex gap-3"><Check className="text-purple-500 w-4 h-4" /> Done in 60m</li>
                    </ul>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Incl. $100 mobile fee</div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}

      {/* --- FORM VIEWS --- */}
      {customerInfo && !showPayment && (
        <div className="py-20 animate-in fade-in slide-in-from-bottom-10">
          <CustomerInfoForm selectedOption={selectedOption!} deviceModel={selectedDevice?.model || ''} price={getSelectedPrice()} onSubmit={(info) => { setCustomerInfo(info); setShowPayment(true); }} onBack={() => setCustomerInfo(null)} />
        </div>
      )}

      {showPayment && customerInfo && (
        <div className="py-20 animate-in fade-in slide-in-from-bottom-10">
          <PaymentConfirmation customerName={customerInfo.name} deviceModel={selectedDevice?.model || ''} repairType="Screen Repair" serviceType={selectedOption!} price={getSelectedPrice()} onBack={() => setShowPayment(false)} onComplete={() => setOrderComplete(true)} />
        </div>
      )}

      {/* --- NEAT STICKY FOOTER --- */}
      {selectedDevice && selectedOption && !customerInfo && !orderComplete && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[500] animate-in slide-in-from-bottom-full">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Device</div>
                <div className="font-bold text-slate-900">{selectedDevice.model.replace(/_/g, ' ')}</div>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block" />
              <div className="hidden sm:block">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Service</div>
                <div className="font-bold text-blue-600 capitalize">{selectedOption} Screen</div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Price</div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">${getSelectedPrice()}</div>
              </div>
              <button onClick={() => setCustomerInfo({ name: '', email: '', phone: '' })} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95">Book Now</button>
            </div>
          </div>
        </div>
      )}

      {/* --- NEAT FOOTER --- */}
      <footer className="bg-slate-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-slate-400">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Tool className="text-white w-4 h-4" /></div>
              <span className="text-xl font-black text-white tracking-tighter">FYXTERS</span>
            </div>
            <p className="text-xs font-bold leading-relaxed uppercase tracking-widest">Premium Mobile Phone Repair at your door.</p>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-white mb-8">Service</h4>
            <ul className="text-xs font-black uppercase tracking-widest space-y-5"><li>Pricing Guide</li><li>Locations</li></ul>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-white mb-8">Trust</h4>
            <ul className="text-xs font-black uppercase tracking-widest space-y-5"><li>6-Month Warranty</li><li>Privacy</li></ul>
          </div>
          <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700">
             <h4 className="font-black text-white mb-2 uppercase text-[10px] tracking-widest">Direct Line</h4>
             <a href="tel:+15148652788" className="text-blue-500 font-black text-xl hover:text-white transition-colors">(514) 865-2788</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
           <div>© 2026 Fyxters Montreal</div>
           <div className="flex items-center gap-8"><CreditCard className="w-4 h-4" /> Secured by Stripe</div>
        </div>
      </footer>

      <ScreenInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
}
