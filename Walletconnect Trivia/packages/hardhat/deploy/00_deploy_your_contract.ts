import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the Trivia contract and a MockERC20 token for rewards
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployTrivia: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const isLocalNetwork = hre.network.name === "hardhat" || hre.network.name === "localhost";

  // Check if MockERC20 is already deployed
  let mockTokenAddress: string;
  const existingMockToken = await hre.deployments.getOrNull("MockERC20");
  
  if (existingMockToken) {
    console.log("ℹ️  MockERC20 already deployed at:", existingMockToken.address);
    mockTokenAddress = existingMockToken.address;
  } else {
    // First, deploy the MockERC20 token
    const mockToken = await deploy("MockERC20", {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: isLocalNetwork ? 1 : 2, // Wait for confirmations on live networks
      autoMine: isLocalNetwork,
    });

    console.log("✅ MockERC20 deployed at:", mockToken.address);
    mockTokenAddress = mockToken.address;
  }

  // Deploy the Trivia contract with the token address
  const trivia = await deploy("Trivia", {
    from: deployer,
    args: [mockTokenAddress],
    log: true,
    waitConfirmations: isLocalNetwork ? 1 : 2, // Wait for confirmations on live networks
    autoMine: isLocalNetwork,
  });

  console.log("✅ Trivia contract deployed at:", trivia.address);

  // Get the deployed contracts to interact with them
  const triviaContract = await hre.ethers.getContract<Contract>("Trivia", deployer);
  const tokenContract = await hre.ethers.getContract<Contract>("MockERC20", deployer);

  // Transfer some tokens to the Trivia contract for rewards
  const transferAmount = hre.ethers.parseEther("100000"); // 100k tokens
  console.log("⏳ Transferring tokens to Trivia contract...");
  const transferTx = await tokenContract.transfer(trivia.address, transferAmount);
  
  if (!isLocalNetwork) {
    console.log("⏳ Waiting for token transfer confirmation...");
    await transferTx.wait(2); // Wait for 2 confirmations
  }
  
  console.log(`✅ Transferred ${transferAmount.toString()} tokens to Trivia contract for rewards`);

  // Verify the setup
  const owner = await triviaContract.owner();
  const rewardToken = await triviaContract.rewardToken();
  const questionCount = await triviaContract.getQuestionCount();

  console.log("\n📋 Contract Setup:");
  console.log("  Owner:", owner);
  console.log("  Reward Token:", rewardToken);
  console.log("  Initial Question Count:", questionCount.toString());
};

export default deployTrivia;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Trivia
deployTrivia.tags = ["Trivia"];
