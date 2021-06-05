import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@material-ui/core/IconButton";

// core components
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function ExpandableTable(props) {
  const classes = useStyles();
  const {
    percentage,
    tableTitle,
    tableHead,
    tableData,
    tableHeaderColor,
    firstColumn,
    secondColumn,
    localLinkPath,
    localLinkAditionalInfo,
    localLinkIcon,
    externalLink,
    externalLinkPath,
    externalLinkIcon,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage
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
                    style = 
                    {{
                      width: key == 0 ? "5%" : (key == 2 || key == 3) && "20%",
                      textAlign: key == 2 || key == 3 ? "end" : "start"
                    }}
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
          {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                <TableCell className={classes.tableCell} style={{textAlign: "start"}}>
                  {key  + 1 + page * rowsPerPage}
                  </TableCell>
                <TableCell className={classes.tableCell} style={{textAlign: "start"}}>
                  <a
                    href={prop[localLinkPath]  + localLinkAditionalInfo}
                  >
                  {firstColumn.map((field) => {
                    return prop[field];
                  })}
                  </a>
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{ textAlign: "end" }}
                >
                  {secondColumn.map((field) => {
                    return prop[field];
                  })}
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{ textAlign: "end" }}
                >
                  {Math.round(10000 * prop["n"]/tableData.reduce((a,b) => a + b["n"], 0))/100} %   
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                >

                </TableCell>
                {externalLink === true ? (
                  <TableCell
                    className={classes.tableCell}
                    style={{ textAlign: "center" }}
                  >
                    <IconButton
                      color="primary"
                      component="span"
                      onClick={() => window.open(prop[externalLinkPath])}
                    >
                      {externalLinkIcon}
                    </IconButton>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
          rowsPerPageOptions={[10, 25, 30, 50]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          style= {{padding: 0}}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
    </div>
  );
}

ExpandableTable.defaultProps = {
  tableHeaderColor: "gray",
};

ExpandableTable.propTypes = {
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
