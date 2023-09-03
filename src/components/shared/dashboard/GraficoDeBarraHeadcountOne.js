import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

function GraficoDeBarraHeadcountOne({
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
                            h.data[indexM] += a.volMeses[MONTHS[indexM]];
                          } else {
                            h.data.push(0);
                            h.data[indexM] += a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                      if (periodoSelected.month === 4) {
                        if (indexM < 4) {
                          if (h.data[indexM] || h.data[indexM] === 0) {
                            h.data[indexM] += a.volMeses[MONTHS[indexM]];
                          } else {
                            h.data.push(0);
                            h.data[indexM] += a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                      if (periodoSelected.month === 6) {
                        if (indexM < 6) {
                          if (h.data[indexM] || h.data[indexM] === 0) {
                            h.data[indexM] += a.volMeses[MONTHS[indexM]];
                          } else {
                            h.data.push(0);
                            h.data[indexM] += a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                      if (periodoSelected.month === 12) {
                        if (indexM > 5) {
                          if (h.data[indexM - 6] || h.data[indexM - 6] === 0) {
                            h.data[indexM - 6] += a.volMeses[MONTHS[indexM]];
                          } else {
                            h.data.push(0);
                            h.data[indexM - 6] += a.volMeses[MONTHS[indexM]];
                          }
                        }
                      }
                    } else if (h.data[indexM] || h.data[indexM] === 0) {
                      h.data[indexM] += a.volMeses[MONTHS[indexM]];
                    } else {
                      h.data.push(0);
                      h.data[indexM] += a.volMeses[MONTHS[indexM]];
                    }
                  }
                } else if (h.data[indexY] || h.data[indexY] === 0) {
                  h.data[indexY] += a.volMeses[MONTHS[indexM]];
                } else {
                  h.data.push(0);
                  h.data[indexY] += a.volMeses[MONTHS[indexM]];
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

  const formatDataValues = (info) => {
    const data = [...info]
    const sufijos = {
      0: '',
      3: 'K',
      6: 'M',
      9: 'B',
      12: 'T',
      15: 'Qa',
    };
    for (let i = 0; i < data.length; i++) {
      // Itera sobre cada número en la propiedad 'data' del objeto
      for (let j = 0; j < data[i].data.length; j++) {
          // Convierte el número en una cadena (string)
          // data[i].data[j] = data[i].data[j].toString();
          let num;
          if (typeof data[i].data[j] === 'string') {
            num = parseInt(data[i].data[j].replace(/\./g, ''));
          } else {
            num = data[i].data[j];
          }

          let exp = 0;

          while (num >= 1000 && exp < 15) {
            num /= 1000;
            exp += 3;
          }

          // Formatear el número con dos decimales si es igual o mayor a 1000
          const numeroFormateado = exp >= 3 ? num.toFixed(2) : num.toFixed(0);
          data[i].data[j] = `${numeroFormateado} ${sufijos[exp]}`
      }
    }

    return data;
  }

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
    </div>
  );
}

export default GraficoDeBarraHeadcountOne;
