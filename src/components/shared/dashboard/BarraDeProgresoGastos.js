// import { Progress } from 'components/ui';
import { Progress } from 'components/ui';

function BarraDeProgresoGastos({
  data,
  nameCuentas,
  totalVentas,
  selectYear,
  periodoSelected,
}) {
  let cuentas = [];

  if (data && nameCuentas) {
    data.forEach((d, indexD) => {
      cuentas.push({
        name: nameCuentas[indexD],
        data: d,
      });
    });

    cuentas.sort((a1, a2) => {
      if (a1.data > a2.data) {
        return -1;
      }
      if (a1.total < a2.data) {
        return 1;
      }
      return 0;
    });
  }

  console.log('c', cuentas);
  return (
    <div>
      {cuentas.map((country, indexC) => {
        <div key={country.name}>
          <span className="cursor-default">{country.name.toUpperCase()}</span>
          <Progress
            // percent={((country.data * 100) / totalVentas).toFixed(0)}
            percent={100}
            color="amber-400"
          />
        </div>;
      })}
    </div>
  );
}

export default BarraDeProgresoGastos;
