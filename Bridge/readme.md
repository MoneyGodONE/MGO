Usage:Set PRIVATE_KEY_EVM in .env (your EVM wallet private key).
For BSC: npx hardhat run scripts/deploy.js --network bsc
For Base: npx hardhat run scripts/deploy.js --network base
To bridge: Use Wormhole SDK (install @wormhole-foundation/sdk) or Portal UI.Example bridge script snippet (after setup):javascript

// Use Wormhole SDK to attest and transfer from Solana to EVM.
// See docs: https://docs.wormhole.com/wormhole/quick-start/token#transfer-tokens
// This would lock on Solana and mint on BSC/Base via relayers.


https://wormholescan.io/#/developers/integrators/submit-protocol
