import {Node} from '../algorithms/node'
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
    for (const nodeName in config) {
        const node = nodes[nodeName];
        config[nodeName].forEach((neighborName: string) => {
            node.neighbors.push(nodes[neighborName]);
        });
    }

    for (const nodeName in nodes) {
        console.log(nodes[nodeName].toString());
    }

    return nodes
}


export {
    findTopologyFile,
    parseTopology,
}
