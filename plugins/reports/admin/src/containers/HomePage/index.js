/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import BootstrapTable from "react-bootstrap-table-next";
import Select from "react-dropdown-select";
import { InputGroup, Input, Button } from "reactstrap";
import axios from "axios";
// TODO there is a native way to do this with bootstrap table - look into it
// TODO also has table search potentially
import { CSVLink } from "react-csv/lib";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";

const columns = [
  {
    dataField: "title",
    text: "Title",
    sort: true,
  },
  {
    dataField: "address",
    text: "Address",
    sort: true,
  },
  {
    dataField: "firstname",
    text: "First Name",
    sort: true,
  },
  {
    dataField: "lastname",
    text: "Last Name",
    sort: true,
  },
  {
    dataField: "phone_number",
    text: "Phone",
    sort: false,
  },
  {
    dataField: "email",
    text: "Email",
    sort: true,
  },
  {
    dataField: "updated_at",
    text: "Date Created",
    sort: true,
  },
  {
    dataField: "transaction_id",
    text: "Transaction ID",
    sort: true,
  },
  {
    dataField: "depositcheck",
    text: "Deposit Type",
    sort: true,
  },
  {
    dataField: "deposit",
    text: "Deposit",
    sort: true,
  },
  {
    dataField: "processed",
    text: "Processed",
    sort: false,
  },
];

const processed = [{ label: "Unprocessed" }, { label: "Processed" }];
const operations = [
  { label: "Delete Item", url: "deleteitem" },
  { label: "Process Registration", url: "processregistration" },
  { label: "Unprocess Registration", url: "unprocessregistration" },
];

// TODO move into some utility file at some point maybe
function addDate(dt, amount, dateType) {
  switch (dateType) {
    case "days":
      return dt.setDate(dt.getDate() + amount) && dt;
    case "weeks":
      return dt.setDate(dt.getDate() + 7 * amount) && dt;
    case "months":
      return dt.setMonth(dt.getMonth() + amount) && dt;
    case "years":
      return dt.setFullYear(dt.getFullYear() + amount) && dt;
  }
}

const HomePage = () => {
  const [values, setValues] = useState({
    title: "",
    email: "",
    firstname: "",
    lastname: "",
    transaction_id: "",
    processed: "",
  });
  const [reports, setReports] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [date, setDate] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const onSelectAll = (isSelect, rows, e) => {
    if (isSelect) {
      setSelectedRows(rows);
    } else if (!isSelect) {
      setSelectedRows([]);
    }
  };

  const onSelect = (row, isSelect, rowIndex, e) => {
    let currentRows = selectedRows;
    if (
      isSelect &&
      currentRows.filter((item) => item.id === row.id).length === 0
    ) {
      currentRows.push(row);
      setSelectedRows(currentRows);
    } else if (!isSelect) {
      currentRows = currentRows.filter((item) => item.id !== row.id);
      setSelectedRows(currentRows);
    }
  };

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    classes: "selection-row",
    onSelectAll: onSelectAll,
    onSelect: onSelect,
  };

  function applyClick() {
    getReports();
  }

  function valuesChange(event, field) {
    let value = event.target.value;
    let newValues = values;
    newValues[field] = value;
    setValues(newValues);
  }

  function processedChange(option) {
    let newValues = values;
    let labelBool;
    if (option[0]["label"] === "Processed") {
      labelBool = 1;
    } else if (option[0]["label"] === "Unprocessed") {
      labelBool = 0;
    }
    newValues["processed"] = labelBool;
    setValues(newValues);
  }

  async function getReports() {
    let valuesAndDate = { ...values };
    valuesAndDate["startDate"] = date[0].startDate;
    valuesAndDate["endDate"] = date[0].endDate;
    let reportObjs = await axios.get("/orders/reports/", {
      params: valuesAndDate,
    });
    let mappedReports = reportObjs.data.map((reportObj) => {
      let registrations = reportObj.registrations;
      let created_at = new Date(
        registrations["created_at"]
      ).toLocaleDateString();
      let updated_at = new Date(
        registrations["updated_at"]
      ).toLocaleDateString();
      registrations["created_at"] = created_at;
      registrations["updated_at"] = updated_at;
      registrations["title"] = reportObj.classes.title;
      if (
        reportObj.classes.deposit !== null &&
        registrations.depositcheck === "Deposit"
      ) {
        registrations["deposit"] = "$" + reportObj.classes.deposit;
      }
      return registrations;
    });
    setReports(mappedReports);
  }

  async function executeOperation() {
    if (selectedRows.length > 0 && currentOperation.length > 0) {
      let response = await axios.post(
        "/orders/" + currentOperation[0].url + "/",
        {
          rows: selectedRows.map((row) => row.id),
        }
      );
      getReports();
    }
  }

  function processForCSV(selectedRows) {
    const csvData = selectedRows.map((item) => {
      delete item.class;
      delete item.transaction_id;
      delete item.updated_by;
      delete item.created_by;
      delete item.updated_at;
      delete item.published_at;
      delete item.processed;
      delete item.braintree;
      return item;
    });
    return csvData;
  }

  useEffect(() => {
    getReports();
  }, []);
  return (
    <div>
      <h1>Reports</h1>
      <CSVLink
        data={processForCSV(selectedRows)}
        filename={"report-export.csv"}
        className="btn btn-primary"
        target="_blank"
      >
        CSV Export
      </CSVLink>
      <h2>Filters</h2>
      <div style={{ flexDirection: "row", flexWrap: "wrap", display: "flex" }}>
        <InputGroup style={{ flex: 1 }}>
          <Input
            placeholder="Title"
            onChange={(event) => valuesChange(event, "title")}
          />
        </InputGroup>
        <InputGroup style={{ flex: 1 }}>
          <Input
            placeholder="Email"
            onChange={(event) => valuesChange(event, "email")}
          />
        </InputGroup>
        <InputGroup style={{ flex: 1 }}>
          <Input
            placeholder="First Name"
            onChange={(event) => valuesChange(event, "firstname")}
          />
        </InputGroup>
        <InputGroup style={{ flex: 1 }}>
          <Input
            placeholder="Last Name"
            onChange={(event) => valuesChange(event, "lastname")}
          />
        </InputGroup>
        <InputGroup style={{ flex: 1 }}>
          <Input
            placeholder="Transaction ID"
            onChange={(event) => valuesChange(event, "transaction_id")}
          />
        </InputGroup>
      </div>
      <DateRange
        editableDateInputs={true}
        onChange={(item) => setDate([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={date}
      />
      <div style={{ flex: 1 }}>
        <h3>Processed</h3>
        <Select
          options={processed}
          onChange={(option) => processedChange(option)}
        />
      </div>
      <Button color="primary" size="lg" style={{}} onClick={applyClick}>
        Apply
      </Button>
      <div style={{ flexDirection: "row", display: "flex" }}>
        <div style={{ flex: 1 }}>
          <h2>Operations</h2>
          <Select
            options={operations}
            onChange={(option) => setCurrentOperation(option)}
          />
          <Button
            color="primary"
            size="lg"
            style={{}}
            onClick={executeOperation}
          >
            Execute
          </Button>
        </div>
      </div>
      {reports.length === 0 ? null : (
        <div style={{ width: "50%" }}>
          <BootstrapTable
            bootstrap4
            striped
            hover
            keyField="id"
            data={reports}
            columns={columns}
            selectRow={selectRow}
            classes="w-auto table table-fit"
            //defaultSorted={props.defaultSorted}
            //rowEvents={rowEvents}
          />
        </div>
      )}
    </div>
  );
};

export default memo(HomePage);
