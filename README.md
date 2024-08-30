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
1. Choose the algorithm to use:
```
1. Flooding
2. Link State Routing
```
2. Enter the node you are in. (E.g. A, B, C...)
3. When it asks for credentials, enter the name of your node (in lower case) and add "123". (E.g. a123, b123, c123...)
4. Select if you are the sender or any receiver (listener) node.
5. Send the message if you are a sender node, or listen for a message otherwise.
6. After sending the message, information is displayed in the console and the program ends.
