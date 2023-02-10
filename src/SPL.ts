import { ConfirmedSignatureInfo, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { airdropToken, Elusiv, getMintAccount, TokenType } from "elusiv-sdk";
import { getParams } from "./boilerplate";

async function main() {
    // Helper function for generating the elusiv instance 
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, keyPair, conn } = await getParams();

    // Airdrop ourselves some "USDC" to our devnet USDC associated token account
    const usdcMint = getMintAccount('USDC');
    console.log("get or create");
    const ataAcc = await getOrCreateAssociatedTokenAccount(conn, keyPair, usdcMint, keyPair.publicKey);
    console.log("Ata is " + ataAcc.address)
    // Important to remember, USDC is actually measured in 1_000_000, so that means we're airdropping 1 billion USDC here, 
    // but that's only $1000.
    const airdropSig = await airdropToken('USDC', LAMPORTS_PER_SOL, ataAcc.address);
    console.log("Successfully airdropped USDC with sig " + airdropSig.signature);

    // Fetch our current private balance
    let privateBalance = await elusiv.getLatestPrivateBalance('USDC')
    console.log("priv balance is " + privateBalance);

    // We have no private balance? Top up! (We can also top up if we already have a private balance of course)
    if(privateBalance === BigInt(0)){
        // Top up with 500 Million USDC
        console.log("Topping up");
        const sig = await topup(elusiv, keyPair, 0.5 * LAMPORTS_PER_SOL, 'USDC');
        console.log(`Topup complete with sig ${sig.signature}`);
    }

    // Let's send some usdc!
    privateBalance = await elusiv.getLatestPrivateBalance('USDC')

    // Can't send without a private balance
    if(privateBalance > BigInt(0)){
        // Send 100 million USDC. Important to note: When sending with elusiv, we provide the owner NOT the token account.
        console.log("Sending");
        const sig = await send(elusiv, keyPair.publicKey, 0.1 * LAMPORTS_PER_SOL, 'USDC');
        console.log(`Send complete with sig ${sig.signature}`);
    }
    else{
        throw new Error('Can\'t send from an empty private balance');
    }
}

// Run main when invoking this file
main().then(
    (a) => { 
        console.log(a)
        process.exit()},
    (err) => {
        throw err;
    },
);

 async function topup(elusivInstance: Elusiv, keyPair: Keypair, amount: number, tokenType : TokenType) : Promise<ConfirmedSignatureInfo> {
    // Build our topup transaction
    const topupTx = await elusivInstance.buildTopUpTx(amount, tokenType);
    // Sign it (only needed for topups, as we're topping up from our public key there)
    topupTx.tx.partialSign(keyPair);
    // Send it off
    return elusivInstance.sendElusivTx(topupTx);
}

async function send(elusiv: Elusiv, recipient : PublicKey, amount: number, tokenType : TokenType) : Promise<ConfirmedSignatureInfo> {
    // Build the send transaction 
    const sendTx = await elusiv.buildSendTx(amount, recipient, tokenType);
    // Send it off!
    return elusiv.sendElusivTx(sendTx);
}
