import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { defaultFont } from "../../assets/jss/material-dashboard-react.js";

const firstLevelColumns = [
  {
    id: "empty",
    label: "",
    align: "center",
    colspan: 3,
  },
  {
    id: "rr",
    label: "RR",
    align: "center",
    colspan: 3,
  },
  {
    id: "map",
    label: "MAP",
    align: "center",
    colspan: 3,
  },
  {
    id: "sat10",
    label: "S@10",
    align: "center",
    colspan: 3,
  },
];

const columns = [
  { id: "overall", label: " ", minWidth: 170, align: "center" },
  {
    id: "querygroup",
    label: "Query\u00a0Group",
    minWidth: 100,
    align: "center",
  },
  {
    id: "query",
    label: "Query",
    minWidth: 170,
    align: "center",
    border: "1px solid black",
  },
  {
    id: "rrv1",
    label: "V1",
    minWidth: 170,
    align: "center",
    metric: true,
  },
  {
    id: "rrv2",
    label: "V2",
    minWidth: 170,
    align: "center",
    metric: true,
  },
  {
    id: "rrdelta",
    label: "\u0394",
    minWidth: 170,
    align: "center",
    metric: true,
    delta: true,
    border: "1px solid black",
  },
  {
    id: "mapv1",
    label: "V1",
    minWidth: 170,
    align: "center",
    metric: true,
  },
  {
    id: "mapv2",
    label: "V2",
    minWidth: 170,
    align: "center",
    metric: true,
  },
  {
    id: "mapdelta",
    label: "\u0394",
    minWidth: 170,
    align: "center",
    metric: true,
    delta: true,
    border: "1px solid black",
  },
  {
    id: "sat10v1",
    label: "V1",
    minWidth: 170,
    align: "center",
    metric: true,
  },
  {
    id: "sat10v2",
    label: "V2",
    minWidth: 170,
    align: "center",
    metric: true,
  },
  {
    id: "sat10delta",
    label: "\u0394",
    minWidth: 170,
    align: "center",
    metric: true,
    delta: true,
  },
];

function createData(
  overall,
  querygroup,
  query,
  rrv1,
  rrv2,
  rrdelta,
  mapv1,
  mapv2,
  mapdelta,
  sat10v1,
  sat10v2,
  sat10delta
) {
  //const density = query / size;
  return {
    overall,
    querygroup,
    query,
    rrv1,
    rrv2,
    rrdelta,
    mapv1,
    mapv2,
    mapdelta,
    sat10v1,
    sat10v2,
    sat10delta,
  };
}

const rows = [
  createData("Overall", "", "", 0.9, 0.8, -0.1, 0.6, 0.5, -0.1, 0.5, 0.5, 0),
  createData("", "Atletico", "", 0.9, 0.8, -0.1, 0.6, 0.5, -0.1, 0.4, 0.5, 0.1),
  createData("", "", "atletico", 0.9, 0.8, -0.1, 0.6, 0.5, -0.1, 0.4, 0.5, 0.1),
  createData("", "", "Atletico", 0.9, 0.8, -0.1, 0.6, 0.5, -0.1, 0.4, 0.5, 0.1),
  createData(
    "",
    "Cristiano Ronaldo",
    "",
    0.9,
    0.8,
    -0.1,
    0.6,
    0.5,
    -0.1,
    0.4,
    0.5,
    0.1
  ),
  createData("", "", "ronaldo", 0.9, 0.8, -0.1, 0.6, 0.5, -0.1, 0.4, 0.5, 0.1),
  createData(
    "",
    "",
    "cristiano",
    0.9,
    0.8,
    -0.1,
    0.6,
    0.5,
    -0.1,
    0.4,
    0.5,
    0.1
  ),
  createData("", "", "cr7", 0.9, 0.8, -0.1, 0.6, 0.5, -0.1, 0.4, 0.5, 0.1),
  //createData('', 'MX', 126577691, 1972550),
  //createData('', 'JP', 126317000, 377973),
  //createData('', 'FR', 67022000, 640679),
  //createData('', 'GB', 67545757, 242495),
  //createData('', 'RU', 146793744, 17098246),
  //createData('', 'NG', 200962417, 923768),
  //createData('', 'BR', 210147125, 8515767),
];

const useStyles = makeStyles({
  root: {
    width: "75%",
    margin: "auto",
  },

  container: {
    maxHeight: 560,
  },

  tableRow: {},

  tableHead: {
    backgroundColor: "#2c3e50",
    color: "white",
    ...defaultFont,
    "&, &$tableCell": {
      fontSize: "1.3em",
    },
    borderBottom: "1px solid black",
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow className={classes.tableRow}>
              {firstLevelColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className={classes.tableHead}
                  colSpan={column.colspan}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    width: "50",
                    paddingLeft: 0,
                    paddingRight: 0,
                    borderRight: column.border,
                  }}
                  className={classes.tableHead}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          borderRight: column.border,
                          backgroundColor:
                            column.delta === true
                              ? value < 0
                                ? "red"
                                : value > 0
                                ? "green"
                                : "yellow"
                              : null,
                        }}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
