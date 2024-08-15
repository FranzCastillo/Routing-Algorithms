import {getAlgorithm} from './utils/input';

const main = async () => {
    const algorithm = await getAlgorithm(); // Always resolves as 'flooding' or 'link-state'

    if (algorithm === 'flooding') {
        // Run flooding algorithm
    } else if (algorithm === 'link-state') {
        // Run link-state algorithm
    }
}

main().then(() => {
    process.exit();
});
