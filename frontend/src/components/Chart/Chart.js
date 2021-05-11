import React from "react";
import {Line} from 'react-chartjs-2';

export default function Chart (props) {

    const { title, string, labels, data, yLabel, displayLegend, displayTitle, displayX, displayXLegend, displayYLegend, smaller } = props;

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
      <div style ={{width: smaller && 150}}>
        { title !== false ? <h5 style = {{ marginTop: "auto", marginBottom: "auto", backgroundColor: "#F5F5F5", paddingBottom: 20}}> {title} </h5> : null}
        <Line
          data={queryData}
          options= {{
            plugins: {
                title:{
                  display: displayTitle,
                  fontSize: 20
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
                        text: yLabel
                    },
                }
              }
            }
        }
        />
      </div>
    );
}
