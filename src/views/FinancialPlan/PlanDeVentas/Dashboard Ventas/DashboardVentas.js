import BarraDeProgreso from 'components/shared/dashboard/BarraDeProgreso';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarra from 'components/shared/dashboard/GraficoDeBarra';
import ProgresoCircular from 'components/shared/dashboard/ProgresoCircular';
import ProgresoCircularScroll from 'components/shared/dashboard/ProgresoCircularScroll';
import SelectOptions from 'components/shared/dashboard/SelectOptions';
import Total from 'components/shared/dashboard/Total';
import { MenuItem, Select } from 'components/ui';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { showMultiplicacionPxQ } from 'utils/calcs';

const año = [
  { value: 'año 1', label: 'Año 1', year: 0 },
  { value: 'año 2', label: 'Año 2', year: 1 },
  { value: 'año 3', label: 'Año 3', year: 2 },
  { value: 'año 4', label: 'Año 4', year: 3 },
  { value: 'año 5', label: 'Año 5', year: 4 },
  { value: 'año 6', label: 'Año 6', year: 5 },
  { value: 'año 7', label: 'Año 7', year: 6 },
  { value: 'año 8', label: 'Año 8', year: 7 },
  { value: 'año 9', label: 'Año 9', year: 8 },
  { value: 'año 10', label: 'Año 10', year: 9 },
  { value: 'todo', label: 'Todo' },
];

const periodo = [
  { value: '1er mes', label: '1er mes' },
  { value: '1er trimestre', label: '1er trimestre' },
  { value: '1er semestre', label: '1er semestre' },
  { value: '2do semestre', label: '2do semestre' },
  { value: 'todo el año', label: 'Todo el año' },
];
const data = [
  {
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380, 320],
  },
];

const churnProducto = [
  { nombre: 'Producto A', numero: 1 },
  { nombre: 'Producto B', numero: 2 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },
  { nombre: 'Producto C', numero: 3 },

  // ...
];

const paisesData = [
  { name: 'Country A', sales: 100 },
  { name: 'Country B', sales: 200 },
  { name: 'Country C', sales: 300 },
  // ...
];

