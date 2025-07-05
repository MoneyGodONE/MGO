// functions/mint.js
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { mintV2 } = require('@metaplex-foundation/mpl-candy-machine');
const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const bs58 = require('bs58');

const connection = new Connection('https://api.mainnet-beta.solana.com');
const umi = createUmi(connection);

// Replace with your Candy Machine ID and authority private key
const CANDY_MACHINE_ID = new PublicKey('REPLACE_WITH_YOUR_CM_ID');
const WALLET_SECRET = process.env.MGO_AUTHORITY_SECRET;
const payer = umi.eddsa.createKeypairFromSecretKey(bs58.decode(WALLET_SECRET));

const badgeURIs = {
  Prayer: 'https://arweave.net/YOUR_PRAYER_METADATA.json',
  Service: 'https://arweave.net/YOUR_SERVICE_METADATA.json'
};

async function mintBadgeNFT(recipientAddress, category) {
  const recipient = new PublicKey(recipientAddress);
  const metadataUri = badgeURIs[category];

  if (!metadataUri) throw new Error('Invalid category');

  const { signature } = await mintV2(
    umi,
    {
      candyMachine: CANDY_MACHINE_ID,
      collectionMint: new PublicKey('REPLACE_WITH_COLLECTION_MINT'),
      payer,
      nftMint: umi.eddsa.generateKeypair(),
      destinationOwner: recipient,
      metadataUri
    }
  );

  return signature;
}

module.exports = { mintBadgeNFT };
