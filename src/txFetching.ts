import { getParams } from "./boilerplate";

async function main() {
    // Helper function for generating the elusiv instance 
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv } = await getParams();

    // Fetch our most recent private transactions of any token type
    const mostRecentPrivTx = await elusiv.getPrivateTransactions(1);

    console.log("Our most recent private transaction:\n");
    console.log(mostRecentPrivTx);

    // Fetch our last 5 private transactions using Sol (if we only have 1 it will only return 1 of course)
    const last5PrivTxs = await elusiv.getPrivateTransactions(5, 'LAMPORTS');

    console.log("Our last 5 private transactions:\n");
    console.log(last5PrivTxs);
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
