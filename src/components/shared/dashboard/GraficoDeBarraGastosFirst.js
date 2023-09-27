/* eslint-disable object-shorthand */
import { BASIC_EMPTY, EMPTY_TOTALES } from 'constants/forms.constants';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
// import { COLORS } from '../../../configs/chart.config';
let totals = JSON.parse(JSON.stringify(EMPTY_TOTALES));
let superTotals = JSON.parse(JSON.stringify(BASIC_EMPTY));

function GraficoDeBarraGastosFirst({ typeView, dataView }) {
  const currency = useSelector((state) => state.auth.user.currency);

  return (
    <Chart
      options={{
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (value) {
            return `${currency}${value}`;
          },
        },
        xaxis: {
          categories: typeView,
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return `${currency}${value}`;
            },
          },
        },
      }}
      series={[
        {
          data: dataView,
          name: 'Total de ventas',
        },
      ]}
      type="bar"
      height={300}
    />
  );
}

export default GraficoDeBarraGastosFirst;
