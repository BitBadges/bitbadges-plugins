import NextAuth from 'next-auth';
import { BitBadgesNextAuth as BitBadges } from 'bitbadgesjs-sdk';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [BitBadges], //Add others as needed
});
