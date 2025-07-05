// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { mintBadgeNFT } = require("./mint");

admin.initializeApp();
const db = admin.firestore();

exports.mintOnVerification = functions.firestore
  .document("vows/{vowId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (!before.verified && after.verified) {
      try {
        await mintBadgeNFT(after.wallet, after.category);
        console.log(`NFT badge minted for ${after.wallet}`);
      } catch (e) {
        console.error("Minting failed:", e);
      }
    }
  });
