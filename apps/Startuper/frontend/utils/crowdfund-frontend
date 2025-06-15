import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnectProvider from '@walletconnect/web3-provider';

export default function CrowdfundApp() {
  const { publicKey, signTransaction } = useWallet();
  const [provider, setProvider] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState('');

  const connectEvm = async () => {
    const wcProvider = new WalletConnectProvider({
      rpc: {
        56: 'https://bsc-dataseed.binance.org/',
        8453: 'https://mainnet.base.org'
      }
    });
    await wcProvider.enable();
    const ethersProvider = new ethers.providers.Web3Provider(wcProvider);
    setProvider(ethersProvider);
  };

  const pledgeEvm = async (campaignId) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const tx = await contract.pledge(campaignId, { value: ethers.utils.parseEther(pledgeAmount) });
    await tx.wait();
    alert('Pledged!');
  };

  const pledgeSolana = async () => {
    if (!publicKey) return alert('Connect Solana Wallet');
    // Call Solana Anchor instructions via backend or use Anchor JS
    alert('Pledge sent via Solana (mocked)');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Support a Project</h1>
      <input value={pledgeAmount} onChange={e => setPledgeAmount(e.target.value)} placeholder="Amount" className="border p-2" />
      <div className="flex gap-4 mt-4">
        <button onClick={connectEvm} className="bg-blue-500 text-white px-4 py-2">Connect EVM</button>
        <button onClick={() => pledgeEvm(1)} className="bg-green-500 text-white px-4 py-2">Pledge (EVM)</button>
        <button onClick={pledgeSolana} className="bg-purple-500 text-white px-4 py-2">Pledge (Solana)</button>
      </div>
    </div>
  );
}

const CONTRACT_ADDRESS = "0x..."; // Fill in your deployed BSC/Base contract address
const ABI = [
  "function pledge(uint256) external payable"
];

