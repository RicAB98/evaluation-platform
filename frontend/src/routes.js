// @material-ui/icons
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import CompareArrowsOutlinedIcon from '@material-ui/icons/CompareArrowsOutlined';
// core components/views for Admin layout
//import MasterDataPage from "views/MasterData/MasterData.js";
//import OrderList from "views/OrderList/OrderList.js";
import DashboardPage from "./views/Dashboard/Dashboard.js";
import ResultsPage from "./views/Results/Results.js";

const dashboardRoutes = [

  {
    path: "/neweval",
    name: "New Evaluation",
    icon: AddCircleOutlineOutlinedIcon,
    component: DashboardPage,
    layout: "/admin"
  },

  {
    path: "/results",
    name: "Results",
    icon: TableChartOutlinedIcon,
    component: ResultsPage,
    layout: "/admin"
  },

  {
    path: "/loadeval",
    name: "Load Evaluation",
    icon: PublishOutlinedIcon,
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