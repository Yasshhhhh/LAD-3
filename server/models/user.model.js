// user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  Name: String,
  Batch: String,
  T1: Number,
  T2: Number,
  T3: Number,
  C431_12_1: Number,
  C431_12_2: Number,
  C431_12_3: Number,
  C431_12_4: Number,
  C431_12_5: Number,
  C431_12_1_1: Number,
  C431_12_2_1: Number,
  C431_12_3_1: Number,
  C431_12_4_1: Number,
  C431_12_5_1: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
