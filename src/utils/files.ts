import { Node } from '../types/node';
import { FloodingNode } from '../types/floodingNode';
import { LinkStateNode } from '../types/linkStateNode';
import fs from 'fs';
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
        if (file.startsWith('names-') && file.endsWith('.json')) {
            return path.join(dir, file);
        }
    }
    return null;
};

const parseTopology = (path: string): { [key: string]: Node } => {
    const data = fs.readFileSync(path, 'utf8');
    const config = JSON.parse(data).config;

    const nodes: { [key: string]: Node } = {};

    for (const nodeName in config) {
        nodes[nodeName] = new Node(nodeName);
    }

    for (const nodeName in config) {
        const node = nodes[nodeName];
        config[nodeName].forEach((neighborName: string) => {
            node.neighbors.push(nodes[neighborName]);
        });
    }

    return nodes;
};

const parseNamesFile = (filePath: string): { [key: string]: string } => {
    const data = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(data).config; // Accedemos a la clave 'config' dentro del JSON
    return config;
};


const parseFloodTestFile = (filePath: string): { [key: string]: FloodingNode } => {
    const data = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(data).config;

    const nodes: { [key: string]: FloodingNode } = {};

    for (const nodeName in config) {
        nodes[nodeName] = new FloodingNode(nodeName);
    }

    for (const nodeName in config) {
        const node = nodes[nodeName];
        config[nodeName].forEach((neighbor: { neighbor: string, weight: number }) => {
            node.addNeighbor(nodes[neighbor.neighbor], neighbor.weight);
        });
    }

    return nodes;
};

const parseLinkStateFile = (filePath: string): { [key: string]: LinkStateNode } => {
    const data = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(data).config;

    const nodes: { [key: string]: LinkStateNode } = {};

    for (const nodeName in config) {
        nodes[nodeName] = new LinkStateNode(nodeName);
    }

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
    parseNamesFile,
    parseFloodTestFile,
    parseLinkStateFile
};
