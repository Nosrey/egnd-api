// import { Progress } from 'components/ui';
import { Progress } from 'components/ui';
import { MONTHS } from 'constants/forms.constants';

function BarraDeProgreso({ data, totalVentas, selectYear, periodoSelected }) {
  let paises = [];

  Object.keys(data).map((d, indexD) => {
    let p = {};
    p.name = d;
    p.index = indexD;
    p.total = 0;
    paises.push(p);
  });

  Object.values(data).map((d, indexD) => {
    d.map((o) => {
      o.productos.map((p) => {
        p.años.map((a, indexY) => {
          if (selectYear.year === indexY) {
            MONTHS.map((o, indexMes) => {
              if (periodoSelected.month || periodoSelected.month === 0) {
                if (periodoSelected.month === 0) {
                  if (indexMes === 0) {
                    paises[indexD].total += Number(
                      a.volMeses[MONTHS[indexMes]],
                    );
                  }
                } else if (periodoSelected.month === 4) {
                  if (indexMes < 4) {
                    paises[indexD].total += Number(
                      a.volMeses[MONTHS[indexMes]],
                    );
                  }
                } else if (periodoSelected.month === 6) {
                  if (indexMes < 6) {
                    paises[indexD].total += Number(
                      a.volMeses[MONTHS[indexMes]],
                    );
                  }
                }
                if (periodoSelected.month === 12) {
                  if (indexMes > 5) {
                    paises[indexD].total += Number(
                      a.volMeses[MONTHS[indexMes]],
                    );
                  }
                }
              } else {
                paises[indexD].total += Number(a.ventasTotal);
              }
            });
          }
          if (!periodoSelected.month && selectYear.year) {
            paises[indexD].total += Number(a.ventasTotal);
          }
        });
      });
    });
  });

  paises.sort((a1, a2) => {
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
      {paises.map((country) => (
        <div key={country.name}>
          <span>{country.name.toUpperCase()}</span>
          <Progress
            percent={((country.total * 100) / totalVentas).toFixed(0)}
            color="amber-400"

          />
        </div>
      ))}
    </div>
  );
}

export default BarraDeProgreso;
