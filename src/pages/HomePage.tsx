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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#1a1c1e] text-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-800">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#25282c]">
          <h3 className="text-xl font-bold">What's the Difference?</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <h4 className="font-bold text-lg">Original Screen</h4>
              </div>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-500 shrink-0" /> <span><strong>OLED/Retina:</strong> Perfect colors & deep blacks.</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-500 shrink-0" /> <span>Guaranteed Face ID & Touch ID.</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-500 shrink-0" /> <span>Original Gorilla Glass strength.</span></li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <h4 className="font-bold text-lg">Aftermarket Screen</h4>
              </div>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-gray-500 shrink-0" /> <span><strong>Premium LCD:</strong> Bright and vibrant.</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-gray-500 shrink-0" /> <span>Fully compatible with all sensors.</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-gray-500 shrink-0" /> <span>Reinforced tempered glass.</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-6 bg-[#25282c] flex justify-center">
          <button onClick={onClose} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95">Got it, let's choose</button>
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
  const [showDiagnosticCard, setShowDiagnosticCard] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [technicianInfo, setTechnicianInfo] = useState<{ distance: string; duration: string; name: string; rating: number } | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const priceSectionRef = useRef<HTMLDivElement>(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- INITIALIZATION ---
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
            const newLoc = { 
              latitude: place.geometry.location.lat(), 
              longitude: place.geometry.location.lng() 
            };
            setUserLocation(newLoc);
            renderMap(newLoc);
          }
        });
      }
    } catch (err) { console.error("Maps load error", err); }
  };

  const fetchDevicePrices = async () => {
    try {
      const { data, error } = await supabase.from('screen_prices').select('*').order('brand', { ascending: true });
      if (error) throw error;
      setDevicePrices(data || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleGetLocation = async () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(loc);
        renderMap(loc);
        setLocationLoading(false);
      },
      () => {
        alert("Please enable location permissions in your browser settings.");
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
      styles: [
        { elementType: "geometry", stylers: [{ color: "#212121" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#303030" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
      ],
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
      case 'diagnostic': return 30;
      default: return 0;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-32 text-gray-100">
      <Helmet>
        <title>Fyxters – Heroic Phone Repair</title>
      </Helmet>

      {orderComplete ? (
        <div className="max-w-xl mx-auto bg-[#1a1c1e] border border-gray-800 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-blue-500" /></div>
          <h2 className="text-3xl font-bold mb-4">Request Received!</h2>
          <p className="text-gray-400 text-lg">A Fyxter technician will call you within 15 minutes.</p>
        </div>
      ) : showPayment && customerInfo ? (
        <PaymentConfirmation customerName={customerInfo.name} deviceModel={selectedDevice?.model || ''} repairType="Screen Repair" serviceType={selectedOption!} price={getSelectedPrice()} onBack={() => setShowPayment(false)} onComplete={() => setOrderComplete(true)} />
      ) : (
        <div className="space-y-16">
          
          {/* STEP 1: DEVICE SELECTION */}
          <section className="bg-[#1a1c1e] p-8 rounded-3xl border border-gray-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3"><span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> Select Your Device</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Brand</label>
                <div className="flex flex-col gap-2">
                  {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                    <button key={b} onClick={() => setSelectedBrand(b)} className={`py-3 px-4 text-left rounded-xl border transition-all ${selectedBrand === b ? 'border-blue-600 bg-blue-600/10 text-blue-500' : 'border-gray-800 hover:border-gray-600 bg-gray-900/50'}`}>{b}</button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-3 space-y-4">
                <label className="text-xs font-bold uppercase text-gray-500 tracking-widest">Model</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                    <button key={m.id} onClick={() => handleDeviceSelect(m)} className={`py-4 px-2 text-sm font-semibold rounded-xl border transition-all ${selectedDevice?.id === m.id ? 'border-blue-600 bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'}`}>{m.model.replace(/_/g, ' ')}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2: REPAIR OPTIONS (PRICING) */}
          {selectedDevice && (
            <section ref={priceSectionRef} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h2 className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-3"><span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> Choose Part Quality</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* AFTERMARKET */}
                <div onClick={() => handleOptionSelect('aftermarket')} className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all ${selectedOption === 'aftermarket' ? 'border-blue-600 bg-[#1e2227] scale-105 shadow-2xl' : 'border-gray-800 bg-[#1a1c1e] hover:border-gray-700'}`}>
                  <div className="flex justify-between mb-6">
                    <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Budget Friendly</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === 'aftermarket' ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}`}>{selectedOption === 'aftermarket' && <Check className="w-4 h-4 text-white" />}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Aftermarket Screen</h3>
                  <div className="text-3xl font-black mb-6 text-blue-500">${selectedDevice.aftermarket_part}</div>
                  <ul className="space-y-3 mb-8 text-sm text-gray-400">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> Premium LCD Display</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> 6-Month Warranty</li>
                  </ul>
                  <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-gray-500 text-xs flex items-center gap-1 hover:text-white transition-colors"><Info className="w-3 h-3" /> Compare Qualities</button>
                </div>

                {/* ORIGINAL */}
                <div onClick={() => handleOptionSelect('original')} className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all ${selectedOption === 'original' ? 'border-blue-600 bg-[#1e2227] scale-105 shadow-2xl' : 'border-gray-800 bg-[#1a1c1e] hover:border-gray-700'}`}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase shadow-lg shadow-blue-900/50">Most Popular</div>
                  <div className="flex justify-between mb-6">
                    <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">OEM Quality</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === 'original' ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}`}>{selectedOption === 'original' && <Check className="w-4 h-4 text-white" />}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Original Screen</h3>
                  <div className="text-3xl font-black mb-6 text-blue-500">${selectedDevice.original_part}</div>
                  <ul className="space-y-3 mb-8 text-sm text-gray-400">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> Factory OLED Panel</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> 6-Month Warranty</li>
                  </ul>
                </div>

                {/* ON-SITE */}
                <div onClick={() => handleOptionSelect('onsite')} className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all ${selectedOption === 'onsite' ? 'border-blue-600 bg-[#1e2227] scale-105 shadow-2xl' : 'border-gray-800 bg-[#1a1c1e] hover:border-gray-700'}`}>
                  <div className="flex justify-between mb-6">
                    <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">VIP Service</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === 'onsite' ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}`}>{selectedOption === 'onsite' && <Check className="w-4 h-4 text-white" />}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Home Service</h3>
                  <div className="text-3xl font-black mb-6 text-blue-500">${selectedDevice.original_part + 100}</div>
                  <ul className="space-y-3 mb-8 text-sm text-gray-400">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> We come to your door</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-blue-500" /> Repair in 60 mins</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* STEP 3: LOCATION & MAP */}
          {selectedOption && (
            <section ref={locationSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-[#1a1c1e] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span> Where is the repair?</h2>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input ref={searchInputRef} type="text" placeholder="Enter Street Address, Montreal..." className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-white" />
                    </div>
                    <button onClick={handleGetLocation} disabled={locationLoading} className="px-5 bg-blue-600/10 text-blue-500 border border-blue-900/50 rounded-xl hover:bg-blue-600/20 transition-colors"><MapPin className={locationLoading ? "animate-pulse" : ""} /></button>
                  </div>

                  {technicianInfo && (
                    <div className="flex items-center justify-between p-5 bg-blue-600/5 rounded-2xl border border-blue-900/30">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">{technicianInfo.name[0]}</div>
                        <div>
                          <div className="font-bold">{technicianInfo.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Arriving in {technicianInfo.duration}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-500 font-bold">{technicianInfo.rating.toFixed(1)} ⭐</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Top Rated Fyxter</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div id="map" className="min-h-[400px] bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl" />
            </section>
          )}

          {/* TRUST BADGES SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#1a1c1e] p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
               <Shield className="text-blue-500 w-10 h-10" />
               <div><div className="font-bold">6-Month Warranty</div><div className="text-sm text-gray-500">On every part we replace.</div></div>
             </div>
             <div className="bg-[#1a1c1e] p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
               <CreditCard className="text-blue-500 w-10 h-10" />
               <div><div className="font-bold">Pay After Repair</div><div className="text-sm text-gray-500">Only pay when you're happy.</div></div>
             </div>
             <div className="bg-[#1a1c1e] p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
               <Ticket className="text-blue-500 w-10 h-10" />
               <div><div className="font-bold">Student Pricing</div><div className="text-sm text-gray-500">Show ID for 10% off.</div></div>
             </div>
          </div>
        </div>
      )}

      {/* STICKY FOOTER PRICE BAR */}
      {selectedDevice && selectedOption && !orderComplete && !showPayment && (
        <div className="fixed bottom-0 left-0 right-0 z-[500] p-4 bg-[#1a1c1e]/90 backdrop-blur-xl border-t border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-12 h-12 bg-blue-600/20 rounded-xl items-center justify-center text-blue-500"><Tool /></div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Final Price</div>
                <div className="text-2xl font-black text-white">${getSelectedPrice()}</div>
              </div>
            </div>
            <button onClick={() => {
              if(!userLocation) {
                locationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                alert("Please select a location first.");
              } else {
                setCustomerInfo({ name: '', email: '', phone: '' });
              }
            }} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 active:scale-95">Complete Booking</button>
          </div>
        </div>
      )}

      <ScreenInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </main>
  );
}
