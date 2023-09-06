// import { Progress } from 'components/ui';
import { Progress } from 'components/ui';
import { MONTHS } from 'constants/forms.constants';

function BarraDeProgresoMargenBruto({
  selectYear,
  periodoSelected,
  dataAssump,
  type,
  getMargenResult,
  infoForm,
}) {
  let total = 0;
  let totalProdServ = 0;
  let paises = [];
  let canales = [];
  let productos = [];
  let servicios = [];

  switch (type) {
    case 'pais':
      dataAssump.paises.map((d, indexD) => {
        let p = {};
        p.name = d.label;
        p.index = indexD;
        p.total = 0;
        paises.push(p);
      });
      break;
    case 'canal':
      dataAssump.canales.map((d, indexD) => {
        let p = {};
        p.name = d.name;
        p.index = indexD;
        p.total = 0;
        canales.push(p);
      });

      break;
    case 'producto':
      dataAssump.productos.map((d, indexD) => {
        if (d.type === 'producto') {
          let p = {};
          p.name = d.name;
          p.index = indexD;
          p.total = 0;
          productos.push(p);
        }
      });

      break;
    case 'servicio':
      dataAssump.productos.map((d, indexD) => {
        if (d.type === 'servicio') {
          let p = {};
          p.name = d.name;
          p.index = indexD;
          p.total = 0;
          servicios.push(p);
        }
      });

      break;
    default:
      break;
  }

  const getTotalsByParam = (
    indexPais,
    indexChannel,
    indexProduct,
    indexYear,
    indexMonth,
  ) => {
    switch (type) {
      case 'pais':
        paises[indexPais].total += getMargenResult(
          indexPais,
          indexChannel,
          indexProduct,
          indexYear,
          indexMonth,
        );
        break;
      case 'canal':
        canales[indexChannel].total += getMargenResult(
          indexPais,
          indexChannel,
          indexProduct,
          indexYear,
          indexMonth,
        );
        break;
      case 'producto':
        productos.map((d, indexD) => {
          if (d.index === indexProduct) {
            d.total += getMargenResult(
              indexPais,
              indexChannel,
              indexProduct,
              indexYear,
              indexMonth,
            );
            totalProdServ += getMargenResult(
              indexPais,
              indexChannel,
              indexProduct,
              indexYear,
              indexMonth,
            );
          }
        });

        break;
      case 'servicio':
        servicios.map((d, indexD) => {
          if (d.index === indexProduct) {
            d.total += getMargenResult(
              indexPais,
              indexChannel,
              indexProduct,
              indexYear,
              indexMonth,
            );
            totalProdServ += getMargenResult(
              indexPais,
              indexChannel,
              indexProduct,
              indexYear,
              indexMonth,
            );
          }
        });

        break;
      default:
        break;
    }
  };
  if (infoForm)
    Object.values(infoForm).map((d, indexD) => {
      d.map((o, indexChannel) => {
        o.productos.map((p, indexP) => {
          p.años.map((a, indexY) => {
            if (selectYear.year === indexY) {
              MONTHS.map((o, indexMes) => {
                if (periodoSelected.month || periodoSelected.month === 0) {
                  if (periodoSelected.month === 0) {
                    if (indexMes === 0) {
                      getTotalsByParam(
                        indexD,
                        indexChannel,
                        indexP,
                        indexY,
                        indexMes,
                      );
                      total += getMargenResult(
                        indexD,
                        indexChannel,
                        indexP,
                        indexY,
                        indexMes,
                      );
                    }
                  } else if (periodoSelected.month === 4) {
                    if (indexMes < 3) {
                      getTotalsByParam(
                        indexD,
                        indexChannel,
                        indexP,
                        indexY,
                        indexMes,
                      );
                      total += getMargenResult(
                        indexD,
                        indexChannel,
                        indexP,
                        indexY,
                        indexMes,
                      );
                    }
                  } else if (periodoSelected.month === 6) {
                    if (indexMes < 6) {
                      getTotalsByParam(
                        indexD,
                        indexChannel,
                        indexP,
                        indexY,
                        indexMes,
                      );
                      total += getMargenResult(
                        indexD,
                        indexChannel,
                        indexP,
                        indexY,
                        indexMes,
                      );
                    }
                  }
                  if (periodoSelected.month === 12) {
                    if (indexMes > 5) {
                      getTotalsByParam(
                        indexD,
                        indexChannel,
                        indexP,
                        indexY,
                        indexMes,
                      );
                      total += getMargenResult(
                        indexD,
                        indexChannel,
                        indexP,
                        indexY,
                        indexMes,
                      );
                    }
                  }
                } else {
                  getTotalsByParam(
                    indexD,
                    indexChannel,
                    indexP,
                    indexY,
                    indexMes,
                  );
                  total += getMargenResult(
                    indexD,
                    indexChannel,
                    indexP,
                    indexY,
                    indexMes,
                  );
                }
              });
            }
            if (!periodoSelected.month && selectYear.year) {
              for (let i = 0; i <= 11; i++) {
                getTotalsByParam(indexD, indexChannel, indexP, indexY, i);
                total += getMargenResult(
                  indexD,
                  indexChannel,
                  indexP,
                  indexY,
                  i,
                );
              }
            }
          });
        });
      });
    });

  const orderItems = () => {
    switch (type) {
      case 'pais':
        paises.sort((a1, a2) => {
          if (a1.total > a2.total) {
            return -1;
          }
          if (a1.total < a2.total) {
            return 1;
          }
          return 0;
        });
        break;
      case 'canal':
        canales.sort((a1, a2) => {
          if (a1.total > a2.total) {
            return -1;
          }
          if (a1.total < a2.total) {
            return 1;
          }
          return 0;
        });
        break;
      case 'producto':
        productos.sort((a1, a2) => {
          if (a1.total > a2.total) {
            return -1;
          }
          if (a1.total < a2.total) {
            return 1;
          }
          return 0;
        });

        break;
      case 'servicio':
        servicios.sort((a1, a2) => {
          if (a1.total > a2.total) {
            return -1;
          }
          if (a1.total < a2.total) {
            return 1;
          }
          return 0;
        });
        break;
      default:
        break;
    }
  };

  orderItems();

  return (
    <div>
      {type === 'pais' &&
        paises.map((country) => (
          <div key={country.name}>
            <span className="cursor-default">{country.name.toUpperCase()}</span>
            <Progress
              percent={((country.total * 100) / total).toFixed(0)}
              color="teal-300"
            />
          </div>
        ))}
      {type === 'canal' &&
        canales.map((country) => (
          <div key={country.name}>
            <span className="cursor-default">{country.name.toUpperCase()}</span>
            <Progress
              percent={((country.total * 100) / total).toFixed(0)}
              color="violet-500"
            />
          </div>
        ))}

      {type === 'producto' &&
        productos.map((country) => (
          <div key={country.name}>
            <span>{country.name.toUpperCase()}</span>
            <Progress
              percent={
                ((country.total * 100) / totalProdServ).toFixed(0) > 100
                  ? 100
                  : ((country.total * 100) / totalProdServ).toFixed(0) < 0
                  ? 0
                  : ((country.total * 100) / totalProdServ).toFixed(0)
              }
              color="lime-300"
            />
          </div>
        ))}

      {type === 'servicio' &&
        servicios.map((country) => (
          <div key={country.name}>
            <span className="cursor-default">{country.name.toUpperCase()}</span>
            <Progress
              percent={
                ((country.total * 100) / totalProdServ).toFixed(0) > 100
                  ? 100
                  : ((country.total * 100) / totalProdServ).toFixed(0) < 0
                  ? 0
                  : ((country.total * 100) / totalProdServ).toFixed(0)
              }
              color="orange-300"
            />
          </div>
        ))}
    </div>
  );
}

export default BarraDeProgresoMargenBruto;
