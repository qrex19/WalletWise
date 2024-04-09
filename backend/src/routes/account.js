const express = require("express");
const router = express.Router();
const { authMiddleware } = require("./middleware");
const { Account } = require("../database/db");
const zod = require("zod");
const mongoose = require("mongoose");

const transactionSchema = zod.object({
  to: zod.string(),
  amount: zod.number(),
});

router.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;

  const found = await Account.findOne({
    userId: userId,
  });

  if (found) {
    res.status(200).json({
      message: found.balance,
    });
  } else {
    res.status(400).json({
      message: "user not found",
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const object = req.body;
  const parse = transactionSchema.safeParse(object);

  if (!parse.success) {
    return res.status(400).json({
      message: "wrong json format/data",
    });
  }

  const session = await mongoose.startSession();

  session.startTransaction();

  const userId = req.userId;
  const toUserId = req.body.to;
  const amount = req.body.amount;

  const senderData = await Account.findOne({
    userId: userId,
  }).session(session);

  if (!senderData || senderData.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficent balance",
    });
  }

  const receiverData = await Account.findOne({
    userId: toUserId,
  }).session(session);

  if (!receiverData) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "receiver userId not found",
    });
  }

  senderData.balance = senderData.balance - amount;
  await senderData.save({ session });
  receiverData.balance = receiverData.balance + amount;
  await receiverData.save({ session });
  await session.commitTransaction();
  res.status(200).json({
    message: "Transfer successfull",
  });
});

module.exports = router;
