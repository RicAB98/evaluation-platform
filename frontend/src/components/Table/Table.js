import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";

// core components
import styles from "../../assets/jss/material-dashboard-react/components/tableStyle.js";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const {
    percentage,
    tableTitle,
    tableHead,
    headerLinkPath,
    headerLinkIcon,
    tableData,
    tableHeaderColor,
    firstColumn,
    secondColumn,
    localLinkPath,
    localLinkAditionalInfo,
    externalLink,
    externalLinkPath,
    externalLinkIcon,
    columnWidth,
    columnTextAlign
  } = props;

  return (
    <div className={classes.tableResponsive}>
     { <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 350,
            marginBottom:20
          }}
        >
      <h5 style = {{ marginTop: "auto", marginBottom: "auto"}}> {tableTitle} </h5>
      <IconButton
        color="primary"
        component="span"
        onClick={() => window.open(headerLinkPath)}
        style={{marginLeft: 20}}
      >
        {headerLinkIcon}
        <h6 style = {{ marginLeft: 5, marginTop: "auto", marginBottom: "auto", color: "#4054b4", fontWeight: "bold"}}>Full results </h6>
      </IconButton>
      </div>}
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
                      width: columnWidth[key],
                      textAlign: columnTextAlign[key]
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
          {tableData.map((prop, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                <TableCell className={classes.tableCell} style={{textAlign: columnTextAlign[0]}}>{key + 1}</TableCell>
                <TableCell className={classes.tableCell} style={{textAlign: columnTextAlign[1]}}>
                  <a
                    href= {prop[localLinkPath] + localLinkAditionalInfo}
                  >
                    {firstColumn.map((field) => {
                      return prop[field];
                    })}
                  </a>
                </TableCell>
                <TableCell
                  className={classes.tableCell}
                  style={{textAlign: columnTextAlign[2]}}
                >
                  {secondColumn.map((field) => {
                    return prop[field];
                  })}
                </TableCell>
                { percentage ? 
                <TableCell className={classes.tableCell} style={{textAlign: columnTextAlign[4]}}>
                  {Math.round(10000 * prop["n"]/tableData.reduce((a,b) => a + b["n"], 0))/100} %   
                </TableCell> : null}
                <TableCell
                  className={classes.tableCell}
                  style={{textAlign: columnTextAlign[3]}}
                >
                </TableCell>
                {externalLink === true ? (
                  <TableCell
                    className={classes.tableCell}
                    style={{ textAlign: columnTextAlign[5]}}
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
