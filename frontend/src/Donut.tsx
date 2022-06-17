import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutComponent({ data }: any) {
  const dataChart = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "# of Votes",
        data: Object.values(data),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Doughnut
      data={dataChart}
      // plugins={{
      //   tooltips: {
      //     callbacks: {
      //       label: function (tooltipItem: any, data: any) {
      //         //get the concerned dataset
      //         var dataset = data.datasets[tooltipItem.datasetIndex];
      //         //calculate the total of this data set
      //         var total = dataset.data.reduce(function (
      //           previousValue: any,
      //           currentValue: any
      //         ) {
      //           return previousValue + currentValue;
      //         });
      //         //get the current items value
      //         var currentValue = dataset.data[tooltipItem.index];
      //         //calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
      //         var percentage = Math.floor((currentValue / total) * 100 + 0.5);

      //         return percentage + "%";
      //       },
      //     },
      //   },
      // }}
    />
  );
}
