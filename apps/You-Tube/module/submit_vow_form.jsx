import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SubmitVowForm({ userWallet }) {
  const [vowText, setVowText] = useState('');
  const [category, setCategory] = useState('Prayer');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!vowText) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'vows'), {
        wallet: userWallet,
        vow: vowText,
        category,
        timestamp: serverTimestamp(),
        verified: false
      });
      setVowText('');
      alert('🙏 Vow submitted! Awaiting verification.');
    } catch (error) {
      console.error('Error submitting vow:', error);
      alert('Failed to submit vow.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">✍️ Submit a Vow</h1>
      <Textarea
        rows={5}
        placeholder="Write your vow here..."
        className="mb-4"
        value={vowText}
        onChange={(e) => setVowText(e.target.value)}
      />
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Category</label>
        <select
          className="w-full border rounded p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Prayer">Prayer</option>
          <option value="Service">Service</option>
        </select>
      </div>
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit Vow'}
      </Button>
    </div>
  );
}
