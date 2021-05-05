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
    <div style = {{width: "50%"}}>
      <div className={classes.demo}>
        {
            info.GrowthLast7d = info.average7days !== 0 ? Math.round((info.totalLast24h-info.average7days) * 100 * 100 / info.average7days)/100 : 0,
            info.GrowthLast24h = info.totalPrevious24h !== 0 ? Math.round((info.totalLast24h-info.totalPrevious24h) * 100 * 100/info.totalPrevious24h)/100 : 0,

            ''
        }
        <List>
          <ListItem>
            <ListItemText> 
                Total 7 days:
                <span style={{position: "absolute",
                              right: 125 }}>
                    <b> {info.totalLast7days} </b> 
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
                Average 7 days: 
                <span style={{position: "absolute",
                              right: 125 }}>
                    <b> {Math.round(100 * info.average7days)/100} </b> 
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                Previous 24 hours: 
                <span style={{position: "absolute",
                              right: 125 }}>
                    <b> {info.totalPrevious24h} </b>
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                Within range: 
                <span style={{position: "absolute",
                              right: 125 }}>
                    <b> {info.totalLast24h} </b>
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                 Growth 7 days:
                <span style={{position: "absolute",
                              right: 125, 
                              color: info.GrowthLast7d > 0 ? "#00cc00" :  "red" }}>
                    <b> {info.GrowthLast7d}% </b>
                </span> 
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                Growth 24 hours:
                <span style={{position: "absolute",
                              right: 125,
                              color: info.GrowthLast24h > 0 ? "#00cc00" :  "red" }}>
                    <b> {info.GrowthLast24h}% </b>
                </span></ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                Average rank:
                <span style={{position: "absolute",
                              right: 125 }}>
                    <b> {info.totalClicks !== 0 ? Math.round(info.sumRank * 100 / info.totalClicks) / 100 : 0} </b>
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                Clicks on first option: 
                <span style={{position: "absolute",
                              right: 125 }}>
                    <b> {info.totalClicks !== 0 ? Math.round((100 * info.oneCount/info.totalClicks) * 10) / 10 : 0} % </b> 
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
                Insuccess rate: 
                <span style={{position: "absolute",
                              right: 125 }}>
                    <b> {info.totalLast7days !== 0 ? Math.round((100 - (100 * info.totalClicks/info.totalLast7days)) * 10) / 10 : 0} % </b> 
                </span>
            </ListItemText>
          </ListItem>
        </List>
      </div>
    </div>
  );
}
