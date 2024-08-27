import { getAlgorithm, getSelfNode, getGoalNode } from './utils/input';
import { 
    findTopologyFile, 
    findNamesFile, 
    parseFloodTestFile, 
    parseLinkStateFile, 
    parseNamesFile 
} from './utils/files';
import { connectToXMPP, sendMessageXMPP, listenToMessages } from './xmpp/xmppClient';
import { askQuestion } from './utils/questions';

const main = async () => {
    const configPath = 'src/configs';
    const topologyFile = findTopologyFile(configPath);
    const namesFile = findNamesFile(configPath);

    if (!topologyFile) {
        console.error('No topology file found.');
        process.exit(1);
    }

    if (!namesFile) {
        console.error('No names file found.');
        process.exit(1);
    }

    const algorithm = await getAlgorithm();  // Always resolves as 'flooding' or 'link-state'
    let nodes;

    if (algorithm === 'flooding') {
        nodes = parseFloodTestFile('src/configs/flood-test.json');
    } else if (algorithm === 'link-state') {
        nodes = parseLinkStateFile('src/configs/linkState-test.json');
    }

    const nodeNamesMap = parseNamesFile(namesFile);

    if (nodes) {
        const { node: self, xmppAddress, password } = await getSelfNode(nodes, nodeNamesMap);  // Get the node that this program is running on

        // Conectar al servidor XMPP
        const xmppClient = await connectToXMPP(xmppAddress, password);

        console.log(`🗸 Successfully logged in as ${xmppAddress}`);

        const action = await askQuestion('Do you want to send a message (1) or listen for incoming messages (2)? ');

        if (action === '1') {
            const goalNodeName = await askQuestion('Enter the name of the destination node: ');
            const goal = nodes[goalNodeName];

            if (!goal) {
                console.error('Destination node not found.');
                process.exit(1);
            }

            const messagePayload = await askQuestion('Enter the message to send: ');

            const messageData = {
                from: xmppAddress,
                to: nodeNamesMap[goal.name],
                payload: messagePayload
            };

            if (algorithm === 'flooding') {
                self.flood();
                const bestPath = goal.getBestPath(self.name);
                if (bestPath) {
                    console.log(`Best path from ${self.name} to ${goal.name}: ${bestPath.path.map(node => node.name).join(' -> ')}`);
                    console.log(`Total weight: ${bestPath.totalWeight}`);
                    messageData.hops = 1;
                    messageData.type = "message";
                    await sendMessageXMPP(xmppClient, nodeNamesMap[bestPath.path[1].name], messageData);
                } else {
                    console.log(`No path found from ${self.name} to ${goal.name}.`);
                }
            } else if (algorithm === 'link-state') {
                self.linkStateAlgorithm(nodes);
                const path = self.getShortestPath(goal);
                if (path) {
                    console.log(`Shortest path from ${self.name} to ${goal.name}: ${path.path.map(node => node.name).join(' -> ')}`);
                    console.log(`Total distance: ${path.distance}`);
                    messageData.hops = 1;
                    messageData.type = "message";
                    await sendMessageXMPP(xmppClient, nodeNamesMap[path.path[1].name], messageData);
                } else {
                    console.log(`No path found from ${self.name} to ${goal.name}.`);
                }
            }

            // Cerrar la sesión de XMPP después de enviar el mensaje
            xmppClient.stop().then(() => {
                console.log(`🗸 Session closed for ${xmppAddress}`);
                process.exit();
            }).catch(err => {
                console.error('Error closing session:', err);
                process.exit(1);
            });

        } else if (action === '2') {
            console.log('Listening for incoming messages...');
            listenToMessages(xmppClient, self.name, nodes, nodeNamesMap, xmppAddress, algorithm);
        }
    }
};

main();
