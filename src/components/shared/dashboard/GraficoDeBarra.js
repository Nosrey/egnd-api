import React from 'react';
import Chart from 'react-apexcharts';
// import { COLORS } from '../../../configs/chart.config';

function GraficoDeBarra({ data }) {
  return (
    <Chart
      options={{
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        // colors: COLORS,
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          categories: [
            'Ene',
            'Feb',
            'May',
            'Abr',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
        },
      }}
      series={data}
      type="bar"
      height={300}
    />
  );
}

export default GraficoDeBarra;
