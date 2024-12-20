const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.jwt_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token", token);
    console.log("cookies", cookies);
    console.log("req", req);

    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    const decode = jwt.verify(token, JWT_SECRET);

    if (!decode.userId) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.userId = decode.userId;
    req.role = decode.role;
    next();
  } catch (err) {
    res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
