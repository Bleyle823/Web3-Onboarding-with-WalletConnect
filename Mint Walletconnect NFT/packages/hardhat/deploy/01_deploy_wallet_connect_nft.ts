import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the WalletConnectNFT contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployWalletConnectNFT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Constructor arguments
  const name = "WalletConnect NFT";
  const symbol = "WCNFT";
  // Using a placeholder IPFS hash for the base URI. 
  // You should replace this with your actual IPFS CID when you have one.
  const baseTokenURI = "ipfs://QmZP4Kk8n5d8.../"; 

  await deploy("WalletConnectNFT", {
    from: deployer,
    // Contract constructor arguments
    args: [name, symbol, baseTokenURI],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const walletConnectNFT = await hre.ethers.getContract<Contract>("WalletConnectNFT", deployer);
  console.log("👋 WalletConnectNFT deployed at:", await walletConnectNFT.getAddress());
};

export default deployWalletConnectNFT;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags WalletConnectNFT
deployWalletConnectNFT.tags = ["WalletConnectNFT"];

