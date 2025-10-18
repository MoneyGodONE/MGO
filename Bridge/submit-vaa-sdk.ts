import { Wormhole, signSendWait } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import { ethers } from 'ethers'; // v5
require('dotenv').config();

// Base64 VAA (your provided one; replace if needed)
const vaaBase64 = 'AQAAAAABAAUEGjMhr7+Wa1RB3r/ePGtI9AW4ZpBYbPoZETE31AQIIlruhXWsWNlFGBZJTJA/bNBGbpwY17NM5wT7vkyRoqcBaBhsUwAAAAAAATsmQJ+Kre0/XdyhhGlapqD6gpsMhcr4SFYySJbSFMqYAAAAAAAAe3UgAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABdIdugAMl5TdY2PvRfISg0vu/hDraznxQs4Rdj2bD8pucRaEAcAAQAAAAAAAAAAAAAAANtUkiZfYDiDHon0lWcP+Qmt6UvZJxJSEVaEb4NC66JT6eM4rAcoML4SFZrG0rJaRfL8TH935gEAAAAAAAAAAAAAAABXRsrLH3GNCU3vUYD+v2Csub2BpgAAAAAAAABkYnZnUFJrVE1ucVJ1SHhGcENKUTRZcFFqNmlEY2pLWWVoTWpNMnFOcHVtcA==';

// Function to get EVM signer
async function getEvmSigner(chainName: 'Bsc' | 'Base') {
  const rpc = chainName === 'Bsc' ? 'https://bsc-dataseed.binance.org/' : 'https://mainnet.base.org';
  const privateKey = chainName === 'Bsc' ? process.env.PRIVATE_KEY_BSC : process.env.PRIVATE_KEY_BASE;
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  return new ethers.Wallet(privateKey, provider);
}

async function main() {
  const wh = await Wormhole('Mainnet', [evm]);

  // For BSC (repeat for 'Base')
  const dstChain = wh.getChain('Bsc'); // Or 'Base'
  const signer = await getEvmSigner('Bsc'); // Or 'Base'

  // Decode base64 to bytes (VAA is already signed)
  const vaaBytes = Buffer.from(vaaBase64, 'base64');

  // Get TokenBridge protocol for destination
  const tb = await dstChain.getTokenBridge();

  // Submit VAA (for transfer redemption; use submitAttestation if attestation VAA)
  const txGenerator = tb.redeem(vaaBytes); // Or completeTransfer if part of WormholeTransfer object

  // Sign and send
  const txids = await signSendWait(dstChain, txGenerator, signer);
  console.log('VAA submitted on', dstChain.chain, ':', txids);

  // If recovering from txid (alternative if no base64):
  // const sourceTxid = 'YOUR_SOL_TXID_HERE';
  // const xfer = await wh.tokenTransfer.from(sourceTxid); // Rebuild transfer
  // const destTxids = await xfer.completeTransfer(signer);
  // console.log('Transfer completed:', destTxids);
}

main().catch(console.error);
