import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getCurrentLocation, getTechnicianInfo } from '../lib/maps';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone as PhoneIcon, MapPin, Clock, Shield, PenTool as Tool, Ticket, SearchIcon, Check, CreditCard, Info, X } from 'lucide-react';

// --- SCREEN INFO MODAL ---
function ScreenInfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">What's the Difference?</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <h4 className="font-bold text-lg text-gray-900">Original Screen</h4>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span><strong>OLED/Retina:</strong> Best colors.</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Original Gorilla Glass strength.</span></li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <h4 className="font-bold text-lg text-gray-900">Aftermarket</h4>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-500 shrink-0" /> <span><strong>Premium LCD:</strong> Bright & vibrant.</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-500 shrink-0" /> <span>Best value for budget repairs.</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-center">
          <button onClick={onClose} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Got it</button>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { brand, model } = useParams();
  const [devicePrices, setDevicePrices] = useState<DevicePrice[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>('Iphone');
  const [selectedDevice, setSelectedDevice] = useState<DevicePrice | null>(null);
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | 'onsite' | 'diagnostic' | null>(null);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [technicianInfo, setTechnicianInfo] = useState<{ distance: string; duration: string; name: string; rating: number } | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const priceSectionRef = useRef<HTMLDivElement>(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDevicePrices();
    initAutocomplete();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) setOrderComplete(true);
  }, []);

  const initAutocomplete = async () => {
    try {
      const google = await loader.load();
      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: "ca" },
          fields: ["geometry", "formatted_address"],
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            const newLoc = { latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() };
            setUserLocation(newLoc);
            renderMap(newLoc);
          }
        });
      }
    } catch (err) { console.error(err); }
  };

  const fetchDevicePrices = async () => {
    try {
      const { data, error } = await supabase.from('screen_prices').select('*').order('brand', { ascending: true });
      if (error) throw error;
      setDevicePrices(data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleGetLocation = async () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(loc);
        renderMap(loc);
        setLocationLoading(false);
      },
      () => {
        alert("Please enable location permissions.");
        setLocationLoading(false);
      }
    );
  };

  const renderMap = async (location: Location) => {
    const google = await loader.load();
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    const map = new google.maps.Map(mapElement, {
      center: { lat: location.latitude, lng: location.longitude },
      zoom: 14,
      disableDefaultUI: true,
    });
    new google.maps.Marker({ position: { lat: location.latitude, lng: location.longitude }, map });
    const technician = await getTechnicianInfo(location.latitude, location.longitude);
    if (technician) setTechnicianInfo({ distance: '1.3 km', duration: '6 mins', name: technician.name, rating: technician.rating });
  };

  const handleDeviceSelect = (device: DevicePrice) => {
    setSelectedDevice(device);
    setSelectedOption(null);
    setTimeout(() => priceSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleOptionSelect = (option: 'original' | 'aftermarket' | 'onsite' | 'diagnostic') => {
    setSelectedOption(option);
    setTimeout(() => locationSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const getSelectedPrice = () => {
    if (!selectedDevice || !selectedOption) return 0;
    switch (selectedOption) {
      case 'original': return selectedDevice.original_part;
      case 'aftermarket': return selectedDevice.aftermarket_part;
      case 'onsite': return selectedDevice.original_part + 100;
      default: return 0;
    }
  };

  return (
    // UPDATED BACKGROUND: Deep Hero Slate Gradient
    <main className="min-h-screen bg-gradient-to-b from-[#1e2329] to-[#0f1215] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-32">
      <Helmet>
        <title>Fyxters – Professional Phone Repair</title>
      </Helmet>

      {orderComplete ? (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-green-600" /></div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h2>
          <p className="text-gray-600 text-lg">A Fyxter will call you in 15 mins.</p>
        </div>
      ) : showPayment && customerInfo ? (
        <PaymentConfirmation customerName={customerInfo.name} deviceModel={selectedDevice?.model || ''} repairType="Screen Repair" serviceType={selectedOption!} price={getSelectedPrice()} onBack={() => setShowPayment(false)} onComplete={() => setOrderComplete(true)} />
      ) : (
        <div className="space-y-16">
          
          {/* STEP 1: DEVICE SELECTION (CLEAN WHITE CARD) */}
          <section className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"><span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-blue-200">1</span> Select Your Device</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Brand</label>
                <div className="flex flex-col gap-2">
                  {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                    <button key={b} onClick={() => setSelectedBrand(b)} className={`py-3 px-4 text-left rounded-xl border-2 font-bold transition-all ${selectedBrand === b ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 hover:border-gray-200 text-gray-600'}`}>{b}</button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-3 space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Model</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                    <button key={m.id} onClick={() => handleDeviceSelect(m)} className={`py-4 px-2 text-sm font-bold rounded-xl border-2 transition-all ${selectedDevice?.id === m.id ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-200' : 'border-gray-50 bg-gray-50 text-gray-700 hover:border-gray-200'}`}>{m.model.replace(/_/g, ' ')}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2: REPAIR OPTIONS (PRICING) */}
          {selectedDevice && (
            <section ref={priceSectionRef} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h2 className="text-3xl font-bold text-center text-white mb-10">2. Choose Your Price</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AFTERMARKET */}
                <div onClick={() => handleOptionSelect('aftermarket')} className={`relative p-8 rounded-3xl border-4 cursor-pointer transition-all ${selectedOption === 'aftermarket' ? 'border-blue-600 bg-white scale-105 shadow-2xl' : 'border-transparent bg-white/10 text-white hover:bg-white/20'}`}>
                   <div className="flex justify-between mb-4">
                     <span className={`${selectedOption === 'aftermarket' ? 'bg-blue-100 text-blue-700' : 'bg-white/10 text-gray-300'} px-3 py-1 rounded-full text-[10px] font-black uppercase`}>Value</span>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === 'aftermarket' ? 'bg-blue-600 border-blue-600' : 'border-gray-500'}`}>{selectedOption === 'aftermarket' && <Check className="w-4 h-4 text-white" />}</div>
                   </div>
                   <h3 className={`text-xl font-bold mb-2 ${selectedOption === 'aftermarket' ? 'text-gray-900' : 'text-white'}`}>Aftermarket Screen</h3>
                   <div className={`text-3xl font-black mb-6 ${selectedOption === 'aftermarket' ? 'text-blue-600' : 'text-blue-400'}`}>${selectedDevice.aftermarket_part}</div>
                   <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-xs font-bold flex items-center gap-1 hover:underline opacity-70"><Info className="w-3 h-3" /> Compare</button>
                </div>

                {/* ORIGINAL */}
                <div onClick={() => handleOptionSelect('original')} className={`relative p-8 rounded-3xl border-4 cursor-pointer transition-all ${selectedOption === 'original' ? 'border-blue-600 bg-white scale-105 shadow-2xl' : 'border-transparent bg-white/10 text-white hover:bg-white/20'}`}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">Most Popular</div>
                   <div className="flex justify-between mb-4">
                     <span className={`${selectedOption === 'original' ? 'bg-green-100 text-green-700' : 'bg-white/10 text-gray-300'} px-3 py-1 rounded-full text-[10px] font-black uppercase`}>OEM</span>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === 'original' ? 'bg-blue-600 border-blue-600' : 'border-gray-500'}`}>{selectedOption === 'original' && <Check className="w-4 h-4 text-white" />}</div>
                   </div>
                   <h3 className={`text-xl font-bold mb-2 ${selectedOption === 'original' ? 'text-gray-900' : 'text-white'}`}>Original Screen</h3>
                   <div className={`text-3xl font-black mb-6 ${selectedOption === 'original' ? 'text-blue-600' : 'text-blue-400'}`}>${selectedDevice.original_part}</div>
                </div>

                {/* ON-SITE */}
                <div onClick={() => handleOptionSelect('onsite')} className={`relative p-8 rounded-3xl border-4 cursor-pointer transition-all ${selectedOption === 'onsite' ? 'border-blue-600 bg-white scale-105 shadow-2xl' : 'border-transparent bg-white/10 text-white hover:bg-white/20'}`}>
                   <div className="flex justify-between mb-4">
                     <span className={`${selectedOption === 'onsite' ? 'bg-purple-100 text-purple-700' : 'bg-white/10 text-gray-300'} px-3 py-1 rounded-full text-[10px] font-black uppercase`}>VIP</span>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === 'onsite' ? 'bg-blue-600 border-blue-600' : 'border-gray-500'}`}>{selectedOption === 'onsite' && <Check className="w-4 h-4 text-white" />}</div>
                   </div>
                   <h3 className={`text-xl font-bold mb-2 ${selectedOption === 'onsite' ? 'text-gray-900' : 'text-white'}`}>Home Service</h3>
                   <div className={`text-3xl font-black mb-6 ${selectedOption === 'onsite' ? 'text-blue-600' : 'text-blue-400'}`}>${selectedDevice.original_part + 100}</div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 3: LOCATION & MAP (WHITE CARD) */}
          {selectedOption && (
            <section ref={locationSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3"><span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-blue-200">3</span> Where is the repair?</h2>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input ref={searchInputRef} type="text" placeholder="Enter Street Address..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-900" />
                    </div>
                    <button onClick={handleGetLocation} className="px-5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"><MapPin className={locationLoading ? "animate-pulse" : ""} /></button>
                  </div>
                  {technicianInfo && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100 text-gray-900">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">{technicianInfo.name[0]}</div>
                        <div>
                          <div className="font-bold">{technicianInfo.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {technicianInfo.duration}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-600 font-bold">{technicianInfo.rating.toFixed(1)} ⭐</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div id="map" className="min-h-[350px] bg-gray-100 rounded-3xl overflow-hidden shadow-inner border-4 border-white" />
            </section>
          )}
        </div>
      )}

      {/* STICKY FOOTER PRICE BAR (DARK PREMIUM) */}
      {selectedDevice && selectedOption && !orderComplete && !showPayment && (
        <div className="fixed bottom-0 left-0 right-0 z-[500] p-4 bg-[#1a1c1e]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-12 h-12 bg-blue-600/20 rounded-xl items-center justify-center text-blue-500"><Tool /></div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Selection</div>
                <div className="text-xl font-bold text-white leading-tight">{selectedDevice.model.replace(/_/g, ' ')} • <span className="text-blue-500 capitalize">{selectedOption}</span></div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Price</div>
                <div className="text-2xl font-black text-white">${getSelectedPrice()}</div>
              </div>
              <button onClick={() => {
                if(!userLocation) {
                  locationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  alert("Please enter your location first.");
                } else {
                  setCustomerInfo({ name: '', email: '', phone: '' });
                }
              }} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 active:scale-95">Book Now</button>
            </div>
          </div>
        </div>
      )}
      <ScreenInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </main>
  );
}
