const express = require("express");
const cors = require("cors");
const port = 3000;
const app = express();

const mainRouter = require("./routes/index");

app.use(cors(), express.json());

app.use("/api/v1", mainRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
