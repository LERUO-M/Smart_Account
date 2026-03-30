require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();



module.exports = {
  defaultNetwork: "localhost",
  networks: {
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};

