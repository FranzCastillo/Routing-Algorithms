import {getAlgorithm, getSelfNode} from './utils/input';
import {findTopologyFile, parseTopology, findNamesFile, parseNames, parseFloodTestFile} from './utils/files';

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
    // const nodes = parseTopology(topologyFile);  // Parse the topology file to Node objects
    // parseNames(namesFile, nodes);  // Assign XMPP users to nodes
    const nodes = parseFloodTestFile('src/configs/flood-test.json');
    const self = await getSelfNode(nodes);  // Get the node that this program is running on

    if (algorithm === 'flooding') {
        // Check if self is a FloodingNode
        if (!('flood' in self)) {
            console.error('Node is not a FloodingNode.');
            process.exit(1);
        }
        self.flood();

        for (const node in nodes) {
            nodes[node].printPaths();
        }

    } else if (algorithm === 'link-state') {
        // Run link-state algorithm
    }
}

main().then(() => {
    process.exit();
});
