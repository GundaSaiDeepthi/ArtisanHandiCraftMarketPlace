import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      /*
      ====================================
      GET TOKEN
      ====================================
      */

      const authHeader =
        req.headers.authorization ||
        req.headers.Authorization;

      let token = null;

      // From Authorization header
      if (
        authHeader &&
        authHeader.startsWith("Bearer ")
      ) {
        token = authHeader.split(" ")[1];
      }

      // From Cookies
      if (!token && req.cookies?.token) {
        token = req.cookies.token;
      }

      /*
      ====================================
      TOKEN CHECK
      ====================================
      */

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login",
        });
      }

      /*
      ====================================
      JWT SECRET CHECK
      ====================================
      */

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          success: false,
          message: "JWT_SECRET is missing",
        });
      }

      /*
      ====================================
      VERIFY TOKEN
      ====================================
      */

      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      /*
      ====================================
      ROLE CHECK
      ====================================
      */

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(
          decodedToken.role
        )
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. Access denied",
        });
      }

      /*
      ====================================
      ATTACH USER TO REQUEST
      ====================================
      */

      req.user = decodedToken;

      next();
    } catch (err) {
      /*
      ====================================
      TOKEN EXPIRED
      ====================================
      */

      if (
        err.name ===
        "TokenExpiredError"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Session expired. Please login again",
        });
      }

      /*
      ====================================
      INVALID TOKEN
      ====================================
      */

      if (
        err.name ===
        "JsonWebTokenError"
      ) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      console.error(
        "Verify Token Error:",
        err
      );

      /*
      ====================================
      SERVER ERROR
      ====================================
      */

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};