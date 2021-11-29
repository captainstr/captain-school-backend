"use strict";
const braintree = require("braintree");

let environment_setting = process.env.BRAINTREE_ENV;
let merchantId;
let publicKey;
let privateKey;
let environment;

if (environment_setting !== "production") {
  merchantId = "dmq5c2znwzv59ns2";
  publicKey = "g95tdf4wpkjztpx8";
  privateKey = "03af29cf0c3195839607be151779ebdc";
  environment = braintree.Environment.Sandbox;
} else if (environment_setting === "production") {
  merchantId = process.env.PROD_MERCHANT_ID;
  publicKey = process.env.PROD_PUBLIC_KEY;
  privateKey = process.env.PROD_PRIVATE_KEY;
  environment = braintree.Environment.Production;
}

const gateway = new braintree.BraintreeGateway({
  environment: environment,
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

async function deleteItem(ctx) {
  const knex = strapi.connections.default;
  console.log(ctx.query);
  console.log(ctx.request.body.rows);
  const rows = await knex("registrations")
    .whereIn("id", ctx.request.body.rows)
    .delete("*");
  ctx.body = "Rows deleted";
}

async function processRegistration(ctx) {
  const knex = strapi.connections.default;
  const rows = await knex("registrations")
    .whereIn("id", ctx.request.body.rows)
    .update("processed", 1);
  ctx.body = "Rows updated";
}

async function unprocessRegistration(ctx) {
  const knex = strapi.connections.default;
  const rows = await knex("registrations")
    .whereIn("id", ctx.request.body.rows)
    .update("processed", 0);
  ctx.body = "Rows updated";
}

async function reports(ctx) {
  const knex = strapi.connections.default;
  console.log(ctx.query);
  const rows = await knex("registrations")
    .join("classes", "registrations.class", "classes.id")
    .where((qb) => {
      for (const [key, value] of Object.entries(ctx.query)) {
        if (value !== "") {
          qb.where({ [key]: value });
        }
      }
    })
    .select("*")
    .options({ nestTables: true });

  console.log(rows);

  let mappedReports = rows.map((reportItem) => {
    return reportItem;
  });
  ctx.body = mappedReports;
}

module.exports = {
  gettoken,
  payment,
  cashpayment,
  reports,
  deleteItem,
  processRegistration,
  unprocessRegistration,
};
