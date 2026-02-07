import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getTechnicianInfo } from '../lib/maps';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, Clock, Shield, SearchIcon, Check, Info, X, Monitor, 
  Battery, Smartphone, Camera, Droplets, Zap, Power, Phone as PhoneIcon,
  CreditCard, Ticket
} from 'lucide-react';
// ✅ NEW: Import pricing queries
import { getPricingOptions, PricingOption } from '../lib/pricingQueries';

// --- SCREEN INFO MODAL ---
function ScreenInfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold">What's the Difference?</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-green-600">Original Screen</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Perfect OLED colors & deep blacks.</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Original Gorilla Glass strength.</span></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-blue-600">Aftermarket Screen</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-500 shrink-0" /> <span>Premium LCD: Bright & vibrant.</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-blue-500 shrink-0" /> <span>Best value for budget repairs.</span></li>
            </ul>
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-center">
          <button onClick={onClose} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold">Got it</button>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  // ✅ UPDATED: Changed state structure
  const [devicePrices, setDevicePrices] = useState<DevicePrice[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('Iphone');
  const [selectedDevice, setSelectedDevice] = useState<DevicePrice | null>(null);
  const [selectedRepairType, setSelectedRepairType] = useState<string | null>(null);
  
  // ✅ NEW: Store pricing options from new table
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<PricingOption | null>(null);
  
  const [technicianInfo, setTechnicianInfo] = useState<{ distance: string; duration: string; name: string; rating: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const priceSectionRef = useRef<HTMLDivElement>(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDevicePrices();
    initAutocomplete();
  }, []);

  // ✅ KEEP OLD FUNCTION: Still fetch from screen_prices for device list
  const fetchDevicePrices = async () => {
    const { data } = await supabase.from('screen_prices').select('*').order('brand', { ascending: true });
    setDevicePrices(data || []);
  };

  // ✅ NEW: Fetch pricing when device and repair type are selected
  useEffect(() => {
    if (selectedDevice && selectedRepairType) {
      fetchPricingOptions();
    }
  }, [selectedDevice, selectedRepairType]);

  const fetchPricingOptions = async () => {
    if (!selectedDevice || !selectedRepairType) return;

    // Map repair type ID to database name
    const repairTypeMap: Record<string, string> = {
      'screen': 'Broken Screen',
      'battery': 'Battery Issues',
      'rear': 'Rear Glass',
      'camera': 'Camera Problems',
      'water': 'Water Damage',
      'power': "Won't Power On"
    };

    const repairTypeName = repairTypeMap[selectedRepairType];
    if (!repairTypeName) return;

    const options = await getPricingOptions(selectedDevice.model, repairTypeName);
    if (options) {
      setPricingOptions(options);
      // Auto-select the most popular option
      const popularOption = options.find(opt => opt.is_most_popular);
      if (popularOption) {
        setSelectedOption(popularOption);
      }
    }
  };

  const initAutocomplete = async () => {
    const google = await loader.load();
    if (searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, { componentRestrictions: { country: "ca" } });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const loc = { latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() };
          setUserLocation(loc);
          renderMap(loc);
        }
      });
    }
  };

  const handleGetLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          setUserLocation(loc);
          renderMap(loc);
          setLocationLoading(false);
        },
        () => { setLocationLoading(false); alert("Please allow location access or type address manually."); }
      );
    }
  };

  const renderMap = async (location: Location) => {
    const google = await loader.load();
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    const map = new google.maps.Map(mapElement, {
      center: { lat: location.latitude, lng: location.longitude },
      zoom: 14,
      disableDefaultUI: true,
      styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]
    });
    new google.maps.Marker({ position: { lat: location.latitude, lng: location.longitude }, map });
    const tech = await getTechnicianInfo(location.latitude, location.longitude);
    if (tech) setTechnicianInfo({ ...tech, duration: '6 mins' });
  };

  const repairTypes = [
    { id: 'screen', title: 'Broken Screen', icon: Monitor },
    { id: 'battery', title: 'Battery Issues', icon: Battery },
    { id: 'rear', title: 'Rear Glass', icon: Smartphone },
    { id: 'camera', title: 'Camera Problems', icon: Camera },
    { id: 'water', title: 'Water Damage', icon: Droplets },
    { id: 'power', title: "Won't Power On", icon: Power },
  ];

  // ✅ NEW: Get label for display
  const getOptionLabel = (option: PricingOption) => {
    if (option.repair_option === 'Aftermarket') return 'Aftermarket Screen';
    if (option.repair_option === 'Original') return 'Original Screen';
    if (option.repair_option === 'Home Service') return 'Home Service';
    if (option.repair_option === 'Diagnostic') return 'Diagnostic Service';
    if (option.repair_option === 'Front Camera') return 'Front Camera Repair';
    if (option.repair_option === 'Back Camera') return 'Back Camera Repair';
    return option.repair_type;
  };

  // ✅ NEW: Get badge text
  const getOptionBadge = (option: PricingOption) => {
    if (option.repair_option === 'Aftermarket') return 'Value Choice';
    if (option.repair_option === 'Original') return 'Recommended';
    if (option.repair_option === 'Home Service') return 'VIP Service';
    if (option.repair_option === 'Diagnostic') return 'Assessment';
    return 'Standard';
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-32">
      <Helmet><title>Fyxters – Fast Device Repair</title></Helmet>

      <div className="space-y-12">
        {/* STEP 1: DEVICE SELECTION (WITH SCROLL BOX) */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
            Select Your Device & Problem
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Brand selector */}
            <div className="flex flex-col gap-3">
              {['Iphone', 'Ipad', 'Samsung', 'Google'].map((brand) => (
                <button key={brand} onClick={() => { setSelectedBrand(brand); setSelectedDevice(null); setSelectedRepairType(null); }} className={`py-4 px-6 rounded-2xl font-black transition-all ${selectedBrand === brand ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>{brand}</button>
              ))}
            </div>

            {/* Device models scroll box */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {devicePrices.filter(d => d.brand === selectedBrand).map((device) => (
                  <button key={device.id} onClick={() => { setSelectedDevice(device); setSelectedRepairType(null); setPricingOptions([]); }} className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${selectedDevice?.id === device.id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-transparent bg-gray-50 hover:border-gray-100'}`}>{device.model}</button>
                ))}
              </div>
            </div>
          </div>

          {selectedDevice && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-8 border-t border-gray-100 animate-in fade-in">
              {repairTypes.map((repair) => (
                <button key={repair.id} onClick={() => { setSelectedRepairType(repair.id); setTimeout(() => priceSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${selectedRepairType === repair.id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-transparent bg-gray-50 hover:border-gray-100'}`}>
                  <repair.icon className={`w-5 h-5 ${selectedRepairType === repair.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-bold text-[11px] text-gray-800">{repair.title}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* STEP 2: PRICE CHOICE - ✅ UPDATED TO USE NEW PRICING TABLE */}
        {selectedRepairType && pricingOptions.length > 0 && (
          <section ref={priceSectionRef} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-xl font-black text-gray-900 mb-8 text-center">Choose Your Repair Quality</h2>
            <div className={`grid grid-cols-1 ${pricingOptions.length === 3 ? 'md:grid-cols-3' : pricingOptions.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6`}>
              {pricingOptions.map((option) => (
                <div 
                  key={option.id} 
                  onClick={() => { 
                    setSelectedOption(option); 
                    setTimeout(() => locationSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); 
                  }} 
                  className={`p-8 rounded-3xl border-4 cursor-pointer transition-all bg-white relative ${
                    selectedOption?.id === option.id 
                      ? 'border-blue-600 shadow-xl scale-105 z-10' 
                      : 'border-gray-100 hover:border-gray-200 shadow-sm'
                  }`}
                >
                  {option.is_most_popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-black text-gray-900 mb-1">{getOptionLabel(option)}</h3>
                  <div className="text-4xl font-black text-blue-600 mb-6">${option.price}</div>
                  <ul className="space-y-3 mb-8 text-xs text-gray-500">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500"/> {option.warranty_months}-Month Warranty
                    </li>
                    {option.includes_expert_technician && (
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500"/> Expert Technician
                      </li>
                    )}
                  </ul>
                  {/* Only show info button for screen repairs */}
                  {selectedRepairType === 'screen' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} 
                      className="text-blue-600 text-[11px] font-bold flex items-center gap-1 hover:underline"
                    >
                      <Info className="w-3 h-3" /> What's the difference?
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STEP 3: LOCATION & MAP */}
        {selectedOption && (
          <section ref={locationSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                Where are you located?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input ref={searchInputRef} type="text" placeholder="Enter street address..." className="w-full pl-12 pr-4 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                  </div>
                  {/* LOCATION ACTIVATION BUTTON */}
                  <button onClick={handleGetLocation} disabled={locationLoading} className="px-6 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors">
                    <MapPin className={locationLoading ? "animate-pulse" : ""} />
                  </button>
                </div>

                {/* TECHNICIAN CARD */}
                {technicianInfo && (
                  <div className="flex items-center justify-between p-5 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in slide-in-from-left-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${technicianInfo.name}&background=2563eb&color=fff&rounded=true&size=128`} 
                        alt="Tech" className="w-14 h-14 rounded-full border-2 border-white shadow-md" 
                      />
                      <div>
                        <div className="font-black text-gray-900 leading-none mb-1">{technicianInfo.name}</div>
                        <div className="text-sm font-bold text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Arriving in {technicianInfo.duration}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-black text-lg">{technicianInfo.rating.toFixed(1)} ⭐</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Verified Fyxter</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div id="map" className="min-h-[350px] bg-gray-50 rounded-3xl overflow-hidden border-4 border-white shadow-sm" />
          </section>
        )}

        {/* WHY TRUST FYXTERS (IMAGE 3 DESIGN) */}
        <section className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Shield className="text-blue-400 w-6 h-6" /> Why Trust Fyxters?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"><CreditCard /></div>
                  <div><div className="font-bold">Pay After Repair</div><div className="text-sm text-gray-400">Secure authorization via Stripe.</div></div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"><Ticket /></div>
                  <div><div className="font-bold">Student Discount</div><div className="text-sm text-gray-400">10% off with valid Student ID.</div></div>
                </div>
              </div>
            </div>
            <div className="text-center p-8 border-2 border-white/10 rounded-3xl bg-white/5 backdrop-blur-md">
              <h4 className="text-xl font-bold mb-3">Can't find your device?</h4>
              <p className="text-gray-400 mb-8">Our expert technicians fix all makes and models.</p>
              <div className="flex flex-col gap-4">
                 <a href="tel:+15148652788" className="bg-white text-[#0f172a] py-4 rounded-2xl font-black hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"><PhoneIcon className="w-5 h-5" /> (514) 865-2788</a>
                 <button className="bg-blue-600 py-4 rounded-2xl font-black hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50">Book Full Diagnostic ($30)</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* STICKY FOOTER PRICE BAR - ✅ UPDATED */}
      {selectedDevice && selectedOption && (
        <div className="fixed bottom-0 left-0 right-0 z-[500] p-4 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-15px_35px_rgba(0,0,0,0.1)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Estimated Total</div>
              <div className="text-3xl font-black text-gray-900 leading-none">${selectedOption.price}</div>
            </div>
            <button className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">Complete Booking</button>
          </div>
        </div>
      )}

      <ScreenInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </main>
  );
}
