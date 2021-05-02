import React from "react";
import {Line} from 'react-chartjs-2';

export default function Chart (props) {

    const { string, labels, data, displayLegend, displayTitle, displayX, displayXLegend, displayYLegend, smaller } = props;

    const queryData = 
    {
        labels:labels,
      
        datasets: [
          {
            label: string,
            fill: false,
            lineTension: 0,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            data: data
          }
        ],
      }      

    return (
      <div style ={{width: smaller && 250}}>
        <Line
          data={queryData}
          options= {{
            plugins: {
                title:{
                  display: displayTitle,
                  text:'Searches per day',
                  fontSize:20
                },
                legend:{
                  display:displayLegend,
                  position:'right'
                }
              },
              scales: {
                x: {
                    title:
                    {
                        display: displayXLegend,
                        text: 'Date'
                    },
                    display: displayX
                },
                y: {
                    title:
                    {
                        display: displayYLegend,
                        text: 'Number of searches'
                    },
                }
              }
            }
        }
        />
      </div>
    );
}
