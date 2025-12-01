import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the WalletConnectNFT contract using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network baseSepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Constructor arguments for WalletConnectNFT
  const contractName = "WalletConnect NFT";
  const contractSymbol = "WCNFT";
  const baseTokenURI = "https://ipfs.io/ipfs/"; // You can update this to your IPFS gateway

  await deploy("WalletConnectNFT", {
    from: deployer,
    // Contract constructor arguments: name, symbol, baseTokenURI
    args: [contractName, contractSymbol, baseTokenURI],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const nftContract = await hre.ethers.getContract<Contract>("WalletConnectNFT", deployer);
  console.log("✅ WalletConnectNFT deployed at:", await nftContract.getAddress());
  console.log("📝 Contract Name:", contractName);
  console.log("🔖 Contract Symbol:", contractSymbol);
  console.log("🌐 Base Token URI:", baseTokenURI);
  
  // Get collection stats
  const stats = await nftContract.getCollectionStats();
  console.log("📊 Collection Stats:");
  console.log("   - Current Supply:", stats.currentSupply.toString());
  console.log("   - Max Supply:", stats.maxSupply_.toString());
  console.log("   - Mint Price:", hre.ethers.formatEther(stats.mintPrice_), "ETH");
  console.log("   - Minting Enabled:", stats.mintingEnabled_);
  console.log("   - Public Mint Enabled:", stats.publicMintEnabled_);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags WalletConnectNFT
deployYourContract.tags = ["WalletConnectNFT"];
