import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TimelineIcon from "@material-ui/icons/Timeline";
import { Link } from "react-router-dom";
// core components
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const {
    tableTitle,
    tableHead,
    tableData,
    tableHeaderColor,
  } = props;

  return (
    <div className={classes.tableResponsive}>
      <h5 style={{ marginBottom: 30 }}> {tableTitle} </h5>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                <TableCell className={classes.tableCell}>
                  {key + 1}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {prop["search_string"]}
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{ textAlign: "center" }}
                >
                  {prop["n"]}
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{ textAlign: "center" }}
                >
                  <Link
                    to={{
                      pathname: "/admin/query",
                      search: "?string=" + prop["search_string"]
                    }}
                  >
                    <TimelineIcon />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
