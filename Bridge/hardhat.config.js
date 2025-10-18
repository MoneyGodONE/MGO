require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    bsc: {
      url: "https://bsc-dataseed.binance.org/", // Or testnet: https://data-seed-prebsc-1-s1.binance.org:8545
      accounts: [process.env.PRIVATE_KEY_EVM],
    },
    base: {
      url: "https://mainnet.base.org", // Or testnet: https://sepolia.base.org
      accounts: [process.env.PRIVATE_KEY_EVM],
    },
  },
};
