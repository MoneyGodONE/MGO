const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { mintNft } = require('./metaplex/mint');
admin.initializeApp();

exports.mintBadge = functions.https.onCall(async (data, context) => {
  const { wallet, category } = data;
  if (!wallet || !category) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing wallet or category');
  }

  const metadataByCategory = {
    Prayer: {
      name: 'Prayer Vow Badge',
      symbol: 'MGO',
      uri: 'https://your-metadata-url.com/prayer.json',
    },
    Service: {
      name: 'Service Vow Badge',
      symbol: 'MGO',
      uri: 'https://your-metadata-url.com/service.json',
    },
  };

  const nftMetadata = metadataByCategory[category] || metadataByCategory['Prayer'];
  try {
    const tx = await mintNft(wallet, nftMetadata);
    await admin.firestore().collection('minted_badges').add({
      wallet,
      category,
      timestamp: Date.now(),
      tx,
    });
    return { success: true, tx };
  } catch (err) {
    throw new functions.https.HttpsError('internal', 'Minting failed', err);
  }
});
