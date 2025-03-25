import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, Clock, Check, Ticket, ArrowRight } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';

// Initialize Stripe with the public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  customerName: string;
  deviceModel: string;
  repairType: string;
  serviceType: 'original' | 'aftermarket' | 'onsite' | 'diagnostic';
  price: number;
  onBack: () => void;
  onComplete: () => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedDiscount: number;
  setAppliedDiscount: (discount: number) => void;
  isCouponApplied: boolean;
  setIsCouponApplied: (applied: boolean) => void;
  isCouponInvalid: boolean;
  setIsCouponInvalid: (invalid: boolean) => void;
}

// The checkout form component that uses Stripe's Embedded Checkout
const CheckoutForm: React.FC<CheckoutFormProps> = ({
  customerName,
  deviceModel,
  repairType,
  serviceType,
  price,
  onBack,
  onComplete,
  couponCode,
  setCouponCode,
  appliedDiscount,
  setAppliedDiscount,
  isCouponApplied,
  setIsCouponApplied,
  isCouponInvalid,
  setIsCouponInvalid
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);

  const handleApplyCoupon = () => {
    setIsCouponInvalid(false);
    
    // Check if the coupon is the student discount coupon
    if (couponCode.toLowerCase() === 'student10') {
      // Apply 10% discount
      setAppliedDiscount(Math.round(price * 0.1));
      setIsCouponApplied(true);
    } else {
      // Invalid coupon
      setIsCouponInvalid(true);
    }
  };

  useEffect(() => {
    // Create a checkout session as soon as the page loads
    const createCheckoutSession = async () => {
      const finalPrice = isCouponApplied ? price - appliedDiscount : price;
      if (finalPrice > 0) {
        await createStripeCheckoutSession(finalPrice);
      }
    };
    createCheckoutSession();
  }, [isCouponApplied, appliedDiscount, price]);

  const createStripeCheckoutSession = async (finalPrice: number) => {
    if (!finalPrice || finalPrice <= 0) return;
    
    setLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      const requestBody = {
        price: finalPrice,
        repair_details: {
          user_id: 'anonymous',
          model: deviceModel,
          repair_type: repairType,
          service_type: serviceType,
          location: { latitude: 0, longitude: 0 } // Default values if not available
        }
      };
      
      console.log('Creating checkout session for price:', finalPrice);
      setDebugInfo('Attempting to create checkout session...');
      
      try {
        // Use the API route path instead of direct Netlify function path
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          setDebugInfo(`Failed with checkout endpoint: Status ${response.status}, Response: ${errorText.substring(0, 100)}`);
          throw new Error(`Server error: ${response.status}. Response: ${errorText.substring(0, 100)}`);
        }

        const data = await response.json();
        console.log('Checkout session response:', data);
        
        if (!data.client_secret && !data.sessionId) {
          throw new Error('No client secret or session ID returned from the server');
        }

        // Store the client secret for the Embedded Checkout
        if (data.client_secret) {
          setClientSecret(data.client_secret);
        }
        
        // Store the session ID for the Embedded Checkout
        if (data.sessionId) {
          setCheckoutSessionId(data.sessionId);
        }
        
        console.log('Checkout session created successfully');
        setDebugInfo('Checkout session created successfully');
      } catch (initialError) {
        console.error('Error with checkout endpoint:', initialError);
        setDebugInfo(`${debugInfo}\nError creating checkout session: ${initialError.message}`);
        throw initialError;
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setDebugInfo(`${debugInfo}\nFinal error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const createPaymentIntent = async (finalPrice: number) => {
    if (!finalPrice || finalPrice <= 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const requestBody = {
        amount: Math.round(finalPrice * 100), // Convert to cents
        currency: 'usd',
        repair_details: {
          user_id: 'anonymous',
          model: deviceModel,
          repair_type: repairType,
          service_type: serviceType,
          location: { latitude: 0, longitude: 0 } // Default values if not available
        }
      };
      
      console.log('Creating payment intent for amount:', requestBody.amount);
      
      // Use the API route path instead of direct Netlify function path
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}. Response: ${errorText}`);
      }

      const data = await response.json();
      console.log('Payment intent response:', data);
      
      if (!data.clientSecret) {
        throw new Error('No client secret returned from the server');
      }

      return data.clientSecret;
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => `$${amount.toFixed(2)}`;
  const finalPrice = price - appliedDiscount;

  // If we have a client secret, render the Embedded Checkout
  if (clientSecret) {
    return (
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-medium mb-4">Complete Your Payment</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Device</span>
            <span>{deviceModel.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service Type</span>
            <span className="capitalize">{serviceType}</span>
          </div>
          
          {isCouponApplied && (
            <div className="flex justify-between text-green-600">
              <span>Student Discount (10%)</span>
              <span>-{formatPrice(appliedDiscount)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(finalPrice)}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          {/* Stripe Embedded Checkout will be rendered here */}
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
        
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        
        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-500 mt-1" size={20} />
            <div>
              <h3 className="font-medium text-blue-900">Secure Transaction</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your payment information is encrypted and secure. We use Stripe for secure payment processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the coupon form and create checkout button
  return (
    <div className="p-6 space-y-6">
      {/* Order Summary */}
      <div>
        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Device</span>
            <span>{deviceModel.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service Type</span>
            <span className="capitalize">{serviceType}</span>
          </div>
          {serviceType === 'diagnostic' && (
            <div className="bg-blue-50 p-3 rounded text-sm text-blue-700 mt-2">
              <p className="font-medium">Diagnostic Fee Policy:</p>
              <p>The $30 diagnostic fee will be deducted from your final repair cost if you proceed with the repair.</p>
            </div>
          )}
          
          {/* Coupon Code Section */}
          <div className="pt-3 border-t">
            <div className="mb-3">
              <div className="flex items-center mb-2">
                <Ticket className="w-4 h-4 mr-2 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">Have a coupon code?</label>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className={`flex-1 p-2 border rounded-l-lg text-sm focus:ring-2 focus:outline-none ${
                    isCouponInvalid ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || loading}
                  className="bg-gray-800 text-white px-4 py-2 rounded-r-lg text-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Apply
                  <ArrowRight className="ml-1 w-3 h-3" />
                </button>
              </div>
              {isCouponInvalid && (
                <p className="text-red-500 text-xs mt-1">Invalid coupon code. Try "STUDENT10" for student discount.</p>
              )}
              {isCouponApplied && (
                <p className="text-green-500 text-xs mt-1">Student discount applied successfully!</p>
              )}
            </div>
            
            {/* Pricing breakdown */}
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(price)}</span>
              </div>
              
              {isCouponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Student Discount (10%)</span>
                  <span>-{formatPrice(appliedDiscount)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {debugInfo && (
        <div className="text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium mb-1">Debug Info:</h4>
          <pre className="whitespace-pre-wrap text-xs text-gray-600">{debugInfo}</pre>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 
          border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => createStripeCheckoutSession(finalPrice)}
          disabled={loading}
          className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Proceed to Checkout`}
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="text-blue-500 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-blue-900">Secure Transaction</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your payment information is encrypted and secure. We use Stripe for secure payment processing.
            </p>
          </div>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="flex items-center justify-center gap-2 text-gray-600">
        <Clock size={16} />
        <span className="text-sm">
          {serviceType === 'diagnostic' 
            ? 'Estimated diagnostic time: 30-60 minutes' 
            : 'Estimated repair time: 1-2 hours after payment'}
        </span>
      </div>
      
      {/* Student Discount Notice */}
      <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
        <Ticket className="text-red-500 mt-1" size={20} />
        <div>
          <h3 className="font-medium text-red-900">Student Discount Available</h3>
          <p className="text-sm text-red-700 mt-1">
            Students get 10% off all repairs! Use coupon code "STUDENT10" to get your discount.
          </p>
        </div>
      </div>
    </div>
  );
};

export function PaymentConfirmation({
  customerName,
  deviceModel,
  repairType,
  serviceType,
  price,
  onBack,
  onComplete
}: {
  customerName: string;
  deviceModel: string;
  repairType: string;
  serviceType: 'original' | 'aftermarket' | 'onsite' | 'diagnostic';
  price: number;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isCouponInvalid, setIsCouponInvalid] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Handle Stripe redirect with URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      // If we have a session_id in the URL, the payment was successful
      setPaymentSuccess(true);
      onComplete();
    }
  }, [onComplete]);

  // If payment is successful, show success screen
  if (paymentSuccess) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order, {customerName}. Your {serviceType === 'diagnostic' ? 'diagnostic' : 'repair'} has been scheduled.
          </p>
          <p className="text-gray-600 mb-6">
            A confirmation has been sent to your email. A technician will contact you shortly with next steps.
          </p>
          <div className="space-y-4">
            <p className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
              <Clock className="w-4 h-4 mr-2" />
              {serviceType === 'diagnostic' 
                ? 'Estimated diagnostic time: 30-60 minutes' 
                : 'Estimated repair time: 1-2 hours'}
            </p>
            
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-left mt-6">
              <h3 className="font-medium text-yellow-800 mb-2">What happens next?</h3>
              <ol className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>A Fyxters technician will contact you via phone or email within 15-30 minutes.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>They will confirm your location and specific device details.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>The technician will arrive at your location or provide directions to our service center.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>Your {serviceType === 'diagnostic' ? 'device diagnosis' : 'repair'} will be completed as scheduled.</span>
                </li>
              </ol>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              Order Reference: FYX-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold">Payment Details</h2>
        <p className="text-gray-600 mt-1">Complete your {serviceType === 'diagnostic' ? 'diagnostic' : 'repair'} request</p>
      </div>

      <CheckoutForm
        customerName={customerName}
        deviceModel={deviceModel}
        repairType={repairType}
        serviceType={serviceType}
        price={price}
        onBack={onBack}
        onComplete={() => setPaymentSuccess(true)}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        appliedDiscount={appliedDiscount}
        setAppliedDiscount={setAppliedDiscount}
        isCouponApplied={isCouponApplied}
        setIsCouponApplied={setIsCouponApplied}
        isCouponInvalid={isCouponInvalid}
        setIsCouponInvalid={setIsCouponInvalid}
      />
    </div>
  );
}