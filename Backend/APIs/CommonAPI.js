import exp from "express";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { config }
from "dotenv";

import {
  authenticate
} from "../services/authService.js";

import {
  UserTypeModel
} from "../models/UserModel.js";

import {
  verifyToken
} from "../middlewares/verifyToken.js";

config();

export const commonRouter =
  exp.Router();



/*
==================================================
LOGIN
POST => /common-api/login
==================================================
*/

commonRouter.post(

  "/login",

  async (req, res, next) => {

    try {

      /*
      ====================================
      GET USER CREDENTIALS
      ====================================
      */

      

      const userCred = req.body ?? {};

      /*
      ====================================
      AUTHENTICATE USER
      ====================================
      */

      const {
        token,
        user
      } =
        await authenticate(
          userCred
        );

      /*
      ====================================
      STORE TOKEN IN COOKIE
      ====================================
      */

      res.cookie(

        "token",

        token,

        {
          httpOnly: true,

          secure: false,

          sameSite: "lax",

          path: "/",

          maxAge:
            1000 * 60 * 60 * 24,
        }
      );

      /*
      ====================================
      SEND RESPONSE
      ====================================
      */

      res.status(200).json({

        success: true,

        message:
          "Login successful",

        token,

        payload: user,
      });

    } catch (err) {

      next(err);
    }
  }
);



/*
==================================================
LOGOUT
GET => /common-api/logout
==================================================
*/

commonRouter.get(

  "/logout",

  (req, res) => {

    /*
    ====================================
    CLEAR COOKIE
    ====================================
    */

    res.clearCookie(

      "token",

      {
        httpOnly: true,

        secure: false,

        sameSite: "lax",

        path: "/",
      }
    );

    res.status(200).json({

      success: true,

      message:
        "Logout successful",
    });
  }
);



/*
==================================================
CHANGE PASSWORD
PUT => /common-api/change-password
==================================================
*/

commonRouter.put(

  "/change-password",

  verifyToken(
    "USER",
    "ARTISAN",
    "ADMIN"
  ),

  async (req, res, next) => {

    try {

      /*
      ====================================
      GET PASSWORDS
      ====================================
      */

      const {

        currentPassword,

        newPassword,

      } = req.body;

      /*
      ====================================
      VALIDATION
      ====================================
      */

      if (
        !currentPassword ||
        !newPassword
      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",
        });
      }

      /*
      ====================================
      PASSWORD CHECK
      ====================================
      */

      if (
        currentPassword ===
        newPassword
      ) {

        return res.status(400).json({

          success: false,

          message:
            "New password must be different",
        });
      }

      /*
      ====================================
      FIND USER
      ====================================
      */

      const account =
        await UserTypeModel.findById(
          req.user.userId
        );

      if (!account) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      /*
      ====================================
      VERIFY CURRENT PASSWORD
      ====================================
      */

      const isMatch =
        await bcrypt.compare(

          currentPassword,

          account.password
        );

      if (!isMatch) {

        return res.status(401).json({

          success: false,

          message:
            "Current password incorrect",
        });
      }

      /*
      ====================================
      HASH NEW PASSWORD
      ====================================
      */

      account.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await account.save();

      res.status(200).json({

        success: true,

        message:
          "Password changed successfully",
      });

    } catch (err) {

      next(err);
    }
  }
);



/*
==================================================
CHECK AUTHENTICATION
GET => /common-api/check-auth
==================================================
*/

commonRouter.get(

  "/check-auth",

  verifyToken(
    "USER",
    "ARTISAN",
    "ADMIN"
  ),

  async (req, res, next) => {

    try {

      /*
      ====================================
      FIND LOGGED-IN USER
      ====================================
      */

      const account =
        await UserTypeModel.findById(

          req.user.userId

        ).select("-password");

      if (!account) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      res.status(200).json({

        success: true,

        message:
          "Authenticated",

        payload: account,
      });

    } catch (err) {

      next(err);
    }
  }
);



/*
==================================================
UPDATE PROFILE
PUT => /common-api/update-profile
==================================================
*/

commonRouter.put(

  "/update-profile",

  verifyToken(
    "USER",
    "ARTISAN",
    "ADMIN"
  ),

  async (req, res, next) => {

    try {

      const {

        firstName,

        lastName,
      } = req.body;

      /*
      ====================================
      UPDATE USER
      ====================================
      */

      const updatedUser =
        await UserTypeModel.findByIdAndUpdate(

          req.user.userId,

          {
            $set: {
              firstName,
              lastName,
            },
          },

          {
            new: true,
          }
        ).select("-password");

      res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        payload: updatedUser,
      });

    } catch (err) {

      next(err);
    }
  }
);



/*
==================================================
FORGOT PASSWORD
POST => /common-api/forgot-password
==================================================
*/

commonRouter.post(

  "/forgot-password",

  async (req, res, next) => {

    try {

      const { email } =
        req.body;

      /*
      ====================================
      FIND USER
      ====================================
      */

      const user =
        await UserTypeModel.findOne({
          email,
        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "Email not found",
        });
      }

      /*
      ====================================
      GENERATE RESET TOKEN
      ====================================
      */

      const resetToken =
        jwt.sign(

          {
            userId:
              user._id,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "15m",
          }
        );

      /*
      ====================================
      SEND RESPONSE
      ====================================
      */

      res.status(200).json({

        success: true,

        message:
          "Reset token generated",

        resetToken,
      });

    } catch (err) {

      next(err);
    }
  }
);



/*
==================================================
RESET PASSWORD
PUT => /common-api/reset-password
==================================================
*/

commonRouter.put(

  "/reset-password",

  async (req, res, next) => {

    try {

      const {

        token,

        newPassword,

      } = req.body;

      /*
      ====================================
      VERIFY TOKEN
      ====================================
      */

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET
        );

      /*
      ====================================
      FIND USER
      ====================================
      */

      const user =
        await UserTypeModel.findById(

          decoded.userId
        );

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      /*
      ====================================
      HASH PASSWORD
      ====================================
      */

      user.password =
        await bcrypt.hash(

          newPassword,

          10
        );

      await user.save();

      res.status(200).json({

        success: true,

        message:
          "Password reset successful",
      });

    } catch (err) {

      next(err);
    }
  }
);



/*
==================================================
DELETE ACCOUNT
DELETE => /common-api/delete-account
==================================================
*/

commonRouter.delete(

  "/delete-account",

  verifyToken(
    "USER",
    "ARTISAN",
    "ADMIN"
  ),

  async (req, res, next) => {

    try {

      /*
      ====================================
      DELETE USER
      ====================================
      */

      await UserTypeModel.findByIdAndDelete(

        req.user.userId
      );

      /*
      ====================================
      CLEAR COOKIE
      ====================================
      */

      res.clearCookie("token");

      res.status(200).json({

        success: true,

        message:
          "Account deleted successfully",
      });

    } catch (err) {

      next(err);
    }
  }
);