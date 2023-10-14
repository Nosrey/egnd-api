// import { Progress } from 'components/ui';
import { Progress } from 'components/ui';
import { useEffect, useState } from 'react';

function BarraDeProgresoGastos({
  data,
  nameCuentas,
  totalVentas,
  periodoSelected,
  yearSelected,
}) {
  const [dataView, setDataView] = useState([]);

  useEffect(() => {
    let cuentas = [];
    data.forEach((d, indexD) => {
      cuentas.push({
        name: nameCuentas[indexD],
        data: d,
      });
    });
    setDataView(cuentas);
  }, [periodoSelected, yearSelected]);

  dataView.sort((a1, a2) => {
    if (a1.data > a2.data) {
      return -1;
    }
    if (a1.total < a2.data) {
      return 1;
    }
    return 0;
  });

  return (
    <div>
      {dataView.map((cuenta) => {
        <div>
          <span className="cursor-default">{cuenta.name.toUpperCase()}</span>
          <Progress
            percent={((cuenta.data * 100) / totalVentas).toFixed(0)}
            color="amber-400"
          />
        </div>;
      })}
    </div>
  );
}

export default BarraDeProgresoGastos;
