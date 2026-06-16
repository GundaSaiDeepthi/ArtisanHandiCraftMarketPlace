import { Schema, model } from "mongoose";

/*
==================================================
USER SCHEMA
==================================================
*/

const userSchema = new Schema(
  {
    /*
    ==================================
    FIRST NAME
    ==================================
    */

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 30,
    },

    /*
    ==================================
    LAST NAME
    ==================================
    */

    lastName: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },

    /*
    ==================================
    EMAIL
    ==================================
    */

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },

    /*
    ==================================
    PASSWORD
    ==================================
    */

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],

   
      
    },

    /*
    ==================================
    PROFILE IMAGE
    ==================================
    */

    profileImageUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dchp82dvy/image/upload/v1780238844/149071_1_t7hroc.png",
    },

    /*
    ==================================
    USER ROLE
    ==================================
    */

    role: {
      type: String,

      enum: {
        values: ["ARTISAN", "USER", "ADMIN"],
        message: "{VALUE} is an invalid role",
      },

      required: [true, "Role is required"],

      default: "USER",
    },

    /*
    ==================================
    ACCOUNT STATUS
    ==================================
    */

    isActive: {
      type: Boolean,
      default: true,
    },

    /*
    ==================================
    EMAIL VERIFIED
    ==================================
    */

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    /*
    ==================================
    EMAIL OTP
    ==================================
    */

    emailOTP: {
      type: String,
      default: null,
    },

    /*
    ==================================
    OTP EXPIRY
    ==================================
    */

    otpExpiry: {
      type: Date,
      default: null,
    },

    /*
    ==================================
    RESET PASSWORD TOKEN
    ==================================
    */

    resetPasswordToken: {
      type: String,
      default: null,
    },

    /*
    ==================================
    RESET PASSWORD EXPIRES
    ==================================
    */

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    /*
    ==================================
    LAST LOGIN
    ==================================
    */

    lastLogin: {
      type: Date,
      default: null,
    },

    /*
    ==================================
    LAST ACTIVE
    ==================================
    */

    lastActive: {
      type: Date,
      default: null,
    },

    /*
    ==================================
    SOCKET ID
    ==================================
    */

    socketId: {
      type: String,
      default: null,
    },

    /*
    ==================================
    ONLINE STATUS
    ==================================
    */

    isOnline: {
      type: Boolean,
      default: false,
    },

    /*
    ==================================
    PHONE NUMBER
    ==================================
    */

    phoneNumber: {
      type: String,
      trim: true,

      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Invalid phone number",
      },

      default: "",
    },

    /*
    ==================================
    ADDRESS
    ==================================
    */

    address: {
      street: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "India",
      },

      postalCode: {
        type: String,
        default: "",
      },
    },

    /*
    ==================================
    ARTISAN BIO
    ==================================
    */

    artisanBio: {
      type: String,
      default: "",
      maxlength: 500,
    },

    /*
    ==================================
    ARTISAN SPECIALIZATION
    ==================================
    */

    artisanSpecialization: {
      type: String,
      default: "",
    },

    /*
    ==================================
    ARTISAN EXPERIENCE
    ==================================
    */

    artisanExperience: {
      type: Number,
      default: 0,
    },

    /*
    ==================================
    ARTISAN APPROVAL
    ==================================
    */

    isArtisanApproved: {
      type: Boolean,
      default: false,
    },

    /*
    ==================================
    PRODUCTS COUNT
    ==================================
    */

    totalProducts: {
      type: Number,
      default: 0,
    },

    /*
    ==================================
    TOTAL SALES
    ==================================
    */

    totalSales: {
      type: Number,
      default: 0,
    },

    /*
    ==================================
    WISHLIST COUNT
    ==================================
    */

    wishlistCount: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  }
);

/*
==================================================
INDEXES
==================================================
*/

userSchema.index({ role: 1 });

userSchema.index({ isActive: 1 });

userSchema.index({ isEmailVerified: 1 });

userSchema.index({ isArtisanApproved: 1 });

userSchema.index({ createdAt: -1 });

/*
==================================================
REMOVE SENSITIVE DATA
==================================================
*/

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.emailOTP;
  delete user.otpExpiry;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;

  return user;
};

/*
==================================================
PRE SAVE
==================================================
*/

userSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }

  if (this.firstName) {
    this.firstName = this.firstName.trim();
  }

  if (this.lastName) {
    this.lastName = this.lastName.trim();
  }

  next();
});

/*
==================================================
MODEL
==================================================
*/

export const UserTypeModel = model(
  "User",
  userSchema
);