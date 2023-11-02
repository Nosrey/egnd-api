import React, { useState } from 'react';
import Chart from 'react-apexcharts';

function GraficoDashed(props) {
  const [cac, setCac] = useState(props.cac);
  const [ltv, setLtv ]= useState(props.ltv);
  const data = [
    {
      name: 'CAC',
      data: cac,
    },
    {
      name: 'LTV',
      data: ltv,
    },
  ];

  return (
    <Chart
      options={{
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        // colors: [...COLORS],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [3, 5, 3],
          curve: 'straight',
          dashArray: [0, 8, 5],
        },
        legend: {
          tooltipHoverFormatter: (val, opts) =>
            `${val} - ${
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]
            }`,
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6,
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
        tooltip: {
          y: [
            {
              title: {
                formatter: (val) => `${val}`,
              },
            },
            {
              title: {
                formatter: (val) => `${val}`,
              },
            },
            {
              title: {
                formatter: (val) => `${val}`,
              },
            },
          ],
        },
        grid: {
          borderColor: '#f1f1f1',
        },
      }}
      series={data}
      height={300}
    />
  );
}

export default GraficoDashed;
