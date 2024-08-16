class Node {
    name: string;
    xmpp_user: string;
    neighbors: Node[];

    constructor(name: string) {
        this.name = name;
        this.xmpp_user = '';
        this.neighbors = [];
    }

    toString(): string {
        const neighborNames = this.neighbors.map(neighbor => neighbor.name).join(', ');
        return `Node(name: ${this.name}, neighbors: [${neighborNames}])`;
    }
}

export {
    Node
};
