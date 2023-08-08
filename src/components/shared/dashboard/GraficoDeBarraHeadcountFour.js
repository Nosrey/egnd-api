import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

function GraficoDeBarraHeadcountFour({
  typeView,
  ventas,
  dataHeadcount,
  periodoSelected,
  yearSelected,
}) {
  const [dataView, setDataView] = useState([]);

  const calcFte = (totalVentas, cantPers) => {
    let div = 0;

    if (periodoSelected.month || periodoSelected.month === 0) {
      if (periodoSelected.month === 0) {
        return totalVentas / cantPers;
      }
      if (periodoSelected.month === 4) {
        div = Math.floor(cantPers / 4);
        return totalVentas / div;
      }
      if (periodoSelected.month === 6 || periodoSelected.month === 12) {
        div = Math.floor(cantPers / 6);
        return totalVentas / div;
      }
    } else {
      div = Math.floor(cantPers / 12);
      return totalVentas / div;
    }
  };

  useEffect(() => {
    let head = [];
    let fte = [];
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
                          if (fte[indexM] || fte[indexM] === 0) {
                            fte[indexM] +=
                              ventas[indexM] / a.volMeses[MONTHS[indexM]];
                          } else {
                            fte.push(0);
                            fte[indexM] +=
                              ventas[indexM] / a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                      if (periodoSelected.month === 4) {
                        console.log(
                          ventas[(indexM, a.volMeses[MONTHS[indexM]])],
                        );
                        if (indexM < 4) {
                          if (fte[indexM] || fte[indexM] === 0) {
                            fte[indexM] +=
                              ventas[indexM] / a.volMeses[MONTHS[indexM]];
                          } else {
                            fte.push(0);
                            // fte[indexM] +=
                            //   ventas[indexM] / a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                      if (periodoSelected.month === 6) {
                        if (fte[indexM] || fte[indexM] === 0) {
                          fte[indexM] +=
                            ventas[indexM] / a.volMeses[MONTHS[indexM]];
                        } else {
                          fte.push(0);
                          fte[indexM] +=
                            ventas[indexM] / a.volMeses[MONTHS[indexM]];
                        }
                      }

                      if (periodoSelected.month === 12) {
                        if (indexM > 5) {
                          if (fte[indexM - 6] || fte[indexM] === 0) {
                            fte[indexM - 6] +=
                              ventas[indexM] / a.volMeses[MONTHS[indexM]];
                          } else {
                            fte.push(0);
                            fte[indexM - 6] +=
                              ventas[indexM] / a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                    }
                  }
                } else if (fte[indexY] || fte[indexY] === 0) {
                  fte[indexY] += ventas[indexY] / a.volMeses[MONTHS[indexM]];
                } else {
                  fte.push(0);
                  fte[indexY] += ventas[indexY] / a.volMeses[MONTHS[indexM]];
                }
              });
            });
          });
        }
      });
    });

    setDataView(fte);
  }, [yearSelected, periodoSelected]);

  const data = [
    {
      name: 'Cantidad de Personas',
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
        // colors: [COLOR_2],
        xaxis: {
          categories: typeView,
        },
      }}
      series={data}
      height={300}
    />
  );
}

export default GraficoDeBarraHeadcountFour;
