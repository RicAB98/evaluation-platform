// @material-ui/icons
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import CompareArrowsOutlinedIcon from '@material-ui/icons/CompareArrowsOutlined';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
// core components/views for Admin layout
//import MasterDataPage from "views/MasterData/MasterData.js";
//import OrderList from "views/OrderList/OrderList.js";
import RunPage from "./views/Run/Run.js";
import LoadPage from "./views/Load/Load.js";
import ResultsPage from "./views/Results/Results.js";

const dashboardRoutes = [

  {
    path: "/run",
    name: "Run Evaluation",
    icon: AddCircleOutlineOutlinedIcon,
    component: RunPage,
    layout: "/admin"
  },

  {
    path: "/load",
    name: "Load Evaluation",
    icon: PublishOutlinedIcon,
    component: LoadPage,
    layout: "/admin"
  },

  {
    path: "/last",
    name: "Last Evaluation",
    icon: AccessTimeIcon,
    component: ResultsPage,
    layout: "/admin"
  },
  {
    path: "/compare",
    name: "Compare",
    icon: CompareArrowsOutlinedIcon,
    component: ResultsPage,
    layout: "/admin"
  }
];

export default dashboardRoutes;