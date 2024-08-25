import { getAlgorithm, getSelfNode, getGoalNode } from './utils/input';
import { findTopologyFile, parseFloodTestFile, parseLinkStateFile, findNamesFile } from './utils/files';
import { createXmppClient } from './xmpp/xmppClient';
import * as fs from 'fs';
import { xml } from '@xmpp/client';

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

    if (nodes) {
        const self = await getSelfNode(nodes);  // Get the node that this program is running on

        // Initialize XMPP clients for all nodes
        const xmppClients = {};
        const nodeConfig = JSON.parse(fs.readFileSync(namesFile, 'utf8')).config;

        for (const nodeName in nodeConfig) {
            xmppClients[nodeName] = createXmppClient(nodeName);
            xmppClients[nodeName].start().catch(console.error);
        }

        const goal = await getGoalNode(nodes);

        if (algorithm === 'flooding') {
            // Check if self is a FloodingNode
            if (!('flood' in self)) {
                console.error('Node is not a FloodingNode.');
                process.exit(1);
            }

            self.flood();

            const bestPath = goal.getBestPath(self.name);
            if (bestPath) {
                console.log(`Best path from ${self.name} to ${goal.name}: ${bestPath.path.map(node => node.name).join(' -> ')}`);
                console.log(`Total weight: ${bestPath.totalWeight}`);
            } else {
                console.log(`No path found from ${self.name} to ${goal.name}.`);
            }

            // Send messages through the path using XMPP
            for (let i = 0; i < bestPath.path.length - 1; i++) {
                const fromNode = bestPath.path[i].name;
                const toNode = bestPath.path[i + 1].name;
                const message = {
                    type: 'message',
                    from: `${nodeConfig[fromNode].username}@alumchat.lol`,
                    to: `${nodeConfig[toNode].username}@alumchat.lol`,
                    hops: bestPath.path.length,
                    headers: [],
                    payload: `Message from ${fromNode} to ${toNode}`,
                };

                const messageXML = xml(
                    'message',
                    { type: 'chat', to: `${nodeConfig[toNode].username}@alumchat.lol` },
                    xml('body', {}, JSON.stringify(message))
                );

                await xmppClients[fromNode].send(messageXML);
                console.log(`Message sent from ${fromNode} to ${toNode}`);
            }

        } else if (algorithm === 'link-state') {
            self.linkStateAlgorithm(nodes);
            const path = self.getShortestPath(goal);

            if (path) {
                console.log(`Shortest path from ${self.name} to ${goal.name}: ${path.path.map(node => node.name).join(' -> ')}`);
                console.log(`Total distance: ${path.distance}`);

                // Send messages through the path using XMPP
                for (let i = 0; i < path.path.length - 1; i++) {
                    const fromNode = path.path[i].name;
                    const toNode = path.path[i + 1].name;
                    const message = {
                        type: 'message',
                        from: `${nodeConfig[fromNode].username}@alumchat.lol`,
                        to: `${nodeConfig[toNode].username}@alumchat.lol`,
                        hops: path.path.length,
                        headers: [],
                        payload: `Message from ${fromNode} to ${toNode}`,
                    };

                    const messageXML = xml(
                        'message',
                        { type: 'chat', to: `${nodeConfig[toNode].username}@alumchat.lol` },
                        xml('body', {}, JSON.stringify(message))
                    );

                    await xmppClients[fromNode].send(messageXML);
                    console.log(`Message sent from ${fromNode} to ${toNode}`);
                }

            } else {
                console.log(`No path found from ${self.name} to ${goal.name}.`);
            }
        }
    }
}

main().then(() => {
    process.exit();
});
