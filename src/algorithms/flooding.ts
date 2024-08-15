import Algorithm from './algorithm';

class Flooding extends Algorithm {
    sendMessage(message: string): void {
        console.log(`Flooding algorithm: ${message}`);
    }
}

export default Flooding;
