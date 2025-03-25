import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Testing connection to Supabase...');
  const [details, setDetails] = useState<any>(null);
  const [screenPrices, setScreenPrices] = useState<any[]>([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('loading');
      setMessage('Testing connection to Supabase...');
      
      // Test basic connection by getting settings
      const { data: settings, error: settingsError } = await supabase.from('screen_prices').select('*').limit(5);
      
      if (settingsError) {
        throw settingsError;
      }
      
      setScreenPrices(settings || []);
      
      // Test customer_info table permissions
      const testCustomer = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '123-456-7890'
      };
      
      const { data: customerData, error: customerError } = await supabase
        .from('customer_info')
        .insert([testCustomer])
        .select();
      
      if (customerError) {
        setMessage('Connected to Supabase, but customer_info insertion failed');
        setDetails({
          screenPrices: settings ? `Successfully fetched ${settings.length} records` : 'No records fetched',
          customerError: {
            message: customerError.message,
            code: customerError.code,
            details: customerError.details,
            hint: customerError.hint
          }
        });
        setStatus('error');
        return;
      }
      
      setMessage('Successfully connected to Supabase!');
      setDetails({
        screenPrices: settings ? `Successfully fetched ${settings.length} records` : 'No records fetched',
        customerInsert: 'Successfully inserted test customer',
        customerData
      });
      setStatus('success');
      
    } catch (error: any) {
      console.error('Failed to test Supabase connection:', error);
      setMessage('Failed to connect to Supabase');
      setDetails({
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          stack: error.stack
        }
      });
      setStatus('error');
    }
  };

  const retryConnection = () => {
    testConnection();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className={`p-4 rounded-lg mb-6 ${
        status === 'loading' ? 'bg-blue-50 text-blue-700' :
        status === 'success' ? 'bg-green-50 text-green-700' :
        'bg-red-50 text-red-700'
      }`}>
        <div className="font-semibold text-lg mb-2">
          {status === 'loading' && (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {message}
            </div>
          )}
          {status === 'success' && (
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {message}
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {message}
            </div>
          )}
        </div>
        
        {details && (
          <div className="mt-2 text-sm">
            <pre className="whitespace-pre-wrap overflow-auto max-h-60 p-2 rounded bg-opacity-50 bg-white">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}
        
        {status === 'error' && (
          <button 
            onClick={retryConnection}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        )}
      </div>
      
      {screenPrices.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Sample Data (screen_prices)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Brand</th>
                  <th className="border border-gray-300 px-4 py-2">Model</th>
                  <th className="border border-gray-300 px-4 py-2">Original Price</th>
                  <th className="border border-gray-300 px-4 py-2">Aftermarket Price</th>
                </tr>
              </thead>
              <tbody>
                {screenPrices.map((price) => (
                  <tr key={price.id}>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{price.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{price.brand}</td>
                    <td className="border border-gray-300 px-4 py-2">{price.model}</td>
                    <td className="border border-gray-300 px-4 py-2">${price.original_part}</td>
                    <td className="border border-gray-300 px-4 py-2">${price.aftermarket_part}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}