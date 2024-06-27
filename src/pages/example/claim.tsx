import { useRouter } from 'next/router';
import { useState } from 'react';
import '../../app/globals.css';

export interface ContextInfo {
    address: string;
    claimId: string;
    cosmosAddress: string;
    createdAt: number;
    lastUpdated: number;
}

interface MyPluginCustomBody {
    claimToken: string;
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

    const [testMode, setTestMode] = useState(true);
    const [customBody, setCustomBody] = useState<MyPluginCustomBody>({
        claimToken: crypto.randomUUID(),
    });

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold">User Claim Page</h1>
            <p className="mb-8 text-center">
                This is the page the user will be redirected to when attempting
                to claim.
            </p>

            <div className="mb-4">
                <label
                    className="block text-gray-200 text-sm font-bold mb-2"
                    htmlFor="booleanParameter"
                >
                    Test Mode
                </label>
                <input
                    type="checkbox"
                    id="booleanParameter"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    className="mr-2 leading-tight"
                />
                <span className="text-gray-200">Enable</span>
            </div>

            <div className="w-full max-w-lg">
                <div className="mb-4">
                    <label
                        className="block text-gray-200 text-sm font-bold mb-2"
                        htmlFor="numericParameter"
                    >
                        Authenticate?
                    </label>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => {
                            //TODO: Authenticate the user for access to gated information?
                        }}
                    >
                        Sign In to XYZ
                    </button>
                </div>

                <div className="mb-4">
                    <label
                        className="block text-gray-200 text-sm font-bold mb-2"
                        htmlFor="textParameter"
                    >
                        Text Parameter
                    </label>
                    <input
                        type="text"
                        id="textParameter"
                        value={customBody.claimToken}
                        onChange={(e) =>
                            setCustomBody({ claimToken: e.target.value })
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => {
                            //TODO: Save claim token to backend for future lookup from handler

                            if (testMode) {
                                //We will call your backend handler directly in test mode
                                const appname =
                                    window.location.pathname.split('/')[1];

                                fetch(`/api/${appname}`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(customBody),
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        console.log('Success:', data);
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error);
                                    });
                            } else {
                                if (window.opener) {
                                    console.log(
                                        'Sending message to opener',
                                        customBody,
                                        'https://bitbadges.io'
                                    );
                                    window.opener.postMessage(
                                        customBody,
                                        'https://bitbadges.io'
                                    );
                                    window.close();
                                }
                            }
                        }}
                    >
                        Submit {testMode ? '(Test Mode)' : ''}
                    </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                    This is the body that you will receive in your backend
                    handler. In production, this will be passed to BitBadges.
                    For test mode, we pass it directly to your backend handler.
                </div>
            </div>
        </main>
    );
}
