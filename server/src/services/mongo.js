const mongoose = require("mongoose");
require('dotenv').config();


const MONGO_URL =process.env.MONGO_URL

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}
async function mongoDisconnect() {
  await mongoose.disconnect(MONGO_URL);
}

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection Successful");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
