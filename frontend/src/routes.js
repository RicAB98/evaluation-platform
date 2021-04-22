// @material-ui/icons
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import CompareArrowsOutlinedIcon from '@material-ui/icons/CompareArrowsOutlined';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TimelineIcon from '@material-ui/icons/Timeline';
import MenuBookIcon from '@material-ui/icons/MenuBook';
// core components/views for Admin layout

import RunPage from "./views/Run/Run.js";
import LoadPage from "./views/Load/Load.js";
import ResultsPage from "./views/Results/Results.js";
import QueryPage from "./views/Query/QueryPerformance.js";
import PageAnalysisPage from "./views/Page/PageAnalysis";
import ComparePage from "./views/Compare/Compare.js";

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
    path: "/daily",
    name: "Daily Evaluation",
    icon: AccessTimeIcon,
    component: ResultsPage,
    layout: "/admin"
  },
  {
    path: "/query",
    name: "Query Analysis",
    icon: TimelineIcon,
    component: QueryPage,
    layout: "/admin"
  },
  {
    path: "/page",
    name: "Page Analysis",
    icon: MenuBookIcon,
    component: PageAnalysisPage,
    layout: "/admin"
  },
  {
    path: "/compare",
    name: "Compare",
    icon: CompareArrowsOutlinedIcon,
    component: ComparePage,
    layout: "/admin"
  }
];

export default dashboardRoutes;