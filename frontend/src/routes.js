// @material-ui/icons
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import CompareArrowsOutlinedIcon from '@material-ui/icons/CompareArrowsOutlined';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import OpenWithIcon from '@material-ui/icons/OpenWith';
// core components/views for Admin layout

import RunPage from "./views/Run/Run.js";
import LoadPage from "./views/Load/Load.js";
import ResultsPage from "./views/Results/Results.js";
import HotQueriesPage from "./views/HotQueries/HotQueries";
import QueryPage from "./views/Query/QueryPerformance.js";
import PageAnalysisPage from "./views/Page/PageAnalysis";
import ExpandedAnalysisPage from "./views/Expanded/ExpandedAnalysis";
import ComparePage from "./views/Compare/Compare.js";

const dashboardRoutes = [

  /*{
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
  },*/
  {
    path: "/trending",
    name: "Trending",
    icon: TrendingUpIcon,
    component: HotQueriesPage,
    layout: "/admin"
  },
  {
    path: "/daily",
    name: "Evaluation",
    icon: EqualizerIcon,
    component: ResultsPage,
    layout: "/admin"
  },
  {
    path: "/query",
    name: "Query Analysis",
    icon: TextRotationNoneIcon,
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
    path: "/expanded",
    name: "Expanded Analysis",
    icon: OpenWithIcon,
    component: ExpandedAnalysisPage,
    layout: "/admin"
  },
  /*{
    path: "/compare",
    name: "Compare",
    icon: CompareArrowsOutlinedIcon,
    component: ComparePage,
    layout: "/admin"
  }*/
];

export default dashboardRoutes;