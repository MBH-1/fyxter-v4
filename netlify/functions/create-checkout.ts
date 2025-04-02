import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Received checkout session request');
    
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

    const { price, repair_details } = parsedBody;

    if (!price || !repair_details) {
      console.error('Missing required parameters:', { price, repair_details });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    console.log(`Creating checkout session for ${price} USD`);
    console.log('Repair details:', repair_details);

    // Create a Checkout Session for both standard redirect and embedded checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      ui_mode: 'embedded', // This enables embedded checkout
      return_url: `${process.env.URL || 'http://localhost:8888'}/repair-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      payment_intent_data: {
        capture_method: 'manual', // This tells Stripe to authorize only
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${repair_details.model} - ${repair_details.repair_type}`,
              description: `${repair_details.service_type} Service`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        model: repair_details.model,
        repair_type: repair_details.repair_type,
        service_type: repair_details.service_type,
        location: repair_details.location ? `${repair_details.location.latitude},${repair_details.location.longitude}` : 'Unknown',
      },
    });

    console.log('Checkout session created:', session.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        // For embedded checkout we need to return both the session ID and client_secret
        sessionId: session.id,
        client_secret: session.client_secret,
        url: session.url, // Also include URL for clients that need standard checkout
      }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    let statusCode = 500;
    let errorMessage = 'Failed to create checkout session';
    
    if (error instanceof Stripe.errors.StripeError) {
      statusCode = error.statusCode || 500;
      errorMessage = error.message;
    }
    
    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({
        error: errorMessage,
      }),
    };
  }
};