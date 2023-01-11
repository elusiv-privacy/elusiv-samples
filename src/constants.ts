/**
 * Constants used throughout the samples
 */

export const DEVNET_RPC_URL = 'https://api.devnet.solana.com';

/**
 * ONLY FOR SAMPLES NEVER EVER STORE YOUR/ANYONE'S PRIVATE KEY IN PLAIN TEXT
 * TODO: Insert your private key here
 */
export const PRIV_KEY = Uint8Array.from([]);

/**
 * Pin/Password to be collected from the user. Also possible to use a fixed string here for better UX, but STRONGLY DISCOURAGED.
 * Reason: If this string is publicly known, any other dapp can ask the user to sign it and regenerate the Elusiv seed.
 */
export const USER_PASSWORD = 'ElusivSandstorm'
