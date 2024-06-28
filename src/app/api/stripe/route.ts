import { NextRequest } from 'next/server';
import Stripe from 'stripe';

const STRIPE_SK = process.env.STRIPE_SECRET_KEY ?? '';
const stripe = new Stripe(STRIPE_SK);

//TODO: If you are auto-completing the claim right away, do the following:
// - Remove the plugin secret step (you will not have a plugin)
// - Add the claim completion code directly here

export const POST = async (req: NextRequest) => {
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ message: 'Invalid method' }), {
                status: 405,
            });
        }

        const body = await req.json();

        const {
            //See documentation for all possible fields.
            pluginSecret,
            claimToken, //The claim token is the Stripe payment intent ID (thus enforcing one use per completed payment)
        } = body;

        //Step 2: Verify BitBadges as origin by checking plugin secret is correct
        const YOUR_PLUGIN_SECRET = process.env.PLUGIN_SECRET;
        if (
            !pluginSecret ||
            !YOUR_PLUGIN_SECRET ||
            pluginSecret !== YOUR_PLUGIN_SECRET
        ) {
            return new Response(
                JSON.stringify({
                    message:
                        'Invalid plugin secret. Origin of the request must be BitBadges',
                }),
                {
                    status: 401,
                }
            );
        }

        //Step 3: Implement your custom logic here. Consider checking the plugin's creation / last updated time to implement custom logic.
        //Check stripe payment intent status
        const paymentIntent = await stripe.paymentIntents.retrieve(claimToken);
        if (paymentIntent.status !== 'succeeded') {
            return new Response(
                JSON.stringify({
                    message:
                        'Payment intent not successful. Status: ' +
                        paymentIntent.status,
                }),
                {
                    status: 401,
                }
            );
        }

        //Step 4: Return the response to the plugin. Claim token is the payment intent ID.
        const claimTokenRes = { claimToken };
        return new Response(JSON.stringify(claimTokenRes), {
            status: 200,
        });
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: `${err}` }), {
            status: 401,
        });
    }
};
