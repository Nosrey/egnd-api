import BarraDeProgreso from 'components/shared/dashboard/BarraDeProgreso';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarra from 'components/shared/dashboard/GraficoDeBarra';
import ProgresoCircular from 'components/shared/dashboard/ProgresoCircular';
import ProgresoCircularScroll from 'components/shared/dashboard/ProgresoCircularScroll';
import Total from 'components/shared/dashboard/Total';
import { MenuItem, Select } from 'components/ui';
import { año, periodo } from 'constants/dashboard.constant';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { showMultiplicacionPxQ } from 'utils/calcs';
import formatNumber from 'utils/formatTotalsValues';

function DashboardVentas() {
  const currentState = useSelector((state) => state.auth.user);
  const [yearSelected, setYearSelected] = useState({
    value: 'año 1',
    label: 'Año 1',
    year: 0,
  });
  const [periodoSelected, setPeriodoSelected] = useState({
    value: '1er semestre',
    label: '1er semestre',
    month: 6,
  });
  const [dataAssump, setDataAssump] = useState([]);
  const [infoForm, setInfoForm] = useState();
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalServ, setTotalServ] = useState(0);
  const [totalProd, setTotalProd] = useState(0);
  const [volProd, setVolProd] = useState(0);
  const [volServ, setVolServ] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalsCacr, setTotalsCacr] = useState();
  const [newClients, setNewClients] = useState(0);

  const selectYear = (event) => {
    setYearSelected(event);
  };

  const selectPeriodo = (event) => {
    setPeriodoSelected(event);
  };

  const calcTotals = () => {
    let tot = 0;
    let totProd = 0;
    let totServ = 0;
    let superTotal = 0;
    if (infoForm) {
      Object.values(infoForm).map((m) => {
        m.map((p) => {
          p.productos.map((o) => {
            o.años.map((a, indexY) => {
              superTotal += Number(a.ventasTotal);
              if (yearSelected.year || yearSelected.year === 0) {
                MONTHS.map((s, indexM) => {
                  if (yearSelected.year === indexY) {
                    if (periodoSelected.month || periodoSelected.month === 0) {
                      if (periodoSelected.month === 0) {
                        if (indexM === 0) {
                          if (o.type === 'producto') {
                            totProd += Number(a.volMeses[MONTHS[indexM]]);
                          } else {
                            totServ += Number(a.volMeses[MONTHS[indexM]]);
                          }
                          tot += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      } else if (periodoSelected.month === 6) {
                        if (indexM < 6) {
                          if (o.type === 'producto') {
                            totProd += Number(a.volMeses[MONTHS[indexM]]);
                          } else {
                            totServ += Number(a.volMeses[MONTHS[indexM]]);
                          }
                          tot += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      } else if (periodoSelected.month === 4) {
                        if (indexM < 4) {
                          if (o.type === 'producto') {
                            totProd += Number(a.volMeses[MONTHS[indexM]]);
                          } else {
                            totServ += Number(a.volMeses[MONTHS[indexM]]);
                          }
                          tot += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      } else if (periodoSelected.month === 12) {
                        if (indexM > 5) {
                          if (o.type === 'producto') {
                            totProd += Number(a.volMeses[MONTHS[indexM]]);
                          } else {
                            totServ += Number(a.volMeses[MONTHS[indexM]]);
                          }
                          tot += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    } else {
                      if (o.type === 'producto') {
                        totProd += Number(a.ventasTotal);
                      } else {
                        totServ += Number(a.ventasTotal);
                      }
                      tot += Number(a.ventasTotal);
                    }
                  }
                });
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
      selectYear({ value: 'año 1', label: 'Año 1', year: 0 });
      selectPeriodo({
        value: '1er semestre',
        label: '1er semestre',
        month: 6,
      });
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
                MONTHS.map((m, indexM) => {
                  if (periodoSelected.month || periodoSelected.month === 0) {
                    if (periodoSelected.month === 0) {
                      if (indexM === 0) {
                        if (p.type === 'producto') {
                          totV += Number(a.volMeses[MONTHS[indexM]]);
                        } else {
                          totS += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    } else if (periodoSelected.month === 4) {
                      if (indexM < 4) {
                        if (p.type === 'producto') {
                          totV += Number(a.volMeses[MONTHS[indexM]]);
                        } else {
                          totS += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    } else if (periodoSelected.month === 6) {
                      if (indexM < 6) {
                        if (p.type === 'producto') {
                          totV += Number(a.volMeses[MONTHS[indexM]]);
                        } else {
                          totS += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    } else if (periodoSelected.month === 12) {
                      if (indexM > 5) {
                        if (p.type === 'producto') {
                          totV += Number(a.volMeses[MONTHS[indexM]]);
                        } else {
                          totS += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    }
                  } else if (p.type === 'producto') {
                    totV += Number(a.volTotal);
                  } else {
                    totS += Number(a.volTotal);
                  }
                });
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

  const calcNewClients = (data, indexY, indexMes, indexChannel, indexProd) =>
    Number(
      formatNumber(
        data.años[indexY].volMeses[MONTHS[indexMes]] /
          dataAssump.canales[indexChannel].items[indexProd].volumen -
          (data.años[indexY].volMeses[MONTHS[indexMes - 1]] /
            dataAssump.canales[indexChannel].items[indexProd].volumen -
            ((data.años[indexY].volMeses[MONTHS[indexMes - 1]] /
              dataAssump.canales[indexChannel].items[indexProd].volumen) *
              dataAssump.churns[indexChannel].items[indexProd]
                .porcentajeChurn) /
              100),
      ),
    );

  const calcClentes = () => {
    let tot = 0;
    let newC = 0;
    if (infoForm && dataAssump) {
      Object.values(infoForm).map((d) => {
        d.map((i, indexChannel) => {
          i.productos.map((p, indexProd) => {
            p.años.map((a, indexY) => {
              if (yearSelected.year || yearSelected.year === 0) {
                if (yearSelected.year === indexY) {
                  MONTHS.map((o, indexMes) => {
                    if (periodoSelected.month || periodoSelected.month === 0) {
                      if (periodoSelected.month === 0) {
                        tot += 0;
                      } else if (periodoSelected.month === 4) {
                        if (indexMes === 3) {
                          tot += Math.floor(
                            a.volMeses[MONTHS[indexMes]] /
                              dataAssump.canales[indexChannel].items[indexProd]
                                .volumen,
                          );
                        }
                        if (indexMes < 4) {
                          newC +=
                            indexMes === 0
                              ? 0
                              : calcNewClients(
                                  p,
                                  indexY,
                                  indexMes,
                                  indexChannel,
                                  indexProd,
                                );
                        }
                      } else if (periodoSelected.month === 6) {
                        if (indexMes === 5) {
                          tot += Math.floor(
                            a.volMeses[MONTHS[indexMes]] /
                              dataAssump.canales[indexChannel].items[indexProd]
                                .volumen,
                          );
                        }
                        if (indexMes < 6) {
                          newC +=
                            indexMes === 0
                              ? 0
                              : calcNewClients(
                                  p,
                                  indexY,
                                  indexMes,
                                  indexChannel,
                                  indexProd,
                                );
                        }
                      } else if (periodoSelected.month === 12) {
                        if (indexMes === 11) {
                          tot += Math.floor(
                            a.volMeses[MONTHS[indexMes]] /
                              dataAssump.canales[indexChannel].items[indexProd]
                                .volumen,
                          );
                        }
                        if (indexMes > 5) {
                          newC +=
                            indexMes === 0
                              ? 0
                              : calcNewClients(
                                  p,
                                  indexY,
                                  indexMes,
                                  indexChannel,
                                  indexProd,
                                );
                        }
                      }
                    } else {
                      if (indexMes === 11) {
                        tot += Math.floor(
                          a.volMeses[MONTHS[indexMes]] /
                            dataAssump.canales[indexChannel].items[indexProd]
                              .volumen,
                        );
                      }
                      newC +=
                        indexMes === 0
                          ? 0
                          : calcNewClients(
                              p,
                              indexY,
                              indexMes,
                              indexChannel,
                              indexProd,
                            );
                    }
                  });
                }
              } else {
                MONTHS.map((o, indexMes) => {
                  if (indexMes === 11) {
                    tot +=
                      a.volMeses[MONTHS[indexMes]] /
                      dataAssump.canales[indexChannel].items[indexProd].volumen;
                  }
                  newC +=
                    indexMes === 0
                      ? 0
                      : calcNewClients(
                          p,
                          indexY,
                          indexMes,
                          indexChannel,
                          indexProd,
                        );
                });
              }
            });
          });
        });
      });
    }
    setTotalClients(tot);
    setNewClients(newC);
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
  }, [yearSelected, periodoSelected]);

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
              value={yearSelected}
              onChange={selectYear}
            >
              {año.map((a) => (
                <MenuItem key={a.value} value={a.value}>
                  {a.label}
                </MenuItem>
              ))}
            </Select>
            {yearSelected.value !== 'todo' && (
              <Select
                className="w-[12%]"
                placeholder="Periodo"
                options={periodo}
                value={periodoSelected}
                onChange={selectPeriodo}
              >
                {periodo.map((a) => (
                  <MenuItem key={a.value} value={a.value}>
                    {a.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
          <div className="mt-[30px] mb-[30px]">
            <Total title="Total de Ventas" data={totalVentas} />
          </div>
          <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
            <CardNumerica
              type="default"
              title="Venta de Productos"
              hasCurrency
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
              hasCurrency
              cantidad={volProd ? totalProd / volProd : 0}
            />
            <CardNumerica
              type="default"
              title="Venta de Servicios"
              hasCurrency
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
              hasCurrency
              cantidad={volServ ? totalServ / volServ : 0}
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
                <GraficoDeBarra
                  data={infoForm}
                  yearSelected={yearSelected}
                  periodoSelected={periodoSelected}
                />
              </div>
              <div className="w-[50%]">
                <h5 className="mb-[30px]">Distribución de Ventas por País</h5>
                <BarraDeProgreso
                  data={infoForm}
                  totalVentas={totalVentas}
                  selectYear={yearSelected}
                  periodoSelected={periodoSelected}
                />
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
                      (1 / (yearSelected.year + 1) - 1)
                    ).toFixed(2)}
                  />
                )}
            </div>
          )}
          <h5 className="mb-[20px]">Clientes</h5>
          <div className="grid grid-cols-3 gap-[20px] mb-[40px]">
            <CardNumerica
              title="Clientes Nuevos"
              type="clear"
              cantidad={newClients}
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
              hasCurrency
              cantidad={totalVentas / totalClients}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardVentas;
