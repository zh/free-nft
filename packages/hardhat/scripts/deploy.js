const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('WaifuGen');
  const domainContract = await domainContractFactory.deploy(
    'WaifuGen',
    'WAIFUGEN',
    'ipfs://bafybeigv5iojhntwdswb4zx4oyunncqjpcxwm6jlyf4xqakft5nnvyekgm/'
  );
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
