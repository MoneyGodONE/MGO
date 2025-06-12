import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useWallet, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import idl from "./idl.json";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PROGRAM_ID = new PublicKey("4bvgPRkTMnqRuHxFpCJQ4YpQj6i7cJkYehMjM2qNpump");
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };
const categories = ["Prayer", "VolunteerWork", "CharityDonation", "Mentorship", "ElderSupport"];

export default function MGOApp() {
  const wallet = useWallet();
  const [provider, setProvider] = useState(null);
  const [program, setProgram] = useState(null);
  const [vowText, setVowText] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [category, setCategory] = useState(0);

  useEffect(() => {
    if (wallet.connected) {
      const connection = new Connection(network, opts.preflightCommitment);
      const provider = new AnchorProvider(connection, wallet, opts);
      const program = new Program(idl, PROGRAM_ID, provider);
      setProvider(provider);
      setProgram(program);
    }
  }, [wallet]);

  const submitVow = async () => {
    if (!program) return;
    const logKeypair = web3.Keypair.generate();
    await program.methods.createLog(vowText, isAnon, category)
      .accounts({
        log: logKeypair.publicKey,
        user: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId
      })
      .signers([logKeypair])
      .rpc();
    alert("Vow submitted!");
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">MGO Vow Log</h1>
      <WalletMultiButton />

      <Card>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your vow or act of service..."
            value={vowText}
            onChange={(e) => setVowText(e.target.value)}
          />
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
          >
            {categories.map((c, i) => (
              <option value={i} key={c}>{c}</option>
            ))}
          </select>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={isAnon} onChange={(e) => setIsAnon(e.target.checked)} />
            <span>Post anonymously</span>
          </label>
          <Button onClick={submitVow} disabled={!wallet.connected}>Submit Vow</Button>
        </CardContent>
      </Card>
    </div>
  );
}
