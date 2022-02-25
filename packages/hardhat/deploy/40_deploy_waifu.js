//const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const {deployer, tokenOwner} = await getNamedAccounts();
  await deploy('WaifuGen', {
    from: deployer,
    args: [
      "WaifuGen",
      "WAIFUGEN",
      "ipfs://bafybeigv5iojhntwdswb4zx4oyunncqjpcxwm6jlyf4xqakft5nnvyekgm/"
    ],
    log: true,
  });
};
module.exports.tags = ["WAIFU"];
