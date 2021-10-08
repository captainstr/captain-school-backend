"use strict";
const braintree = require("braintree");

let environment = "sandbox";
let merchantId;
let publicKey;
let privateKey;

// TODO probably replace ALL variables with environmental variables here

if (environment === "sandbox") {
  merchantId = "dmq5c2znwzv59ns2";
  publicKey = "g95tdf4wpkjztpx8";
  privateKey = "03af29cf0c3195839607be151779ebdc";
} else if (environment === "production") {
  merchantId = "INSERT ENVIRONMENTAL VARIABLES";
  publicKey = "INSERT ENVIRONMENTAL VARIABLES";
  privateKey = "INSERT ENVIRONMENTAL VARIABLES";
}

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: merchantId,
  publicKey: publicKey,
  privateKey: privateKey,
});

async function gettoken(ctx) {
  const braintreeToken = gateway.clientToken.generate({});
  return braintreeToken;
}

async function payment(ctx) {
  let nonceFromTheClient = ctx.request.body.paymentMethodNonce;
  let amountFromTheClient = ctx.request.body.amount;
  const newTransaction = await gateway.transaction.sale({
    amount: amountFromTheClient,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true,
    },
  });
  return newTransaction;
}

async function cashpayment(ctx) {
  let depositcheck = ctx.request.body.depositcheck;
  if (depositcheck === "NA") {
    let response = await strapi.plugins["email"].services.email.send({
      // TODO move to emails file and other relevant places
      to: ctx.request.body.email,
      bcc: "captaind@capquest.com, rossfowle@gmail.com",
      subject: "Payment arrangement for 3Bs Captains School",
      text: balanceDueBody,
      html: 'You have elected to make payment arrangements without using a credit card. Contact Capt. Ross @ 910-547-3689 or <a href="mailto:rossfowle@gmail.com">email</a><center><strong>Be advised that registration is not confirmed until payment have been made.</strong></center>',
      text: 'You have elected to make payment arrangements without using a credit card. Contact Capt. Ross @ 910-547-3689 or <a href="mailto:rossfowle@gmail.com">email</a>Be advised that registration is not confirmed until payment have been made.',
    });
  }
}

module.exports = {
  gettoken,
  payment,
  cashpayment,
};
