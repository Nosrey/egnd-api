/* eslint-disable object-shorthand */
import {  useState } from 'react';
import Chart from 'react-apexcharts';


function GraficoDeBarra({ data}) {
  const [view, setView] = useState(data);
  return (
    <Chart
      options={{
        colors: ["#F4A020"],
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (value) {
            return `${value}`;
          },
        },
        xaxis: {
          categories: [
            'Año 1',
            'Año 2',
            'Año 3',
            'Año 4',
            'Año 5',
            'Año 6',
            'Año 7',
            'Año 8',
            'Año 9',
            'Año 10',
          ],
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return `${value}`;
            },
          },
        },
      }}
      series={[
        {
          data: view,
          name: 'LTV / CAC',
        },
      ]}
      type="bar"
      height={300}
      
    />
  );
}

export default GraficoDeBarra;
