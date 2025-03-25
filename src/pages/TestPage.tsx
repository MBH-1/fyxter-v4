import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { SupabaseConnectionTest } from '../components/SupabaseConnectionTest';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Card element styles
const cardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

// Stripe test component
const StripeTestForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [amount, setAmount] = useState(25);
  
  const stripe = useStripe();
  const elements = useElements();

  const handleCreatePaymentIntent = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // convert to cents
          currency: 'usd',
          repair_details: {
            user_id: 'test-user',
            model: 'iPhone 13',
            repair_type: 'Screen Replacement',
            service_type: 'original',
            location: { latitude: 45.5, longitude: -73.5 }
          }
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }
      
      setClientSecret(data.clientSecret);
      setSuccess('Payment intent created! You can now submit the payment form.');
    } catch (err) {
      console.error('Error creating payment intent:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Test User',
          },
        },
      });
      
      if (paymentError) {
        throw new Error(paymentError.message);
      }
      
      setSuccess(`Payment ${paymentIntent?.status}! PaymentIntent ID: ${paymentIntent?.id}`);
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Stripe Test Payment</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <button
        type="button"
        onClick={handleCreatePaymentIntent}
        disabled={loading || !amount}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors mb-4 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Payment Intent'}
      </button>
      
      {clientSecret && (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Card details</label>
            <div className="p-3 border rounded-md">
              <CardElement options={cardElementOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Test card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading || !stripe || !clientSecret}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay $${amount}`}
          </button>
        </form>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}
    </div>
  );
};

export function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="grid gap-10">
          <SupabaseConnectionTest />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold">Stripe Integration Test</h2>
            </div>
            
            <Elements stripe={stripePromise}>
              <StripeTestForm />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}