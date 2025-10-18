require('dotenv').config();
const { Wormhole, signTransaction, getSignedVAA } = require('@wormhole-foundation/sdk');
const solana = require('@wormhole-foundation/sdk/solana');
const evm = require('@wormhole-foundation/sdk/evm');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Wallet: EvmWallet } = require('ethers'); // For EVM signer
const bs58 = require('bs58');

async function main() {
  const wh = await Wormhole('Mainnet', [solana, evm]); // Or 'Testnet'

  // Solana setup
  const srcChain = wh.getChain('Solana');
  const connection = new Connection(process.env.SOLANA_RPC, 'confirmed');
  const privateKey = bs58.decode(process.env.PRIVATE_KEY_BASE58);
  const solanaWallet = Keypair.fromSecretKey(privateKey);
  const solanaSigner = { signTransaction: async (tx) => signTransaction(connection, tx, [solanaWallet]) };

  // EVM setup (for BSC or Base; repeat for each)
  const evmSigner = new EvmWallet(process.env.PRIVATE_KEY_EVM); // Same key for both if desired

  // Example: Bridge to BSC (chain ID 'Bsc')
  const dstChainBsc = wh.getChain('Bsc');
  const transferToBsc = await srcChain.tokenBridge.transfer(
    solanaSigner,
    { token: '4bvgPRkTMnqRuHxFpCJQ4YpQj6i7cJkYehMjM2qNpump', amount: 1000000n * 10n ** 9n }, // Adjust amount/decimals
    { chain: dstChainBsc.chain, address: '0xe6cbc4170b19fd2bae844b9a326b6b3f9423190f' } // Your BSC wrapped address
  );

  const vaaBsc = await getSignedVAA(wh, transferToBsc.message);
  console.log('VAA for BSC Bridge:', vaaBsc); // Base64 VAA here

  // Redeem on BSC
  await dstChainBsc.tokenBridge.redeem(evmSigner, vaaBsc);

  // Repeat for Base (chain ID 'Base')
  const dstChainBase = wh.getChain('Base');
  const transferToBase = await srcChain.tokenBridge.transfer(
    solanaSigner,
    { token: '4bvgPRkTMnqRuHxFpCJQ4YpQj6i7cJkYehMjM2qNpump', amount: 1000000n * 10n ** 9n },
    { chain: dstChainBase.chain, address: '0x17569125459bf5e630bd4ce16efe38da146d8681' }
  );

  const vaaBase = await getSignedVAA(wh, transferToBase.message);
  console.log('VAA for Base Bridge:', vaaBase);

  await dstChainBase.tokenBridge.redeem(evmSigner, vaaBase);

  console.log('Bridges completed; prices should unify via arbitrage.');
}

main().catch(console.error);
