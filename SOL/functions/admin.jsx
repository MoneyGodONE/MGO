import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const categories = ["Prayer", "VolunteerWork", "CharityDonation", "Mentorship", "ElderSupport"];

export function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "vows"));
      const vows = snap.docs.map(doc => doc.data());

      const summary = vows.reduce((acc, vow) => {
        const cat = categories[vow.category] || "Unknown";
        acc[cat] = (acc[cat] || 0) + 1;
        acc.total = (acc.total || 0) + 1;
        if (vow.verified) acc.verified = (acc.verified || 0) + 1;
        return acc;
      }, {});
      setStats(summary);
    };

    load();
  }, []);

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-bold">Community Vow Analytics</h2>
      <p>Total Vows: {stats.total || 0}</p>
      <p>Verified: {stats.verified || 0}</p>
      {categories.map(cat => (
        <p key={cat}>{cat}: {stats[cat] || 0}</p>
      ))}
    </div>
  );
}
