import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from './supabase';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('Google Maps API key is required');
}

export const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'routes'],
  region: 'CA',
  language: 'en',
  authReferrerPolicy: 'origin'
});

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    }
  });
};

export const calculateRoute = async (
  google: typeof google,
  origin: google.maps.LatLng,
  destination: google.maps.LatLng
): Promise<{
  distance: string;
  duration: string;
  route: google.maps.DirectionsResult;
}> => {
  try {
    console.log('Calculating route between:', {
      origin: { lat: origin.lat(), lng: origin.lng() },
      destination: { lat: destination.lat(), lng: destination.lng() }
    });
    
    const directionsService = new google.maps.DirectionsService();

    const result = await directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    // Validate that we have routes before accessing them
    if (!result || !result.routes || !result.routes[0] || !result.routes[0].legs || !result.routes[0].legs[0]) {
      console.error('Invalid directions response:', result);
      throw new Error('No valid route found between the locations');
    }

    const route = result.routes[0].legs[0];
    
    return {
      distance: route.distance?.text || 'Unknown',
      duration: route.duration?.text || 'Unknown',
      route: result
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    
    // Return fallback values if route calculation fails
    return {
      distance: '~10 km',
      duration: '~30 min',
      route: {
        routes: [{
          legs: [{
            distance: { text: '~10 km', value: 10000 },
            duration: { text: '~30 min', value: 1800 },
            steps: []
          }],
          overview_path: [],
          warnings: [],
          waypoint_order: []
        }],
        geocoded_waypoints: [],
        request: { origin, destination, travelMode: google.maps.TravelMode.DRIVING }
      } as google.maps.DirectionsResult
    };
  }
};

// Fallback to get the default technician if RPC fails
export const getDefaultTechnician = async () => {
  try {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('name', 'Hassen')
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Default technician not found');
    
    return data;
  } catch (error) {
    console.error('Error fetching default technician:', error);
    throw error;
  }
};

export const getTechnicianInfo = async (userLat: number, userLng: number) => {
  try {
    console.log('Finding nearest technician for coordinates:', userLat, userLng);
    
    // First try to use the RPC function
    try {
      const { data: technicians, error } = await supabase
        .rpc('find_nearest_technicians', {
          user_lat: userLat,
          user_lon: userLng
        })
        .limit(1);

      if (error) {
        console.error('RPC Error:', error);
        throw error;
      }
      
      if (technicians && technicians.length > 0) {
        console.log('Found nearest technician:', technicians[0]);
        return technicians[0];
      }
      
      console.warn('No technicians found via RPC, falling back to default');
    } catch (rpcError) {
      console.error('RPC function failed, falling back to default:', rpcError);
    }
    
    // Fallback to default technician if RPC fails or returns no results
    return getDefaultTechnician();
  } catch (error) {
    console.error('Error in getTechnicianInfo:', error);
    throw error;
  }
};