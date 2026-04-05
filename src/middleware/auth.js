import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - no token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired - please login again"
      });
    }
    res.status(401).json({
      message: "Unauthorized - invalid token"
    });
  }
};