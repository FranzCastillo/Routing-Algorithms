abstract class Algorithm {
    abstract sendMessage(message: string): void;

    abstract receiveMessage(message: string): void;

    abstract readConfigFile(path: string): void;
}

export default Algorithm;
