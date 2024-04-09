const express = require("express");
const cors = require("cors");
require("dotenv").config(); //to import dotenv file
const app = express();

const mainRouter = require("./routes/index");

app.use(cors(), express.json());

app.use("/api/v1", mainRouter);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
