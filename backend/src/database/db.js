const mongoose = require("mongoose"); //importing the mongoose module
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL);

const userSchema = mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,
  password: String,
});

const accountSchema = mongoose.Schema({
  userId: String,
  balance: Number, //the number 33.45 should be stored as 3345
});

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);

module.exports = { User, Account };
