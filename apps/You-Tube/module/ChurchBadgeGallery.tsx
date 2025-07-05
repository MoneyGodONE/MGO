import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const badgeMetadata = {
  Prayer: {
    image: 'https://arweave.net/YOUR_PRAYER_BADGE_IMAGE_LINK',
    description: 'Prayer Vow Badge awarded for submitting a spiritual vow.'
  },
  Service: {
    image: 'https://arweave.net/YOUR_SERVICE_BADGE_IMAGE_LINK',
    description: 'Service Badge awarded for volunteer commitment.'
  }
};

export default function ChurchBadgeGallery({ userWallet }) {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    async function fetchBadges() {
      if (!userWallet) return;
      const q = query(
        collection(db, 'minted_badges'),
        where('wallet', '==', userWallet)
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => doc.data());
      setBadges(results);
    }
    fetchBadges();
  }, [userWallet]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {badges.map((badge, i) => {
        const meta = badgeMetadata[badge.category] || {};
        return (
          <Card key={i} className="rounded-2xl shadow-xl p-4">
            <img src={meta.image} alt={badge.category} className="rounded-xl mb-2" />
            <CardContent>
              <h2 className="text-xl font-bold">{badge.category} Badge</h2>
              <p className="text-sm text-gray-600">{meta.description}</p>
              <p className="text-xs text-green-500 mt-1">Minted: {new Date(badge.timestamp).toLocaleString()}</p>
              <p className="text-xs break-all text-gray-400">Tx: {badge.tx}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
