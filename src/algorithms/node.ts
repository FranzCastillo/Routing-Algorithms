class Node {
    name: string;
    neighbors: Node[];

    constructor(name: string) {
        this.name = name;
        this.neighbors = [];
    }
}
