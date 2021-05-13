import React from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chart from "../../components/Chart/Chart";
import Dropdown from "../../components/Dropdown/Dropdown.js";

const tp_item_list = {
  2: "competition.php?id_comp=",
  3: "equipa.php?id=",
  4: "jogador.php?id=",
  8: "estadio.php?id=",
  9: "coach.php?id=",
  10: "local.php?id=",
  13: "arbitro.php?id=",
  16: "dirigente.php?id=",
  17: "agent.php?id=",
  18: "menu.php?id=",
};

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${
          Math.round(props.value * 10) / 10
        }%`}</Typography>
      </Box>
    </Box>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "search_string", align: "left", disablePadding: true, label: "Id" },
  {
    id: "avgRank",
    align: "center",
    disablePadding: false,
    label: "Average rank",
  },
  {
    id: "insuccessRate",
    align: "center",
    disablePadding: false,
    label: "Insuccess rate",
  },
  {
    id: "totalLast24h",
    align: "right",
    disablePadding: false,
    label: "Last 24 hours",
  },
  {
    id: "totalPrevious24h",
    align: "right",
    disablePadding: false,
    label: "Previous 24 hours",
  },
  {
    id: "average7days",
    align: "right",
    disablePadding: false,
    label: "Last 7 days",
  },
  {
    id: "GrowthLast24h",
    align: "right",
    disablePadding: false,
    label: "Last 24 hours %",
  },
  {
    id: "GrowthLast7d",
    align: "right",
    disablePadding: false,
    label: "Last 7 days %",
  },
  {
    id: "weekgraph",
    align: "center",
    disablePadding: false,
    label: "7 days graph",
  },
  { id: "icon", numeric: false, disablePadding: false, label: "" },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, includeInsuccess } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) =>
          !includeInsuccess && headCell.label === "Insuccess rate" ? null : (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.disablePadding ? "none" : "default"}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{ backgroundColor: "#2c3e50", paddingLeft: 20 }}
            >
              <TableSortLabel
                onClick={createSortHandler(headCell.id)}
                style={{ color: "white" }}
                hideSortIcon={true}
                IconComponent={ExpandLessIcon}
              >
                <b style={{ color: "white" }}>{headCell.label}</b>
                {orderBy === headCell.id ? (
                  <div>
                    {order === "desc" ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </div>
                ) : null}
              </TableSortLabel>
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(90 90 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },

  colorPrimary: {
    backgroundColor: "#ffb2b2",
  },

  barColorPrimary: {
    backgroundColor: "#e50000",
  },
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [entityType, setEntityType] = React.useState(0);
  const {
    tableTitle,
    rows,
    includeInsuccess,
    iconButton,
    localLinkPath,
    localLinkFields,
    localLinkAdditional,
    defaultMinimum,
    dropdownOnChange,
  } = props;

  const handleChangeEntity = (event) => {
    setEntityType(event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: 30,
        }}
      >
        <h4
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            marginRight: 20,
            top: 200,
          }}
        >
          {" "}
          {tableTitle}{" "}
        </h4>
        <Dropdown
          list={[
            { id: 5, name: "5" },
            { id: 10, name: 10 },
            { id: 20, name: 20 },
            { id: 50, name: 50 },
            { id: 100, name: 100 },
            { id: 200, name: 200 },
            { id: 500, name: 500 },
            { id: 1000, name: 1000 },
          ]}
          name="Minimum 24h"
          value={defaultMinimum}
          onChange={dropdownOnChange}
        />
        {tableTitle === "Hot Pages" ? (
          <Dropdown
            list={[
              { id: 0, name: "All" },
              { id: 2, name: "Competition" },
              { id: 3, name: "Team" },
              { id: 4, name: "Player" },
              { id: 8, name: "Stadium" },
              { id: 9, name: "Coach" },
              { id: 10, name: "City" },
              { id: 13, name: "Referee" },
              { id: 16, name: "Director" },
              { id: 17, name: "Agent" },
              { id: 18, name: "Menu" },
            ]}
            name="Entities"
            value={entityType}
            onChange={handleChangeEntity}
          />
        ) : null}
      </div>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              includeInsuccess={includeInsuccess}
            />
            <TableBody>
              {rows.forEach(function (element) {
                element.avgRank =
                  element.totalClicks !== 0
                    ? Math.round(
                        (element.sumRank * 100) / element.totalClicks
                      ) / 100
                    : "No clicks";
                element.insuccessRate =
                  100 -
                  (100 * element.totalClicks) /
                    (element.totalLast7days + element.totalLast24h);
                element.GrowthLast7d =
                  element.average7days !== 0
                    ? Math.round(
                        ((element.totalLast24h - element.average7days) *
                          100 *
                          100) /
                          element.average7days
                      ) / 100
                    : Math.round(((element.totalLast24h - 1) * 100 * 100) / 1) /
                      100;
                element.GrowthLast24h =
                  element.totalPrevious24h !== 0
                    ? Math.round(
                        ((element.totalLast24h - element.totalPrevious24h) *
                          100 *
                          100) /
                          element.totalPrevious24h
                      ) / 100
                    : Math.round(((element.totalLast24h - 1) * 100 * 100) / 1) /
                      100;
              })}
              {stableSort(rows, getComparator(order, orderBy))
                .filter((element) =>
                  entityType != 0 ? element.tp_item == entityType : true
                )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                      style={{ border: "2px solid grey" }}
                    >
                      <TableCell
                        style={{ paddingLeft: 20 }}
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.tp_item == null ? (
                          <b> {row.search_string} </b>
                        ) : (
                          <a
                            href={
                              "https://www.zerozero.pt/" +
                              tp_item_list[row.tp_item] +
                              row.fk_item
                            }
                          >
                            {" "}
                            <b>
                              {tp_item_list[row.tp_item] + row.fk_item}
                            </b>{" "}
                          </a>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <b>{row.avgRank}</b>
                        <LinearProgressWithLabel
                          variant="determinate"
                          value={
                            row.totalClicks !== 0
                              ? (100 * row.oneCount) / row.totalClicks
                              : 0
                          }
                        />
                      </TableCell>
                      
                      {includeInsuccess ? (
                        <TableCell align="right" style={{paddingTop:25}}>
                          <LinearProgressWithLabel
                            variant="determinate"
                            value={row.insuccessRate}
                            classes={{
                              colorPrimary: classes.colorPrimary,
                              barColorPrimary: classes.barColorPrimary,
                            }}
                          />
                        </TableCell>
                      ) : null}
                      <TableCell align="right">
                        <b>{row.totalLast24h}</b>
                      </TableCell>
                      <TableCell align="right">
                        <b>{row.totalPrevious24h}</b>
                      </TableCell>
                      <TableCell align="right">
                        <b>{Math.round(100 * row.average7days) / 100}</b>
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: row.GrowthLast24h > 0 ? "#00cc00" : "red",
                        }}
                      >
                        <b>{row.GrowthLast24h}%</b>
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: row.GrowthLast7d > 0 ? "#00cc00" : "red",
                        }}
                      >
                        <b>{row.GrowthLast7d}%</b>
                      </TableCell>
                      <TableCell align="right">
                        <Chart
                          title = {false}
                          string={row.search_string}
                          data={
                            row.searches !== undefined
                              ? row.searches.split(",")
                              : row.searches
                          }
                          labels={
                            row.dates !== undefined
                              ? row.dates.split(",")
                              : row.dates
                          }
                          smaller={true}
                          displayLegend={false}
                          displayTitle={false}
                          displayX={false}
                          displayXLegend={false}
                          displayYLegend={false}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          component="span"
                          onClick={() =>
                            window.open(
                              localLinkPath +
                                new String(
                                  localLinkFields.map((field) => {
                                    return field + "=" + row[field];
                                  })
                                ).replace(",", "&") +
                                localLinkAdditional
                            )
                          }
                        >
                          {iconButton}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={
            entityType == 0
              ? rows.length
              : rows.filter((element) => element.tp_item == entityType).length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
