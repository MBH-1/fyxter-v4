import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location, RepairOption } from '../lib/types';
import { loader, getCurrentLocation, calculateRoute, getTechnicianInfo } from '../lib/maps';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone as PhoneIcon, MapPin, Clock, User, Shield, PenTool as Tool, Ticket, SearchIcon, AlertCircle, Check, CreditCard, Info, X } from 'lucide-react';

// --- NEW COMPONENT: SCREEN INFO MODAL ---
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h4 className="font-bold text-lg text-gray-800">Original Screen</h4>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-green-500 shrink-0" /> <span><strong>OLED/Retina:</strong> Perfect colors & deep blacks.</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-green-500 shrink-0" /> <span>Guaranteed Face ID & Touch ID compatibility.</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-green-500 shrink-0" /> <span>Original Gorilla Glass strength.</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-green-500 shrink-0" /> <span>Preserves phone resale value.</span></li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h4 className="font-bold text-lg text-gray-800">Aftermarket Screen</h4>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-blue-500 shrink-0" /> <span><strong>Premium LCD:</strong> Bright and vibrant colors.</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-blue-500 shrink-0" /> <span>Fully compatible with all sensors.</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-blue-500 shrink-0" /> <span>Reinforced tempered glass.</span></li>
                <li className="flex items-start gap-2"><Check className="w-5 h-5 text-blue-500 shrink-0" /> <span>Best value for budget repairs.</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-50 flex justify-center">
          <button onClick={onClose} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">Got it, let's choose</button>
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
  const [selectedRepairIssue, setSelectedRepairIssue] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DevicePrice | null>(null);
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | 'onsite' | 'diagnostic' | null>(null);
  const [showDiagnosticCard, setShowDiagnosticCard] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [technicianInfo, setTechnicianInfo] = useState<{ distance: string; duration: string; name: string; rating: number } | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const technicianSectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const brandMap: Record<string, string> = { iphone: 'iPhone', ipad: 'iPad', samsung: 'Samsung', google: 'Google' };

  const prettyBrand = brand ? (brandMap[brand.toLowerCase()] ?? (brand[0].toUpperCase() + brand.slice(1))) : null;
  const prettyModel = model ? model.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null;
  const pageTitle = (prettyBrand && prettyModel) ? `${prettyBrand} ${prettyModel} Repair | Fyxters` : 'Fyxters – Book the Best Phone Repair Technicians in Montreal';
  const pageDescription = (prettyBrand && prettyModel) ? `Fast, reliable ${prettyBrand} ${prettyModel} repair. Book an expert Fyxters technician near you today.` : 'Book the best phone repair technicians in Montreal for screen, battery, and charging port repairs.';

  const repairIssues = ['Screen Replacement', 'Battery Replacement', 'Charging Port', 'Other'];

  useEffect(() => {
    fetchDevicePrices();
    handleGetLocation();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_id')) setOrderComplete(true);
  }, []);

  useEffect(() => {
    if (brand && model && devicePrices.length > 0) {
      const formattedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
      setSelectedBrand(formattedBrand);
      const matchedDevice = devicePrices.find(d => d.model.toLowerCase() === model.toLowerCase().replace(/-/g, '_'));
      if (matchedDevice) setSelectedDevice(matchedDevice);
    }
  }, [brand, model, devicePrices]);

  const fetchDevicePrices = async () => {
    try {
      const { data, error } = await supabase.from('screen_prices').select('*').order('brand', { ascending: true });
      if (error) throw error;
      setDevicePrices(data || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleGetLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const position = await getCurrentLocation();
      const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setUserLocation(loc);
      setMapLoaded(false);
      initializeMap(loc);
    } catch (error) { setLocationError('Failed to get location. Use search bar.'); } finally { setLocationLoading(false); }
  };

  const initializeMap = async (location: Location) => {
    if (!location) return;
    try {
      const google = await loader.load();
      
      // AUTOCOMPLETE SETUP
      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry?.location) {
            const newLoc = { latitude: place.geometry.location.lat(), longitude: place.geometry.location.lng() };
            setUserLocation(newLoc);
            initializeMap(newLoc);
          }
        });
      }

      const technician = await getTechnicianInfo(location.latitude, location.longitude);
      if (!technician) return;

      const mapElement = document.getElementById('map');
      if (!mapElement) return;

      const map = new google.maps.Map(mapElement, {
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 13,
        disableDefaultUI: true,
        styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
      });

      new google.maps.Marker({ position: { lat: location.latitude, lng: location.longitude }, map, title: 'You' });
      setMapLoaded(true);
      setTechnicianInfo({ distance: '1.3 km', duration: '6 mins', name: technician.name, rating: technician.rating });
    } catch (error) { console.error('Map error:', error); }
  };

  const getDeviceBrands = () => ['Iphone', 'Ipad', 'Samsung', 'Google'].filter(b => Array.from(new Set(devicePrices.map(d => d.brand))).includes(b));
  const getDeviceModels = (brand: string) => devicePrices.filter(d => d.brand === brand).map(d => ({ id: d.id, name: d.model.replace(/_/g, ' '), value: d.model }));

  const handleBrandSelect = (brand: string) => { setSelectedBrand(brand); setSelectedDevice(null); setSelectedOption(null); };
  const handleDeviceSelect = (device: DevicePrice) => { setSelectedDevice(device); setSelectedOption(null); technicianSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  const handleRepairOptionSelect = (option: 'original' | 'aftermarket' | 'onsite' | 'diagnostic') => setSelectedOption(option);
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-32">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
       {/* SEO – invisible, safe */}
    <h1 className="sr-only">
      Phone Repair in Montreal – iPhone & Samsung Screen Repair | Fyxters
    </h1>
     <h2 className="sr-only">iPhone Screen Repair in Montreal</h2>
    <h2 className="sr-only">Samsung Screen Repair in Montreal</h2>
    <h2 className="sr-only">Same-Day Phone Repair in Montreal</h2>

      {orderComplete ? (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="w-10 h-10 text-green-600" /></div>
          <h2 className="text-3xl font-bold mb-4">Request Received!</h2>
          <p className="text-gray-600 text-lg mb-8">A Fyxter technician will call you within 15 minutes to confirm.</p>
        </div>
      ) : showPayment && customerInfo ? (
        <PaymentConfirmation customerName={customerInfo.name} deviceModel={selectedDevice?.model || ''} repairType="Screen Repair" serviceType={selectedOption!} price={getSelectedPrice()} onBack={() => setShowPayment(false)} onComplete={() => setOrderComplete(true)} />
      ) : selectedOption && !showDiagnosticCard && selectedOption !== 'diagnostic' ? (
        <CustomerInfoForm selectedOption={selectedOption} deviceModel={selectedDevice?.model || ''} price={getSelectedPrice()} onSubmit={(info) => { setCustomerInfo(info); setShowPayment(true); }} onBack={() => setSelectedOption(null)} />
      ) : (
        <div className="space-y-12">
          {/* STEP 1: DEVICE SELECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-8">1. Select Your Device</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Brand</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {getDeviceBrands().map(brand => (
                      <button key={brand} onClick={() => handleBrandSelect(brand)} className={`py-3 px-2 text-sm font-bold rounded-xl border-2 transition-all ${selectedBrand === brand ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 hover:border-gray-300'}`}>{brand}</button>
                    ))}
                  </div>
                </div>
                {selectedBrand && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Model</label>
                    <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {getDeviceModels(selectedBrand).map(m => (
                        <Link key={m.id} to={`/repair/${selectedBrand.toLowerCase()}/${m.value.toLowerCase().replace(/_/g, '-')}`} className={`py-4 px-2 text-center text-sm font-semibold rounded-xl border-2 transition-all ${selectedDevice?.model === m.value ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100' : 'border-gray-100 hover:border-gray-200 bg-gray-50'}`}>{m.name}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: SEARCH & MAP */}
            <div ref={technicianSectionRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
              <div className="p-8 pb-4">
                <h2 className="text-2xl font-bold mb-2">2. Where is the repair?</h2>
                <p className="text-gray-500 mb-6">Enter your address to see the nearest Fyxter.</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input ref={searchInputRef} type="text" placeholder="Enter Street Address, City..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
                  </div>
                  <button onClick={handleGetLocation} className="px-5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors" title="Use Current Location"><MapPin className="w-6 h-6" /></button>
                </div>
                {technicianInfo && (
                  <div className="mt-6 flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">{technicianInfo.name[0]}</div>
                      <div>
                        <div className="font-bold">{technicianInfo.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Arriving in {technicianInfo.duration}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-bold">{technicianInfo.rating.toFixed(1)} ⭐</div>
                      <div className="text-xs text-gray-400">Top Rated Fyxter</div>
                    </div>
                  </div>
                )}
              </div>
              <div id="map" className="flex-1 bg-gray-100" />
            </div>
          </div>

          {/* STEP 3: REPAIR OPTIONS GRID */}
          {selectedDevice && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h2 className="text-3xl font-bold text-center mb-4">3. Choose Your Repair Option</h2>
              <p className="text-center text-gray-500 mb-10">Select the part quality that fits your needs.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AFTERMARKET CARD */}
                <div onClick={() => handleRepairOptionSelect('aftermarket')} className={`relative p-8 rounded-3xl border-4 cursor-pointer transition-all ${selectedOption === 'aftermarket' ? 'border-blue-600 bg-white shadow-2xl scale-105 z-10' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase">Value Choice</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === 'aftermarket' ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>{selectedOption === 'aftermarket' && <Check className="w-4 h-4 text-white" />}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Aftermarket Screen</h3>
                  <div className="text-3xl font-black mb-6">${selectedDevice.aftermarket_part}</div>
                  <ul className="space-y-3 mb-8 text-sm text-gray-600">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Premium Replacement LCD</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Fully Tested Performance</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> 6-Month Fyxters Warranty</li>
                  </ul>
                  <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"><Info className="w-3 h-3" /> What's the difference?</button>
                </div>

                {/* ORIGINAL CARD (PROPOSED BEST SELLER) */}
                <div onClick={() => handleRepairOptionSelect('original')} className={`relative p-8 rounded-3xl border-4 cursor-pointer transition-all ${selectedOption === 'original' ? 'border-blue-600 bg-white shadow-2xl scale-105 z-10' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase shadow-lg">Most Popular</div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase">Factory Quality</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === 'original' ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>{selectedOption === 'original' && <Check className="w-4 h-4 text-white" />}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Original Screen</h3>
                  <div className="text-3xl font-black mb-6">${selectedDevice.original_part}</div>
                  <ul className="space-y-3 mb-8 text-sm text-gray-600">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Genuine Factory OLED Panel</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Perfect Color & Brightness</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> 6-Month Fyxters Warranty</li>
                  </ul>
                  <button onClick={(e) => { e.stopPropagation(); setIsInfoModalOpen(true); }} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"><Info className="w-3 h-3" /> What's the difference?</button>
                </div>

                {/* ON-SITE CARD */}
                <div onClick={() => handleRepairOptionSelect('onsite')} className={`relative p-8 rounded-3xl border-4 cursor-pointer transition-all ${selectedOption === 'onsite' ? 'border-blue-600 bg-white shadow-2xl scale-105 z-10' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-black uppercase">VIP Service</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption === 'onsite' ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>{selectedOption === 'onsite' && <Check className="w-4 h-4 text-white" />}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">On-Site Repair</h3>
                  <div className="text-3xl font-black mb-6">${selectedDevice.original_part + 100}</div>
                  <ul className="space-y-3 mb-8 text-sm text-gray-600">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Fyxter comes to your door</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Repaired in under 60 mins</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Original Quality Part</li>
                  </ul>
                  <div className="text-xs text-gray-400 italic">Includes $100 mobile call-out fee</div>
                </div>
              </div>
            </div>
          )}

          {/* MISC INFO BOX */}
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-10 text-white shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Shield className="text-blue-400" /> Why Trust Fyxters?</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl">
                    <CreditCard className="text-blue-300" />
                    <div><div className="font-bold">Pay After Repair</div><div className="text-sm text-gray-300">Authorized by Stripe, paid only when finished.</div></div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl">
                    <Ticket className="text-blue-300" />
                    <div><div className="font-bold">Student Discount</div><div className="text-sm text-gray-300">10% off with a valid student ID.</div></div>
                  </div>
                </div>
              </div>
              <div className="text-center p-8 border-2 border-white/20 rounded-2xl bg-white/5">
                <h4 className="text-xl font-bold mb-2">Can't find your device?</h4>
                <p className="text-gray-300 mb-6">Our experts can fix almost any gadget.</p>
                <div className="flex flex-col gap-3">
                   <a href="tel:+15148652788" className="bg-white text-blue-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"><PhoneIcon className="w-4 h-4" /> (514) 865-2788</a>
                   <button onClick={() => setShowDiagnosticCard(true)} className="bg-blue-600 py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors">Book Diagnostic ($30)</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY FOOTER PRICE BAR */}
      {selectedDevice && selectedOption && !orderComplete && !showPayment && (
        <div className="fixed bottom-0 left-0 right-0 z-[500] p-4 bg-white/90 backdrop-blur-md border-t shadow-[0_-10px_40px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-12 h-12 bg-blue-100 rounded-xl items-center justify-center text-blue-600"><Tool /></div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Selection</div>
                <div className="font-bold text-gray-900 leading-tight">{selectedDevice.model.replace(/_/g, ' ')} • <span className="text-blue-600">{selectedOption}</span></div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Price</div>
                <div className="text-2xl font-black text-gray-900">${getSelectedPrice()}</div>
              </div>
              <button onClick={() => setCustomerInfo({ name: '', email: '', phone: '' })} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95">Book Now</button>
            </div>
          </div>
        </div>
      )}

      <ScreenInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </main>
  );
}

