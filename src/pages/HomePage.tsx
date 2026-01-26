import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getTechnicianInfo } from '../lib/maps';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, Clock, SearchIcon, Check, Info, X, Monitor, 
  Battery, Smartphone, Camera, Droplets, Zap, Power, Shield, CreditCard, Ticket 
} from 'lucide-react';

export function HomePage() {
  const [devicePrices, setDevicePrices] = useState<DevicePrice[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('Iphone');
  const [selectedDevice, setSelectedDevice] = useState<DevicePrice | null>(null);
  const [selectedRepairType, setSelectedRepairType] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | 'onsite' | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [technicianInfo, setTechnicianInfo] = useState<{ distance: string; duration: string; name: string; rating: number } | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const priceSectionRef = useRef<HTMLDivElement>(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDevicePrices();
    initAutocomplete();
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
    } catch (err) { console.error("Autocomplete load error", err); }
  };

  const fetchDevicePrices = async () => {
    const { data } = await supabase.from('screen_prices').select('*').order('brand', { ascending: true });
    setDevicePrices(data || []);
  };

  const handleGetLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(loc);
        renderMap(loc);
        setLocationLoading(false);
      },
      () => { setLocationLoading(false); alert("Location access blocked. Please type your address manually."); }
    );
  };

  const renderMap = async (location: Location) => {
    const google = await loader.load();
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    const map = new google.maps.Map(mapElement, { center: { lat: location.latitude, lng: location.longitude }, zoom: 15, disableDefaultUI: true });
    new google.maps.Marker({ position: { lat: location.latitude, lng: location.longitude }, map });
    const technician = await getTechnicianInfo(location.latitude, location.longitude);
    if (technician) setTechnicianInfo({ ...technician, duration: '6 mins' });
  };

  const repairTypes = [
    { id: 'screen', title: 'Broken or Cracked Screen', icon: Monitor },
    { id: 'battery', title: 'Battery & Power Issues', icon: Battery },
    { id: 'rear_glass', title: 'Rear Glass & Chassis Repair', icon: Smartphone },
    { id: 'camera', title: 'Camera & Lens Problems', icon: Camera },
    { id: 'water', title: 'Water Damage Recovery', icon: Droplets },
    { id: 'lag', title: 'System Lag & Touch Issues', icon: Zap },
    { id: 'power', title: "Dead Device / Won't Power On", icon: Power },
  ];

  const getSelectedPrice = () => {
    if (!selectedDevice || !selectedOption) return 0;
    const base = selectedOption === 'aftermarket' ? selectedDevice.aftermarket_part : selectedDevice.original_part;
    return selectedOption === 'onsite' ? base + 100 : base;
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-32">
      <Helmet><title>Fyxters – Professional Device Repair</title></Helmet>

      {orderComplete ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
           <Check className="text-green-500 w-16 h-16 mx-auto mb-6" />
           <h2 className="text-3xl font-black text-gray-900">Request Received!</h2>
           <p className="text-gray-500 mt-4">A technician will contact you in 15 minutes.</p>
        </div>
      ) : (
        <div className="space-y-16">
          
          {/* STEP 1: SELECT DEVICE & PROBLEM */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              Select Device & Problem
            </h2>
            
            {/* Brand/Model Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              <div className="flex flex-col gap-2">
                {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                  <button key={b} onClick={() => setSelectedBrand(b)} className={`py-4 px-5 text-left rounded-2xl border-2 font-bold transition-all ${selectedBrand === b ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 bg-gray-50/50'}`}>{b}</button>
                ))}
              </div>
              <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                  <button key={m.id} onClick={() => setSelectedDevice(m)} className={`py-5 px-3 text-sm font-bold rounded-2xl border-2 transition-all ${selectedDevice?.id === m.id ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100' : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-gray-200'}`}>{m.model.replace(/_/g, ' ')}</button>
                ))}
              </div>
            </div>

            {/* Fyxters Problem Selection */}
            {selectedDevice && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500 pt-6 border-t border-gray-50">
                {repairTypes.map((repair) => (
                  <button key={repair.id} onClick={() => { setSelectedRepairType(repair.id); setTimeout(() => priceSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }} className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 text-left ${selectedRepairType === repair.id ? 'border-blue-600 bg-white shadow-md' : 'border-transparent bg-gray-50 hover:border-gray-200'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedRepairType === repair.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}><repair.icon className="w-6 h-6" /></div>
                    <span className="font-bold text-gray-800 leading-tight">{repair.title}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* STEP 2: PRICE CHOICE */}
          {selectedRepairType && (
            <section ref={priceSectionRef} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h2 className="text-2xl font-black text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                Choose Your Price
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'aftermarket', label: 'Aftermarket Screen', price: selectedDevice?.aftermarket_part, badge: 'Value Choice' },
                  { id: 'original', label: 'Original Screen', price: selectedDevice?.original_part, badge: 'Recommended' },
                  { id: 'onsite', label: 'Home Service', price: (selectedDevice?.original_part || 0) + 100, badge: 'VIP Service' }
                ].map((opt) => (
                  <div key={opt.id} onClick={() => { setSelectedOption(opt.id as any); setTimeout(() => locationSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }} className={`p-8 rounded-3xl border-2 cursor-pointer transition-all bg-white relative ${selectedOption === opt.id ? 'border-blue-600 shadow-xl scale-105 z-10' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedOption === opt.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{opt.badge}</span>
                    <div className="mt-4">
                        <h3 className="text-xl font-black text-gray-900 mb-1">{opt.label}</h3>
                        <div className="text-4xl font-black text-blue-600">${opt.price}</div>
                    </div>
                    <div className="mt-6 space-y-2">
                       <div className="flex items-center gap-2 text-sm text-gray-500"><Check className="w-4 h-4 text-green-500"/> 6-Month Warranty</div>
                       <div className="flex items-center gap-2 text-sm text-gray-500"><Check className="w-4 h-4 text-green-500"/> Verified Parts</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* STEP 3: LOCATION */}
          {selectedOption && (
            <section ref={locationSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Where are you?
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        ref={searchInputRef} 
                        type="text" 
                        placeholder="Enter your street address..." 
                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-bold" 
                      />
                    </div>
                    <button onClick={handleGetLocation} className="px-6 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors">
                      <MapPin className={locationLoading ? "animate-pulse" : ""} />
                    </button>
                  </div>
                  {technicianInfo && (
                    <div className="flex items-center justify-between p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                            <img 
                                src={`/images/technicians/${technicianInfo.name.toLowerCase().replace(' ', '-')}.jpg`} 
                                alt={technicianInfo.name} 
                                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${technicianInfo.name}&background=2563eb&color=fff`; }}
                            />
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-white"><Check className="w-2 h-2 text-white" /></div>
                        </div>
                        <div>
                          <div className="font-black text-gray-900 leading-none mb-1">{technicianInfo.name}</div>
                          <div className="text-sm font-bold text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {technicianInfo.duration}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-600 font-black">{technicianInfo.rating.toFixed(1)} ⭐</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase">Top Rated</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div id="map" className="min-h-[400px] bg-gray-50 rounded-3xl overflow-hidden border-4 border-white shadow-sm" />
            </section>
          )}
        </div>
      )}

      {/* STICKY BOOKING FOOTER */}
      {selectedDevice && selectedOption && !orderComplete && (
        <div className="fixed bottom-0 left-0 right-0 z-[500] p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Total Quote</div>
              <div className="text-3xl font-black text-gray-900 leading-none">${getSelectedPrice()}</div>
            </div>
            <button 
              onClick={() => { 
                if(!userLocation) { 
                  locationSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); 
                  alert("Please enter your address to check technician availability."); 
                } else { 
                  // Trigger final checkout/customer form
                } 
              }} 
              className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
            >
              Book Repair Now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