function DashboardVentas() {
  const currentState = useSelector((state) => state.auth.user);
  const [yearSelected, setYearSelected] = useState({ value: '' });
  const [dataAssump, setDataAssump] = useState([]);
  const [infoForm, setInfoForm] = useState();
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalServ, setTotalServ] = useState(0);
  const [totalProd, setTotalProd] = useState(0);
  const [volProd, setVolProd] = useState(0);
  const [volServ, setVolServ] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalsCacr, setTotalsCacr] = useState();

  const selectYear = (event) => {
    setYearSelected(event);
  };

  const calcTotals = () => {
    let tot = 0;
    let totProd = 0;
    let totServ = 0;
    if (infoForm) {
      Object.values(infoForm).map((m) => {
        m.map((p) => {
          p.productos.map((o) => {
            o.años.map((a, indexY) => {
              if (yearSelected.year || yearSelected.year === 0) {
                if (yearSelected.year === indexY) {
                  if (o.type === 'producto') {
                    totProd += Number(a.ventasTotal);
                  } else {
                    totServ += Number(a.ventasTotal);
                  }
                  tot += Number(a.ventasTotal);
                }
              } else {
                if (o.type === 'producto') {
                  totProd += Number(a.ventasTotal);
                } else {
                  totServ += Number(a.ventasTotal);
                }
                tot += Number(a.ventasTotal);
              }
            });
          });
        });
      });

      setTotalVentas(tot);
      setTotalProd(totProd);
      setTotalServ(totServ);
    } else {
      selectYear({ value: '' });
    }
  };

  const calcVols = (dataVolumen) => {
    let totV = 0;
    let totS = 0;
    dataVolumen.map((d) => {
      d.stats.map((s) => {
        s.productos.map((p) => {
          p.años.map((a, indexY) => {
            if (yearSelected.year || yearSelected.year === 0) {
              if (yearSelected.year === indexY) {
                if (p.type === 'producto') {
                  totV += Number(a.volTotal);
                } else {
                  totS += Number(a.volTotal);
                }
              }
            } else if (p.type === 'producto') {
              totV += Number(a.volTotal);
            } else {
              totS += Number(a.volTotal);
            }
          });
        });
      });
    });

    setVolProd(totV);
    setVolServ(totS);
  };

  const calcClentes = () => {
    let tot = 0;
    if (infoForm && dataAssump) {
      Object.values(infoForm).map((d) => {
        d.map((i, indexChannel) => {
          i.productos.map((p, indexProd) => {
            p.años.map((a, indexY) => {
              MONTHS.map((o, indexMes) => {
                tot +=
                  a.volMeses[MONTHS[11]] /
                  dataAssump.canales[indexChannel].items[indexProd].volumen;
              });
            });
          });
        });
      });
    }
    setTotalClients(tot);
  };

  const calcCacr = (dataVolumen) => {
    let tot = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    dataVolumen.map((d) => {
      d.stats.map((s) => {
        s.productos.map((p) => {
          p.años.map((a, indexY) => {
            tot[indexY] += Number(a.volTotal);
          });
        });
      });
    });

    setTotalsCacr(tot);
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data.assumptionData[0]) {
          setDataAssump(data.assumptionData[0]);
        }
        if (data?.volumenData.length !== 0 && data?.precioData.length !== 0) {
          // tengo infoForm vol y precio precargada
          const datosPrecargados = {};
          let dataVentas = showMultiplicacionPxQ(
            data?.volumenData.sort((a, b) =>
              a.countryName.localeCompare(b.countryName),
            ),
            data?.precioData.sort((a, b) =>
              a.countryName.localeCompare(b.countryName),
            ),
          );
          for (let i = 0; i < dataVentas.length; i++) {
            datosPrecargados[dataVentas[i].countryName] = dataVentas[i].stats;
          }
          setInfoForm(() => ({ ...datosPrecargados }));
          calcTotals();
          calcVols(data?.volumenData);
          calcCacr(data?.volumenData);
          calcClentes();
        }
      })
      .catch((error) => console.error(error));
  }, [yearSelected]);

  console.log('sel', yearSelected);

  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Dashboard de Ventas</h4>
        <span>Plan de Ventas</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="px-4 py-5">
          <div className="flex justify-end gap-[20px]">
            <Select
              className="w-[12%]"
              placeholder="Año"
              options={año}
              onChange={selectYear}
            >
              {año.map((a) => (
                <MenuItem key={a.value} value={a.value}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
            {yearSelected.value !== 'todo' && (
              <SelectOptions options={periodo} placehol="Periodo" />
            )}
          </div>
          <div className="mt-[30px] mb-[30px]">
            <Total title="Total de Ventas" data={totalVentas} />
          </div>
          <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
            <CardNumerica
              type="default"
              title="Venta de Productos"
              cantidad={totalProd}
            />
            <CardNumerica
              type="default"
              title="Cantidad de productos"
              cantidad={volProd}
            />
            <CardNumerica
              type="default"
              title="Ticket medio por Producto"
              cantidad={totalProd / volProd}
            />
            <CardNumerica
              type="default"
              title="Venta de Servicios"
              cantidad={totalServ}
            />
            <CardNumerica
              type="default"
              title="Volumen de Servicios"
              cantidad={volServ}
            />
            <CardNumerica
              type="default"
              title="Ticket medio por Servicio"
              cantidad={totalServ / volServ}
            />
          </div>
          {infoForm && (
            <div className="flex justify-center gap-[50px] mt-[50px] mb-[40px]">
              <div className="w-[50%]">
                {yearSelected.value === 'todo' ? (
                  <h5 className="mb-[30px]">Distribución de Ventas por Año</h5>
                ) : (
                  <h5 className="mb-[30px]">Distribución de Ventas por Mes</h5>
                )}
                <GraficoDeBarra data={infoForm} selected={yearSelected} />
              </div>
              <div className="w-[50%]">
                <h5 className="mb-[30px]">Distribución de Ventas por País</h5>
                <BarraDeProgreso data={infoForm} totalVentas={totalVentas} />
              </div>
            </div>
          )}
          {infoForm && (
            <div className="flex justify-center gap-[50px] mb-[40px]">
              {dataAssump.length !== 0 && (
                <ProgresoCircularScroll
                  title="Churn Promedio"
                  churnProducto={dataAssump}
                />
              )}
              {yearSelected.value !== 'año 1' &&
                yearSelected.value !== '' &&
                yearSelected.value !== 'todo' && (
                  <ProgresoCircular
                    title="CAGR"
                    data={(
                      (totalsCacr[yearSelected.year] / totalsCacr[0]) **
                      (1 / 5 - 1)
                    ).toFixed(2)}
                  />
                )}
            </div>
          )}
          <h5 className="mb-[20px]">Clientes</h5>
          <div className="grid grid-cols-3 gap-[20px] mb-[40px]">
            <CardNumerica
              title="Clientes Nuevos"
              cantidad={763}
              data={infoForm}
            />
            <CardNumerica
              type="totalC"
              title="Clientes Totales"
              cantidad={totalClients}
            />
            <CardNumerica
              type="ticket"
              title="Ticket por cliente"
              cantidad={totalVentas / totalClients}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardVentas;
