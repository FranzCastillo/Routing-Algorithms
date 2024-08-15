import Algorithm from './algorithm';

class LinkState extends Algorithm {
    sendMessage(message: string): void {
        console.log(`Link State algorithm: ${message}`);
    }
}

export default LinkState;
