class Node {
    name: string;
    xmpp_user: string;
    neighbors: Node[] | { Node: Node, Weight: number }[];

    constructor(name: string) {
        this.name = name;
        this.xmpp_user = '';
        this.neighbors = [];
    }

    toString(): string {
        return `Node(${this.name})`;
    }
}

export {
    Node
};
