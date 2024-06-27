import { useState } from 'react';
import { useRouter } from 'next/router';

import '../../app/globals.css';
import { ContextInfo } from './claim';

export default function Create() {
    const router = useRouter();
    const { context } = router.query;

    let claimContext: ContextInfo | undefined = undefined;
    try {
        claimContext = JSON.parse(context?.toString() || '{}');
    } catch (e) {
        console.error('Error parsing context', e);
    }

    const [textParameter, setTextParameter] = useState('');
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Text Parameter:', textParameter);

        // TODO: Here you can add logic to store the config
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold">Configure the Claim</h1>
            <p className="mb-8 text-center">
                This is a page where you can store settings / configuration for
                the claim.
                <br />
                All config needs to be stored by you. BitBadges does not store
                any of it.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="mb-4">
                    <label
                        className="block text-gray-200 text-sm font-bold mb-2"
                        htmlFor="textParameter"
                    >
                        Custom Parameter
                    </label>
                    <input
                        type="text"
                        id="textParameter"
                        value={textParameter}
                        onChange={(e) => setTextParameter(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Save Configuration
                    </button>
                </div>
            </form>
        </main>
    );
}
