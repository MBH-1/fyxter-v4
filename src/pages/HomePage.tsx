import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getCurrentLocation, getTechnicianInfo } from '../lib/maps';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, MapPin, Clock, Shield, PenTool as Tool, SearchIcon, Check, Info, X, Store, Navigation, Star } from 'lucide-react';

// --- PREMIUM MODAL: THE DIFFERENCE ---
function ScreenInfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Part Comparison</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="inline-flex px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">Original Quality</div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">Factory-grade OLED panels. Guaranteed color accuracy, peak brightness, and 100% FaceID compatibility.</p>
          </div>
          <div className="space-y-4">
            <div className="inline-flex px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-full">Aftermarket</div>
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
  const { brand, model } = useParams();
  const [devicePrices, setDevicePrices] = useState<DevicePrice[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('Iphone');
  const [selectedDevice, setSelectedDevice] = useState<DevicePrice | null>(null);
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | 'onsite' | 'diagnostic' | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [technicianInfo, setTechnicianInfo] = useState<any>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const technicianSectionRef = useRef<HTMLDivElement>(null);
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
    } catch (error) { console.error('Location error'); }
  };

  const initializeMap = async (location: Location) => {
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
    const tech = await getTechnicianInfo(location.latitude, location.longitude);
    setTechnicianInfo(tech);
    
    const mapElement = document.getElementById('map');
    if (mapElement) {
      const map = new google.maps.Map(mapElement, {
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 13,
        disableDefaultUI: true,
        styles: [{ featureType: 'all', elementType: 'all', stylers: [{ saturation: -100 }, { lightness: 10 }] }]
      });
      new google.maps.Marker({ position: { lat: location.latitude, lng: location.longitude }, map });
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
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Helmet><title>Fyxters | Montreal's Premium Repair Network</title></Helmet>

      {/* --- SLIM NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[500] bg-white/80 backdrop-blur-lg border-b border-slate-100 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <Link to="/" className="text-xl font-black tracking-tighter uppercase text-slate-950">Fyxters</Link>
          <a href="tel:+15148652788" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
            <Phone className="w-4 h-4" /> (514) 865-2788
          </a>
        </div>
      </nav>

      {orderComplete ? (
        <div className="pt-40 text-center">
           <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10" /></div>
           <h2 className="text-4xl font-black uppercase tracking-tighter">Request Received</h2>
           <p className="text-slate-500 mt-4">A Fyxter will call you within 15 minutes.</p>
        </div>
      ) : showPayment ? (
        <div className="pt-24"><PaymentConfirmation customerName={customerInfo?.name || ''} deviceModel={selectedDevice?.model || ''} repairType="Screen Repair" serviceType={selectedOption!} price={getSelectedPrice()} onBack={() => setShowPayment(false)} onComplete={() => setOrderComplete(true)} /></div>
      ) : (
        <div className="pt-32 pb-40 space-y-24">
          
          {/* STEP 1 & 2: DEVICE & LOCATION */}
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* 1. SELECT DEVICE */}
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">01. Select Device</h2>
              <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl">
                {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                  <button key={b} onClick={() => setSelectedBrand(b)} className={`flex-1 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${selectedBrand === b ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{b}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                  <button key={m.id} onClick={() => setSelectedDevice(m)} className={`py-4 rounded-xl border-2 font-black text-xs transition-all ${selectedDevice?.id === m.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-white bg-white text-slate-500 hover:border-slate-200'}`}>{m.model.replace(/_/g, ' ')}</button>
                ))}
              </div>
            </div>

            {/* 2. LOCATION & MAP */}
            <div ref={technicianSectionRef} className="bg-slate-950 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-10 space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">02. Service Area</h2>
                <div className="relative">
                  <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input ref={searchInputRef} type="text" placeholder="Enter your address..." className="w-full pl-14 pr-6 py-5 bg-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-white placeholder:text-slate-600" />
                </div>
                {technicianInfo && (
                  <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black">{technicianInfo.name[0]}</div>
                      <div>
                        <div className="font-black text-sm text-white uppercase">{technicianInfo.name}</div>
                        <div className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1"><Navigation className="w-3 h-3" /> {technicianInfo.duration} away</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-black text-xs">5.0 ★</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Certified Fyxter</div>
                    </div>
                  </div>
                )}
              </div>
              <div id="map" className="flex-1 min-h-[250px] opacity-60 grayscale" />
            </div>
          </div>

          {/* STEP 3: OPTIONS GRID */}
          {selectedDevice && (
            <div className="max-w-7xl mx-auto px-6 space-y-12 animate-in fade-in slide-in-from-bottom-10">
              <h2 className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">03. Choose Your Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* AFTERMARKET */}
                <div onClick={() => setSelectedOption('aftermarket')} className={`p-8 rounded-[2.5rem] border-4 cursor-pointer transition-all ${selectedOption === 'aftermarket' ? 'border-slate-900 bg-white shadow-2xl scale-105' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                   <div className="text-4xl font-black mb-4 tracking-tighter">${selectedDevice.aftermarket_part}</div>
                   <h3 className="font-black text-xs uppercase tracking-widest mb-6">Aftermarket Display</h3>
                   <ul className="space-y-3 mb-10">
                     <li className="flex gap-3 text-xs font-bold text-slate-500"><Check className="w-4 h-4 text-slate-900" /> Premium Performance</li>
                     <li className="flex gap-3 text-xs font-bold text-slate-500"><Check className="w-4 h-4 text-slate-900" /> 6-Month Guarantee</li>
                   </ul>
                   <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1 hover:underline"><Info className="w-3 h-3" /> What is this?</button>
                </div>

                {/* ORIGINAL */}
                <div onClick={() => setSelectedOption('original')} className={`relative p-8 rounded-[2.5rem] border-4 cursor-pointer transition-all ${selectedOption === 'original' ? 'border-slate-900 bg-white shadow-2xl scale-105' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Recommended</div>
                   <div className="text-4xl font-black mb-4 tracking-tighter">${selectedDevice.original_part}</div>
                   <h3 className="font-black text-xs uppercase tracking-widest mb-6 text-blue-600">Original Quality</h3>
                   <ul className="space-y-3 mb-10">
                     <li className="flex gap-3 text-xs font-bold text-slate-500"><Check className="w-4 h-4 text-blue-600" /> Genuine Factory Panel</li>
                     <li className="flex gap-3 text-xs font-bold text-slate-500"><Check className="w-4 h-4 text-blue-600" /> Perfect Color/FaceID</li>
                   </ul>
                   <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-[10px] font-black uppercase text-blue-600 flex items-center gap-1 hover:underline"><Info className="w-3 h-3" /> What is this?</button>
                </div>

                {/* ON-SITE */}
                <div onClick={() => setSelectedOption('onsite')} className={`p-8 rounded-[2.5rem] border-4 cursor-pointer transition-all ${selectedOption === 'onsite' ? 'border-slate-900 bg-white shadow-2xl scale-105' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                   <div className="text-4xl font-black mb-4 tracking-tighter">${selectedDevice.original_part + 100}</div>
                   <h3 className="font-black text-xs uppercase tracking-widest mb-6 text-purple-600">VIP On-Site Repair</h3>
                   <ul className="space-y-3 mb-10">
                     <li className="flex gap-3 text-xs font-bold text-slate-500"><Check className="w-4 h-4 text-purple-600" /> We come to your door</li>
                     <li className="flex gap-3 text-xs font-bold text-slate-500"><Check className="w-4 h-4 text-purple-600" /> Done in 60 minutes</li>
                   </ul>
                   <div className="text-[10px] font-black uppercase text-slate-300">Includes travel fee</div>
                </div>
              </div>
            </div>
          )}

          {/* TRUST SECTION */}
          <div className="max-w-4xl mx-auto px-6">
             <div className="bg-slate-950 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-6">
                   <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3"><Shield className="text-blue-500" /> The Fyxter Guarantee</h3>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-slate-400 font-bold text-sm"><Check className="text-blue-500" /> Authorized Stripe Payments</div>
                      <div className="flex items-center gap-3 text-slate-400 font-bold text-sm"><Check className="text-blue-500" /> Certified Tech Network</div>
                   </div>
                </div>
                <div className="w-full md:w-auto p-8 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                   <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Need help?</p>
                   <a href="tel:+15148652788" className="block w-full py-4 px-8 bg-white text-slate-950 rounded-2xl font-black uppercase text-sm hover:bg-slate-100 transition-all">Call Expert</a>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* STICKY FOOTER */}
      {selectedDevice && selectedOption && !orderComplete && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-slate-950 text-white p-6 rounded-[2rem] shadow-2xl z-[500] animate-in slide-in-from-bottom-10 flex items-center justify-between border border-slate-800">
           <div className="flex items-center gap-8 pl-4">
              <div className="hidden sm:block">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Quote</div>
                 <div className="text-3xl font-black tracking-tighter">${getSelectedPrice()}</div>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="flex items-center gap-3 text-blue-400">
                 <Shield className="w-5 h-5" />
                 <div className="text-[10px] font-black uppercase tracking-widest">Fyxter Verified</div>
              </div>
           </div>
           <button onClick={() => { setCustomerInfo({ name: '', email: '', phone: '' }); }} className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all">Book Repair</button>
        </div>
      )}

      <ScreenInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
}
