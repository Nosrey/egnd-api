/* eslint-disable object-shorthand */
import {
  firstSem,
  month,
  oneMonth,
  secondSem,
  trimn,
  year,
} from 'constants/dashboard.constant';
import { BASIC_EMPTY, EMPTY_TOTALES, MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
// import { COLORS } from '../../../configs/chart.config';
let totals = JSON.parse(JSON.stringify(EMPTY_TOTALES));
let superTotals = JSON.parse(JSON.stringify(BASIC_EMPTY));

function GraficoDeBarra({ data, yearSelected, periodoSelected }) {
  const [view, setView] = useState();
  const [typeView, setTypeView] = useState(year);
  const currency = useSelector((state) => state.auth.user.currency);

  useEffect(() => {
    let pSelMonth = [0];
    let pFirstSem = [0, 0, 0, 0, 0, 0];
    let pSecondSem = [0, 0, 0, 0, 0, 0];
    let pFirstTrim = [0, 0, 0];
    Object.values(data).map((d) => {
      d.map((m) => {
        m.productos.map((p) => {
          p.años.map((a, indexY) => {
            MONTHS.map((u, indexM) => {
              if (yearSelected.year || yearSelected.year === 0) {
                if (periodoSelected.month || periodoSelected.month === 0) {
                  if (periodoSelected.month === 0) {
                    if (indexM === 0 && yearSelected.year === indexY) {
                      pSelMonth[indexM] += Number(a.volMeses[MONTHS[indexM]]);
                      setTypeView(oneMonth);
                      setView(pSelMonth);
                    }
                  } else if (periodoSelected.month === 4) {
                    if (indexM < 4 && yearSelected.year === indexY) {
                      pFirstTrim[indexM] += Number(a.volMeses[MONTHS[indexM]]);
                      setTypeView(trimn);
                      setView(pFirstTrim);
                    }
                  } else if (periodoSelected.month === 6) {
                    if (indexM < 6 && yearSelected.year === indexY) {
                      pFirstSem[indexM] += Number(a.volMeses[MONTHS[indexM]]);
                      setTypeView(firstSem);

                      setView(pFirstSem);
                    }
                  } else if (periodoSelected.month === 12) {
                    if (
                      indexM > 5 &&
                      indexM < 12 &&
                      yearSelected.year === indexY
                    ) {
                      pSecondSem[indexM - 6] += Number(
                        a.volMeses[MONTHS[indexM]],
                      );
                      setTypeView(secondSem);
                      setView(pSecondSem);
                    }
                  }
                }
                if (!periodoSelected.month && yearSelected.year) {
                  totals[indexY][indexM] += Number(a.volMeses[MONTHS[indexM]]);
                  setView(totals[yearSelected.year]);
                  setTypeView(month);
                }
              } else {
                setView(superTotals);
                setTypeView(year);
              }
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
  }, [yearSelected, periodoSelected]);

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
          data: view,
          name: 'Total de ventas',
        },
      ]}
      type="bar"
      height={300}
    />
  );
}

export default GraficoDeBarra;
