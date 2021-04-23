import React, { Component } from "react";
import {Line} from 'react-chartjs-2';

/*const state = {
  labels: ['January', 'February', 'March',
           'April', 'May'],

  datasets: [
    {
      label: 'Rainfall',
      fill: false,
      lineTension: 0,
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 2,
      data: [65, 59, 80, 81, 56]
    },
    {
        label: 'Rainfall2',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        data: [55, 49, 70, 91, 46]
      }
  ],
}*/

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
                  text:'Clicks',
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
                        text: 'Clicks'
                    }
                }
              }
            }
        }
        />
      </div>
    );
}
