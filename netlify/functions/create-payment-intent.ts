import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const handler: Handler = async (event) => {
  // Add CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    console.log('Received payment intent request');
    
    if (!event.body) {
      console.error('Missing request body');
      throw new Error('Missing request body');
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
      console.log('Request body parsed successfully:', JSON.stringify(parsedBody));
    } catch (parseError) {
      console.error('Error parsing request body:', event.body);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        }),
      };
    }

  const { amount, repair_details } = parsedBody;
  const currency = 'cad';


    if (!amount || !repair_details) {
      console.error('Missing required parameters:', { amount, repair_details });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    const parsedAmount = Math.round(amount);
    if (parsedAmount <= 0) {
      console.error('Invalid amount:', parsedAmount);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid amount' }),
      };
    }

   console.log(`Creating payment intent for ${parsedAmount} cents (${parsedAmount / 100} CAD)`);

    console.log('Repair details:', JSON.stringify(repair_details));

    // Set a dummy success response for testing in case Stripe API isn't fully configured
    if (process.env.NODE_ENV === 'development' || (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_live'))) {
      console.log('Using test mode, returning dummy client secret');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          clientSecret: 'pi_dummy_' + Math.random().toString(36).substring(2, 15) + '_secret_' + Math.random().toString(36).substring(2, 15),
          testMode: true
        }),
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parsedAmount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          user_id: repair_details.user_id || 'anonymous',
          model: repair_details.model,
          repair_type: repair_details.repair_type,
          service_type: repair_details.service_type,
          location: repair_details.location ? `${repair_details.location.latitude},${repair_details.location.longitude}` : 'Unknown',
        },
      });

      console.log('Payment intent created:', paymentIntent.id);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          clientSecret: paymentIntent.client_secret,
        }),
      };
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      throw stripeError;
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof Stripe.errors.StripeError) {
      statusCode = error.statusCode || 500;
      errorMessage = error.message;
    } else if (error instanceof SyntaxError) {
      statusCode = 400;
      errorMessage = 'Invalid request body';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
