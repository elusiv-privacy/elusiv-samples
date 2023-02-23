import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getParams } from "./boilerplate";

async function main() {
    // Helper function for generating the elusiv instance 
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, keyPair } = await getParams();

    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS')

    console.log('Current private balance: ', privateBalance)

    // Can't send without a private balance
    if (privateBalance > BigInt(0)) {
        // Send half a Sol
        const sendTxData = await elusiv.buildSendTx(0.05 * LAMPORTS_PER_SOL, keyPair.publicKey, 'LAMPORTS');

        const { elusivTxSig, commitmentInsertionPromise } = await elusiv.sendElusivTxWithTracking(sendTxData)
        // Money has arrived, we can tell user
        const completedMessage = `Send complete with sig ${elusivTxSig.signature}`;
        // Wait for clean up in the background
        const cleanupAnimation = loadingAnimation('Cleaning up...', completedMessage);
        await commitmentInsertionPromise;
        clearInterval(cleanupAnimation);
        console.log('Finished clean up, you can send another elusiv transaction now');
    }
    else {
        throw new Error('Can\'t send from an empty private balance');
    }

}

function loadingAnimation(loadingText?: string, previousText?: string) {
    const characters = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
        .map(c => {
            if (previousText) c = previousText + '\n' + c;
            if (loadingText) c = c + ' ' + loadingText;
            return c;
        })
    let i = 0;

    return setInterval(() => {
        i = (i > 8) ? 0 : i + 1;
        console.clear();
        console.log(characters[i] + ' ' + loadingText);
    }, 50);
};

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
