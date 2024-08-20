import { Node } from './node';

// LinkStateNode class
class LinkStateNode extends Node {
    // Format  of neighbors: { node: LinkStateNode, weight: number }
    paths: Map<string, {
        distance: number;
        previous: LinkStateNode | null;
    }> = new Map();
    constructor(name: string) {
        super(name);
    }

    addNeighbor(neighbor: LinkStateNode, weight: number): void {
        this.neighbors.push({ node: neighbor, weight });
    }

    getNeighbors(): { node: LinkStateNode, weight: number }[] {
        return this.neighbors as { node: LinkStateNode, weight: number }[];
    }

    // Link state algorithm to find paths using Dijkstra
    linkStateAlgorithm(nodes: { [key: string]: LinkStateNode }): Map<string, { distance: number, previous: LinkStateNode | null }> {
        // Initialize distances and unvisited
        const distances = new Map<string, { distance: number, previous: LinkStateNode | null }>();
        const unvisited = new Set<LinkStateNode>();

        // Config the distances
        for (const key in nodes) {
            distances.set(key, { distance: Infinity, previous: null });
            unvisited.add(nodes[key]);
        }
        
        distances.set(this.name, { distance: 0, previous: null });

        while (unvisited.size > 0) {
            // Select the unvisited node with the smallest distance
            let currentNode: LinkStateNode | null = null;
            for (const node of unvisited) {
                if (currentNode === null || distances.get(node.name)!.distance < distances.get(currentNode.name)!.distance) {
                    currentNode = node;
                }
            }

            if (currentNode === null) break;

            unvisited.delete(currentNode);

            const currentDistance = distances.get(currentNode.name)!.distance;

            for (const neighbor of currentNode.getNeighbors()) {
                const newDistance = currentDistance + neighbor.weight;
                const neighborDistance = distances.get(neighbor.node.name)!.distance;

                if (newDistance < neighborDistance) {
                    distances.set(neighbor.node.name, { distance: newDistance, previous: currentNode });
                }
            }
        }

        this.paths = distances;
    }

    getShortestPath(target: LinkStateNode): { path: LinkStateNode[], distance: number } | null {
        if (!this.paths.has(target.name)) {
            return null;
        }

        const path: LinkStateNode[] = [];
        let current: LinkStateNode | null = target;

        while (current !== null) {
            path.unshift(current);
            current = this.paths.get(current.name)!.previous;
        }

        return { path, distance: this.paths.get(target.name)!.distance };
    }
}

export { LinkStateNode };
