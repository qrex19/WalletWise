const mongoose = require("mongoose"); //importing the mongoose module

mongoose.connect(
  "mongodb+srv://nishanttjhaa:Madhubani%40123@cluster0.fazlyab.mongodb.net/"
);

const userSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  }, //accountname(email)

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const accountSchema = mongoose.Schema({
  userId: String,
  balance: Number,
});

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);

module.exports = { User, Account };
