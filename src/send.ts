import { ConfirmedSignatureInfo, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
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
    if (privateBalance > BigInt(0)) {
        // Send half a Sol
        const sig = await send(elusiv, keyPair.publicKey, 0.5 * LAMPORTS_PER_SOL, 'LAMPORTS');
        console.log(`Send complete with sig ${sig.signature}`);
    }
    else {
        throw new Error('Can\'t send from an empty private balance');
    }

}

async function send(elusiv: Elusiv, recipient: PublicKey, amount: number, tokenType: TokenType): Promise<ConfirmedSignatureInfo> {
    // Build the send transaction 
    const sendTx = await elusiv.buildSendTx(amount, recipient, tokenType);
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
