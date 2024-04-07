const express = require("express");
const router = express.Router();
//instead of using 'app', use 'router'

const userRouter = require("./user");

router.use("/user", userRouter);

module.exports = router;
