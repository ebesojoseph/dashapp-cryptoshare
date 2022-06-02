const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
const { render } = require("ejs");
const Dash = require("dash");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.set("trust proxy", 1); // trust first proxy

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.get("/createid", async (req, res) => {
  res.render("createid");
});
app.get("/importwallet", () => {
  res.render("importwallet");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/connectwallet", (req, res) => {
  if (req.session.auth) {
    res.redirect("/");
  }
  res.render("connect_wallet");
});
app.post("/importwallet", async (req, res) => {
  const { mnemonic } = req.body;
  const clientOpts = {
    network: "testnet",
    wallet: {
      mnemonic: mnemonic, // this indicates that we want a new wallet to be generated
      // if you want to get a new address for an existing wallet
      // replace 'null' with an existing wallet mnemonic
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 650000, // only sync from early-2022
      },
    },
  };

  const client = new Dash.Client(clientOpts);

  const createWallet = async () => {
    const account = await client.getWalletAccount();

    const mnemonic = client.wallet.exportWallet();
    const address = account.getUnusedAddress();

    req.session.user = {
      address: address.address,
      mnemonic: mnemonic,
    };

    console.log("Mnemonic:", client.wallet);
    console.log("Unused address:");

    res.render("/");
  };

  createWallet()
    .catch((e) => console.error("Something went wrong:\n", e))
    .finally(() => client.disconnect());

  // Handle wallet async errors
  client.on("error", (error, context) => {
    console.error(`Client error: ${error.name}`);
    console.error(context);
  });
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.post("/index", async (req, res) => {
  const {domain} = req.body;

  if (!req.session.user.mnemonic) {
    res.redirect("/connectwallet");
  }

  if (!req.session.user.id) {
    res.redirect("/createid");
  }
  const clientOpts = {
    wallet: {
      mnemonic: req.session.user.mnemonic,
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 650000, // only sync from early-2022
      },
    },
  };
  const client = new Dash.Client(clientOpts);
  
  const registerName = async () => {
    const { platform } = client;
  
    const identity = await platform.identities.get(req.session.user.id);
    const nameRegistration = await platform.names.register(
      `${domain.split("."[0])}.dash`,
      { dashUniqueIdentityId: identity.getId() },
      identity,
    );
  
    return nameRegistration;
  };
  
  registerName()
    .then((d) => console.log('Name registered:\n', d.toJSON()))
    .catch((e) => console.error('Something went wrong:\n', e))
    .finally(() => client.disconnect());
});
app.post("/createid", async (req, res) => {
  const { mnemonic, address } = req.body;
  const clientOpts = {
    network: "testnet",
    wallet: {
      mnemonic: mnemonic,
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 650000, // only sync from early-2022
      },
    },
  };
  const client = new Dash.Client(clientOpts);

  const createIdentity = async () => {
    return client.platform.identities.register();
  };

  createIdentity()
    .then((d) => {
      console.log("Identity:\n", d.toJSON());
    })
    .catch((e) => console.error("Something went wrong:\n", e))
    .finally(() => client.disconnect());
});

app.get("/createwallet", async (req, res) => {
  const clientOpts = {
    network: "testnet",
    wallet: {
      mnemonic: null, // this indicates that we want a new wallet to be generated
      // if you want to get a new address for an existing wallet
      // replace 'null' with an existing wallet mnemonic
      offlineMode: true, // this indicates we don't want to sync the chain
      // it can only be used when the mnemonic is set to 'null'
    },
  };

  const client = new Dash.Client(clientOpts);

  const createWallet = async () => {
    const account = await client.getWalletAccount();

    const mnemonic = client.wallet.exportWallet();
    const address = account.getUnusedAddress();
    console.log("Mnemonic:", account);
    console.log("Unused address:");

    req.session.user = {
      address: address.address,
      mnemonic: mnemonic,
    };

    res.render("createwallet", { mnemonic, address: address.address });
  };

  createWallet()
    .catch((e) => console.error("Something went wrong:\n", e))
    .finally(() => client.disconnect());

  // Handle wallet async errors
  client.on("error", (error, context) => {
    console.error(`Client error: ${error.name}`);
    console.error(context);
  });
});

app.listen(8080, () => {
  console.log(`Listening on port ${8080}`);
});
