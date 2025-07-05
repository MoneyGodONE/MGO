import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { PublicKey, Connection } from '@solana/web3.js';

export default function MyBadges({ walletAddress }) {
  const [badges, setBadges] = useState([]);
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  useEffect(() => {
    const fetchBadges = async () => {
      if (!walletAddress) return;
      try {
        const nfts = await getParsedNftAccountsByOwner({
          publicAddress: walletAddress,
          connection
        });
        const badgeNfts = nfts.filter(nft => nft?.data?.symbol === 'MGO');
        setBadges(badgeNfts);
      } catch (e) {
        console.error('Failed to fetch badges:', e);
      }
    };

    fetchBadges();
  }, [walletAddress]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {badges.map((nft, idx) => (
        <Card key={idx} className="p-2">
          <CardContent>
            <img src={nft.data.uri} alt={nft.data.name} className="w-full rounded" />
            <h3 className="mt-2 text-sm font-semibold">{nft.data.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
