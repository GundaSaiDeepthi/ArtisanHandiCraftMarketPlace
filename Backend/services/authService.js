import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";

import crypto from "crypto";

import { UserTypeModel }

from "../models/UserModel.js";

import {
  sendOTPEmail,
  sendResetPasswordEmail,
} from "../utils/sendEmail.js";




/*
==================================================
PASSWORD VALIDATION FUNCTION
==================================================
*/

const validatePassword = (
  password
) => {

  /*
  ==================================
  PASSWORD RULES
  ==================================

  1 Uppercase
  1 Lowercase
  1 Number
  1 Special Character
  Minimum 8 Characters
  */

  const passwordRegex =

    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#.-])[A-Za-z\d@$!%*?&_#.-]{8,}$/;

  return passwordRegex.test(
    password
  );
};

/*
==================================================
GENERATE EMAIL OTP
==================================================
*/

export const generateOTP = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};

/*
==================================================
REGISTER USER
==================================================
*/

export const register =
  async (userObj) => {

    /*
    ==================================
    CHECK REQUIRED FIELDS
    ==================================
    */

    if (

      !userObj.firstName ||

      !userObj.email ||

      !userObj.password

    ) {

      const err = new Error(

        "First name, email and password are required"

      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    PASSWORD VALIDATION
    ==================================
    */

    if (

      !validatePassword(
        userObj.password
      )

    ) {

      const err = new Error(

        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters"

      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    NORMALIZE EMAIL
    ==================================
    */

    const normalizedEmail =

      userObj.email
        .toLowerCase()
        .trim();

    /*
    ==================================
    CHECK EMAIL EXISTS
    ==================================
    */

    const existingUser =

      await UserTypeModel.findOne({

        email:
          normalizedEmail,
      });

    if (existingUser) {

      const err = new Error(
        "Email already exists"
      );

      err.status = 409;

      throw err;
    }

    if (userObj.phoneNumber) {

  const existingPhone =
    await UserTypeModel.findOne({
      phoneNumber:
        userObj.phoneNumber,
    });

  if (existingPhone) {

    const err = new Error(
      "Phone number already exists"
    );

    err.status = 409;

    throw err;
  }
}

    const allowedRoles = [
  "USER",
  "ARTISAN"
];

const role =
  (userObj.role || "USER")
    .toUpperCase();

if (
  !allowedRoles.includes(role)
) {
  const err = new Error(
    "Invalid role selected"
  );

  err.status = 400;

  throw err;
}

if (role === "ARTISAN") {

  if (
    !userObj.artisanBio ||
    !userObj.artisanSpecialization
  ) {

    const err = new Error(
      "Artisan Bio and Specialization are required"
    );

    err.status = 400;

    throw err;
  }
}

    /*
    ==================================
    GENERATE OTP
    ==================================
    */

    const otp =
      generateOTP();

    /*
    ==================================
    OTP EXPIRY
    ==================================
    */

    const otpExpiry =
      new Date(

        Date.now() +

        10 * 60 * 1000

      );

    /*
    ==================================
    HASH PASSWORD
    ==================================
    */

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =

      await bcrypt.hash(

        userObj.password,

        salt
      );

      

    /*
    ==================================
    CREATE USER OBJECT
    ==================================
    */

 const userData = {
  firstName: userObj.firstName,
  lastName: userObj.lastName || "",

  email: normalizedEmail,

  password: hashedPassword,

  role,

  phoneNumber:
    userObj.phoneNumber || "",

  profileImageUrl:
    userObj.profileImageUrl || "",

  artisanBio:
    role === "ARTISAN"
      ? userObj.artisanBio || ""
      : "",

  artisanSpecialization:
    role === "ARTISAN"
      ? userObj.artisanSpecialization || ""
      : "",

  artisanExperience:
    role === "ARTISAN"
      ? Number(
          userObj.artisanExperience || 0
        )
      : 0,

  isEmailVerified: false,

  emailOTP: otp,

  otpExpiry,

  isActive: true,
};

    /*
    ==================================
    CREATE USER DOC
    ==================================
    */

    const userDoc =
      new UserTypeModel(
        userData
      );

    /*
    ==================================
    VALIDATE SCHEMA
    ==================================
    */

    await userDoc.validate();

    /*
    ==================================
    SAVE USER
    ==================================
    */

  const createdUser =
  await userDoc.save();

/*
==================================
SEND OTP EMAIL
==================================
*/

await sendOTPEmail(
  normalizedEmail,
  otp
);

    /*
    ==================================
    REMOVE SENSITIVE DATA
    ==================================
    */

    const userResponse =

      createdUser.toObject();

    delete userResponse.password;

    delete userResponse.emailOTP;

    delete userResponse.otpExpiry;

    delete userResponse.resetPasswordToken;

    delete userResponse.resetPasswordExpires;

    /*
    ==================================
    RETURN USER + OTP
    ==================================
    */

    return {
  success: true,
  user: userResponse,
  otp,
   message:
    "Registration successful. OTP sent to your email.",
};
  };

/*
==================================================
VERIFY EMAIL OTP
==================================================
*/

export const verifyEmailOTP =
  async (
    email,
    otp
  ) => {

    /*
    ==================================
    CHECK REQUIRED FIELDS
    ==================================
    */

    if (!email || !otp) {

      const err = new Error(

        "Email and OTP are required"

      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    FIND USER
    ==================================
    */

    const user =
      await UserTypeModel.findOne({

        email:
          email
            .toLowerCase()
            .trim(),
      });

    if (!user) {

      const err = new Error(
        "User not found"
      );

      err.status = 404;

      throw err;
    }

    /*
    ==================================
    ALREADY VERIFIED
    ==================================
    */

    if (
      user.isEmailVerified
    ) {

      const err = new Error(
        "Email already verified"
      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    CHECK OTP
    ==================================
    */

    if (
      user.emailOTP !== otp
    ) {

      const err = new Error(
        "Invalid OTP"
      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    CHECK OTP EXPIRY
    ==================================
    */

    if (

      !user.otpExpiry ||

      user.otpExpiry < new Date()

    ) {

      const err = new Error(
        "OTP expired"
      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    VERIFY EMAIL
    ==================================
    */

    user.isEmailVerified =
      true;

    user.emailOTP = null;

    user.otpExpiry = null;

    await user.save();

    return {

      success: true,

      message:
        "Email verified successfully",
    };
  };

/*
==================================================
RESEND OTP
==================================================
*/

export const resendOTP =
  async (email) => {

    /*
    ==================================
    CHECK EMAIL
    ==================================
    */

    if (!email) {

      const err = new Error(
        "Email is required"
      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    FIND USER
    ==================================
    */

    const user =
      await UserTypeModel.findOne({

        email:
          email
            .toLowerCase()
            .trim(),
      });

    if (!user) {

      const err = new Error(
        "User not found"
      );

      err.status = 404;

      throw err;
    }

    /*
    ==================================
    ALREADY VERIFIED
    ==================================
    */

    if (
      user.isEmailVerified
    ) {

      const err = new Error(
        "Email already verified"
      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    GENERATE NEW OTP
    ==================================
    */

    const otp =
      generateOTP();

    user.emailOTP =
      otp;

    user.otpExpiry =
      new Date(

        Date.now() +

        10 * 60 * 1000

      );

    await user.save();

    await user.save();

/*
==================================
SEND OTP EMAIL
==================================
*/

await sendOTPEmail(
  user.email,
  otp
);

return {
  success: true,
  message:
    "OTP sent successfully",
};
  };

/*
==================================================
LOGIN USER
==================================================
*/

export const authenticate =
  async ({

    email,

    password,

  } = {}) => {

    /*
    ==================================
    CHECK EMAIL & PASSWORD
    ==================================
    */

    if (
      !email ||
      !password
    ) {

      const err = new Error(

        "Email and password are required"

      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    FIND USER
    ==================================
    */

    const user =
      await UserTypeModel.findOne({

        email:
          email
            .toLowerCase()
            .trim(),
      });

    /*
    ==================================
    INVALID EMAIL
    ==================================
    */

    if (!user) {

      const err = new Error(
        "Invalid email"
      );

      err.status = 401;

      throw err;
    }

  
 /*
    ==================================
    BLOCKED ACCOUNT
    ==================================
    */
   if (user.isActive === false) {

  const err = new Error(
    "Your account is blocked. Contact admin."
  );

  err.status = 403;

  throw err;
}
      /*
    ==================================
    EMAIL NOT VERIFIED
    ==================================
    */
    if (
      !user.isEmailVerified
    ) {

      const err = new Error(

        "Please verify your email first"

      );

      err.status = 401;

      throw err;
    }

   


    /*
    ==================================
    COMPARE PASSWORD
    ==================================
    */

    const isMatch =

      await bcrypt.compare(

        password,

        user.password
      );

    /*
    ==================================
   INVALID PASSWORD
    ==================================
    */

    if (!isMatch) {

      const err = new Error(
        "Invalid password"
      );

      err.status = 401;

      throw err;
    }

    /*
    ==================================
    JWT SECRET CHECK
    ==================================
    */

    if (
      !process.env.JWT_SECRET
    ) {

      throw new Error(
        "JWT_SECRET missing"
      );
    }

    /*
    ==================================
    UPDATE LAST LOGIN
    ==================================
    */

    user.lastLogin =
      new Date();

    await user.save();

    /*
    ==================================
    GENERATE TOKEN
    ==================================
    */

    const token = jwt.sign(

      {

        userId:
          user._id,

        role:
          user.role,

        email:
          user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    /*
    ==================================
    REMOVE SENSITIVE DATA
    ==================================
    */

    const userObj =
      user.toObject();

    delete userObj.password;

    delete userObj.emailOTP;

    delete userObj.otpExpiry;

    delete userObj.resetPasswordToken;

    delete userObj.resetPasswordExpires;

    /*
    ==================================
    RETURN RESPONSE
    ==================================
    */

    return {

      token,

      user:
        userObj,
    };
  };

/*
==================================================
FORGOT PASSWORD
==================================================
*/

export const forgotPassword =
  async (email) => {

    if (!email) {

      const err = new Error(
        "Email is required"
      );

      err.status = 400;

      throw err;
    }

    const user =
      await UserTypeModel.findOne({

        email:
          email
            .toLowerCase()
            .trim(),
      });

    if (!user) {

  return {
    success: true,
  };
}

    /*
    ==================================
    GENERATE RESET TOKEN
    ==================================
    */

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpires =
      new Date(

        Date.now() +

        15 * 60 * 1000
      );

    await user.save();

   await user.save();

/*
==================================
GENERATE RESET LINK
==================================
*/

const resetLink =
`${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

/*
==================================
SEND RESET EMAIL
==================================
*/

await sendResetPasswordEmail(
  user.email,
  resetLink
);

return {
  success: true,
  message:
    "Password reset link sent to email",
};
  };

/*
==================================================
RESET PASSWORD
==================================================
*/

export const resetPassword =
  async (
    token,
    newPassword
  ) => {

    if (
      !token ||
      !newPassword
    ) {

      const err = new Error(

        "Token and new password are required"

      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    PASSWORD VALIDATION
    ==================================
    */

    if (
      !validatePassword(
        newPassword
      )
    ) {

      const err = new Error(

        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters"

      );

      err.status = 400;

      throw err;
    }

    /*
    ==================================
    FIND USER
    ==================================
    */

    const user =
      await UserTypeModel.findOne({

        resetPasswordToken:
          token,

        resetPasswordExpires: {
          $gt: new Date(),
        },
      });

   
if (!user) {

  const err = new Error(
    "Invalid or expired reset token"
  );

  err.status = 400;

  throw err;
}

if (
  !user.isEmailVerified
) {

  const err = new Error(
    "Email not verified"
  );

  err.status = 400;

  throw err;
}

    /*
    ==================================
    HASH NEW PASSWORD
    ==================================
    */

    const hashedPassword =

      await bcrypt.hash(

        newPassword,

        10
      );

    /*
    ==================================
    UPDATE PASSWORD
    ==================================
    */

    user.password =
      hashedPassword;

    user.resetPasswordToken =
      null;

    user.resetPasswordExpires =
      null;

    await user.save();

    return {
      success: true,
    };
  };

/*
==================================================
GENERATE JWT TOKEN
==================================================
*/

export const generateToken =
  (user) => {

    if (
      !process.env.JWT_SECRET
    ) {

      throw new Error(
        "JWT_SECRET missing"
      );
    }

    return jwt.sign(

      {

        userId:
          user._id,

        role:
          user.role,

        email:
          user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );
  };

/*
==================================================
HASH PASSWORD
==================================================
*/

export const hashPassword =
  async (password) => {

    const salt =
      await bcrypt.genSalt(10);

    return bcrypt.hash(
      password,
      salt
    );
  };

/*
==================================================
COMPARE PASSWORD
==================================================
*/

export const comparePassword =
  async (

    password,

    hashedPassword

  ) => {

    return bcrypt.compare(

      password,

      hashedPassword
    );
  };