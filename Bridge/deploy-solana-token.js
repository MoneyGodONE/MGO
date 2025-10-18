require('dotenv').config();
const { Connection, Keypair, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const bs58 = require('bs58');

async function main() {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed'); // Use 'devnet' for testing

  const privateKey = bs58.decode(process.env.PRIVATE_KEY_BASE58);
  const wallet = Keypair.fromSecretKey(privateKey);

  // Use existing mint
  const mint = new PublicKey('4bvgPRkTMnqRuHxFpCJQ4YpQj6i7cJkYehMjM2qNpump');
  console.log('Using Existing Token Mint Address:', mint.toBase58());

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    wallet.publicKey
  );
  console.log('Token Account Address:', tokenAccount.address.toBase58());

main().catch(console.error);
