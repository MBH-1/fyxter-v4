import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location } from '../lib/types';
import { loader, getTechnicianInfo } from '../lib/maps';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, Clock, Shield, PenTool as Tool, Ticket, SearchIcon, 
  Check, CreditCard, Info, X, Monitor, Battery, Smartphone, 
  Camera, Droplets, Zap, Power, Phone as PhoneIcon 
} from 'lucide-react';

// --- SCREEN INFO MODAL ---
function ScreenInfoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold">What's the Difference?</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-green-600">Original Screen</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Perfect OLED colors & deep blacks.</span></li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Guaranteed Face ID/Touch ID.</span></li>
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
        </div>
        <div className="p-6 bg-gray-50 flex justify-center">
          <button onClick={onClose} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold">Got it</button>
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
  const [selectedRepairType, setSelectedRepairType] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | 'onsite' | null>(null);
  const [technicianInfo, setTechnicianInfo] = useState<{ distance: string; duration: string; name: string; rating: number } | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const priceSectionRef = useRef<HTMLDivElement>(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchDevicePrices(); initAutocomplete(); }, []);

  const initAutocomplete = async () => {
    try {
      const google = await loader.load();
      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, { componentRestrictions: { country: "ca" } });
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
    const { data } = await supabase.from('screen_prices').select('*').order('brand', { ascending: true });
    setDevicePrices(data || []);
  };

  const renderMap = async (location: Location) => {
    const google = await loader.load();
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    const map = new google.maps.Map(mapElement, { center: { lat: location.latitude, lng: location.longitude }, zoom: 14, disableDefaultUI: true });
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

  return (
    <main className="min-h-screen bg-[#f8fafc] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-32">
      <Helmet><title>Fyxters – Premium Repair</title></Helmet>

      {orderComplete ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
           <Check className="text-green-500 w-16 h-16 mx-auto mb-6" />
           <h2 className="text-3xl font-black text-gray-900">Request Received!</h2>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* STEP 1: DEVICE & PROBLEM (REDUCED SIZE) */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
              Select Device & Problem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                {['Iphone', 'Ipad', 'Samsung', 'Google'].map(b => (
                  <button key={b} onClick={() => setSelectedBrand(b)} className={`py-3 px-4 text-left rounded-xl border-2 font-bold transition-all ${selectedBrand === b ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 bg-gray-50/50'}`}>{b}</button>
                ))}
              </div>
              <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {devicePrices.filter(d => d.brand === selectedBrand).map(m => (
                  <button key={m.id} onClick={() => setSelectedDevice(m)} className={`py-3 px-2 text-xs font-bold rounded-xl border-2 transition-all ${selectedDevice?.id === m.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-gray-200'}`}>{m.model.replace(/_/g, ' ')}</button>
                ))}
              </div>
            </div>

            {selectedDevice && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-gray-50">
                {repairTypes.map((repair) => (
                  <button key={repair.id} onClick={() => { setSelectedRepairType(repair.id); setTimeout(() => priceSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${selectedRepairType === repair.id ? 'border-blue-600 bg-blue-50' : 'border-transparent bg-gray-50'}`}>
                    <repair.icon className={`w-5 h-5 ${selectedRepairType === repair.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-bold text-[11px] text-gray-800 leading-tight">{repair.title}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* STEP 2: PRICE CHOICE (REFERENCE DESIGN) */}
          {selectedRepairType && (
            <section ref={priceSectionRef} className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'aftermarket', label: 'Aftermarket Screen', price: selectedDevice?.aftermarket_part, badge: 'Value' },
                  { id: 'original', label: 'Original Screen', price: selectedDevice?.original_part, badge: 'Recommended', popular: true },
                  { id: 'onsite', label: 'Home Service', price: (selectedDevice?.original_part || 0) + 100, badge: 'VIP' }
                ].map((opt) => (
                  <div key={opt.id} onClick={() => { setSelectedOption(opt.id as any); setTimeout(() => locationSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }} className={`p-8 rounded-3xl border-4 cursor-pointer transition-all bg-white relative ${selectedOption === opt.id ? 'border-blue-600 shadow-xl scale-105 z-10' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                    {opt.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">Most Popular</div>}
                    <h3 className="text-lg font-black text-gray-900 mb-1">{opt.label}</h3>
                    <div className="text-3xl font-black text-blue-600 mb-4">${opt.price}</div>
                    <ul className="space-y-2 mb-6 text-xs text-gray-500">
                       <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500"/> 6-Month Warranty</li>
                    </ul>
                    <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-blue-600 text-[10px] font-bold flex items-center gap-1 hover:underline"><Info className="w-3 h-3" /> What's the difference?</button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* STEP 3: LOCATION & MAP WITH TECH PHOTO */}
          {selectedOption && (
            <section ref={locationSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6">3. Where is the repair?</h2>
                <div className="space-y-6">
                  <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input ref={searchInputRef} type="text" placeholder="Enter your address..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                  </div>
                  {technicianInfo && (
                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-4">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${technicianInfo.name}&background=2563eb&color=fff&rounded=true`} 
                          alt="Tech" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" 
                        />
                        <div>
                          <div className="font-black text-gray-900 leading-none mb-1">{technicianInfo.name}</div>
                          <div className="text-xs font-bold text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {technicianInfo.duration}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-600 font-black text-sm">{technicianInfo.rating.toFixed(1)} ⭐</div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Top Rated</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div id="map" className="min-h-[300px] bg-gray-100 rounded-3xl overflow-hidden border-4 border-white shadow-sm" />
            </section>
          )}

          {/* REFERENCE IMAGE 3: WHY TRUST FYXTERS */}
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl p-8 text-white shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Shield className="text-blue-400 w-5 h-5" /> Why Trust Fyxters?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <CreditCard className="text-blue-400 w-5 h-5" />
                    <div><div className="font-bold text-sm">Pay After Repair</div><div className="text-xs text-gray-400">Paid only when finished.</div></div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <Ticket className="text-blue-400 w-5 h-5" />
                    <div><div className="font-bold text-sm">Student Discount</div><div className="text-xs text-gray-400">10% off with valid ID.</div></div>
                  </div>
                </div>
              </div>
              <div className="text-center p-6 border-2 border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                <h4 className="text-lg font-bold mb-2">Can't find your device?</h4>
                <p className="text-xs text-gray-400 mb-6">Our experts can fix almost any gadget.</p>
                <div className="flex flex-col gap-3">
                   <a href="tel:+15148652788" className="bg-white text-[#0f172a] py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm"><PhoneIcon className="w-4 h-4" /> (514) 865-2788</a>
                   <button className="bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors text-sm">Book Diagnostic ($30)</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STICKY FOOTER */}
      {selectedDevice && selectedOption && !orderComplete && (
        <div className="fixed bottom-0 left-0 right-0 z-[500] p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Total Quote</div>
              <div className="text-2xl font-black text-gray-900 leading-none">${selectedOption === 'aftermarket' ? selectedDevice.aftermarket_part : selectedDevice.original_part + (selectedOption === 'onsite' ? 100 : 0)}</div>
            </div>
            <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-md hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">Book Repair</button>
          </div>
        </div>
      )}

      <ScreenInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </main>
  );
}
