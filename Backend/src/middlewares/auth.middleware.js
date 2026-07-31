const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  console.log("========== AUTH DEBUG ==========");
  console.log("req.cookies:", req.cookies);
  console.log("req.headers.cookie:", req.headers.cookie);
  console.log("req.headers.authorization:", req.headers.authorization);
  console.log("===============================");

  const token = req.cookies?.token;

  console.log("token:", token);
  if (!token) {
    return res.status(401).json({
      message: "Token not provided.",
    });
  }

  const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "Token is Invalid.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
}
module.exports = { authUser };
