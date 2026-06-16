import nodemailer from "nodemailer";
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
/*
==================================================
CREATE EMAIL TRANSPORTER
==================================================
*/

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

/*
==================================================
SEND EMAIL FUNCTION
==================================================
*/

export const sendEmail =
  async ({

    to,
    subject,
    text,

  }) => {

    try {

      const mailOptions = {

        from:
          process.env.EMAIL_USER,

        to,

        subject,

        text,
      };

      const info =
        await transporter.sendMail(
          mailOptions
        );

      console.log(

        "Email sent successfully:",

        info.messageId
      );

      return info;

    } catch (err) {

      console.log(

        "Email sending failed:",

        err.message
      );

      throw err;
    }
  };

/*
==================================================
SEND OTP EMAIL
==================================================
*/

export const sendOTPEmail =
  async (
    email,
    otp
  ) => {

    return sendEmail({

      to: email,

      subject:
        "Email Verification OTP",

      text: `

Your OTP for email verification is:

${otp}

This OTP is valid for 10 minutes.

      `,
    });
  };

/*
==================================================
SEND PASSWORD RESET EMAIL
==================================================
*/

export const sendResetPasswordEmail =
  async (
    email,
    resetLink
  ) => {

    return sendEmail({

      to: email,

      subject:
        "Reset Password",

      text: `

Click the link below to reset your password:

${resetLink}

This link will expire in 15 minutes.

      `,
    });
  };