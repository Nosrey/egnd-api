import { month, year } from 'constants/dashboard.constant';
import { BASIC_EMPTY, EMPTY_TOTALES, MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
// import { COLORS } from '../../../configs/chart.config';
let totals = JSON.parse(JSON.stringify(EMPTY_TOTALES));
let superTotals = JSON.parse(JSON.stringify(BASIC_EMPTY));

function GraficoDeBarra({ data, selected }) {
  const [view, setView] = useState();
  const [typeView, setTypeView] = useState(year);

  useEffect(() => {
    Object.values(data).map((d) => {
      d.map((m) => {
        m.productos.map((p) => {
          p.años.map((a, indexY) => {
            MONTHS.map((u, indexM) => {
              totals[indexY][indexM] += Number(a.volMeses[MONTHS[indexM]]) / 2;
            });
          });
        });
      });
    });

    for (let i = 0; i <= 9; i++) {
      for (let j = 0; j <= 11; j++) {
        superTotals[i] += totals[i][j];
      }
    }
  }, []);

  useEffect(() => {
    if (selected.year || selected.year === 0) {
      setView(totals[selected.year]);
      setTypeView(month);
    } else {
      setView(superTotals);
      setTypeView(year);
    }
  }, [selected]);

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
          categories: typeView,
        },
      }}
      series={[{ data: view }]}
      type="bar"
      height={300}
    />
  );
}

export default GraficoDeBarra;
