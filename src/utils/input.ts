import readline from 'readline';
import { Node } from '../types/node';
import { FloodingNode } from "../types/floodingNode.ts";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false // Esto debería evitar la duplicación de la entrada en algunos entornos
});

const askQuestion = (query: string): Promise<string> => {
    return new Promise(resolve => rl.question(query, resolve));
};

const getAlgorithm = async (): Promise<string> => {
    const algorithm = await askQuestion('Choose the algorithm to use:\n1. Flooding\n2. Link State Routing\n');
    if (algorithm === '1') {
        return 'flooding';
    } else if (algorithm === '2') {
        return 'link-state';
    } else {
        console.log('Invalid input. Please try again.');
        return getAlgorithm();
    }
};

const getSelfNode = async (nodes: { [key: string]: Node } | { [key: string]: FloodingNode }, nodeNamesMap: { [key: string]: string }): Promise<{ node: Node | FloodingNode, xmppAddress: string, password: string }> => {
    const nodeName = await askQuestion('Enter the name of the node you are running this program on: ');
    if (nodes[nodeName]) {
        let xmppAddress = nodeNamesMap[nodeName];
        if (!xmppAddress) {
            console.error(`No XMPP address found for node ${nodeName}.`);
            return getSelfNode(nodes, nodeNamesMap); // Retry
        }

        // Extraer el prefijo antes de "@alumchat.lol" para usar en la conexión
        xmppAddress = xmppAddress.split('@')[0];

        console.log(`Using XMPP address for node ${nodeName}: ${xmppAddress}`);
        const password = await askQuestion(`Enter the password for the node ${nodeName}: `);
        return { node: nodes[nodeName], xmppAddress, password };
    } else {
        console.log('Invalid node name. Please try again.');
        console.log('Valid node names are:', Object.keys(nodes).join(', '), '\n');
        return getSelfNode(nodes, nodeNamesMap);
    }
};

const getGoalNode = async (nodes: { [key: string]: Node } | { [key: string]: FloodingNode }): Promise<Node | FloodingNode> => {
    const nodeName = await askQuestion('Enter the name of the goal node: ');
    if (nodes[nodeName]) {
        return nodes[nodeName];
    } else {
        console.log('Invalid node name. Please try again.');
        console.log('Valid node names are:', Object.keys(nodes).join(', '), '\n');
        return getGoalNode(nodes);
    }
};

export {
    getAlgorithm,
    getSelfNode,
    getGoalNode,
};
