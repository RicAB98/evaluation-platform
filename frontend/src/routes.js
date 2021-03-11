// @material-ui/icons
import ListIcon from '@material-ui/icons/List';

// core components/views for Admin layout
//import MasterDataPage from "views/MasterData/MasterData.js";
//import OrderList from "views/OrderList/OrderList.js";
import DashboardPage from "./views/Dashboard/Dashboard.js";

const dashboardRoutes = [

  {
    path: "/dashboard",
    name: "Dashboard",
    icon: ListIcon,
    component: DashboardPage,
    layout: "/admin"
  }
];

export default dashboardRoutes;