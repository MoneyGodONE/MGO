import { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

export default function EVMWalletConnector() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    const wcProvider = new WalletConnectProvider({
      rpc: {
        56: "https://bsc-dataseed.binance.org/",
        8453: "https://mainnet.base.org",
      },
    });
    await wcProvider.enable();
    const ethersProvider = new ethers.providers.Web3Provider(wcProvider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();
    const network = await ethersProvider.getNetwork();
    setAccount(address);
    setChainId(network.chainId);
    setProvider(ethersProvider);
  };

  return (
    <div className="p-4 space-y-4">
      <button
        className="bg-blue-600 text-white py-2 px-4 rounded"
        onClick={connectWallet}
      >
        Connect BSC/Base Wallet
      </button>
      {account && (
        <div>
          <p>Connected: {account}</p>
          <p>Chain ID: {chainId}</p>
        </div>
      )}
    </div>
  );
}
