# Routing-Algorithms

## Howe to run?

1. Clone the repository:
```bash
git clone https://github.com/FranzCastillo/Routing-Algorithms.git
```
2. Access the folder:
```bash
cd Routing-Algorithms 
```

3. Run the following commands:
```bash
docker build --rm . -t routing-algs && docker run --rm -ti routing-algs
```

## How to use?
1. In the file [names-nodes.json](src/configs/names-nodes.json) type your xmpp JID on the node you are in.
2. Choose the algorithm to use:
```
1. Flooding
2. Link State Routing
```
3. Enter the node you are in.
4. Select if you are the sender or any reciver node.
5. Send the message if you are a sender node, or listen for a message otherwise.
