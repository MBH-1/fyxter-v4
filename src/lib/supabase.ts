import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Test the connection and log detailed information
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test specifically with screen_prices table
    const { data, error } = await supabase
      .from('screen_prices')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    } else {
      console.log('Supabase connection successful. Sample data:', data);
    }

    // Test customer_info table permissions
    console.log('Testing customer_info table permissions...');
    try {
      const { error: customerError } = await supabase
        .from('customer_info')
        .insert([{ name: 'Test User', email: 'test@example.com', phone: '123-456-7890' }]);
      
      if (customerError) {
        console.error('Customer info insert error:', {
          message: customerError.message,
          code: customerError.code,
          details: customerError.details,
          hint: customerError.hint
        });
      } else {
        console.log('Customer info insertion would be successful (test skipped)');
      }
    } catch (customerTestError) {
      console.error('Error testing customer_info:', customerTestError);
    }
  } catch (err) {
    console.error('Failed to test Supabase connection:', err);
  }
};

// Run the test immediately
testConnection();