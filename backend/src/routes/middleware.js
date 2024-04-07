const jwt = require("jsonwebtoken");
const JWT_KEY = require("./config");

function authMiddleware(req, res, next) {
  const headerToken = req.headers.authorization;

  if (!headerToken || !headerToken.startsWith("Bearer ")) {
    console.log("in condition");
    return res.status(400).json({
      message: "invalid token",
    });
  }

  const token = headerToken.split(" ")[1]; //first index of the split token string "Bearer skncbsjchs"

  const data = jwt.decode(token, JWT_KEY);

  if (data == null) {
    return res.status(401).json({
      message: "invalid JWT token",
    });
  } else {
    req.userId = data.userId;
    next();
  }
}

module.exports = { authMiddleware };
