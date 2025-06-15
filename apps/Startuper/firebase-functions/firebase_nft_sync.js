const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Connection, PublicKey } = require('@solana/web3.js');
const { mintNft } = require('./mint-nft'); // Assume helper exists for Metaplex
admin.initializeApp();

exports.syncPledge = functions.https.onCall(async (data, context) => {
  const { chain, userAddress, amount, campaignId } = data;
  const db = admin.firestore();

  await db.collection('contributions').add({
    user: userAddress,
    amount,
    campaignId,
    chain,
    timestamp: Date.now(),
  });

  if (chain === 'solana') {
    await mintNft(userAddress, {
      name: 'MGO Supporter Badge',
      symbol: 'MGO',
      uri: 'https://your-nft-metadata-url.json'
    });
  }

  return { success: true };
});
