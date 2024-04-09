const express = require("express");
const router = express.Router();
//instead of using 'app', use 'router'

const userRouter = require("./user");
const accountRouter = require("./account");

router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;
