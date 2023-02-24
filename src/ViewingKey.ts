import { ViewingKey, getSendTxWithViewingKey } from "elusiv-sdk";
import { getParams } from "./boilerplate";
import { CLUSTER } from "./constants";

async function main() {
    // Helper function for generating the elusiv instance 
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, conn, keyPair } = await getParams();

    // Fetch our last 5 private transactions using SOL
    const last5PrivTxs = await elusiv.getPrivateTransactions(5, 'LAMPORTS');

    // Get our latest send tx if it exists
    const lastSendTx = last5PrivTxs.find(tx => tx.txType === 'SEND');
    if (lastSendTx === undefined) throw new Error("Could not find a send tx to generate a viewing key for!");

    console.log(`Generating a viewing key for (original owner is ${keyPair.publicKey.toBase58()}):`);
    console.log(lastSendTx);
    const viewingKey = elusiv.getViewingKey(lastSendTx);
    console.log(`Generated viewing key: ${viewingKeyToString(viewingKey)}`);

    // *Pass the generated viewing key to someone else 
    // who DOES NOT know our seed or have access to our elusiv instance* 

    // Decrypt & display the provided transaction
    const decryptedTx = await getSendTxWithViewingKey(conn, CLUSTER, viewingKey)

    console.log(`Parsed owner ${decryptedTx.owner.toBase58()} from following tx with viewing key:`)
    console.log(decryptedTx.sendTx);
}


function viewingKeyToString(v: ViewingKey): string {
    return `Version: ${v.version}\nId Key: ${v.idKey}\nDecryption Key: ${v.decryptionKey}`
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
