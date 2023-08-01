import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

function GraficoDeBarraCosto({
  volumen,
  comision,
  cargos,
  impuesto,
  typeView,
}) {
  const currency = useSelector((state) => state.auth.user.currency);
  const data = [
    {
      name: 'Comisiones',
      data: comision,
    },
    {
      name: 'Impuestos Comerciales',
      data: impuesto,
    },
    {
      name: 'Cargas por pasarela de cobro',
      data: cargos,
    },
    {
      name: 'Volumen',
      data: volumen,
    },
  ];

  return (
    <div>
      {' '}
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
          // colors: COLORS,
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
          dataLabels: {
            enabled: true,
            formatter(value) {
              return `${currency}${value}`;
            },
          },
          xaxis: {
            categories: typeView,
          },
          yaxis: {
            labels: {
              formatter(value) {
                return `${currency}${value}`;
              },
            },
          },
          legend: {
            position: 'right',
            offsetY: 40,
          },
          fill: {
            opacity: 1,
          },
        }}
        series={data}
        type="bar"
        height={300}
      />
    </div>
  );
}

export default GraficoDeBarraCosto;
