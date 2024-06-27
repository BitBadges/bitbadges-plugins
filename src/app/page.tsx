'use client';
import { useRouter } from 'next/navigation';
import './globals.css';

const buttonStyle = {
    width: 250,
    backgroundColor: 'darkblue',
    fontSize: 14,
    fontWeight: 600,
    color: 'white',
};

const defaultClassName = 'blockin-button mx-2 rounded-lg p-2';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Welcome to the BitBadges plugin provider repository. This is a
            repository where we host custom plugin implementations for BitBadges
            so that you do not have to worry about the hosting part of it!
            <br />
            <br />
            If this is your first time creating a plugin, please refer to the
            Creating a Custom Plugin section of the BitBadges documentation.
            <br />
            <br />
            There are three parts to a potential plugin (the configuration page,
            the claim page, and the backend handler). Create and add your pages
            (if applicable) to the /pages/YOUR_APP_NAME/ directory. See
            /pages/example for examples. Add your handler to the
            /api/YOUR_APP_NAME directory. See /api/example for examples.
            Filenames should be claim.tsx, configure.tsx, and complete.ts,
            respectively.
            <br />
            <br />
            You can then deploy your plugin by 1) submitting a pull request with
            your changes to this repository, and 2) creating a custom plugin in
            the BitBadges developre portal (https://bitbadges.io), and 3)
            submitting it for publishing in the directory.
        </main>
    );
}
