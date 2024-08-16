import readline from 'readline';
import { Node } from '../types/node';
import {FloodingNode} from "../types/floodingNode.ts";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getAlgorithm = async (): Promise<string> => {
    return new Promise((resolve) => {
        rl.question('Choose the algorithm to use:\n1. Flooding\n2. Link State Routing\n', (algorithm) => {
            if (algorithm === '1') {
                resolve('flooding');
            } else if (algorithm === '2') {
                resolve('link-state');
            } else {
                console.log('Invalid input. Please try again.');
                resolve(getAlgorithm());
            }
        });
    });
};

const getSelfNode = async (nodes: { [key: string]: Node } | { [key: string]: FloodingNode }): Promise<Node | FloodingNode> => {
    return new Promise((resolve) => {
        rl.question('Enter the name of the node you are running this program on: ', (nodeName) => {
            if (nodes[nodeName]) {
                resolve(nodes[nodeName]);
            } else {
                console.log('Invalid node name. Please try again.');
                console.log('Valid node names are:', Object.keys(nodes).join(', '), '\n');
                resolve(getSelfNode(nodes));
            }
        });
    });
}

const getGoalNode = async (nodes: { [key: string]: Node } | { [key: string]: FloodingNode }): Promise<Node | FloodingNode> => {
    return new Promise((resolve) => {
        rl.question('Enter the name of the goal node: ', (nodeName) => {
            if (nodes[nodeName]) {
                resolve(nodes[nodeName]);
            } else {
                console.log('Invalid node name. Please try again.');
                console.log('Valid node names are:', Object.keys(nodes).join(', '), '\n');
                resolve(getGoalNode(nodes));
            }
        });
    });

}

export {
    getAlgorithm,
    getSelfNode,
    getGoalNode,
};
