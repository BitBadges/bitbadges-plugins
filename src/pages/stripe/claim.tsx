import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import {
    PaymentIntentResult,
    StripeElementsOptionsClientSecret,
    StripePaymentElementOptions,
    loadStripe,
} from '@stripe/stripe-js';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import '../../app/globals.css';
import { ContextInfo } from '../example/claim';
import { BACKEND_URL, STRIPE_PUBLISHABLE_KEY } from '@/constants';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );

        if (!clientSecret) {
            return;
        }

        stripe
            .retrievePaymentIntent(clientSecret)
            .then(({ paymentIntent }: PaymentIntentResult) => {
                console.log(paymentIntent);
                switch (paymentIntent?.status) {
                    case 'succeeded':
                        setMessage('Payment succeeded!');
                        break;
                    case 'processing':
                        setMessage('Your payment is processing.');
                        break;
                    case 'requires_payment_method':
                        setMessage(
                            'Your payment was not successful, please try again.'
                        );
                        break;
                    default:
                        setMessage('Something went wrong.');
                        break;
                }
            });
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url:
                    window.location.origin + '/stripe/checkout-complete',
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message ?? '');
        } else {
            setMessage('An unexpected error occurred.');
        }

        setIsLoading(false);
    };

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: 'tabs',
    };

    return (
        <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="primary-text"
        >
            <PaymentElement
                className="primary-text"
                id="payment-element"
                options={paymentElementOptions}
            />

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="bp-button mt-5"
            >
                <span id="button-text ">
                    {isLoading ? 'Loading...' : 'Pay Now'}
                </span>
            </button>
            {message && (
                <div
                    className="info-bg w-full p-2 secondary-text"
                    id="payment-message"
                >
                    {message}
                </div>
            )}
        </form>
    );
}

export default function Claim() {
    const router = useRouter();
    const { context } = router.query;

    let claimContext: ContextInfo | undefined = undefined;
    try {
        claimContext = JSON.parse(context?.toString() || '{}');
    } catch (e) {
        console.error('Error parsing context', e);
    }

    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        axios
            .post(
                `${BACKEND_URL}/api/stripe/createPaymentIntent`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            )
            .then((res) => setClientSecret(res.data.clientSecret));
    }, []);

    const options: StripeElementsOptionsClientSecret = {
        clientSecret,
        appearance: {
            theme: 'night',
        },
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold">User Claim Page</h1>
            <p className="mb-8 text-center">
                This is the page the user will be redirected to when attempting
                to claim.
            </p>

            <div className="flex-center">
                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                )}
            </div>
        </main>
    );
}
