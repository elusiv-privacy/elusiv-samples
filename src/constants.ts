/**
 * Constants used throughout the samples
 */

import { Cluster } from "@solana/web3.js";

export const DEVNET_RPC_URL = 'https://api.devnet.solana.com';

export const CLUSTER : Cluster = 'devnet';

/**
 * ONLY FOR SAMPLES NEVER EVER STORE YOUR/ANYONE'S PRIVATE KEY IN PLAIN TEXT
 * TODO: Insert your private key here
 */
export const PRIV_KEY = (new Uint8Array([224, 85, 168, 65, 140, 6, 113, 247, 169, 252, 121,
    139, 24, 152, 58, 182, 198, 150, 246, 3, 96, 228,
    29, 154, 96, 157, 253, 45, 61, 126, 49, 35, 235,
    100, 227, 4, 30, 183, 152, 13, 203, 212, 117, 114,
    107, 115, 101, 38, 33, 196, 205, 216, 189, 83, 24,
    35, 78, 82, 240, 94, 107, 238, 9, 230]));

/**
 * Pin/Password to be collected from the user. Also possible to use a fixed string here for better UX, but STRONGLY DISCOURAGED.
 * Reason: If this string is publicly known, any other dapp can ask the user to sign it and regenerate the Elusiv seed.
 */
export const USER_PASSWORD = 'ElusivSandstorm'
