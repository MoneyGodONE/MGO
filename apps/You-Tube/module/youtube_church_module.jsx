import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function ChurchMemberDashboard() {
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState(null);
  const [vowText, setVowText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const functions = getFunctions();
  const auth = getAuth();

  useEffect(() => {
    if (!publicKey) return;
    const loadProfile = async () => {
      const docRef = doc(db, 'members', publicKey.toBase58());
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setProfile(snap.data());
      }
    };
    loadProfile();
  }, [publicKey]);

  const submitVow = async () => {
    setSubmitting(true);
    const vow = {
      wallet: publicKey.toBase58(),
      text: vowText,
      timestamp: Date.now(),
      category: 'Prayer',
    };
    await setDoc(doc(db, 'vows', publicKey.toBase58() + '_' + Date.now()), vow);

    const mintBadge = httpsCallable(functions, 'mintBadge');
    await mintBadge({ wallet: vow.wallet, category: vow.category });

    setSubmitting(false);
    alert('Vow submitted and badge minted!');
    setVowText('');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Church Member Dashboard</h2>
      {publicKey ? (
        <>
          <div className="bg-gray-100 p-3 rounded mb-4">
            <p><strong>Wallet:</strong> {publicKey.toBase58()}</p>
            {profile && <p><strong>Member Since:</strong> {new Date(profile.created).toLocaleDateString()}</p>}
          </div>

          <textarea
            value={vowText}
            onChange={(e) => setVowText(e.target.value)}
            placeholder="Enter your prayer or service vow"
            className="w-full border p-2 mb-2"
          />

          <button
            onClick={submitVow}
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Vow + Mint Badge
          </button>
        </>
      ) : (
        <p className="text-red-500">Please connect your Solana wallet</p>
      )}
    </div>
  );
}

