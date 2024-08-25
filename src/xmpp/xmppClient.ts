import { client, xml } from '@xmpp/client';
import debug from '@xmpp/debug';
import * as fs from 'fs';

// Load the names-nodes.json file
const nodes = JSON.parse(fs.readFileSync('src/configs/names-nodes.json', 'utf8')).config;

export function createXmppClient(nodeName: string) {
    const { username, password } = nodes[nodeName];

    const xmpp = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        resource: nodeName,
        username: username,
        password: password,
    });
    

    debug(xmpp, false);

    xmpp.on('error', (err) => {
        //console.error('❌ Error', err);
    });

    xmpp.on('offline', () => {
        //console.log('🛑 offline');
    });

    xmpp.on('stanza', async (stanza) => {
        //console.log('⮕ Incoming stanza:', stanza.toString());

        if (stanza.is('message')) {
            // Handle incoming messages here
        }
    });

    xmpp.on('online', async (address) => {
        //console.log('🟢 online as', address.toString());

        // Send initial presence
        await xmpp.send(xml('presence'));

        // Test echo message
        const message = xml(
            'message',
            { type: 'chat', to: `${username}@alumchat.lol/${nodeName}` },
            xml('body', {}, 'Hello from ' + nodeName)
        );
        await xmpp.send(message);
    });

    return xmpp;
}
