const hre = require("hardhat");

async function main() {
  const ProductAuth = await hre.ethers.getContractFactory("ProductAuth");
  const productAuth = await ProductAuth.deploy();

  await productAuth.waitForDeployment();

  console.log("ProductAuth deployed to:", await productAuth.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 