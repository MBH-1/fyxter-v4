import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PenTool as Tool, MapPin, Phone, Mail, User, Briefcase, Star, Shield } from 'lucide-react';

export function TechnicianApplicationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    experience_years: '',
    specializations: [] as string[],
    certifications: '',
    availability: 'full_time',
    background_check: false,
    tools: false,
    transportation: false,
    insurance: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const specializationOptions = [
    'iPhone Repair',
    'Samsung Repair',
    'iPad Repair',
    'Screen Replacement',
    'Battery Replacement',
    'Water Damage',
    'Charging Port',
    'Camera Repair'
  ];

  const handleSpecializationChange = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get coordinates from address using Google Maps Geocoding API
      const geocoder = new google.maps.Geocoder();
      const { results } = await new Promise<google.maps.GeocoderResponse>((resolve, reject) => {
        geocoder.geocode({ address: formData.address }, (results, status) => {
          if (status === 'OK') resolve({ results });
          else reject(new Error(`Geocoding failed: ${status}`));
        });
      });

      const location = results[0].geometry.location;

      const { error: applicationError } = await supabase
        .from('technician_applications')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            latitude: location.lat(),
            longitude: location.lng(),
            experience_years: parseInt(formData.experience_years),
            specializations: formData.specializations,
            certifications: formData.certifications,
            availability: formData.availability,
            background_check_consent: formData.background_check,
            has_tools: formData.tools,
            has_transportation: formData.transportation,
            has_insurance: formData.insurance,
            status: 'pending'
          }
        ]);

      if (applicationError) throw applicationError;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        experience_years: '',
        specializations: [],
        certifications: '',
        availability: 'full_time',
        background_check: false,
        tools: false,
        transportation: false,
        insurance: false
      });
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to become a Fyxter. We'll review your application and get back to you within 2-3 business days.
          </p>
          <a
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Tool className="w-8 h-8 text-gray-600" />
        </div>
        <h1 className="text-3xl font-bold">Become a Fyxter</h1>
        <p className="text-gray-600 mt-2">
          Join our network of expert technicians and start earning on your own schedule
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                placeholder="Full address including city and postal code"
                required
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4">Professional Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.experience_years}
              onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specializations
            </label>
            <div className="grid grid-cols-2 gap-2">
              {specializationOptions.map(specialization => (
                <label
                  key={specialization}
                  className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={formData.specializations.includes(specialization)}
                    onChange={() => handleSpecializationChange(specialization)}
                    className="rounded text-black focus:ring-black"
                  />
                  <span className="text-sm">{specialization}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certifications (optional)
            </label>
            <textarea
              value={formData.certifications}
              onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              rows={3}
              placeholder="List any relevant certifications or training"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              required
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="weekends">Weekends Only</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>

          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.background_check}
              onChange={(e) => setFormData(prev => ({ ...prev, background_check: e.target.checked }))}
              className="mt-1 rounded text-black focus:ring-black"
              required
            />
            <span className="text-sm">
              I consent to a background check and understand it's required to become a Fyxter
            </span>
          </label>

          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.tools}
              onChange={(e) => setFormData(prev => ({ ...prev, tools: e.target.checked }))}
              className="mt-1 rounded text-black focus:ring-black"
              required
            />
            <span className="text-sm">
              I have my own repair tools and equipment
            </span>
          </label>

          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.transportation}
              onChange={(e) => setFormData(prev => ({ ...prev, transportation: e.target.checked }))}
              className="mt-1 rounded text-black focus:ring-black"
              required
            />
            <span className="text-sm">
              I have reliable transportation
            </span>
          </label>

          <label className="flex items-start space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.insurance}
              onChange={(e) => setFormData(prev => ({ ...prev, insurance: e.target.checked }))}
              className="mt-1 rounded text-black focus:ring-black"
              required
            />
            <span className="text-sm">
              I have or am willing to obtain liability insurance
            </span>
          </label>
        </div>

        {error && (
          <div className="text-red-600 text-sm p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          By submitting this application, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </div>
  );
}