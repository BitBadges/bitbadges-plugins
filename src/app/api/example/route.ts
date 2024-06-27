import { NextRequest } from 'next/server';

//TODO: Fill in missing information and implement your logic
export const POST = async (req: NextRequest) => {
    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ message: 'Invalid method' }), {
                status: 405,
            });
        }

        //TODO: Step 1: Handle the request payload from the plugin
        const body = await req.json();
        console.log('Received request in handler: ', body);

        //See below for all possible fields. This will also include your custom body fields.
        //Whether fields are populated  will be dependent on your plugin configuration.
        //   const payload = {
        //     ...customBody,//if applicable
        //     email: { id: 'bob@abc.com' }, //If pass email is configured
        //     discord: { id: '...', username: '...', discriminator: '...' }, //If configured
        //     twitch: { id: '...', username: '...' }, //If configured
        //     twitter: { id: '...', username: '...' }, //If configured
        //     github: { id: '...', username: '...' }, //If configured
        //     google: { id: '...', username: '...' }, //If configured
        //     priorState: { ...}, //If using state transition preset function (see below)
        //     pluginSecret: pluginDoc.pluginSecret,
        //     claimId: context.claimId,
        //     claimAttemptId: context.claimAttemptId,
        //     cosmosAddress: context.cosmosAddress, //If pass address is configured
        //     _isSimulation: context._isSimulation,
        //     lastUpdated: context.lastUpdated,
        //     createdAt: context.createdAt,
        //     maxUses: context.maxUses,
        //     currUses: context.currUses
        // };

        const {
            //Note that in test mode, you will have to provide default values for these fields
            pluginSecret,
            claimToken,
        } = body;

        //Step 2: Verify BitBadges as origin by checking plugin secret is correct
        const YOUR_PLUGIN_SECRET = ''; //TODO:
        if (
            !pluginSecret ||
            !YOUR_PLUGIN_SECRET ||
            pluginSecret !== YOUR_PLUGIN_SECRET
        ) {
            return new Response(
                JSON.stringify({
                    message:
                        'Invalid plugin secret. Origin of the request ust be BitBadges',
                }),
                {
                    status: 401,
                }
            );
        }

        //TODO: Step 3: Implement your custom logic here. Consider checking the plugin's creation / last updated time to implement version control.

        //For the claim token approach, we need to validate if it is a valid claim token issued by you (via the backend)
        //This also may include any other custom logic like checking criteria, authentication, etc.

        //TODO: Step 4: Return the response to the plugin based on your configured state function preset
        // Customize based on your preset
        // const stateTransitionRes = { ...newState }
        // const statelessRes = {};
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
