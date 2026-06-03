/*
==================================================
OTP EMAIL TEMPLATE
==================================================
*/

export const otpEmailTemplate = (
  otp
) => {

  return `
Hello User,

Your OTP for email verification is:

${otp}

This OTP is valid for 10 minutes.

Do not share this OTP with anyone.

Thank You
`;
};

/*
==================================================
ORDER PLACED EMAIL TEMPLATE
==================================================
*/

export const orderPlacedTemplate = (
  name,
  orderId,
  amount
) => {

  return `
Hello ${name},

Your order has been placed successfully.

Order Details:

Order ID : ${orderId}

Total Amount : ₹${amount}

Your order will be processed soon.

Thank you for shopping with us.
`;
};

/*
==================================================
PAYMENT SUCCESS EMAIL TEMPLATE
==================================================
*/

export const paymentSuccessTemplate = (
  name,
  paymentId,
  amount
) => {

  return `
Hello ${name},

Your payment was successful.

Payment Details:

Payment ID : ${paymentId}

Amount Paid : ₹${amount}

Thank you for your payment.
`;
};

/*
==================================================
ORDER DELIVERED EMAIL TEMPLATE
==================================================
*/

export const orderDeliveredTemplate = (
  name,
  orderId
) => {

  return `
Hello ${name},

Your order has been delivered successfully.

Order ID : ${orderId}

We hope you enjoy your purchase.

Thank you for shopping with us.
`;
};

/*
==================================================
PASSWORD RESET EMAIL TEMPLATE
==================================================
*/

export const resetPasswordTemplate = (
  name,
  resetLink
) => {

  return `
Hello ${name},

You requested to reset your password.

Click the link below to reset your password:

${resetLink}

This link will expire in 10 minutes.

If you did not request this, please ignore this email.
`;
};