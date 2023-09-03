// import { Progress } from 'components/ui';
import { Progress } from 'components/ui';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';

function BarraDeProgresoHeadcount({
  data,
  dataHeadcount,
  totalVentas,
  yearSelected,
  periodoSelected,
}) {
  const [dataView, setDataView] = useState([]);
  useEffect(() => {
    let head = [];
    dataHeadcount.map((d, indexD) => {
      Object.values(d).map((p, indexP) => {
        if (p.visible) {
          let h = {};
          h.name = Object.keys(d)[indexP];
          h.total = 0;
          p.puestos.map((m) => {
            m.años.map((a, indexY) => {
              MONTHS.map((n, indexM) => {
                if (yearSelected.year || yearSelected.year === 0) {
                  if (yearSelected.year === indexY) {
                    if (periodoSelected.month || periodoSelected.month === 0) {
                      if (periodoSelected.month === 0) {
                        if (indexM === 0) {
                          h.total += a.volMeses[MONTHS[indexM]] * m.total;
                        }
                      }
                      if (periodoSelected.month === 4) {
                        if (indexM < 3) {
                          h.total += a.volMeses[MONTHS[indexM]] * m.total;
                        }
                      }
                      if (periodoSelected.month === 6) {
                        if (indexM < 6) {
                          h.total += a.volMeses[MONTHS[indexM]] * m.total;
                        }
                      }
                      if (periodoSelected.month === 12) {
                        if (indexM > 5) {
                          h.total += a.volMeses[MONTHS[indexM]] * m.total;
                        }
                      }
                    } else {
                      h.total += a.volMeses[MONTHS[indexM]] * m.total;
                    }
                  }
                } else {
                  h.total += a.volMeses[MONTHS[indexM]] * m.total;
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

  dataView.sort((a1, a2) => {
    if (a1.total > a2.total) {
      return -1;
    }
    if (a1.total < a2.total) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      {dataView.map((country) => (
        <div key={country.name}>
          <span>{country.name.toUpperCase()}</span>
          <Progress
            percent={((country.total * 100) / totalVentas).toFixed(0)}
            color="lime-400"
          />
        </div>
      ))}
    </div>
  );
}

export default BarraDeProgresoHeadcount;
