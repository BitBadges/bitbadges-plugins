import { NextRequest } from 'next/server';
import Stripe from 'stripe';

const STRIPE_SK = process.env.STRIPE_SECRET_KEY ?? '';
const stripe = new Stripe(STRIPE_SK);

const calculateOrderAmount = () => {
    return 1000; //1000 = $10.00
};

export const POST = async (req: NextRequest) => {
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ message: 'Invalid method' }), {
                status: 405,
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(),
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                // Add metadata here
            },
        });

        const response = {
            clientSecret: paymentIntent.client_secret,
        };

        return new Response(JSON.stringify(response), {
            status: 200,
        });
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: `${err}` }), {
            status: 401,
        });
    }
};
