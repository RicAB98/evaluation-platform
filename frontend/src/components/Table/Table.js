import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import IconButton from '@material-ui/core/IconButton';

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
    firstColumn,
    secondColumn,
    linkPath,
    linkIcon
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
                  {firstColumn.map((field) => { return (prop[field])})}
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{ textAlign: "center" }}
                >
                  {secondColumn.map((field) => { return (prop[field])})}
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{ textAlign: "center" }}
                >
                  <IconButton color="primary"  component="span"  onClick={prop[linkPath] !== undefined ? () => window.open(prop[linkPath]): () => window.open("/admin/query?string=" + prop[firstColumn])}>
                    {linkIcon}
                  </IconButton>
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
