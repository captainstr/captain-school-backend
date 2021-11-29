/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import { Button } from "reactstrap";
import axios from "axios";

async function pullRegistrations() {
  let response = await axios.post("/registrations/data-import/", {});
}

async function pullClasses() {
  let response = await axios.post("/classes/data-import/", {});
}

const HomePage = () => {
  return (
    <div>
      <h1>Data Import</h1>
      <div>
        <Button
          color="primary"
          size="lg"
          style={{}}
          onClick={pullRegistrations}
        >
          Import Registrations
        </Button>
      </div>
      {/*
      <div>
        <Button color="primary" size="lg" style={{}} onClick={pullClasses}>
          Import Classes
        </Button>
      </div>*/}
    </div>
  );
};

export default memo(HomePage);
