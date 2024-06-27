import './globals.css';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1 className="text-2xl font-bold mb-4">
                Welcome to the BitBadges Plugin Quickstarter Repository
            </h1>
            <p className="mb-4">
                If this is your first time creating a plugin, please refer to
                the Creating a Custom Plugin section of the BitBadges
                documentation.
            </p>

            <p className="mb-4">
                There are three parts to a potential plugin (the configuration
                page, the claim page, and the backend handler). Create and add
                your pages (if applicable) to the{' '}
                <code>/pages/YOUR_APP_NAME/</code> directory. See{' '}
                <code>/pages/example</code> for examples. Add your handler to
                the <code>/api/YOUR_APP_NAME</code> directory. See{' '}
                <code>/api/example</code> for examples. Filenames should be{' '}
                <code>claim.tsx</code>, <code>configure.tsx</code>, and{' '}
                <code>route.ts</code>, respectively.
            </p>

            <p className="mb-4">
                Once you have implemented the custom logic for your plugin, host
                this repository somewhere (requires HTTPS) and create a
                non-published plugin on BitBadges via the developer portal. The
                easiest way to then test it out is via creating an address list
                with a custom claim using this plugin. You can then test the
                claim flow and delete the address list when you are done.
            </p>

            <p>
                If you want to publish it for others to use, request publishing
                to the directory via the developer portal.
            </p>
        </main>
    );
}
