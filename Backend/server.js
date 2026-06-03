import exp from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import http from "http";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { Server } from "socket.io";

/*
==================================================
IMPORT LOGGER
==================================================
*/

import logger from "./utils/logger.js";

/*
==================================================
IMPORT ROUTES
==================================================
*/

import { commonRouter } from "./APIs/CommonAPI.js";

import { userRoute } from "./APIs/UserAPI.js";

import { artisanRoute } from "./APIs/ArtisanAPI.js";

import { adminRoute } from "./APIs/AdminAPI.js";

import { paymentRoute } from "./APIs/PaymentAPI.js";

/*
==================================================
LOAD ENV VARIABLES
==================================================
*/

config();

/*
==================================================
CHECK REQUIRED ENV VARIABLES
==================================================
*/

const requiredEnvVariables = [
  "PORT",
  "DB_URL",
  "JWT_SECRET",
  "CLIENT_URL",
];

requiredEnvVariables.forEach((envName) => {
  if (!process.env[envName]) {
    logger.error(
      `Missing required environment variable: ${envName}`
    );

    process.exit(1);
  }
});

/*
==================================================
CREATE EXPRESS APP
==================================================
*/

const app = exp();

/*
==================================================
CREATE HTTP SERVER
==================================================
*/

const server = http.createServer(app);

/*
==================================================
SOCKET.IO CONFIGURATION
==================================================
*/

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },

  pingTimeout: 60000,

  transports: ["websocket", "polling"],
});

/*
==================================================
SOCKET CONNECTION
==================================================
*/

io.on("connection", (socket) => {
  logger.info(
    `Socket Connected: ${socket.id}`
  );

  /*
  ==================================
  JOIN USER ROOM
  ==================================
  */

  socket.on(
    "joinRoom",

    (userId) => {
      socket.join(userId);

      logger.info(
        `User joined room: ${userId}`
      );
    }
  );

  /*
  ==================================
  DISCONNECT
  ==================================
  */

  socket.on(
    "disconnect",

    () => {
      logger.info(
        `Socket Disconnected: ${socket.id}`
      );
    }
  );
});

/*
==================================================
TRUST PROXY
==================================================
*/

app.set("trust proxy", 1);

/*
==================================================
DISABLE X-POWERED-BY
==================================================
*/

app.disable("x-powered-by");

/*
==================================================
SECURITY MIDDLEWARES
==================================================
*/

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.method === 'POST' && req.path.startsWith('/common-api')) {
  }
  next();
});

app.use(compression());

app.use((req, res, next) => {
  const sanitizeOptions = { replaceWith: '_' };

  function getDescriptor(obj, key) {
    while (obj) {
      const descriptor = Object.getOwnPropertyDescriptor(obj, key);
      if (descriptor) return descriptor;
      obj = Object.getPrototypeOf(obj);
    }
    return undefined;
  }

  ['body', 'params', 'headers', 'query'].forEach((key) => {
    if (!req[key]) return;

    let result;
    try {
      result = typeof mongoSanitize.sanitize === 'function'
        ? mongoSanitize.sanitize(req[key], sanitizeOptions)
        : { target: req[key] };
    } catch (e) {
      result = { target: req[key] };
    }

    const target = result && result.target !== undefined ? result.target : req[key];

    if (key !== 'query') {
      const descriptor = getDescriptor(req, key);
      if (!descriptor || descriptor.writable) {
        req[key] = target;
      }
    }
  });
  
  next();
});

app.use(hpp());

/*
==================================================
REQUEST LOGGER
==================================================
*/

app.use(morgan("dev"));

/*
==================================================
RATE LIMITER
==================================================
*/

