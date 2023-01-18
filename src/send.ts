import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv, TokenType } from "elusiv-sdk";
import { getParams } from "./boilerplate";

async function main() {
    // Helper function for generating the elusiv instance 
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, keyPair } = await getParams();

    // Fetch our current private balance
    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS')

    console.log('Current private balance: ', privateBalance)

    // Can't send without a private balance
    if(privateBalance > BigInt(0)){
        // Send half a Sol
        const res = await send(elusiv, keyPair, 0.5 * LAMPORTS_PER_SOL, 'LAMPORTS');
        console.log(`Send initiated with sig ${res.sig.signature}`);

        // Wait for the send to be confirmed (have your UI do something else here, this takes a little)
        await res.isConfirmed;
        console.log('Send complete!');
    }
    else{
        throw new Error('Can\'t send from an empty private balance');
    }

}

async function send(elusiv: Elusiv, keyPair: Keypair, amount: number, tokenType : TokenType) {
    // Build the send transaction 
    const sendTx = await elusiv.buildSendTx(amount, keyPair.publicKey, tokenType);
    // Send it off!
    return elusiv.sendElusivTx(sendTx);
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
