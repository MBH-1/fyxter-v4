import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getCurrentLocation, getTechnicianInfo } from '../lib/maps';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone as PhoneIcon, MapPin, Clock, Shield, PenTool as Tool, SearchIcon, Check, Star, Zap, Info, X, CreditCard, ChevronRight } from 'lucide-react';

// --- PART QUALITY MODAL ---
function ScreenInfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl scale-in-center">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-black text-gray-900">Which Screen is right for you?</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <Check className="w-5 h-5" /> <span>Original Screen</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">The gold standard. Factory-grade OLED panel. Identical to the screen your phone had on day one. Best for resale value.</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <Check className="w-5 h-5" /> <span>Aftermarket Screen</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">High-quality LCD alternative. Rigorously tested for touch sensitivity and brightness. Best for those seeking value.</p>
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-center">
          <button onClick={onClose} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95">I Understand</button>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { brand, model } = useParams();
  const [devicePrices, setDevicePrices] = useState<DevicePrice[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('Iphone');
  const [selectedDevice, setSelectedDevice] = useState<DevicePrice | null>(null);
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | 'onsite' | 'diagnostic' | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [technicianInfo, setTechnicianInfo] = useState<{ distance: string; duration: string; name: string; rating: number } | null>(null);
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
    if (tech) setTechnicianInfo({ ...tech, distance: '1.2 km', duration: '5 mins' });
  };

  // --- SMOOTH SCROLL FUNCTION ---
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getSelectedPrice = () => {
    if (!selectedDevice || !selectedOption) return 0;
    if (selectedOption === 'original') return selectedDevice.original_part;
    if (selectedOption === 'aftermarket') return selectedDevice.aftermarket_part;
    if (selectedOption === 'onsite') return selectedDevice.original_part + 100;
    return 30;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-blue-100 selection:text-blue-900">
      <Helmet><title>Fyxters – Expert Mobile Phone Repair Montreal</title></Helmet>

      {/* --- STICKY NAV --- */}
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
              <Tool className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">Fyxters</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="tel:+15148652788" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200">
              <PhoneIcon className="w-4 h-4" /> <span className="hidden sm:inline">(514) 865-2788</span>
            </a>
          </div>
        </div>
      </nav>

      {!orderComplete && !showPayment && !customerInfo && (
        <>
          {/* --- HERO SECTION --- */}
          <section className="bg-white pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-gray-50">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                  <Zap className="w-3.5 h-3.5 fill-blue-600" /> Montreal's On-Demand Repair
                </div>
                <h1 className="text-5xl lg:text-8xl font-black text-gray-900 leading-[0.95] tracking-tight">
                  The Heroes <br />
                  <span className="text-blue-600">of Repairs.</span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-500 leading-relaxed font-medium max-w-lg">
                  Professional Fyxters delivered to your doorstep. Original parts, transparent pricing, and a 6-month guarantee.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <button 
                    onClick={() => scrollToSection('repair-flow')} 
                    className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] hover:-translate-y-1 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    Start Repair <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-yellow-400" /><Star className="w-4 h-4 fill-yellow-400" /><Star className="w-4 h-4 fill-yellow-400" /><Star className="w-4 h-4 fill-yellow-400" /><Star className="w-4 h-4 fill-yellow-400" /></div>
                    <div className="text-xs font-black text-gray-900 border-l pl-3 border-gray-200 uppercase tracking-tighter">Top Rated in QC</div>
                  </div>
                </div>
              </div>

              {/* HERO IMAGE CONTAINER */}
              <div className="relative animate-in fade-in zoom-in duration-1000">
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[16px] border-white group">
                  <img 
                    src="https://res.cloudinary.com/dqwxexsra/image/upload/v1739746162/DALL_E_2025-02-16_16.24.24_-_A_superhero_with_a_bold_letter_F_on_his_chest_wearing_a_modern_and_sleek_superhero_suit._He_is_holding_a_smartphone_in_one_hand_and_smiling_confide_o56dxv.webp" 
                    alt="Fyxter Superhero" 
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                {/* Floating Elements */}
                <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl z-20 flex items-center gap-4 border border-gray-50 animate-bounce-subtle">
                   <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600"><Shield className="w-6 h-6" /></div>
                   <div><div className="font-black text-gray-900 text-sm">Certified Repair</div><div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">6-Month Warranty</div></div>
                </div>
              </div>
            </div>
          </section>

          {/* --- REPAIR FLOW --- */}
          <main id="repair-flow" className="max-w-7xl mx-auto px-4 py-20 space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* DEVICE SELECTION */}
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm">1</div>
                   <h2 className="text-2xl font-black text-gray-900">Select Your Device</h2>
                </div>
                <div className="space-y-8">
                  <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl">
                    {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                      <button key={b} onClick={() => setSelectedBrand(b)} className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${selectedBrand === b ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{b}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                    {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                      <button key={m.id} onClick={() => setSelectedDevice(m)} className={`py-4 px-2 rounded-2xl border-2 font-black text-sm transition-all ${selectedDevice?.id === m.id ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100' : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-gray-200'}`}>{m.model.replace(/_/g, ' ')}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-10 pb-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm">2</div>
                    <h2 className="text-2xl font-black text-gray-900">Where are you?</h2>
                  </div>
                  <div className="relative group">
                    <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                    <input ref={searchInputRef} type="text" placeholder="Enter Montreal Street Address..." className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-bold text-gray-900 transition-all shadow-inner" />
                  </div>
                  {technicianInfo && (
                    <div className="mt-6 flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 animate-in slide-in-from-top-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-black text-xs">{technicianInfo.name[0]}</div>
                         <div><div className="font-bold text-green-900 text-sm">Fyxter Nearby</div><div className="text-xs text-green-700">Arrives in {technicianInfo.duration}</div></div>
                      </div>
                      <div className="text-right text-xs font-black text-green-600 uppercase tracking-widest">{technicianInfo.rating} ⭐</div>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-blue-50/50 flex items-center justify-center">
                   <MapPin className="text-blue-200 w-12 h-12" />
                </div>
              </div>
            </div>

            {/* SCREEN SELECTION CARDS */}
            {selectedDevice && (
              <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000">
                <div className="text-center mb-16 space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">3. Choose Your Part</h2>
                  <p className="text-gray-500 font-medium">Select the quality that fits your lifestyle.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* AFTERMARKET */}
                  <div onClick={() => setSelectedOption('aftermarket')} className={`group p-10 rounded-[3rem] border-4 cursor-pointer transition-all ${selectedOption === 'aftermarket' ? 'border-blue-600 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] scale-105' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                    <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Premium Alt</span>
                    <h3 className="text-2xl font-black mt-6 text-gray-900">Aftermarket</h3>
                    <div className="text-5xl font-black my-8 text-gray-900 tracking-tighter">${selectedDevice.aftermarket_part}</div>
                    <ul className="space-y-4 mb-10 text-sm text-gray-500 font-bold">
                      <li className="flex gap-3"><Check className="text-blue-500 w-5 h-5 shrink-0" /> Vibrant LCD Quality</li>
                      <li className="flex gap-3"><Check className="text-blue-500 w-5 h-5 shrink-0" /> Full Touch Response</li>
                      <li className="flex gap-3"><Check className="text-blue-500 w-5 h-5 shrink-0" /> 6-Month Warranty</li>
                    </ul>
                    <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-blue-600 text-xs font-black flex items-center gap-1.5 hover:underline"><Info className="w-4 h-4" /> Why choose this?</button>
                  </div>

                  {/* ORIGINAL SCREEN */}
                  <div onClick={() => setSelectedOption('original')} className={`relative p-10 rounded-[3rem] border-4 cursor-pointer transition-all ${selectedOption === 'original' ? 'border-blue-600 bg-white shadow-[0_40px_80px_-20px_rgba(37,99,235,0.2)] scale-105' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Most Popular</div>
                    <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Genuine OLED</span>
                    <h3 className="text-2xl font-black mt-6 text-gray-900">Original Quality</h3>
                    <div className="text-5xl font-black my-8 text-gray-900 tracking-tighter">${selectedDevice.original_part}</div>
                    <ul className="space-y-4 mb-10 text-sm text-gray-500 font-bold">
                      <li className="flex gap-3"><Check className="text-green-500 w-5 h-5 shrink-0" /> Factory-Original Panel</li>
                      <li className="flex gap-3"><Check className="text-green-500 w-5 h-5 shrink-0" /> Perfect Retina Display</li>
                      <li className="flex gap-3"><Check className="text-green-500 w-5 h-5 shrink-0" /> 6-Month Warranty</li>
                    </ul>
                    <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-blue-600 text-xs font-black flex items-center gap-1.5 hover:underline"><Info className="w-4 h-4" /> Why choose this?</button>
                  </div>

                  {/* ON-SITE VIP */}
                  <div onClick={() => setSelectedOption('onsite')} className={`p-10 rounded-[3rem] border-4 cursor-pointer transition-all ${selectedOption === 'onsite' ? 'border-blue-600 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] scale-105' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                    <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">VIP Doorstep</span>
                    <h3 className="text-2xl font-black mt-6 text-gray-900">On-Site Pro</h3>
                    <div className="text-5xl font-black my-8 text-gray-900 tracking-tighter">${selectedDevice.original_part + 100}</div>
                    <ul className="space-y-4 mb-10 text-sm text-gray-500 font-bold">
                      <li className="flex gap-3"><Check className="text-purple-500 w-5 h-5 shrink-0" /> Repair at your location</li>
                      <li className="flex gap-3"><Check className="text-purple-500 w-5 h-5 shrink-0" /> Ready in 45-60 mins</li>
                      <li className="flex gap-3"><Check className="text-purple-500 w-5 h-5 shrink-0" /> Original Quality Part</li>
                    </ul>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Includes mobile call-out fee</div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}

      {/* --- FORM & PAYMENT VIEWS --- */}
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

      {/* --- STICKY CONVERSION BAR --- */}
      {selectedDevice && selectedOption && !customerInfo && !orderComplete && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-[500] animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-5xl mx-auto flex flex-row items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Quote</span>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black text-gray-900">${getSelectedPrice()}</span>
                 <span className="hidden sm:inline text-sm font-bold text-blue-600">{selectedDevice.model.replace(/_/g, ' ')}</span>
              </div>
            </div>
            <button 
              onClick={() => setCustomerInfo({ name: '', email: '', phone: '' })} 
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
            >
              Continue Booking
            </button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 pt-24 pb-12 mt-32">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200"><Tool className="text-white w-5 h-5" /></div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">FYXTERS</span>
            </div>
            <p className="text-sm font-medium text-gray-400 leading-relaxed italic">"Montreal's smartest way to fix your phone."</p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-900 mb-8">Service</h4>
            <ul className="text-sm font-bold text-gray-500 space-y-5">
              <li className="hover:text-blue-600 cursor-pointer">Pricing Guide</li>
              <li className="hover:text-blue-600 cursor-pointer">Technician Coverage</li>
              <li className="hover:text-blue-600 cursor-pointer">Become a Fyxter</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-900 mb-8">Trust</h4>
            <ul className="text-sm font-bold text-gray-500 space-y-5">
              <li className="hover:text-blue-600 cursor-pointer">6-Month Warranty</li>
              <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-blue-600 cursor-pointer">Terms of Service</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
            <h4 className="font-black text-gray-900 mb-2">Need a Pro?</h4>
            <p className="text-xs text-gray-400 font-bold mb-6">Open Daily 9am — 9pm</p>
            <a href="tel:+15148652788" className="inline-block text-blue-600 font-black text-xl hover:scale-105 transition-transform">(514) 865-2788</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">© 2026 Fyxters Montreal. All rights reserved.</div>
          <div className="flex items-center gap-8">
            <CreditCard className="w-5 h-5 text-gray-300" />
            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Payments Secured by Stripe</div>
          </div>
        </div>
      </footer>

      <ScreenInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
}
