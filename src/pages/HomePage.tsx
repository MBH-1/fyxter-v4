import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getCurrentLocation, getTechnicianInfo } from '../lib/maps';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone as PhoneIcon, MapPin, Clock, Shield, PenTool as Tool, Ticket, SearchIcon, Check, CreditCard, Info, X } from 'lucide-react';

// --- SCREEN INFO MODAL (Clean White) ---
function ScreenInfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Screen Quality Guide</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600">
            <div className="space-y-4">
              <h4 className="font-bold text-blue-600">Original (OEM)</h4>
              <p className="text-sm">The exact same panel your phone came with. Perfect colors, high brightness, and original touch sensitivity.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">Aftermarket</h4>
              <p className="text-sm">High-quality replacement. Great for those on a budget who want a clear, functional screen without the OEM price tag.</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-center">
          <button onClick={onClose} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Close</button>
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

  // FIXED: Autocomplete initializes independently on mount
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
    } catch (err) { console.error("Google Maps failed", err); }
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
        alert("Location access denied. Please enable location in your browser settings.");
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
    <main className="min-h-screen bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-32">
      <Helmet><title>Fyxters – Premium Repair Service</title></Helmet>

      {orderComplete ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-green-500" /></div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h2>
          <p className="text-gray-500 text-lg">A Fyxter will call you in 15 mins.</p>
        </div>
      ) : showPayment && customerInfo ? (
        <PaymentConfirmation customerName={customerInfo.name} deviceModel={selectedDevice?.model || ''} repairType="Screen Repair" serviceType={selectedOption!} price={getSelectedPrice()} onBack={() => setShowPayment(false)} onComplete={() => setOrderComplete(true)} />
      ) : (
        <div className="space-y-12">
          
          {/* STEP 1: DEVICE (SIMPLE WHITE CARD) */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">1. Select Your Device</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase text-gray-400">Brand</label>
                <div className="flex flex-col gap-2">
                  {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                    <button key={b} onClick={() => setSelectedBrand(b)} className={`py-3 px-4 text-left rounded-xl border-2 font-bold transition-all ${selectedBrand === b ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 hover:border-gray-200 text-gray-600'}`}>{b}</button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-3 space-y-4">
                <label className="text-xs font-bold uppercase text-gray-400">Model</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                    <button key={m.id} onClick={() => handleDeviceSelect(m)} className={`py-4 px-2 text-sm font-bold rounded-xl border-2 transition-all ${selectedDevice?.id === m.id ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100' : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-gray-200'}`}>{m.model.replace(/_/g, ' ')}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* STEP 2: PRICING (SIMPLE WHITE CARDS) */}
          {selectedDevice && (
            <section ref={priceSectionRef} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">2. Choose Part Quality</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['aftermarket', 'original', 'onsite'].map((opt) => {
                  const isSel = selectedOption === opt;
                  const price = opt === 'onsite' ? selectedDevice.original_part + 100 : opt === 'original' ? selectedDevice.original_part : selectedDevice.aftermarket_part;
                  const label = opt === 'onsite' ? 'Home Service' : opt === 'original' ? 'Original Screen' : 'Aftermarket Screen';
                  
                  return (
                    <div key={opt} onClick={() => handleOptionSelect(opt as any)} className={`p-8 rounded-3xl border-2 cursor-pointer transition-all bg-white ${isSel ? 'border-blue-600 shadow-xl scale-105' : 'border-gray-100 hover:border-gray-300 shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isSel ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>{opt}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSel ? 'bg-blue-600 border-blue-600' : 'border-gray-200'}`}>{isSel && <Check className="w-4 h-4 text-white" />}</div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{label}</h3>
                      <div className="text-3xl font-black text-blue-600">${price}</div>
                      {opt === 'aftermarket' && <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="mt-4 text-xs font-bold text-gray-400 hover:text-blue-600 flex items-center gap-1"><Info className="w-3 h-3" /> Compare Qualities</button>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* STEP 3: LOCATION (SIMPLE WHITE CARD) */}
          {selectedOption && (
            <section ref={locationSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">3. Service Location</h2>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input ref={searchInputRef} type="text" placeholder="Enter Address..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
                    </div>
                    <button onClick={handleGetLocation} className="px-5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"><MapPin className={locationLoading ? "animate-pulse" : ""} /></button>
                  </div>
                  {technicianInfo && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">{technicianInfo.name[0]}</div>
                        <div>
                          <div className="font-bold text-gray-900">{technicianInfo.name}</div>
                          <div className="text-sm text-gray-500">Arriving in {technicianInfo.duration}</div>
                        </div>
                      </div>
                      <div className="text-blue-600 font-bold">{technicianInfo.rating.toFixed(1)} ⭐</div>
                    </div>
                  )}
                </div>
              </div>
              <div id="map" className="min-h-[350px] bg-gray-100 rounded-3xl overflow-hidden border-2 border-white shadow-inner" />
            </section>
          )}

          {/* TRUST BADGES (CLEAN WHITE) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
               <Shield className="text-blue-500 w-8 h-8" />
               <div className="text-sm text-gray-600 font-bold">6-Month Warranty</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
               <CreditCard className="text-blue-500 w-8 h-8" />
               <div className="text-sm text-gray-600 font-bold">Pay After Repair</div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
               <Ticket className="text-blue-500 w-8 h-8" />
               <div className="text-sm text-gray-600 font-bold">Student Pricing (-10%)</div>
             </div>
          </div>
        </div>
      )}

      {/* STICKY FOOTER (CLEAN LIGHT DESIGN) */}
      {selectedDevice && selectedOption && !orderComplete && !showPayment && (
        <div className="fixed bottom-0 left-0 right-0 z-[500] p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Price</div>
              <div className="text-2xl font-black text-gray-900 leading-tight">${getSelectedPrice()}</div>
            </div>
            <button onClick={() => {
              if(!userLocation) {
                locationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                alert("Please enter your location first.");
              } else {
                setCustomerInfo({ name: '', email: '', phone: '' });
              }
            }} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">Book Repair</button>
          </div>
        </div>
      )}
      <ScreenInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </main>
  );
}
