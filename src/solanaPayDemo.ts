import { Connection, PublicKey, LAMPORTS_PER_SOL, ConfirmedSignatureInfo, Keypair } from "@solana/web3.js";
import { getParams } from "./boilerplate";
import { encodeURL, parseURL, TransferRequestURL, findReference, FindReferenceError } from '@solana/pay';
import BigNumber from 'bignumber.js';

async function main() {
    const { elusiv, conn } = await getParams();
    // Generate the values for the solana pay request
    const recipient = Keypair.generate().publicKey;
    const ref = Keypair.generate().publicKey;
    const memo = encodeURIComponent('My first elusiv tx');
    const amount = new BigNumber(0.1);

    console.log('Creating solana pay transfer request with recipient ' + recipient.toBase58() + ' and reference ' + ref.toBase58() + ' and memo ' + memo + ' and amount ' + amount.toString() + '...');
    const req = createRequest(recipient, amount, ref, encodeURIComponent('Monke Store'), encodeURIComponent('Monke shirt'), memo);

    // Parse the solana pay request to get only the values we need
    const params = parseRequest(req);

    // Fetch our current private balance to check if we have enough money to pay for the item
    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS');

    // Build the send transaction 
    const sendTx = await elusiv.buildSendTx(params.amountLamports, params.recipient, 'LAMPORTS', params.reference, params.memo, true);
    if (Number(privateBalance) - sendTx.getTotalFeeAmount() < params.amountLamports) throw new Error('Insufficient private balance');

    console.log('Built private send transaction, sending...')

    // Enough money? Send it off!
    const res = elusiv.sendElusivTx(sendTx);
    console.log('Solana pay transfer initiated, using solana pay to await confirmation...');

    if (params.reference) {
        console.log('Awaiting confirmation...');
        const conf = await awaitSolanaPayConfirmation(params.reference, conn);

        console.log(conf);
    }

}

// Wrapper for creating a solana pay request
function createRequest(recipient: PublicKey, amount: BigNumber, reference: PublicKey, label: string, message: string, memo: string): URL {
    return encodeURL({ recipient, amount, reference, label, message, memo });
}

// Parse a solana pay request (only getting the parameters that are actually relevant for the transfer transaction)
function parseRequest(url: URL): { recipient: PublicKey, amountLamports: number, reference: PublicKey | undefined, memo: string | undefined } {
    const req = parseURL(url) as TransferRequestURL;
    const { recipient, amount, splToken, reference, memo } = req;

    // Limitations: Elusiv currently only supports one reference key & only lamports (undefined spltoken means sol)

    if (amount === undefined || (reference !== undefined && reference.length !== 1)) throw new Error('Invalid transfer request');

    // Convert from sol to lamports
    return { recipient, amountLamports: amount.toNumber() * LAMPORTS_PER_SOL, reference: reference ? reference[0] : undefined, memo };

}

async function awaitSolanaPayConfirmation(reference: PublicKey, connection: Connection): Promise<ConfirmedSignatureInfo> {
    // Adapted from https://github.com/solana-labs/solana-pay/blob/master/core/example/payment-flow-merchant/main.ts#L61
    let signatureInfo: ConfirmedSignatureInfo;

    return await new Promise((resolve, reject) => {
        /**
         * Retry until we find the transaction
         *
         * If a transaction with the given reference can't be found, the `findTransactionSignature`
         * function will throw an error. There are a few reasons why this could be a false negative:
         *
         * - Transaction is not yet confirmed
         * - Customer is yet to approve/complete the transaction
         *
         * You can implement a polling strategy to query for the transaction periodically.
         */
        const interval = setInterval(async () => {
            console.count('Checking for transaction...');
            try {
                signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
                console.log('\n 🖌  Signature found: ', signatureInfo.signature);
                clearInterval(interval);
                resolve(signatureInfo);
            } catch (error: any) {
                if (!(error instanceof FindReferenceError)) {
                    console.error(error);
                    clearInterval(interval);
                    reject(error);
                }
            }
        }, 35000);
    });
}


// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);