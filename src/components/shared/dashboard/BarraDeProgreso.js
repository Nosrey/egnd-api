// import { Progress } from 'components/ui';
import { Progress } from 'components/ui';

function BarraDeProgreso({ data, totalVentas }) {
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
        p.años.map((a) => {
          paises[indexD].total += Number(a.ventasTotal);
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
          <Progress percent={country.total} />
        </div>
      ))}
    </div>
  );
}

export default BarraDeProgreso;
