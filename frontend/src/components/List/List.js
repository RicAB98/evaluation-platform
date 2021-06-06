import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

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

export default function InteractiveList(props) {
  const classes = useStyles();
  const { title, rangeInfo, last24hInfo } = props;

  return (
    <div style = {{width: 500}}>
      <h5 style = {{ marginTop: "auto", marginBottom: "auto", backgroundColor: "#F5F5F5", paddingBottom: 20}}> {title} </h5>
      <div className={classes.demo}>
        {
          rangeInfo.GrowthLast7d = rangeInfo.average7days !== 0 ? Math.round((rangeInfo.totalLast24h-rangeInfo.average7days) * 100 * 100 / rangeInfo.average7days)/100 : Math.round(((rangeInfo.totalLast24h - 1) * 100 * 100) / 1) / 100,
          rangeInfo.GrowthLast24h = rangeInfo.totalPrevious24h !== 0 ? Math.round((rangeInfo.totalLast24h-rangeInfo.totalPrevious24h) * 100 * 100/rangeInfo.totalPrevious24h)/100 : Math.round(((rangeInfo.totalLast24h - 1) * 100 * 100) / 1) / 100,
          last24hInfo.GrowthLast7d = last24hInfo.average7days !== 0 ? Math.round((last24hInfo.totalLast24h-last24hInfo.average7days) * 100 * 100 / last24hInfo.average7days)/100 : Math.round(((last24hInfo.totalLast24h - 1) * 100 * 100) / 1) / 100,
          last24hInfo.GrowthLast24h = last24hInfo.totalPrevious24h !== 0 ? Math.round((last24hInfo.totalLast24h-last24hInfo.totalPrevious24h) * 100 * 100/last24hInfo.totalPrevious24h)/100 : Math.round(((last24hInfo.totalLast24h - 1) * 100 * 100) / 1) / 100,

            ''
        }
        <List>
        <ListItem>
            <ListItemText style={{marginBottom: 30}}> 
              <span style={{position: "absolute",
                              right: 200 }}>
                Selected period
              </span>
              <span style={{position: "absolute",
                              right: 50 }}>
                Last 24h
              </span>
            </ListItemText>
          </ListItem>
          
          <ListItem>
            <ListItemText> 
                Within range: 
                <span style={{position: "absolute",
                              right: 200 }}>
                    <b> {rangeInfo.totalLast24h} </b>
                </span>
                <span style={{position: "absolute",
                              right: 50 }}>
                    <b> {last24hInfo.totalLast24h} </b>
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                Previous 24 hours: 
                <span style={{position: "absolute",
                              right: 200 }}>
                    <b> {rangeInfo.totalPrevious24h} </b>
                </span>
                <span style={{position: "absolute",
                              right: 50 }}>
                    <b> {last24hInfo.totalPrevious24h} </b>
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                24 hours growth:
                <span style={{position: "absolute",
                              right: 200,
                              color: rangeInfo.GrowthLast24h > 0 ? "#00cc00" :  "red" }}>
                    <b> {isNaN(rangeInfo.GrowthLast24h) ? 'TBD' : rangeInfo.GrowthLast24h}% </b>
                </span>
                <span style={{position: "absolute",
                              right: 50,
                              color: last24hInfo.GrowthLast24h > 0 ? "#00cc00" :  "red" }}>
                    <b> {isNaN(last24hInfo.GrowthLast24h) ? 'TBD' : last24hInfo.GrowthLast24h}% </b>
                </span>
              </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                Total previous 7 days:
                <span style={{position: "absolute",
                              right: 200 }}>
                    <b> {rangeInfo.totalLast7days} </b> 
                </span>
                <span style={{position: "absolute",
                              right: 50 }}>
                    <b> {last24hInfo.totalLast7days} </b> 
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
                Average previous 7 days: 
                <span style={{position: "absolute",
                              right: 200 }}>
                    <b> {rangeInfo.average7days ==='TBD' ? 'TBD' : Math.round(100 * rangeInfo.average7days)/100} </b> 
                </span>
                <span style={{position: "absolute",
                              right: 50 }}>
                    <b> {last24hInfo.average7days ==='TBD' ? 'TBD' : Math.round(100 * last24hInfo.average7days)/100} </b> 
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                7 days growth:
                <span style={{position: "absolute",
                              right: 200, 
                              color: rangeInfo.GrowthLast7d > 0 ? "#00cc00" :  "red" }}>
                    <b> {isNaN(rangeInfo.GrowthLast7d) ? 'TBD' : rangeInfo.GrowthLast7d}% </b>
                </span> 
                <span style={{position: "absolute",
                              right: 50, 
                              color: last24hInfo.GrowthLast7d > 0 ? "#00cc00" :  "red" }}>
                    <b> {isNaN(last24hInfo.GrowthLast7d) ? 'TBD' : last24hInfo.GrowthLast7d}% </b>
                </span> 
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                7 days ago:
                <span style={{position: "absolute",
                              right: 200 }}>
                    <b> {rangeInfo.total7daysAgo} </b> 
                </span>
                <span style={{position: "absolute",
                              right: 50 }}>
                    <b> {last24hInfo.total7daysAgo} </b> 
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                Average rank:
                <span style={{position: "absolute",
                              right: 200 }}>
                    <b> {rangeInfo.totalClicks === 'TBD'? 'TBD' : rangeInfo.totalClicks !== 0 ? Math.round(rangeInfo.sumRank * 100 / rangeInfo.totalClicks) / 100 : 0} </b>
                </span>
                <span style={{position: "absolute",
                              right: 50 }}>
                    <b> {last24hInfo.totalClicks === 'TBD'? 'TBD' : last24hInfo.totalClicks !== 0 ? Math.round(last24hInfo.sumRank * 100 / last24hInfo.totalClicks) / 100 : 0} </b>
                </span>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText> 
                Clicks on first option: 
                <span style={{position: "absolute",
                              right: 200 }}>
                    <b> {rangeInfo.totalClicks === 'TBD'? 'TBD' : rangeInfo.totalClicks !== 0 ? Math.round((100 * rangeInfo.oneCount/rangeInfo.totalClicks) * 10) / 10 : 0} % </b> 
                </span>
                <span style={{position: "absolute",
                              right: 50 }}>
                    <b> {last24hInfo.totalClicks === 'TBD'? 'TBD' : last24hInfo.totalClicks !== 0 ? Math.round((100 * last24hInfo.oneCount/last24hInfo.totalClicks) * 10) / 10 : 0} % </b> 
                </span>
            </ListItemText>
          </ListItem>
          { title === 'Query summary' ?
          <ListItem>
            <ListItemText>
                Insuccess rate: 
                <span style={{position: "absolute",
                              right: 200 }}>
                    <b> {rangeInfo.totalLast7days === 'TBD' ? 'TBD' : 
                        rangeInfo.totalLast7days !== 0 || rangeInfo.totalLast24h !== 0 ? Math.round((100 - (100 * rangeInfo.totalClicks/(rangeInfo.totalLast7days + rangeInfo.totalLast24h))) * 10) / 10 : 0} % </b> 
                </span>
                <span style={{position: "absolute",
                              right: 50 }}>
                    <b> {rangeInfo.totalLast7days === 'TBD' ? 'TBD' : 
                         last24hInfo.totalLast7days !== 0 || last24hInfo.totalLast24h !== 0 ? Math.round((100 - (100 * last24hInfo.totalClicks/(last24hInfo.totalLast7days + last24hInfo.totalLast24h))) * 10) / 10 : 0} % </b> 
                </span>
            </ListItemText>
          </ListItem>
          : null}
        </List>
      </div>
    </div>
  );
}
