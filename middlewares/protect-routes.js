const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "Major-Lock";

const protectRoute = (requiredRole = null) => {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Bearer Token

    if (!token)
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (requiredRole && req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Access denied. Role required" });
      }
      next();
    } catch (err) {
      return res.status(400).json({ error: "Invalid token" });
    }
  };
};

module.exports = protectRoute;
