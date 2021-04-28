import React from "react";
import {Line} from 'react-chartjs-2';

export default function Chart (props) {

    const { string, labels, data } = props;

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
      <div>
        <Line
          data={queryData}
          options= {{
            plugins: {
                title:{
                  display:true,
                  text:'Searches per day',
                  fontSize:20
                },
                legend:{
                  display:true,
                  position:'right'
                }
              },
              scales: {
                x: {
                    title:
                    {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title:
                    {
                        display: true,
                        text: 'Number of searches'
                    }
                }
              }
            }
        }
        />
      </div>
    );
}
