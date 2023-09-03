import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

function GraficoDeBarraHeadcountThree({
  typeView,
  dataHeadcount,
  periodoSelected,
  yearSelected,
}) {
  const [dataView, setDataView] = useState([]);
  useEffect(() => {
    let head = [];
    dataHeadcount.map((d, indexD) => {
      Object.values(d).map((p, indexP) => {
        if (p.visible) {
          p.puestos.map((m) => {
            m.años.map((a, indexY) => {
              MONTHS.map((n, indexM) => {
                if (yearSelected.year || yearSelected.year === 0) {
                  if (yearSelected.year === indexY) {
                    if (periodoSelected.month || periodoSelected.month === 0) {
                      if (periodoSelected.month === 0) {
                        if (indexM === 0) {
                          if (head[indexM] || head[indexM] === 0) {
                            head[indexM] += a.volMeses[MONTHS[indexM]];
                          } else {
                            head.push(0);
                            head[indexM] += a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                      if (periodoSelected.month === 4) {
                        if (indexM < 4) {
                          if (head[indexM] || head[indexM] === 0) {
                            head[indexM] += a.volMeses[MONTHS[indexM]];
                          } else {
                            head.push(0);
                            head[indexM] += a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                      if (periodoSelected.month === 6) {
                        if (indexM < 6) {
                          if (head[indexM] || head[indexM] === 0) {
                            head[indexM] += a.volMeses[MONTHS[indexM]];
                          } else {
                            head.push(0);
                            head[indexM] += a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                      if (periodoSelected.month === 12) {
                        if (indexM > 5) {
                          if (head[indexM - 6] || head[indexM - 6] === 0) {
                            head[indexM - 6] += a.volMeses[MONTHS[indexM]];
                          } else {
                            head.push(0);
                            head[indexM - 6] += a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                    } else if (head[indexM] || head[indexM] === 0) {
                      head[indexM] += a.volMeses[MONTHS[indexM]];
                    } else {
                      head.push(0);
                      head[indexM] += a.volMeses[MONTHS[indexM]];
                    }
                  }
                } else if (head[indexY] || head[indexY] === 0) {
                  head[indexY] += a.volMeses[MONTHS[indexM]];
                } else {
                  head.push(0);
                  head[indexY] += a.volMeses[MONTHS[indexM]];
                }
              });
            });
          });
        }
      });
    });
    setDataView(head);
  }, [yearSelected, periodoSelected]);

  const data = [
    {
      name: 'Cantidad de RRHH',
      data: dataView,
    },
  ];
  return (
    <Chart
      options={{
        chart: {
          type: 'line',
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
          width: 3,
        },
        colors: ["#10B981"],
        xaxis: {
          categories: typeView,
        },
      }}
      series={data}
      height={300}
    />
  );
}

export default GraficoDeBarraHeadcountThree;
