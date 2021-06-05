// @material-ui/icons
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
import FullResultsPage from "./views/FullResults/FullResults";

const dashboardRoutes = [

  {
    path: "/trending",
    name: "Trending",
    icon: TrendingUpIcon,
    component: HotQueriesPage,
    layout: "",
    sidebar: true
  },
  {
    path: "/evaluation",
    name: "Evaluation",
    icon: EqualizerIcon,
    component: ResultsPage,
    layout: "",
    sidebar: true
  },
  {
    path: "/query",
    name: "Query Analysis",
    icon: TextRotationNoneIcon,
    component: QueryPage,
    layout: "",
    sidebar: true
  },
  {
    path: "/page",
    name: "Page Analysis",
    icon: MenuBookIcon,
    component: PageAnalysisPage,
    layout: "",
    sidebar: true
  },
  {
    path: "/fullresults",
    name: "Full Results", 
    icon: OpenWithIcon,
    component: FullResultsPage,
    layout: "",
    sidebar: false
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