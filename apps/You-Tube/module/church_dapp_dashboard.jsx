import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ChurchDAppDashboard({ userWallet }) {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-white to-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">🙏 Welcome to Money God One Church DApp</h1>

      <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Your Badges</h2>
          <p className="text-sm text-gray-600 mb-4">View spiritual and service rewards you've earned.</p>
          <Link href="/my-badges">
            <Button className="w-full">🎖 View Badges</Button>
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Submit a Vow</h2>
          <p className="text-sm text-gray-600 mb-4">Make a spiritual or service vow and join our mission.</p>
          <Link href="/submit-vow">
            <Button className="w-full">✍️ Submit Vow</Button>
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p className="text-sm text-gray-600 mb-4">Check your wallet info and MGO balance.</p>
          <Link href="/profile">
            <Button className="w-full">👤 View Profile</Button>
          </Link>
        </div>
      </div>

      <div className="text-center mt-12 text-sm text-gray-500">
        Connected wallet: <span className="font-mono">{userWallet}</span>
      </div>
    </div>
  );
}
