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

const registrationQuery = `SELECT registration.registration_id AS id, registration.anon_mail AS email, from_unixtime(registration.created,"%Y-%m-%d %H:%i:%s") AS created_at, from_unixtime(registration.updated,"%Y-%m-%d %H:%i:%s") AS updated_at, from_unixtime(registration.created,"%Y-%m-%d %H:%i:%s") AS published_at, first_name.field_first_name_value AS firstname, last_name.field_last_name_value AS lastname, phone.field_phone_value AS phone_number, 
CONCAT(address.field_address_thoroughfare, address.field_address_premise, " ", address.field_address_locality, ", ", address.field_address_administrative_area, " ", address.field_address_postal_code, " ") AS address, processed.field_processed_value AS processed, depositcheck.field_depositcheck_value AS depositcheck, transaction_id.field_transaction_id_value AS transaction_id
FROM 
registration registration
LEFT JOIN node node_registration ON registration.entity_id = node_registration.nid AND (registration.entity_type = 'node')
LEFT JOIN field_data_field_first_name first_name ON registration.registration_id = first_name.entity_id and (first_name.entity_type = "registration")
LEFT JOIN field_data_field_last_name last_name ON registration.registration_id = last_name.entity_id and (last_name.entity_type = "registration")
LEFT JOIN field_data_field_phone phone ON registration.registration_id = phone.entity_id and (phone.entity_type = "registration")
LEFT JOIN field_data_field_address address ON registration.registration_id = address.entity_id and (address.entity_type = "registration")
LEFT JOIN field_data_field_processed processed ON registration.registration_id = processed.entity_id and (processed.entity_type = "registration")
LEFT JOIN field_data_field_depositcheck depositcheck ON registration.registration_id = depositcheck.entity_id and (depositcheck.entity_type = "registration")
LEFT JOIN field_data_field_transaction_id transaction_id ON registration.registration_id = transaction_id.entity_id and (transaction_id.entity_type = "registration")`;

async function regDataImport(ctx) {
  const connection = await mysql.createConnection(config);
  const [rows, fields] = await connection.execute(registrationQuery);

  for (let i = 0; i < rows.length; i++) {
    strapi.query("registrations").create(rows[i]);
  }

  ctx.body = "success!";
}

module.exports = { regDataImport };
