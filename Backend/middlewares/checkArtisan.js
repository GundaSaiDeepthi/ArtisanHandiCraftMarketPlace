import { UserTypeModel }
from "../models/UserModel.js";

export const checkArtisan =
  async (req, res, next) => {

    try {

      /*
      ====================================
      GET ARTISAN ID
      ====================================
      */

      const aid =
        req.body?.artisan
        || req.params?.artisanId;

      /*
      ====================================
      CHECK ID
      ====================================
      */

      if (!aid) {

        return res.status(400).json({

          success: false,

          message:
            "Artisan id is required",
        });
      }

      /*
      ====================================
      FIND ARTISAN
      ====================================
      */

      const artisan =
        await UserTypeModel.findById(
          aid
        );

      /*
      ====================================
      INVALID ARTISAN
      ====================================
      */

      if (!artisan) {

        return res.status(404).json({

          success: false,

          message:
            "Invalid Artisan",
        });
      }

      /*
      ====================================
      ROLE CHECK
      ====================================
      */

      if (
        artisan.role !== "ARTISAN"
      ) {

        return res.status(403).json({

          success: false,

          message:
            "User is not an Artisan",
        });
      }

      /*
      ====================================
      ACCOUNT ACTIVE CHECK
      ====================================
      */

      if (!artisan.isActive) {

        return res.status(403).json({

          success: false,

          message:
            "Artisan account is not active",
        });
      }

      /*
      ====================================
      FORWARD REQUEST
      ====================================
      */

      next();

    } catch (err) {

      res.status(500).json({

        success: false,

        message: err.message,
      });
    }
  };