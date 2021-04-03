const mongoose = require("mongoose");
const { secret } = require("../config/secret");
const chalk = require("chalk");


mongoose.connect(
  `mongodb+srv://${secret.mongoUser}:${secret.mongoPassword}@onlinestore.zktj8.mongodb.net/onlineStore`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(
    chalk.greenBright("mongo connected") + " " + chalk.bold.blue("onlineStore")
  );
});

module.exports = db;
