"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const mysql = require("mysql2/promise");

const config = {
  host: env.int("OLD_DB_HOST", "127.0.0.1"),
  user: env.int("OLD_DB_USERNAME", ""),
  password: env.int("OLD_DB_PASSWORD", ""),
  database: env.int("OLD_DB", ""),
};

const classQuery = `SELECT node.title AS title, node.nid AS id, from_unixtime(node.created,"%Y-%m-%d %H:%i:%s") AS created_at, from_unixtime(node.changed,"%Y-%m-%d %H:%i:%s") AS updated_at, from_unixtime(node.created,"%Y-%m-%d %H:%i:%s") AS published_at, body.body_value AS details, captain.field_captain_tid AS captain, city.field_city_tid AS city, class_type.field_class_type_tid AS class_type, classroom_location.field_classroom_location_value AS classroom_location, cost.field_cost_value AS cost, date_format(datefield.field_date_value, '%Y-%m-%d') AS date, deposit.field_deposit_value AS deposit, info.field_info_value AS information, location.field_location_value AS location, date_format(money_date.field_money_date_value, '%Y-%m-%d') AS money_date, other_information.field_other_information_value AS other_information, state.field_state_tid AS state, alternate_registration.field_alternate_registration_value AS alternative_registration
FROM
node node
LEFT JOIN field_data_body body ON node.nid = body.entity_id and (body.bundle = "class")
LEFT JOIN field_data_field_captain captain ON node.nid = captain.entity_id and (captain.bundle = "class")
LEFT JOIN field_data_field_city city ON node.nid = city.entity_id and (city.bundle = "class")
LEFT JOIN field_data_field_class_type class_type ON node.nid = class_type.entity_id and (class_type.bundle = "class")
LEFT JOIN field_data_field_classroom_location classroom_location ON node.nid = classroom_location.entity_id and (classroom_location.bundle = "class")
LEFT JOIN field_data_field_cost cost ON node.nid = cost.entity_id and (cost.bundle = "class")
LEFT JOIN field_data_field_date datefield ON node.nid = datefield.entity_id and (datefield.bundle = "class")
LEFT JOIN field_data_field_deposit deposit ON node.nid = deposit.entity_id and (deposit.bundle = "class")
LEFT JOIN field_data_field_info info ON node.nid = info.entity_id and (info.bundle = "class")
LEFT JOIN field_data_field_location location ON node.nid = location.entity_id and (location.bundle = "class")
LEFT JOIN field_data_field_money_date money_date ON node.nid = money_date.entity_id and (money_date.bundle = "class")
LEFT JOIN field_data_field_other_information other_information ON node.nid = other_information.entity_id and (other_information.bundle = "class")
LEFT JOIN field_data_field_state state ON node.nid = state.entity_id and (state.bundle = "class")
LEFT JOIN field_data_field_alternate_registration alternate_registration ON node.nid = alternate_registration.entity_id and (alternate_registration.bundle = "class")
WHERE (( (node.type IN  ('class')) ))`;

async function classDataImport(ctx) {
  const connection = await mysql.createConnection(config);
  const [rows, fields] = await connection.execute(classQuery);

  for (let i = 0; i < rows.length; i++) {
    strapi.query("class").create(rows[i]);
  }

  ctx.body = "success!";
}

module.exports = { classDataImport };
