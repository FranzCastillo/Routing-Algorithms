import {getAlgorithm, getSelfNode, getGoalNode} from './utils/input';
import {findTopologyFile, parseTopology, findNamesFile, parseNames, parseFloodTestFile, parseLinkStateFile} from './utils/files';

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
    let nodes;
    if (algorithm === 'flooding') {
        nodes = parseFloodTestFile('src/configs/flood-test.json');
    } else if (algorithm === 'link-state') {
        nodes = parseLinkStateFile('src/configs/linkState-test.json');
    }

    if (nodes){

        const self = await getSelfNode(nodes);  // Get the node that this program is running on

        if (algorithm === 'flooding') {
            // Check if self is a FloodingNode
            if (!('flood' in self)) {
                console.error('Node is not a FloodingNode.');
                process.exit(1);
            } else {
            }

            const goal = await getGoalNode(nodes);

            self.flood();

            const bestPath = goal.getBestPath(self.name);
            if (bestPath) {
                console.log(`Best path from ${self.name} to ${goal.name}: ${bestPath.path.map(node => node.name).join(' -> ')}`);
                console.log(`Total weight: ${bestPath.totalWeight}`);
            } else {
                console.log(`No path found from ${self.name} to ${goal.name}.`);
            }

        } else if (algorithm === 'link-state') {
            const goal = await getGoalNode(nodes);
            
            self.linkStateAlgorithm(nodes);
            const path = self.getShortestPath(goal);

            if (path) {
                console.log(`Shortest path from ${self.name} to ${goal.name}: ${path.path.map(node => node.name).join(' -> ')}`);
                console.log(`Total distance: ${path.distance}`);
            } else {
                console.log(`No path found from ${self.name} to ${goal.name}.`);
            }
        }
    }
}

main().then(() => {
    process.exit();
});
