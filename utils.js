//create wallet
const Dash = require("dash");

// Mnemonic: job insect involve gloom jewel snake miss tape attitude patient wrestle father
// Unused address: yQ3uPuhezhzTpPPEn7mupdmbF4jGNTaupX

module.exports.createWallet = async (nemonic) => {
  const clientOpts = {
    network: "testnet",
    wallet: {
      mnemonic: nemonic ? nemonic : null, // this indicates that we want a new wallet to be generated
      // if you want to get a new address for an existing wallet
      // replace 'null' with an existing wallet mnemonic
      offlineMode: nemonic ? false : true, // this indicates we don't want to sync the chain
      // it can only be used when the mnemonic is set to 'null'
    },
  };

  const client = new Dash.Client(clientOpts);

  const account = await client.getWalletAccount();

  const mnemonic = client.wallet.exportWallet();
  const address = account.getUnusedAddress();
  console.log("Mnemonic:", mnemonic);
  console.log("Unused address:", address.address);
};

// createWallet()
//   .catch((e) => console.error("Something went wrong:\n", e))
//   .finally(() => client.disconnect());

// // Handle wallet async errors
// client.on("error", (error, context) => {
//   console.error(`Client error: ${error.name}`);
//   console.error(context);
// });

// //connect to wallet
// Identity:
//  {
//   protocolVersion: 1,
//   id: 'DbxYrsyuLmDdo8dMGGRepjPYYo7C1ANDpyCQkfFndGvB',
//   publicKeys: [
//     {
//       id: 0,
//       type: 0,
//       purpose: 0,
//       securityLevel: 0,
//       data: 'A/Vp8li5u/pFmwBFKvJ/2PdMuBblFKNtz30I/rJ7OkqC',
//       readOnly: false
//     }
//   ],
//   balance: 9999409,
//   revision: 0
// }