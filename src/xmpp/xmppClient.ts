import { client, xml } from '@xmpp/client';
import { askQuestion } from '../utils/questions';

export async function connectToXMPP(username: string, password: string) {
    const xmpp = client({
        service: 'ws://alumchat.lol:7070/ws/',
        domain: 'alumchat.lol',
        resource: 'example',
        username,
        password
    });

    xmpp.on('error', (err: any) => {
        console.error('❌', err.toString());
    });

    xmpp.on('status', (status: string) => {
        //console.log(`⏳ ${status}`);
    });

    xmpp.on('online', (address: any) => {
        //console.log(`🗸 Online as ${address.toString()}`);

        // Enviar mensaje de presencia al estar en línea
        const presence = xml('presence');
        xmpp.send(presence);
        //console.log("🗸 Presence sent to notify other clients that this node is online.");
    });

    await xmpp.start();

    return xmpp;
}

export async function sendMessageXMPP(xmppClient: any, to: string, messageData: any) {
    const formattedMessage = {
        type: messageData.type || "message",
        from: messageData.from,
        to: messageData.to,
        hops: messageData.hops || 1,
        headers: messageData.headers || [],
        payload: messageData.payload
    };

    const messageStanza = xml(
        'message',
        { type: 'chat', to },
        xml('body', {}, JSON.stringify(formattedMessage))
    );

    xmppClient.send(messageStanza);
}

export function listenToMessages(xmppClient: any, selfName: string, nodes: any, nodeNamesMap: any, xmppAddress: string, algorithm: string) {
    xmppClient.on('stanza', async (stanza: any) => {
        if (stanza.is('message') && stanza.getChild('body')) {
            const from = stanza.attrs.from;
            const body = stanza.getChild('body').text();

            //console.log(`Raw message received from ${from}: ${body}`);

            try {
                const message = JSON.parse(body);

                console.log(`Parsed message from ${from}:`, message);

                // Extraer solo el prefijo del nombre de usuario para la comparación
                const targetNodeName = Object.keys(nodeNamesMap).find(
                    key => nodeNamesMap[key].split('@')[0] === message.to.split('@')[0]
                );

                const toNode = message.to.split('@')[0]; // Extraer el prefijo del "to"
                const selfNode = xmppAddress.split('@')[0]; // Extraer el prefijo del xmppAddress

                if (toNode === selfNode) {
                    console.log('This message is for this node');
                    // Detener la escucha ya que el mensaje ha sido procesado
                    await xmppClient.stop();
                    console.log(`🗸 Session closed for ${xmppAddress}`);
                    process.exit();
                } else {
                    // El mensaje no es para este nodo, continuar con el algoritmo seleccionado al inicio
                    console.log('The message is not for this node.');

                    if (!targetNodeName || !nodes[targetNodeName]) {
                        console.error(`Target node ${message.to} not found in nodes.`);
                        await xmppClient.stop();
                        console.log(`🗸 Session closed for ${xmppAddress}`);
                        process.exit(1);
                    }

                    let nextHop;

                    if (algorithm === 'flooding') {
                        nodes[selfName].flood();
                        const bestPath = nodes[targetNodeName].getBestPath(selfName);
                        if (bestPath) {
                            nextHop = nodeNamesMap[bestPath.path[1].name];
                        }
                    } else if (algorithm === 'link-state') {
                        nodes[selfName].linkStateAlgorithm(nodes);
                        const path = nodes[selfName].getShortestPath(nodes[targetNodeName]);
                        if (path) {
                            nextHop = nodeNamesMap[path.path[1].name];
                        }
                    }

                    if (nextHop) {
                        message.hops += 1;
                        console.log(`Forwarding message to next hop: ${nextHop}`);
                        await sendMessageXMPP(xmppClient, nextHop, message);

                        // Ahora cerrar la sesión después de reenviar el mensaje
                        await xmppClient.stop();
                        console.log(`🗸 Session closed for ${xmppAddress}`);
                        process.exit();
                    } else {
                        console.error('No next hop found, closing session.');
                        await xmppClient.stop();
                        console.log(`🗸 Session closed for ${xmppAddress}`);
                        process.exit(1);
                    }
                }
            } catch (err) {
                console.error('Failed to parse incoming message:', err);
                await xmppClient.stop();
                console.log(`🗸 Session closed for ${xmppAddress}`);
                process.exit(1);
            }
        } else {
            //console.log('Received non-message stanza:', stanza.toString());
        }
    });
}
