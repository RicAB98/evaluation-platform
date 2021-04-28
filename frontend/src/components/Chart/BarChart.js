import React from "react";
import {Bar} from 'react-chartjs-2';



export default function BarChart (props) {

    const { title, data, xVariable, yVariable, yLabel } = props;

    const graphData = {
        labels: data.map(element => element[xVariable]),
        datasets: [{

            data: data.map(element => element[yVariable]), 
            backgroundColor: [
            'rgba(158,4,14)',
            'rgba(233,0,2)',
            'rgba(251,122,1)',
            'rgba(225,220,0)',
            'rgba(155,218,75)',
            'rgba(78,199,158)',
            'rgba(4,185,245)',
            'rgba(1,129,208)',
            'rgba(2,0,255)',
            'rgba(90,0,150)'
            ],

        }]
    };
   
    return (
        
      <div>
        <Bar
          type= 'bar'
          data={graphData}
          options= {{
            indexAxis: 'y',  
            plugins: {
                title:{
                  display:true,
                  text:title,
                  fontSize: 20
                },
                legend:{
                  display:false
                }
              },
              scales: {
                x: {
                    title:
                    {
                        display: true,
                        text: 'Number of searches'
                    }
                },
                y: {
                    title:
                    {
                        display: true,
                        text: yLabel
                    },
                    beginAtZero: true
                }
              }
            }
        }
        />
      </div>
    );
}
