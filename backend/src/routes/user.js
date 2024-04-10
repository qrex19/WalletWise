const express = require("express");
const router = express.Router();
const z = require("zod");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, Account } = require("../database/db");
const { authMiddleware } = require("./middleware");

const signupSchema = z.object({
  userId: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
});

router.post("/signup", async (req, res) => {
  // res.send("this is signup route");
  //first validate body using zod, then check if the email already exists in the db, then save the user data in db

  const signupObject = req.body;

  const safeparse = signupSchema.safeParse(signupObject);

  if (safeparse.success) {
    const check = await User.findOne({
      userId: signupObject.userId,
    });

    if (check) {
      res.status(404).json({
        message: "email already exists",
      });
    } else {
      const userData = new User(signupObject);
      await userData.save();
      res.status(200);
      const token = jwt.sign(signupObject, process.env.JWT_KEY);

      //account initialisation

      const account = new Account({
        userId: signupObject.userId,
        balance: 1000,
      });

      await account.save();

      res.send({
        message: "user account created successfully and balance added",
        token: token,
      });
    }
  } else {
    res.send({
      message: "Password must be atleast 8 characters long",
    });
    res.status(404);
  }
});

router.post("/signin", async (req, res) => {
  //expect username and password

  const signinObject = req.body;

  const findUserid = await User.findOne({
    userId: signinObject.userId,
    password: signinObject.password,
  });

  if (findUserid == null) {
    return res.status(400).json({
      message: "user not found",
    });
  }

  const object = {
    userId: signinObject.userId,
  };

  const token = jwt.sign(object, process.env.JWT_KEY);

  res.status(200).json({
    token: token,
  });

  // const token =
});

router.put("/update", authMiddleware, async (req, res) => {
  //for updating data of the user account

  const user = await User.findOne({
    userId: req.userId,
  });

  if (user) {
    //user found

    user.password = req.body.password;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;

    await user.save();

    res.status(200).json({
      message: "user data updated Succesfully",
    });
  } else {
    res.status(400).json({
      message: "userId not found",
    });
  }
});

//to search by first name
router.get("/bulk", authMiddleware, async (req, res) => {
  //search for the name that the http parameter contains

  const name = req.query.name;

  if (!name) return res.status(401).json({ message: "invalid query" });

  //search in all user's first names substrings

  //used for finding substrings, the 'i' stands for case insensitive
  const found = await User.findOne({
    firstName: new RegExp(name, "i"), //the name can also be a substring
  });

  if (found) {
    return res.status(200).json({
      firstName: found.firstName,
      lastName: found.lastName,
      userId: found.userId,
      _id: found._id,
    });
  } else {
    return res.status(200).json({
      message: "user not found",
    });
  }
});

module.exports = router;
