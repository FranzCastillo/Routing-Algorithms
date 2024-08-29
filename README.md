# Routing-Algorithms

## Howe to run?

1. Install bun (This is the Windows installation)

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

2. Install the dependencies

```bash
bun install
```

3. Run the project

```bash
bun run
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
