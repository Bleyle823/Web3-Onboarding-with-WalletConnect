import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
<<<<<<< HEAD
 * Deploys a contract named "Poll" using the deployer account.
 * The Poll contract doesn't require constructor arguments.
=======
 * Deploys the Poll contract using the deployer account
>>>>>>> 0faf46f7e42a04d9b2d99854add7a306e9fd9691
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployPoll: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
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

  await deploy("Poll", {
    from: deployer,
<<<<<<< HEAD
    // Poll contract doesn't require constructor arguments
=======
    // Poll contract has no constructor arguments
>>>>>>> 0faf46f7e42a04d9b2d99854add7a306e9fd9691
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const pollContract = await hre.ethers.getContract<Contract>("Poll", deployer);
  console.log("✅ Poll contract deployed at:", await pollContract.getAddress());
<<<<<<< HEAD
  console.log("📊 Poll count:", await pollContract.pollCount());
=======
  console.log("📊 Initial poll count:", (await pollContract.pollCount()).toString());
>>>>>>> 0faf46f7e42a04d9b2d99854add7a306e9fd9691
};

export default deployPoll;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Poll
<<<<<<< HEAD
deployPoll.tags = ["Poll"];
=======
deployYourContract.tags = ["Poll"];
>>>>>>> 0faf46f7e42a04d9b2d99854add7a306e9fd9691
