import {Node} from '../types/node'
import {FloodingNode} from '../types/floodingNode'
import fs from 'fs'
import path from 'path';

const findTopologyFile = (dir: string): string | null => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.startsWith('topo-') && file.endsWith('.txt')) {
            return path.join(dir, file);
        }
    }
    return null;
};

const findNamesFile = (dir: string): string | null => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.startsWith('names-') && file.endsWith('.txt')) {
            return path.join(dir, file);
        }
    }
    return null;
}

const parseTopology = (path: string): { [key: string]: Node } => {
    const data = fs.readFileSync(path, 'utf8')  // Reads the file
    const config = JSON.parse(data).config  // Parses the JSON data

    // Keeps track of all the nodes where the key it the node's name and the value is the node object
    const nodes: { [key: string]: Node } = {}

    // Create nodes for each key
    for (const nodeName in config) {
        nodes[nodeName] = new Node(nodeName)
    }

    // Establish neighbors
    // TODO: Check if the neighbours where declared in the keys
    for (const nodeName in config) {
        const node = nodes[nodeName];
        config[nodeName].forEach((neighborName: string) => {
            node.neighbors.push(nodes[neighborName]);
        });
    }

    return nodes
}

const parseNames = (path: string, nodes: { [key: string]: Node }): void => {
    // TODO: Check if the nodes where declared in the keys
    const data = fs.readFileSync(path, 'utf8')  // Reads the file
    const config = JSON.parse(data).config  // Parses the JSON data

    for (const nodeName in config) {
        nodes[nodeName].xmpp_user = config[nodeName]
    }
}

const parseFloodTestFile = (filePath: string): { [key: string]: FloodingNode } => {
    const data = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(data).config;

    const nodes: { [key: string]: FloodingNode } = {};

    // Create nodes
    for (const nodeName in config) {
        nodes[nodeName] = new FloodingNode(nodeName);
    }

    // Establish neighbors with weights
    for (const nodeName in config) {
        const node = nodes[nodeName];
        config[nodeName].forEach((neighbor: { neighbor: string, weight: number }) => {
            node.addNeighbor(nodes[neighbor.neighbor], neighbor.weight);
        });
    }

    return nodes;
};


export {
    findTopologyFile,
    findNamesFile,
    parseTopology,
    parseNames,
    parseFloodTestFile,
}
