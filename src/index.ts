import {getAlgorithm} from './utils/input';
import {findTopologyFile, parseTopology} from './utils/files';

const main = async () => {
    const configPath = 'src/configs';
    const topologyFile = findTopologyFile(configPath);

    if (!topologyFile) {
        console.error('No topology file found.');
        process.exit(1);
    }

    const algorithm = await getAlgorithm(); // Always resolves as 'flooding' or 'link-state'
    const nodes = parseTopology(topologyFile);
    if (algorithm === 'flooding') {
        // Get the node topology
    } else if (algorithm === 'link-state') {
        // Run link-state algorithm
    }
}

main().then(() => {
    process.exit();
});
