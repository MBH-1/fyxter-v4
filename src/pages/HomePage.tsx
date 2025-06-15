import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { DevicePrice, Location, RepairOption } from '../lib/types';
import { loader, getCurrentLocation, calculateRoute, getTechnicianInfo } from '../lib/maps';
import { RepairOptions } from '../components/RepairOptions';
import { CustomerInfoForm } from '../components/CustomerInfoForm';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { useLocation } from 'react-router-dom';
import { Phone as PhoneIcon, MapPin, Clock, User, Shield, PenTool as Tool, Ticket, SearchIcon, AlertCircle , Check } from 'lucide-react';
import { CreditCard } from "lucide-react";


export function HomePage() {
  const [devicePrices, setDevicePrices] = useState<DevicePrice[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>('Iphone');
  const [selectedRepairIssue, setSelectedRepairIssue] = useState<string | null>(null);

const repairIssues = [
  'Screen Replacement',
  'Battery Replacement',
  'Charging Port',
  'Other'
];
  const [selectedDevice, setSelectedDevice] = useState<DevicePrice | null>(null);
  const [selectedOption, setSelectedOption] = useState<'original' | 'aftermarket' | 'onsite' | 'diagnostic' | null>(null);
  const [showDiagnosticCard, setShowDiagnosticCard] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [technicianInfo, setTechnicianInfo] = useState<{
    distance: string;
    duration: string;
    name: string;
    rating: number;
  } | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const technicianSectionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#select-device") {
      const element = document.getElementById("select-device");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    fetchDevicePrices();
    handleGetLocation();
    
    // Check for successful payment return
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      setOrderComplete(true);
    }
  }, []);

  const fetchDevicePrices = async () => {
    try {
      const { data, error } = await supabase
        .from('screen_prices')
        .select('*')
        .order('brand', { ascending: true });

      if (error) throw error;
      setDevicePrices(data || []);
    } catch (error) {
      console.error('Error fetching device prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const position = await getCurrentLocation();
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      console.log('Got user location:', location);
      setUserLocation(location);
      setMapLoaded(false); // Reset map loaded state
      initializeMap(location);
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Failed to get your location. Please try again or use a different browser.');
    } finally {
      setLocationLoading(false);
    }
  };

  const initializeMap = async (location: Location) => {
    if (!location) {
      console.error('No location available');
      return;
    }

    try {
      console.log('Loading Google Maps...');
      const google = await loader.load();
      console.log('Google Maps loaded successfully');
      
      // Get the closest technician based on user's location
      console.log('Finding nearest technician...');
      const technician = await getTechnicianInfo(location.latitude, location.longitude);
      
      if (!technician) {
        console.error('No technician found');
        throw new Error('No technician found nearby');
      }
      
      console.log('Technician found:', technician);
      
      // Since the RPC returns coordinates differently, we need to check if they come 
      // from an RPC response (which has coord info in the response object) or from a direct query
      let techLat: number, techLng: number;

      if (technician.latitude !== undefined && technician.longitude !== undefined) {
        // Direct query result
        techLat = technician.latitude;
        techLng = technician.longitude;
      } else if (technician.address && typeof technician.distance === 'number') {
        // This is likely from the RPC function - need to get coordinates from the default technician
        const defaultTech = await supabase
          .from('technicians')
          .select('latitude, longitude')
          .eq('name', technician.name)
          .single();
          
        if (defaultTech.error || !defaultTech.data) {
          throw new Error('Could not find technician coordinates');
        }
        
        techLat = defaultTech.data.latitude;
        techLng = defaultTech.data.longitude;
      } else {
        throw new Error(`Invalid technician coordinates data: ${JSON.stringify(technician)}`);
      }
      
      if (!techLat || !techLng) {
        console.error('Invalid technician coordinates:', technician);
        throw new Error('Invalid technician coordinates');
      }
      
      console.log('Creating map with technician at:', techLat, techLng);
      
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map element not found');
        throw new Error('Map element not found');
      }
      
      const map = new google.maps.Map(mapElement, {
        center: { 
          lat: location.latitude, 
          lng: location.longitude 
        },
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add user marker
      const userMarker = new google.maps.Marker({
        position: { 
          lat: location.latitude, 
          lng: location.longitude 
        },
        map,
        title: 'Your Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });

      // Add technician marker
      const techMarker = new google.maps.Marker({
        position: { 
          lat: techLat, 
          lng: techLng 
        },
        map,
        title: `${technician.name} - Fyxter Technician`,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        }
      });

      console.log('Calculating route...');
      try {
        // Calculate and display route
        const routeInfo = await calculateRoute(
          google,
          new google.maps.LatLng(location.latitude, location.longitude),
          new google.maps.LatLng(techLat, techLng)
        );
        
        console.log('Route calculated:', routeInfo);

        setTechnicianInfo({
          distance: routeInfo.distance,
          duration: routeInfo.duration,
          name: technician.name,
          rating: technician.rating
        });

        // Display the route on the map
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true // Hide default markers since we're using custom ones
        });
        
        directionsRenderer.setDirections(routeInfo.route);

      } catch (routeError) {
        console.error('Error calculating route:', routeError);
        // Still set technician info with fallback values if route calculation fails
        setTechnicianInfo({
          distance: '~10 km',
          duration: '~30 min',
          name: technician.name,
          rating: technician.rating
        });
      }

      // Fit bounds to show both markers
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(userMarker.getPosition()!);
      bounds.extend(techMarker.getPosition()!);
      map.fitBounds(bounds);

      // Add info windows
      const userInfo = new google.maps.InfoWindow({
        content: '<div class="p-2"><strong>Your Location</strong></div>'
      });

      const techInfo = new google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <strong>${technician.name}</strong><br>
            Fyxter Technician<br>
            Rating: ${technician.rating.toFixed(1)} ⭐<br>
            Distance: ${technicianInfo?.distance || '~10 km'}
          </div>
        `
      });

      userMarker.addListener('click', () => {
        techInfo.close();
        userInfo.open(map, userMarker);
      });

      techMarker.addListener('click', () => {
        userInfo.close();
        techInfo.open(map, techMarker);
      });

      // Open technician info by default
      techInfo.open(map, techMarker);
      
      setMapLoaded(true);
      console.log('Map initialization complete');

    } catch (error) {
      console.error('Error initializing map:', error);
      setLocationError(`Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getDeviceBrands = (): string[] => {
    // Define the desired brand order
    const brandOrder = ['Iphone', 'Ipad', 'Samsung', 'Google'];
    
    // Get all unique brands from the data
    const availableBrands = Array.from(new Set(devicePrices.map(device => device.brand)));
    
    // Return brands in the specified order, only if they exist in the data
    return brandOrder.filter(brand => availableBrands.includes(brand));
  };

  const getDeviceModels = (brand: string): RepairOption[] => {
    const models = devicePrices
      .filter(device => device.brand === brand)
      .map(device => ({
        id: device.id,
        name: device.model.replace(/_/g, ' '),
        value: device.model,
        dbValue: device.model
      }));

    return Array.from(new Set(models.map(m => JSON.stringify(m))))
      .map(m => JSON.parse(m));
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedDevice(null);
    setSelectedOption(null);
    setShowDiagnosticCard(false);
  };

  const handleDeviceSelect = (device: DevicePrice) => {
    setSelectedDevice(device);
    setSelectedOption(null);
    setShowDiagnosticCard(false);
    technicianSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRepairOptionSelect = (option: 'original' | 'aftermarket' | 'onsite' | 'diagnostic') => {
    setSelectedOption(option);
  };

  const handleDiagnosticSelect = () => {
    // Create a placeholder device if no device is selected
    const placeholderDevice = {
      id: 'diagnostic',
      brand: selectedBrand || 'Unknown',
      model: 'Device Diagnostic',
      original_part: 30,
      aftermarket_part: 30
    };
    setSelectedDevice(placeholderDevice as DevicePrice);
    setShowDiagnosticCard(true);
  };

  const handleCustomerInfoSubmit = (info: { name: string; email: string; phone: string }) => {
    setCustomerInfo(info);
    setShowPayment(true);
    
    // Save customer info to Supabase
    try {
      supabase
        .from('customer_info')
        .insert([
          { 
            name: info.name,
            email: info.email,
            phone: info.phone
          }
        ])
        .then(({ error }) => {
          if (error) console.error('Error saving customer info:', error);
          else console.log('Customer info saved successfully');
        });
    } catch (err) {
      console.error('Error saving customer info:', err);
    }
  };

  const handlePaymentComplete = () => {
    setOrderComplete(true);
    // We're not redirecting anymore, just keeping the success screen
  };

  const getSelectedPrice = () => {
    if (!selectedDevice || !selectedOption) return 0;
    
    switch (selectedOption) {
      case 'original':
        return selectedDevice.original_part;
      case 'aftermarket':
        return selectedDevice.aftermarket_part;
      case 'onsite':
        return selectedDevice.original_part + 100;
      case 'diagnostic':
        return 30; // Fixed price for diagnostic
      default:
        return 0;
    }
  };

  const handleCallSupport = () => {
    window.location.href = 'tel:+15148652788';
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {orderComplete ? (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
          <p className="text-gray-600 mb-6">
            Your request has been confirmed and a Fyxter will contact you shortly.
          </p>
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 mr-2" />
            <span>A technician will contact you soon with next steps</span>
          </div>
        </div>
      ) : showPayment && customerInfo ? (
        <PaymentConfirmation
          customerName={customerInfo.name}
          deviceModel={selectedDevice?.model || ''}
          repairType={selectedOption === 'diagnostic' ? 'Device Diagnostic' : 'Screen Repair'}
          serviceType={selectedOption!}
          price={getSelectedPrice()}
          onBack={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      ) : selectedOption && !showDiagnosticCard ? (
        <CustomerInfoForm
          selectedOption={selectedOption}
          deviceModel={selectedDevice?.model || ''}
          price={getSelectedPrice()}
          onSubmit={handleCustomerInfoSubmit}
          onBack={() => setSelectedOption(null)}
        />
      ) : showDiagnosticCard ? (
        <div className="mt-12">
          <RepairOptions
            devicePrice={selectedDevice!}
            onOptionSelect={(option) => {
              setSelectedOption(option);
              if (option === 'diagnostic') {
                setShowDiagnosticCard(false);
              }
            }}
            technicianInfo={technicianInfo}
          />
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowDiagnosticCard(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to device selection
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Device Selection */}
            <div className="space-y-6">
            <div id="select-device" className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Select Your Device</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {getDeviceBrands().map(brand => (
                        <button
                          key={brand}
                          onClick={() => handleBrandSelect(brand)}
                          className={`p-3 text-center border rounded-lg transition-colors ${
                            selectedBrand === brand 
                              ? 'border-black bg-black text-white' 
                              : 'hover:border-black'
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedBrand && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                        {getDeviceModels(selectedBrand).map(model => (
                          <button
                            key={model.id}
                            onClick={() => handleDeviceSelect(devicePrices.find(d => d.model === model.value)!)}
                            className={`p-3 text-center border rounded-lg transition-colors ${
                              selectedDevice?.model === model.value
                                ? 'border-black bg-black text-white'
                                : 'hover:border-black'
                            }`}
                          >
                            {model.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {selectedDevice && (
  <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
    <h2 className="text-xl font-semibold mb-4">What needs to be fixed?</h2>
    <div className="grid grid-cols-2 gap-2">
      {repairIssues.map((issue) => (
        <div key={issue} className="relative">
          {issue === 'Screen Replacement' ? (
            <button
              onClick={() => setSelectedRepairIssue(issue)}
              className="p-3 text-center border rounded-lg transition-colors hover:border-black"
            >
              {issue}
            </button>
          ) : (
            <div className="p-3 text-center border rounded-lg bg-gray-100 opacity-50 flex flex-col items-center justify-center">
              <span>{issue}</span>
              <span className="text-xs mt-1">(Call Us For a Quote)</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}


              {/* Can't Find Your Device Section */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg shadow-sm text-white">
                <div className="flex flex-col items-center text-center space-y-4">
                  <h3 className="text-xl font-semibold">Can't Find Your Device or Need Other Repairs?</h3>
                  <p className="text-purple-100">
                    Don't worry! Our expert technicians can repair most devices. Contact us for a custom quote.
                  </p>
                  <p className="text-purple-100">
                    <AlertCircle className="inline-block mr-1 h-4 w-4" />
                    Don't know what happened to your device? It doesn't switch on or has any other problem?
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <button
                      onClick={handleCallSupport}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                    >
                      <PhoneIcon className="w-5 h-5 mr-2" />
                      Call (514) 865-2788
                    </button>
                    
                    <button
                      onClick={handleDiagnosticSelect}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-purple-800 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      <SearchIcon className="w-5 h-5 mr-2" />
                      Diagnostic
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
<div ref={technicianSectionRef} className="bg-white rounded-lg shadow-sm overflow-hidden">
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-2">Nearest Available Technician</h2>

    {/* Update Location Button & Message */}
    <div className="mb-4">
      <button
        onClick={handleGetLocation}
        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
      >
        Update Location
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Allow location access to show the nearest available technician to you.
      </p>
    </div>

    {/* Location Status */}
    {locationLoading ? (
      <div className="text-gray-600">Getting your location...</div>
    ) : locationError ? (
      <div className="text-red-600">
        {locationError}
        <button
          onClick={handleGetLocation}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
        >
          Try Again
        </button>
      </div>
    ) : (
      <div className="mb-4 space-y-2">
        {/* Your Location */}
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          Your Location: {userLocation?.latitude.toFixed(6)}, {userLocation?.longitude.toFixed(6)}
        </div>

        {/* Technician Info */}
        {technicianInfo && (
          <>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              Distance: {technicianInfo.distance}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Estimated arrival: {technicianInfo.duration}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              Technician: {technicianInfo.name} ({technicianInfo.rating.toFixed(1)} ⭐)
            </div>
          </>
        )}
      </div>
    )}
  </div>

  {/* Map section */}
  {!mapLoaded && !locationError && (
    <div className="h-[400px] flex items-center justify-center bg-gray-100">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )}
  <div id="map" className="h-[400px]" style={{ display: mapLoaded ? 'block' : 'none' }}></div>
</div>


              {/* Repair Options */}
        {selectedDevice && !showDiagnosticCard && (
          <div className="mt-12">
            <RepairOptions
              devicePrice={selectedDevice}
              onOptionSelect={handleRepairOptionSelect}
              technicianInfo={technicianInfo}
            />
          </div>
        )}

        {/* Secure Payment & Offers Card */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 mt-8 transition-transform duration-500 hover:scale-105">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1 text-white mb-6 md:mb-0 md:mr-8">
              <div className="flex items-center mb-3">
                <CreditCard className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-semibold">Secure Payment & Exclusive Offers</h3>
              </div>
              <p className="text-purple-50 mb-4">
                Payment is authorized only after the repair is done. We use Stripe for a safe, hassle-free experience.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-200" />
                  <span>Repair Guarantee - Your Happiness Is Our Priority.</span>
                </li>
                <li className="flex items-center">
                  <Tool className="w-5 h-5 mr-2 text-purple-200" />
                  <span>Top-quality replacement parts</span>
                </li>
                <li className="flex items-center">
                  <Ticket className="w-5 h-5 mr-2 text-purple-200" />
                  <span>Student Discount (valid ID required)</span>
                </li>
                <li className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-200" />
                  <span>Stripe-secured transactions</span>
                </li>
              </ul>
            </div>
            <div className="text-center bg-white bg-opacity-10 rounded-lg p-4 md:p-6">
              <div className="text-2xl font-bold text-white mb-1">Payment After Repair</div>
              <div className="text-purple-100 text-sm mb-3">Safe, Transparent & Guaranteed</div>
              <button
                onClick={() => {
                  const section = document.getElementById('select-device');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
              >
                <Tool className="w-4 h-4 mr-1" />
                Start Repair
              </button>
            </div>
          </div>
        </div>
      </div> {/* ✅ Close .space-y-8 wrapper */}
    )}
  </main>
);
}

