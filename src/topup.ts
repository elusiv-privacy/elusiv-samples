import { ConfirmedSignatureInfo, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv, TokenType } from "elusiv-sdk";
import { getParams } from "./boilerplate";

async function main() {
    // Helper function for generating the elusiv instance 
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, keyPair } = await getParams();

    // Top up with 1 Sol
    console.log("Initiating topup...")
    const sig = await topup(elusiv, keyPair, LAMPORTS_PER_SOL, 'LAMPORTS');
    console.log(`Topup complete with sig ${sig.signature}`);
}

async function topup(elusivInstance: Elusiv, keyPair: Keypair, amount: number, tokenType: TokenType): Promise<ConfirmedSignatureInfo> {
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
