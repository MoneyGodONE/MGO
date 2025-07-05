const { Metaplex, keypairIdentity, bundlrStorage } = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const secret = require('../wallet-keypair.json');

const connection = new Connection('https://api.mainnet-beta.solana.com');
const walletKeypair = Keypair.fromSecretKey(Uint8Array.from(secret));
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(walletKeypair))
  .use(bundlrStorage());

async function mintNft(toWallet, metadata) {
  const { uri, name, symbol } = metadata;
  const owner = new PublicKey(toWallet);

  const { nft, response } = await metaplex.nfts().create({
    uri,
    name,
    symbol,
    sellerFeeBasisPoints: 0,
    updateAuthority: walletKeypair,
    mintAuthority: walletKeypair,
    tokenOwner: owner,
  });

  return response.signature;
}

module.exports = { mintNft };
