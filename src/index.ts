import {getAlgorithm} from './utils/input';
import {findTopologyFile, parseTopology, findNamesFile, parseNames} from './utils/files';

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
    const nodes = parseTopology(topologyFile);  // Parse the topology file to Node objects
    parseNames(namesFile, nodes);  // Assign XMPP users to nodes

    if (algorithm === 'flooding') {
        // Get the node topology
    } else if (algorithm === 'link-state') {
        // Run link-state algorithm
    }
}

main().then(() => {
    process.exit();
});
