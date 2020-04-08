const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    cldev: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    live: {
      provider: () => {
        return new HDWalletProvider(
          "margin leader jealous spell alien salon enjoy bright wide tip vague rescue",
          "https://ropsten.rpc.fiews.io/v1/free"
        );
      },
      network_id: "3",
      // Necessary due to https://github.com/trufflesuite/truffle/issues/1971
      // Should be fixed in Truffle 5.0.17
      skipDryRun: true,
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.4.24",
    },
  },
};
