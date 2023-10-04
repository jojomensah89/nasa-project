const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true },
  launchDate: { type: Date, required: true },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  target: { type: String },
  customers: [String],
  upcoming: {
    type: Boolean,
    requirer: true,
  },
  success: {
    type: Boolean,
    requirer: true,
    default: true,
  },
});

//Connects launchesSchema with collection launches
module.exports = mongoose.model("Launch", launchesSchema);
