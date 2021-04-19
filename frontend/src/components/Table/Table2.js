import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TimelineIcon from '@material-ui/icons/Timeline';
import { Link } from 'react-router-dom';
// core components
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function Table2(props) {
  const classes = useStyles();
  const { tableTitle, tableDate, tableHead, tableData, tableHeaderColor } = props;

  return (
    <div className={classes.tableResponsive} style = {{marginTop: 0}}>
      <Table className={classes.table} >
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
                <TableCell className={classes.tableCell} key={key}>
                    {key + 1}
                </TableCell>
                <TableCell className={classes.tableCell} key={key}>
                    {prop["page_number"] != '20+' ? (10 * prop["page_number"] + prop["mysql_id"]) : '20+'}
                </TableCell>
                <TableCell className={classes.tableCell} key={key} style = {{ textAlign: "center" }}>
                    {prop["n"]}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div> 
  );
}

Table2.defaultProps = {
  tableHeaderColor: "gray"
};

Table2.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};