import { sign } from "@noble/ed25519";
import { Connection, Keypair } from "@solana/web3.js";
import { Elusiv } from "elusiv-sdk";
import { DEVNET_RPC_URL, PRIV_KEY, USER_PASSWORD } from "./constants";

// Boilerplate code used by all samples

// Helper function to generate params used by all samples, namely a web3js connection, the keypair of the user, and the elusiv instance 
export async function getParams(): Promise<{ elusiv: Elusiv, keyPair: Keypair }> {
    if(PRIV_KEY.length === 0) throw new Error('Need to provide a private key in constants.ts');
    // Connect to devnet
    const connection = new Connection(DEVNET_RPC_URL);

    // Generate a keypair from the private key to retrieve the public key and optionally 
    // sign txs
    const keyPair = Keypair.fromSecretKey(PRIV_KEY);

    // Generate the input seed. Remember, this is almost as important as the private key, so don't log this!
    // (We use sign from an external library here because there is no wallet connected. Usually you'd use the wallet adapter here) 
    // (Slice because in Solana's keypair type the first 32 bytes is the privkey and the last 32 is the pubkey)
    const seed = await sign(Elusiv.hashPw(USER_PASSWORD), keyPair.secretKey.slice(0, 32));

    // Create the elusiv instance
    const elusiv = await Elusiv.getElusivInstance(seed, keyPair.publicKey, connection);

    return { elusiv, keyPair };
}

export function generatePrivateKey() : void{
    const kp = Keypair.generate();
    console.log('Private key (add this to constants.ts):')
    console.log(kp.secretKey);
    console.log('Public key (airdrop some sol to this):')
    console.log(kp.publicKey.toBase58());
}