import React from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from "@material-ui/core/IconButton";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chart from "../../components/Chart/Chart";

function createData(query, avgrank, daygrowth, weekgrowth, daytotal, weektotal, weekgraph) {
  return { query, avgrank, daygrowth, weekgrowth, daytotal, weektotal, weekgraph };
}

const rows = [
  createData('Cupcake', 305, 3.7, 5.6, 400, 2000, 15),
  createData('Donut', 452, 25.0, 20.5, 500, 2100, 10),
  createData('Eclair', 262, 5.0, -5.5, 550, 2100, 10),
  createData('Frozen yoghurt', 159, 6.0, 1.0, 100, 262),
  createData('Gingerbread', 356, 16.0, 10.3, 300, 516,5),
  /*createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0),*/
];

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
}

const CustomSwitch = withStyles({
  switchBase: {
    color: "#2c3e50",
    '&$checked': {
      color: "#2c3e50",
    },
    '&$checked + $track': {
      backgroundColor: "#2c3e50",
    },
  },
  checked: {},
  track: {},
})(Switch);

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
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
  return order === 'desc'
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
  { id: 'search_string', numeric: false, disablePadding: true, label: 'Id' },
  { id: 'avgRank', numeric: true, disablePadding: false, label: 'Average rank' },
  { id: 'totalLast24h', numeric: true, disablePadding: false, label: 'Last 24 hours searches' },
  { id: 'totalPrevious24h', numeric: true, disablePadding: false, label: 'Previous 24 hours searches' },
  { id: 'totalLast7days', numeric: true, disablePadding: false, label: 'Last 7 days searches' },
  { id: 'GrowthLast24h', numeric: true, disablePadding: false, label: 'Last 24 hours growth' },
  { id: 'GrowthLast7d', numeric: true, disablePadding: false, label: 'Last 7 days growth' },
  { id: 'weekgraph', numeric: false, disablePadding: false, label: '7 days graph' },
  { id: 'icon', numeric: false, disablePadding: false, label: '' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler =  (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead >
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            style = {{backgroundColor: "#2c3e50", paddingLeft: 20}}
          >
            <TableSortLabel
              onClick={createSortHandler(headCell.id)}
              style = {{color: "white"}}
              hideSortIcon={true}
              IconComponent= {ExpandLessIcon}
            >
              <b style = {{color: "white"}}>{headCell.label}</b>
              {orderBy === headCell.id ? (
                <div>
                  {order === 'desc' ? <ExpandMoreIcon/> : <ExpandLessIcon/>}
                </div>
                ) : null}
              
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(90 90 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,    
  },
  
  sortLabel: {
    icon:{
      color: "white"
    }
  }
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { rows, iconButton, localLinkPath, localLinkFields, localLinkAdditional } = props;


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer >
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
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
              
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
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
                      style={{border: "2px solid grey"}}
                    >
                      <TableCell style = {{paddingLeft: 20}} component="th" id={labelId} scope="row" padding="none">
                        <b>{row.tp_item == null? row.search_string : tp_item_list[row.tp_item] + row.fk_item}</b>
                      </TableCell>
                      <TableCell align="right"><b>{row.avgRank}</b> <LinearProgressWithLabel variant="determinate" value={100 * row.oneCount/row.totalClicks} /></TableCell>
                      <TableCell align="right"><b>{row.totalLast24h}</b></TableCell>
                      <TableCell align="right"><b>{row.totalPrevious24h}</b></TableCell>
                      <TableCell align="right"><b>{row.totalLast7days}</b></TableCell>
                      <TableCell align="right" style={{color: row.GrowthLast24h > 0 ? "#00cc00" :  "red" }}><b>{row.GrowthLast24h}%</b></TableCell>
                      <TableCell align="right" style={{color: row.GrowthLast7d > 0 ? "#00cc00" : "red" }}><b>{row.GrowthLast7d}%</b></TableCell>
                      <TableCell align="right">
                        <Chart
                          string={row.search_string}
                          data={ row.searches !== undefined ? row.searches.split(",") : row.searches}
                          labels={row.dates !== undefined ? row.dates.split(",") : row.dates}
                          smaller = {true}
                          displayLegend= {false}
                          displayTitle= {false}
                          displayX = {false}
                          displayXLegend= {false}
                          displayYLegend= {false}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          component="span"
                          onClick={() => window.open(localLinkPath + new String(localLinkFields.map((field) => { return field + "=" + row[field] })).replace(',','&') + localLinkAdditional)}
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<CustomSwitch checked={dense} onChange={handleChangeDense} style={{ color: "#2c3e50" }} />}
        label="Dense padding"
      />
    </div>
  );
}
