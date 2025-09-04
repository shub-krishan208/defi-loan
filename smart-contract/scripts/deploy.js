const ethers = require("hardhat").ethers;
async function main() {
  const [deployer] = await ethers.getSigners(); // returns the first account from the list of  hardhat accounts (if run on localhost network)

  console.log("Deploying using the account: ", deployer.address);

  const MyToken = await ethers.getContractFactory("MyToken");
  const mytoken = await MyToken.deploy(deployer.address);
  await mytoken.waitForDeployment();

  const mtAdd = await mytoken.getAddress();
  console.log("Token deployed to: ", mtAdd);

  const LoanSystem = await ethers.getContractFactory("LoanSystem");
  const loansystem = await LoanSystem.deploy(mtAdd);
  await loansystem.waitForDeployment();

  console.log(
    "Loan System contract deployed to: ",
    await loansystem.getAddress()
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
