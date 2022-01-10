"use strict";
const format = require("string-format");
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

async function deleteItem(ctx) {
  const knex = strapi.connections.default;
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
  const rows = await knex("registrations")
    .join("classes", "registrations.class", "classes.id")
    .where((qb) => {
      for (const [key, value] of Object.entries(ctx.query)) {
        if (key === "startDate") {
          qb.where("registrations.created_at", ">=", value);
        } else if (key === "endDate") {
          qb.where("registrations.created_at", "<", value);
        } else if (key !== "startDate" && key !== "endDate" && value !== "") {
          qb.where({ [key]: value });
        }
      }
    })
    .select("*")
    .options({ nestTables: true });

  let mappedReports = rows.map((reportItem) => {
    return reportItem;
  });
  ctx.body = mappedReports;
}

// Emails for orders/registration

async function cashpayment(ctx) {
  let depositcheck = ctx.request.body.depositcheck;
  const knex = strapi.connections.default;
  const emails = await knex("emails")
    .where({
      label: "Cash Pay",
    })
    .first();
  if (depositcheck === "NA") {
    let response = await strapi.plugins["email"].services.email.send({
      to: "captaind@capquest.com, andrew.j.alexander@gmail.com",
      //to: "andrew.j.alexander@gmail.com",
      //to: ctx.request.body.email,
      //cc: "captaind@capquest.com",
      subject: emails.Subject,
      html: emails.HTML,
      text: emails.Text,
    });
  }
}
// TODO add functions in the form and here
async function userregistrationinfo(ctx) {
  const knex = strapi.connections.default;
  const emails = await knex("emails")
    .where({
      label: "Registration",
    })
    .first();
  const formatObj = {
    date: ctx.request.body.date,
    captain: ctx.request.body.captain,
    classroom_location: ctx.request.body.classroom_location,
    class_type: ctx.request.body.class_type,
    title: ctx.request.body.title,
  };
  let registrationSubject = format(emails.Subject, formatObj);
  let registrationBodyHTML = format(emails.HTML, formatObj);
  let registrationBodyText = format(emails.Text, formatObj);
  await strapi.plugins["email"].services.email.send({
    to: "captaind@capquest.com, andrew.j.alexander@gmail.com",
    //to: ctx.request.body.email,
    //bcc: "captaind@capquest.com, ross@captainsschool.com, rossfowle@gmail.com",
    subject: registrationSubject,
    html: registrationBodyHTML,
    text: registrationBodyText,
  });
}

async function adminregistrationinfo(ctx) {
  const knex = strapi.connections.default;
  const today = new Date().toDateString();
  const formatObj = {
    title: ctx.request.body.title,
    created: today,
    firstname: ctx.request.body.firstname,
    lastname: ctx.request.body.lastname,
    address: ctx.request.body.address,
    phone_number: ctx.request.body.phone_number,
    email: ctx.request.body.email,
    cost: ctx.request.body.amount,
    paid: ctx.request.body.deposit,
    class_type: ctx.request.body.class_type,
    due: String(ctx.request.body.amount - ctx.request.body.deposit),
  };
  const emails = await knex("emails")
    .where({
      label: "Send Registration to 3Bs",
    })
    .first();
  let balanceDueSubject = format(emails.Subject, formatObj);
  let balanceDueBodyHTML = format(emails.HTML, formatObj);
  let balanceDueBodyText = format(emails.Text, formatObj);
  await strapi.plugins["email"].services.email.send({
    //to: "andrew.j.alexander@gmail.com",
    to: "captaind@capquest.com, andrew.j.alexander@gmail.com",
    //cc: "rossfowle@gmail.com, ross@captainsschool.com ",
    subject: balanceDueSubject,
    html: balanceDueBodyHTML,
    text: balanceDueBodyText,
  });
}

async function initialregistration(ctx) {
  adminregistrationinfo(ctx);
  userregistrationinfo(ctx);
  return "registration emails sent";
}

module.exports = {
  gettoken,
  payment,
  cashpayment,
  reports,
  deleteItem,
  processRegistration,
  unprocessRegistration,
  initialregistration,
};
