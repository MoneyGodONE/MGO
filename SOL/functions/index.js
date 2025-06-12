const functions = require("firebase-functions");
const admin = require("firebase-admin");
const anchor = require("@coral-xyz/anchor");
const { Connection, clusterApiUrl } = require("@solana/web3.js");
const idl = require("./idl.json");

admin.initializeApp();
const db = admin.firestore();

const PROGRAM_ID = new anchor.web3.PublicKey("4bvgPRkTMnqRuHxFpCJQ4YpQj6i7cJkYehMjM2qNpump");

exports.syncVowsToFirestore = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "processed");
    const provider = new anchor.AnchorProvider(connection, {}, {});
    const program = new anchor.Program(idl, PROGRAM_ID, provider);

    const logs = await program.account.vowLog.all();

    const batch = db.batch();
    logs.forEach(({ account, publicKey }) => {
      const vowData = {
        user: account.user.toString(),
        text: account.vowText,
        timestamp: account.timestamp,
        verified: account.verified,
        category: account.category,
      };
      const ref = db.collection("vows").doc(publicKey.toString());
      batch.set(ref, vowData, { merge: true });
    });

    await batch.commit();
    console.log(`Synced ${logs.length} vow logs.`);
  });
