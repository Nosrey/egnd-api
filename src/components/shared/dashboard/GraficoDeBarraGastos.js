import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

function GraficoDeBarraGastos({ nameData, cuentasData, typeView }) {
  const [dataView, setDataView] = useState([]);

  useEffect(() => {
    let dataVisibile = [];
    if (cuentasData && nameData) {
      cuentasData.forEach((d, indexD) => {
        dataVisibile.push({
          name: nameData[indexD],
          data: d,
        });
      });
    }
    setDataView(dataVisibile);
  }, [typeView]);

  return (
    <Chart
      options={{
        chart: {
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        xaxis: {
          categories: typeView,
        },
        legend: {
          position: 'right',
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
      }}
      series={dataView}
      type="bar"
      height={300}
    />
  );
}

export default GraficoDeBarraGastos;
