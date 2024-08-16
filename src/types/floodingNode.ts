import { Node } from './node';

class FloodingNode extends Node {
    neighbors: { Node: FloodingNode, Weight: number }[] = [];
    paths: Map<string, { path: FloodingNode[], totalWeight: number }[]> = new Map();

    constructor(name: string) {
        super(name);
    }

    // Floods a message to all neighbors
    flood(path: FloodingNode[] = [], totalWeight: number = 0): void {
        path.push(this);
        this.paths.set(this.name, [{ path: [...path], totalWeight }]);  // Initialize paths for this node

        this.neighbors.forEach(({ Node: neighbor, Weight }) => {
            if (!path.includes(neighbor)) {
                neighbor.receive(this, [...path], totalWeight + Weight);
            }
        });
    }

    // Receives a message from a neighbor
    receive(original_sender: FloodingNode, path: FloodingNode[], totalWeight: number): void {
        if (path.includes(this)) {
            return;
        }

        path.push(this);

        // Store the path and total weight
        if (!this.paths.has(original_sender.name)) {
            this.paths.set(original_sender.name, []);
        }
        this.paths.get(original_sender.name)?.push({ path: [...path], totalWeight });

        this.neighbors.forEach(({ Node: neighbor, Weight }) => {
            if (!path.includes(neighbor)) {
                neighbor.receive(original_sender, [...path], totalWeight + Weight);
            }
        });
    }

    addNeighbor(neighbor: FloodingNode, weight: number): void {
        this.neighbors.push({ Node: neighbor, Weight: weight });
    }

    getBestPath(sender: string): { path: FloodingNode[], totalWeight: number } | null {
        if (!this.paths.has(sender)) {
            return null;
        }

        return this.paths.get(sender)!.reduce((best, current) => {
            if (best === null) {
                return current;
            }

            return current.totalWeight < best.totalWeight ? current : best;
        }, null);
    }

    toString(): string {
        return `FloodingNode(${this.name})`;
    }

    // Method to print all paths for this node
    printPaths(): void {
        this.paths.forEach((paths, sender) => {
            console.log(`Paths from ${sender} to ${this.name}:`);
            paths.forEach(({ path, totalWeight }) => {
                console.log(`  Path: ${path.map(node => node.name).join(' -> ')}, Total Weight: ${totalWeight}`);
            });
        });
    }
}

export {
    FloodingNode
};
