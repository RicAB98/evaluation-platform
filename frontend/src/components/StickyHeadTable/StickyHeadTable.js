import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import {
  defaultFont
} from "../../assets/jss/material-dashboard-react.js";

const firstLevelColumns = [
  { 
    id: 'metrics', 
    label: 'Metrics', 
    align: 'right',
  },
]

const versionColumns = [
  { 
    id: 'v1', 
    label: 'V1', 
    align: 'right',
    minWidth: 50,
  },
  { 
    id: 'v2', 
    label: 'V2', 
    align: 'left',
    minWidth: 10,
  },
]

const columns = [
  { id: 'overall', label: ' ', minWidth: 170, align: 'center' },
  { id: 'querygroup', label: 'Query\u00a0Group', minWidth: 100, align: 'center'},
  {
    id: 'query',
    label: 'Query',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'rr',
    label: 'RR',
    minWidth: 170,
    align: 'center',
    metric: true,
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'map',
    label: 'MAP',
    minWidth: 170,
    align: 'center',
    metric: true,
    format: (value) => value.toFixed(2),
  },
  {
    id: 'sat10',
    label: 'S@10',
    minWidth: 170,
    align: 'center',
    metric: true,
    format: (value) => value.toFixed(2),
  },
];

function createData(overall, querygroup, query, map, sat10) {
  //const density = query / size;
  return { overall, querygroup, query, map, sat10 };
}

const rows = [
  createData('Overall', '','', 3287263,1,1),
  createData('', 'Atletico','', 9596961),
  createData('', '', 'atletico', 301340),
  createData('', '', 'Atletico', 9833520),
  createData('', 'Cristiano Ronaldo','' , 9984670),
  createData('', '', 'ronaldo', 7692024),
  createData('', '', 'cristiano', 357578),
  createData('', '', 'cr7', 70273),
  createData('', 'MX', 126577691, 1972550),
  createData('', 'JP', 126317000, 377973),
  createData('', 'FR', 67022000, 640679),
  createData('', 'GB', 67545757, 242495),
  createData('', 'RU', 146793744, 17098246),
  createData('', 'NG', 200962417, 923768),
  createData('', 'BR', 210147125, 8515767),
];

const useStyles = makeStyles({
  root: {
    width: '75%',
    margin: 'auto'
  },
  
  container: {
    maxHeight: 560,
  },
  
  tableRow: {
     
  },

  tableHead: {
    backgroundColor: "#2c3e50",
    color: "white",
    ...defaultFont,
    "&, &$tableCell": {
      fontSize: "1.3em"
    },
    borderBottom: "1px solid black",
  }
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow
              className={classes.tableRow}
            >
              {firstLevelColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align="right"
                  style={{ minWidth: column.minWidth, paddingRight: 265 }}
                  className={classes.tableHead}
                  colSpan={6}
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
                  style={{ minWidth: column.minWidth }}
                  className={classes.tableHead}
                >
                  {column.label}
                  {column.metric === true ? (
                  <TableRow
                  style={{ display: 'flex',  justifyContent:'center', alignItems:'center', }}
                  >
                    {versionColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ width: 50, paddingTop:0, paddingBottom:0, fontSize: "1em", borderBottomWidth: 0 }}
                        className={classes.tableHead}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>): null}
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
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
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
