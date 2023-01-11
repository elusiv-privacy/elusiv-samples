import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv, TokenType } from "elusiv-sdk";
import { getParams } from "./boilerplate";

async function main() {
    // Helper function for generating the elusiv instance 
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, keyPair } = await getParams();

    // Fetch our current private balance
    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS')

    // We have no private balance? Top up! (We can also top up if we already have a private balance of course)
    if(privateBalance === BigInt(0)){
        // Top up with 1 Sol
        const res = await topup(elusiv, keyPair, LAMPORTS_PER_SOL, 'LAMPORTS');
        console.log(`Topup initiated with sig ${res.sig.signature}`);

        // Wait for the topup to be confirmed (have your UI do something else here, this takes a little)
        await res.isConfirmed;
        console.log('Topup complete!');
    }

}

async function topup(elusivInstance: Elusiv, keyPair: Keypair, amount: number, tokenType : TokenType) {
    // Build our topup transaction
    const topupTx = await elusivInstance.buildTopUpTx(amount, tokenType);
    // Sign it (only needed for topups, as we're topping up from our public key there)
    topupTx.tx.partialSign(keyPair);
    // Send it off
    return elusivInstance.sendElusivTx(topupTx);
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
