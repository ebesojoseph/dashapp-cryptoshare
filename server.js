const express = require("express");
const app = express();
const cookieSession = require("cookie-session");

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

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/index", async (req, res) => {
  if (req.session.auth) {
    console.log("User is authenticated");
  } else {
    console.log("User is not authenticated");
  }
  console.log(req.body);
});

app.listen(8080, () => {
  console.log(`Listening on port ${8080}`);
});
