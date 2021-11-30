"use strict";
const format = require("string-format");
const balanceDue = require("../../data/emails.js");

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }

  // Runs every day at 10:00 am
  "0 0 10 * * *": () => {},
  "1 * * * * *": async () => {
    const today = new Date(new Date().setUTCHours(0, 0, 0, 0));

    // important line - necessary for easy querying
    const knex = strapi.connections.default;

    const rows = await knex("registrations")
      .join("classes", "registrations.class", "classes.id")
      .join("class_types", "classes.class_type", "class_types.id")
      .where({
        "classes.money_date": today,
      })
      .select("*")
      .options({ nestTables: true });

    rows.forEach(async (row) => {
      let registrationRow = row.registrations;
      let classRow = row.classes;
      let classTypeRow = row.class_types;
      let email = registrationRow.email;
      email = "andy@codexr.io";
      const formatObj = {
        firstname: registrationRow.firstname,
        lastname: registrationRow.lastname,
        amount: classRow.cost - classRow.deposit,
        title: classRow.title,
        classType: classTypeRow.class_type,
      };
      let balanceDueSubject = format(balanceDue.balanceDueSubject, formatObj);
      let balanceDueBody = format(balanceDue.balanceDueBody, formatObj);
      let response = await strapi.plugins["email"].services.email.send({
        to: email,
        subject: balanceDueSubject,
        text: balanceDueBody,
        html: balanceDueBody,
      });
    });
  },
};
