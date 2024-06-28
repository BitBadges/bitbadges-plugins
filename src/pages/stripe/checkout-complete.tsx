import { Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { handleUserClaimSubmit } from '../example/claim';
import { TEST_MODE } from '@/constants';

interface StripePluginCustomBody {
    claimToken: string; //This doubles as your claimToken
}

export default function CheckoutSuccess() {
    const router = useRouter();
    const { redirect_status, payment_intent } = router.query;

    const [completed, setCompleted] = useState(false);
    useEffect(() => {
        if (!payment_intent) return;

        //Upon receiving the payment intent, you can submit it to the claim
        handleUserClaimSubmit(
            { claimToken: payment_intent } as StripePluginCustomBody,
            TEST_MODE
        ).then(() => {
            setCompleted(true);
        });
    }, [redirect_status, payment_intent]);

    if (!redirect_status) {
        return null;
    }

    if (redirect_status !== 'succeeded') {
        return (
            <div className="flex-center w-full">
                <div className="text-red-500 text-center">
                    Payment Status: {redirect_status}
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className="flex-center mt-20"
                style={{ minHeight: '70vh', alignItems: 'normal' }}
            >
                {completed && (
                    <>
                        {' '}
                        <div className="text-center">
                            <span className="primary-text ml-2 text-3xl font-bold">
                                Payment Successful
                            </span>
                        </div>
                        <br />
                        <div className="info-bg p-2 secondary-text text-center">
                            Your purchase was successful.
                        </div>
                    </>
                )}
                <br />
                {!completed && (
                    <>
                        <div className="text-center">
                            <span className="primary-text ml-2 text-3xl font-bold">
                                Processing
                            </span>{' '}
                            <Spin className="ml-1" size="large" />
                        </div>
                        <br />
                        <div className="info-bg p-2 secondary-text text-center">
                            Your payment is being processed.
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
