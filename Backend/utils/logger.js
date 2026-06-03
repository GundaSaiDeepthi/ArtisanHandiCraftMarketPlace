import winston from "winston";

/*
==================================================
LOGGER FORMAT
==================================================
*/

const logFormat =

  winston.format.printf(

    ({
      level,
      message,
      timestamp,
      stack,
    }) => {

      return `[${timestamp}] ${level.toUpperCase()} : ${stack || message}`;
    }
  );

/*
==================================================
LOGGER CONFIGURATION
==================================================
*/

const logger =
  winston.createLogger({

    level: "info",

    format:
      winston.format.combine(

        winston.format.timestamp({

          format:
            "YYYY-MM-DD HH:mm:ss",
        }),

        winston.format.errors({

          stack: true,
        }),

        logFormat
      ),

    transports: [

      /*
      ==================================
      CONSOLE LOGGER
      ==================================
      */

      new winston.transports.Console(),

      /*
      ==================================
      ERROR LOG FILE
      ==================================
      */

      new winston.transports.File({

        filename:
          "logs/error.log",

        level:
          "error",
      }),

      /*
      ==================================
      COMBINED LOG FILE
      ==================================
      */

      new winston.transports.File({

        filename:
          "logs/combined.log",
      }),
    ],
  });

/*
==================================================
EXPORT LOGGER
==================================================
*/

export default logger;