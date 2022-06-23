# dashapp-cryptoshare

### To get started

### clone the repo then execute 

```
npm install 
npm run start 
```

This projects illustrates how to create a username for crypto addresses using Dash on the dash testnet

i give the user to ability to connect to import their wallet using their mnemonic phrase or create a new wallet

funding for the testnet wallet is done via faucet https://testnet-faucet.dash.org/ 


### Code for creating a wallet

```
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
```

