const { ethers } = require("hardhat");

async function main() {
  const WrappedMyToken = await ethers.getContractFactory("WrappedMyToken");
  const initialSupply = ethers.utils.parseEther("1000000"); // 1,000,000 tokens (18 decimals default)
  const wrappedToken = await WrappedMyToken.deploy(initialSupply);
  await wrappedToken.deployed();
  console.log("Wrapped Token deployed to:", wrappedToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
