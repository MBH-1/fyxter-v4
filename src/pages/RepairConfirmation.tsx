import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ArrowLeft, Clock, Phone, AlertCircle } from 'lucide-react';;


interface RepairDetails {
  customerName: string;
  deviceModel: string;
  repairType: string;
  serviceType: string;
}

export function RepairConfirmation() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repairDetails, setRepairDetails] = useState<RepairDetails | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided. Payment confirmation cannot be verified.');
      setLoading(false);
      return;
    }

    // In a real implementation, you would fetch the session details from Stripe
    // Here we're simulating with either local storage or default values
    const storedCustomerInfo = localStorage.getItem('customerInfo');
    let customerInfo = { name: 'Customer', email: '', phone: '' };
    
    if (storedCustomerInfo) {
      try {
        customerInfo = JSON.parse(storedCustomerInfo);
      } catch (e) {
        console.error('Error parsing stored customer info:', e);
      }
    }
    
    const storedRepairDetails = localStorage.getItem('repairDetails');
    let details = {
      deviceModel: 'Your Device',
      repairType: 'Screen Repair',
      serviceType: 'original'
    };
    
    if (storedRepairDetails) {
      try {
        details = JSON.parse(storedRepairDetails);
      } catch (e) {
        console.error('Error parsing stored repair details:', e);
      }
    }
    
    setRepairDetails({
      customerName: customerInfo.name,
      ...details,
    });
   // Send confirmation email
fetch('/api/send-confirmation-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: customerInfo.email,
    subject: `Fyxters Repair Confirmed: ${details.deviceModel}`,
    message: `
      <h2>Thank you, ${customerInfo.name}!</h2>
      <p>Your ${details.deviceModel.replace(/_/g, ' ')} - ${details.repairType} request has been received.</p>
      <p>We’ll contact you shortly. If you need support, reply to this email or call us at (514) 865-2788.</p>
    `.trim(), // Optional: trims leading/trailing whitespace
  }),
})
  .then((res) => res.json())
  .then((data) => console.log('Email sent:', data))
  .catch((err) => console.error('Email error:', err));
    
    setLoading(false);
  }, [sessionId]);

  const getEstimatedTime = (serviceType: string) => {
    return serviceType === 'diagnostic' 
      ? 'Estimated diagnostic time: 30–60 minutes' 
      : 'Estimated repair time: 1–2 hours';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Verification Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful
          </h2>
          
          <p className="text-gray-700 text-lg mb-2">
            Thanks for your order, {repairDetails?.customerName}! Your repair for {repairDetails?.deviceModel.replace(/_/g, ' ')} — {repairDetails?.repairType} is confirmed.
          </p>
          
          <p className="text-gray-600 mb-6">
            A Fyxters technician will contact you shortly.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">
                {repairDetails && getEstimatedTime(repairDetails.serviceType)}
              </span>
            </div>
            
            <p className="text-sm text-blue-700 text-center">
              Our expert technician will bring all necessary parts and tools for your {repairDetails?.serviceType} repair.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
              <ol className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>A Fyxters technician will contact you within the next 15-30 minutes.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>
                    {repairDetails?.serviceType === 'onsite' 
                      ? 'They will confirm your location details and arrival time.'
                      : 'They will confirm your appointment at our service center.'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Your repair will be completed as scheduled with expert care.</span>
                </li>
              </ol>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-1" />
                <span>Customer Support: (123) 456-7890</span>
              </div>
            </div>
          </div>
          
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
