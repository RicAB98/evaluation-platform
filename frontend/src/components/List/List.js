import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    border: "2px solid grey",
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function InteractiveList(props) {
  const classes = useStyles();
  const { info } = props;

  return (
    <div style = {{}}>
      <div className={classes.demo}>
        <List>
          <ListItem>
            <ListItemText style ={{width: "50%"}}> <b> Total 7 days: </b> {info.totalLast7days} </ListItemText>
            <ListItemText style ={{width: "50%"}}> <b> Average 7 days: </b> {Math.round(100 * info.average7days)/100} </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText style ={{width: "50%"}}> <b> Previous 24 hours: </b> {info.totalPrevious24h} </ListItemText>
            <ListItemText style ={{width: "50%"}}> <b> Last 24 hours: </b> {info.totalLast24h}% </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText style ={{width: "50%"}}> <b> Growth 24 hours: </b> <span style={{color: info.GrowthLast24h > 0 ? "#00ff00" :  "#e50000" }}>{info.GrowthLast24h}% </span></ListItemText>
            <ListItemText style ={{width: "50%"}}> <b> Growth 7 days: </b> <span style={{color: info.GrowthLast7d > 0 ? "#00e300" :  "#e50000" }}>{info.GrowthLast7d}% </span> </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText style ={{width: "50%"}}> <b> Average rank: </b> {Math.round(info.sumRank * 100 / info.totalClicks) / 100} </ListItemText>
            <ListItemText style ={{width: "50%"}}> <b> Clicks on first option: </b> {Math.round((100 * info.oneCount/info.totalClicks) * 10) / 10} % </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> <b> Insuccess rate: </b> {Math.round((100 - (100 * info.totalClicks/info.totalLast7days)) * 10) / 10} % </ListItemText>
          </ListItem>
        </List>
      </div>
    </div>
  );
}
