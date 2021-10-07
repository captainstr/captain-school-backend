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

module.exports = {
  async gettoken(ctx) {
    const braintreeToken = gateway.clientToken.generate({});
    return braintreeToken;
  },

  async payment(ctx) {
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
  },
};
