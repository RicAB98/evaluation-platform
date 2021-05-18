// @material-ui/icons
import CompareArrowsOutlinedIcon from '@material-ui/icons/CompareArrowsOutlined';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import OpenWithIcon from '@material-ui/icons/OpenWith';
// core components/views for Admin layout

import ResultsPage from "./views/Evaluation/Evaluation";
import HotQueriesPage from "./views/HotQueries/HotQueries";
import QueryPage from "./views/Query/QueryAnalysis";
import PageAnalysisPage from "./views/Page/PageAnalysis";
import ExpandedAnalysisPage from "./views/Expanded/ExpandedAnalysis";
import ComparePage from "./views/Compare/Compare.js";

const dashboardRoutes = [

  {
    path: "/trending",
    name: "Trending",
    icon: TrendingUpIcon,
    component: HotQueriesPage,
    layout: ""
  },
  {
    path: "/evaluation",
    name: "Evaluation",
    icon: EqualizerIcon,
    component: ResultsPage,
    layout: ""
  },
  {
    path: "/query",
    name: "Query Analysis",
    icon: TextRotationNoneIcon,
    component: QueryPage,
    layout: ""
  },
  {
    path: "/page",
    name: "Page Analysis",
    icon: MenuBookIcon,
    component: PageAnalysisPage,
    layout: ""
  },
  {
    path: "/expanded",
    name: "Expanded Analysis",
    icon: OpenWithIcon,
    component: ExpandedAnalysisPage,
    layout: ""
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