import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getAlgorithm = async (): Promise<string> => {
    return new Promise((resolve) => {
        rl.question('Choose the algorithm to use:\n1. Flooding\n2. Link State Routing\n', (algorithm) => {
            if (algorithm === '1') {
                resolve('flooding');
            } else if (algorithm === '2') {
                resolve('link-state');
            } else {
                console.log('Invalid input. Please try again.');
                resolve(getAlgorithm());
            }
        });
    });
};

export {
    getAlgorithm
};
