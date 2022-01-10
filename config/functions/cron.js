"use strict";
const format = require("string-format");

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

async function balancepayment(ctx) {
  const today = new Date(new Date().setUTCHours(0, 0, 0, 0));

  // important line - necessary for easy querying
  const knex = strapi.connections.default;
  const baseUrl = strapi.config.get("server.url");

  const rows = await knex("registrations")
    .join("classes", "registrations.class", "classes.id")
    .join("class_types", "classes.class_type", "class_types.id")
    .where({
      "classes.money_date": today,
      "registrations.depositcheck": "Deposit",
    })
    .select("*")
    .options({ nestTables: true });

  const emails = await knex("emails")
    .where({
      label: "Balance Payment",
    })
    .first();

  rows.forEach(async (row) => {
    let registrationRow = row.registrations;
    let classRow = row.classes;
    let classTypeRow = row.class_types;
    let email;
    let environment_setting = process.env.BRAINTREE_ENV;
    if (environment_setting !== "production") {
      email = "andy@codexr.io";
    } else if (environment_setting === "production") {
      email = registrationRow.email;
    }
    let firstname =
      registrationRow.firstname[0].toUpperCase() +
      registrationRow.firstname.substring(1);
    let lastname =
      registrationRow.lastname[0].toUpperCase() +
      registrationRow.lastname.substring(1);
    const formatObj = {
      firstname: firstname,
      lastname: lastname,
      amount: classRow.cost - classRow.deposit,
      title: classRow.title,
      classType: classTypeRow.class_type,
      base_url: baseUrl,
    };
    let balancePaymentSubject = format(emails.Subject, formatObj);
    let balancePaymentBody = format(emails.Text, formatObj);
    let response = await strapi.plugins["email"].services.email.send({
      to: email,
      cc: "captaind@capquest.com",
      subject: balancePaymentSubject,
      text: balancePaymentBody,
      html: balancePaymentBody,
    });
  });
}

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }

  // Runs every day at 10:00 am
  "0 0 10 * * *": async () => {
    balancepayment();
  },
  //"1 * * * * *": async () => {},
  //"0 0 10 * * *": async () => {)
};