const limiter = rateLimit({
  windowMs:
    15 * 60 * 1000,

  max: 100,

  message: {
    success: false,

    message:
      "Too many requests. Please try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

/*
==================================================
APPLY RATE LIMITER
==================================================
*/

app.use(limiter);

/*
==================================================
CORS CONFIGURATION
==================================================
*/

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    logger.error(
      `CORS failure: origin ${origin} is not allowed`
    );

    return callback(
      new Error(
        "CORS policy: This origin is not allowed"
      )
    );
  },
  credentials: true,
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/*
==================================================
COOKIE PARSER
==================================================
*/

app.use(cookieParser());

/*
==================================================
CUSTOM REQUEST LOGGER
==================================================
*/

app.use((req, res, next) => {
  logger.info(
    `${req.method} ${req.originalUrl}`
  );

  next();
});

/*
==================================================
API ROUTES
==================================================
*/

app.use(
  "/common-api",
  commonRouter
);

app.use(
  "/user-api",
  userRoute
);

app.use(
  "/artisan-api",
  artisanRoute
);

app.use(
  "/admin-api",
  adminRoute
);

app.use(
  "/payment-api",
  paymentRoute
);



// Import mock payment route
import { mockPaymentRoute } from "./APIs/MockPaymentAPI.js";

// Mount mock payment route
app.use("/mock-payment-api", mockPaymentRoute);

/*
==================================================
HEALTH CHECK ROUTE
==================================================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    message:
      "Backend Server Running Successfully",

    environment:
      process.env.NODE_ENV,

    timestamp:
      new Date(),
  });
});

/*
==================================================
INVALID ROUTE HANDLER
==================================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,

    message:
      `${req.originalUrl} is an invalid route`,
  });
});

/*
==================================================
GLOBAL ERROR HANDLER
==================================================
*/

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    logger.error(
      `ERROR NAME: ${err.name}`
    );

    logger.error(
      `ERROR MESSAGE: ${err.message}`
    );

    logger.error(err);

    /*
    ==================================
    MONGOOSE VALIDATION ERROR
    ==================================
    */

    if (
      err.name ===
      "ValidationError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Validation Error",

        error:
          err.message,
      });
    }

    /*
    ==================================
    INVALID OBJECT ID ERROR
    ==================================
    */

    if (
      err.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid ID",

        error:
          err.message,
      });
    }

    /*
    ==================================
    DUPLICATE KEY ERROR
    ==================================
    */

    const errCode =
      err.code ??
      err.cause?.code ??
      err.errorResponse?.code;

    const keyValue =
      err.keyValue ??
      err.cause?.keyValue ??
      err.errorResponse?.keyValue;

    if (errCode === 11000) {
      const field =
        Object.keys(keyValue)[0];

      const value =
        keyValue[field];

      return res.status(409).json({
        success: false,

        message:
          "Duplicate field error",

        error:
          `${field} "${value}" already exists`,
      });
    }

    /*
    ==================================
    JWT INVALID TOKEN
    ==================================
    */

    if (
      err.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,

        message:
          "Invalid token",
      });
    }

    /*
    ==================================
    JWT TOKEN EXPIRED
    ==================================
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
    ==================================
    MULTER FILE ERROR
    ==================================
    */

    if (
      err.name === "MulterError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "File upload error",

        error:
          err.message,
      });
    }

    /*
    ==================================
    RAZORPAY ERROR
    ==================================
    */

    if (
      err.error &&
      err.error.description
    ) {
      return res.status(400).json({
        success: false,

        message:
          err.error.description,
      });
    }

    /*
    ==================================
    CUSTOM ERROR HANDLER
    ==================================
    */

    if (err.status) {
      return res.status(
        err.status
      ).json({
        success: false,

        message:
          err.message,
      });
    }

    /*
    ==================================
    DEFAULT SERVER ERROR
    ==================================
    */

    return res.status(500).json({
      success: false,

      message:
        "Internal Server Error",
    });
  }
);

/*
==================================================
DATABASE CONNECTION
==================================================
*/

const connectDB = async () => {
  try {
    logger.info("Attempting connection to primary MongoDB Atlas...");
    await mongoose.connect(
      process.env.DB_URL,
      {
        autoIndex: true,
        serverSelectionTimeoutMS: 4000,
      }
    );

    logger.info(
      "Primary Database Connection Successful"
    );
  } catch (err) {
    logger.warn(`Primary Database connection failed (${err.message}). Attempting fallback to local MongoDB...`);
    try {
      await mongoose.connect(
        "mongodb://127.0.0.1:27017/artisan_handicraft",
        {
          autoIndex: true,
          serverSelectionTimeoutMS: 4000,
        }
      );
      logger.info("Local Fallback Database Connection Successful");
    } catch (localErr) {
      logger.error("Local Database Connection Error:");
      logger.error(localErr);
      process.exit(1);
    }
  }

  /*
  ==================================
  START SERVER
  ==================================
  */
  const PORT = process.env.PORT || 5000;

  server.on('error', (err) => {
    logger.error('Server error event:');
    logger.error(err);

    if (err && err.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use.`);
    }

    process.exit(1);
  });

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

/*
==================================================
HANDLE UNCAUGHT EXCEPTIONS
==================================================
*/

process.on(
  "uncaughtException",

  (err) => {
    logger.error(
      "UNCAUGHT EXCEPTION"
    );

    logger.error(err);

    process.exit(1);
  }
);

/*
==================================================
HANDLE UNHANDLED PROMISE REJECTIONS
==================================================
*/

process.on(
  "unhandledRejection",

  (err) => {
    logger.error(
      "UNHANDLED REJECTION"
    );

    logger.error(err);

    server.close(() => {
      process.exit(1);
    });
  }
);

/*
==================================================
CONNECT DATABASE
==================================================
*/

connectDB();

/*
==================================================
EXPORT APP & SERVER
==================================================
*/

export default app;

export { server };