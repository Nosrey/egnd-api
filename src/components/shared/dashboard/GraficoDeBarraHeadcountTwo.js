import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

function GraficoDeBarraHeadcountTwo({
  typeView,
  dataHeadcount,
  periodoSelected,
  yearSelected,
}) {
  const currency = useSelector((state) => state.auth.user.currency);
  const [dataView, setDataView] = useState([]);

  useEffect(() => {
    let head = [];
    dataHeadcount.map((d, indexD) => {
      Object.values(d).map((p, indexP) => {
        if (p.visible) {
          let h = {};
          h.name = Object.keys(d)[indexP];
          h.data = [];
          p.puestos.map((m) => {
            m.años.map((a, indexY) => {
              MONTHS.map((n, indexM) => {
                if (yearSelected.year || yearSelected.year === 0) {
                  if (yearSelected.year === indexY) {
                    if (periodoSelected.month || periodoSelected.month === 0) {
                      if (periodoSelected.month === 0) {
                        if (indexM === 0) {
                          if (h.data[indexM] || h.data[indexM] === 0) {
                            h.data[indexM] +=
                              a.volMeses[MONTHS[indexM]] * m.total;
                          } else {
                            h.data.push(0);
                            h.data[indexM] +=
                              a.volMeses[MONTHS[indexM]] * m.total;
                          }
                        }
                      }
                      if (periodoSelected.month === 4) {
                        if (indexM < 4) {
                          if (h.data[indexM] || h.data[indexM] === 0) {
                            h.data[indexM] +=
                              a.volMeses[MONTHS[indexM]] * m.total;
                          } else {
                            h.data.push(0);
                            h.data[indexM] +=
                              a.volMeses[MONTHS[indexM]] * m.total;
                          }
                        }
                      }
                      if (periodoSelected.month === 6) {
                        if (indexM < 6) {
                          if (h.data[indexM] || h.data[indexM] === 0) {
                            h.data[indexM] +=
                              a.volMeses[MONTHS[indexM]] * m.total;
                          } else {
                            h.data.push(0);
                            h.data[indexM] +=
                              a.volMeses[MONTHS[indexM]] * m.total;
                          }
                        }
                      }
                      if (periodoSelected.month === 12) {
                        if (indexM > 5) {
                          if (h.data[indexM - 6] || h.data[indexM - 6] === 0) {
                            h.data[indexM - 6] +=
                              a.volMeses[MONTHS[indexM]] * m.total;
                          } else {
                            h.data.push(0);
                            h.data[indexM - 6] +=
                              a.volMeses[MONTHS[indexM]] * m.total;
                          }
                        }
                      }
                    } else if (h.data[indexM] || h.data[indexM] === 0) {
                      h.data[indexM] += a.volMeses[MONTHS[indexM]] * m.total;
                    } else {
                      h.data.push(0);
                      h.data[indexM] += a.volMeses[MONTHS[indexM]] * m.total;
                    }
                  }
                } else if (h.data[indexY] || h.data[indexY] === 0) {
                  h.data[indexY] += a.volMeses[MONTHS[indexM]] * m.total;
                } else {
                  h.data.push(0);
                  h.data[indexY] += a.volMeses[MONTHS[indexM]] * m.total;
                }
              });
            });
          });
          head.push(h);
        }
      });
    });
    setDataView(head);
  }, [periodoSelected, yearSelected]);

  return (
    <div>
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
        series={dataView}
        type="bar"
        height={300}
      />
    </div>
  );
}

export default GraficoDeBarraHeadcountTwo;
