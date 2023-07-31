import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarraDos from 'components/shared/dashboard/GraficoDeBarraDos';
import Total from 'components/shared/dashboard/Total';
import { MenuItem, Select } from 'components/ui';
import { año, periodo } from 'constants/dashboard.constant';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { resolveResul } from 'services/TotalProductsService';

function DashboardCostos() {
  const [totalCostos, setTotalCostos] = useState(0);
  const [totalProd, setTotalProd] = useState(0);
  const [volProd, setVolProd] = useState(0);
  const [canalesOptions, setCanalesOptions] = useState();
  const [paisesOptions, setPaisesOptions] = useState();
  const [productosOptions, setProductosOptions] = useState();
  const [canalSelected, setCanalSelected] = useState();
  const [paisSelected, setPaisSelected] = useState();
  const [productoSelected, setProductoSelected] = useState();
  const [volServ, setVolServ] = useState(0);
  const [dataAssump, setDataAssump] = useState();
  const [totalServ, setTotalServ] = useState(0);
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

  const selectYear = (event) => {
    setYearSelected(event);
  };

  const selectPeriodo = (event) => {
    setPeriodoSelected(event);
  };

  const selecOptions = (option, value) => {
    switch (option) {
      case 'pais':
        setPaisSelected(value);
        console.log('pais', value);
        break;
      case 'canal':
        setCanalSelected(value);
        console.log('canal', value);
        break;

      case 'producto':
        setProductoSelected(value);
        console.log('producto', value);
        break;

      default:
        break;
    }
  };

  const calcCostos = (precio, volumen, comision, impuesto, cargos, costo) => {
    let tot = 0;
    tot +=
      resolveResul(precio, volumen, comision) +
      resolveResul(precio, volumen, impuesto) +
      resolveResul(precio, volumen, cargos) +
      parseInt(volumen * costo);

    return tot;
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

  const calcTotals = (volumenData, costoData, precioData) => {
    let tot = 0;
    let totProd = 0;
    let totServ = 0;

    Object.values(precioData).map((d, indexInicial) => {
      d.stats.map((s, indexStats) => {
        s.productos.map((p, indexP) => {
          p.años.map((a, indexYear) => {
            MONTHS.map((m, indexM) => {
              if (yearSelected.year || yearSelected.year === 0) {
                if (yearSelected.year === indexYear) {
                  if (periodoSelected.month || periodoSelected.month === 0) {
                    if (periodoSelected.month === 0) {
                      if (indexM === 0) {
                        if (a.type === 'producto') {
                          totProd += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        } else {
                          totServ += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        }
                        tot += calcCostos(
                          a.volMeses[m],
                          volumenData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].comision,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].impuesto,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].cargos,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                        );
                      }
                    } else if (periodoSelected.month === 4) {
                      if (indexM < 4) {
                        if (a.type === 'producto') {
                          totProd += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        } else {
                          totServ += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        }
                        tot += calcCostos(
                          a.volMeses[m],
                          volumenData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].comision,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].impuesto,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].cargos,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                        );
                      }
                    } else if (periodoSelected.month === 6) {
                      if (indexM < 6) {
                        if (a.type === 'producto') {
                          totProd += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        } else {
                          totServ += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        }
                        tot += calcCostos(
                          a.volMeses[m],
                          volumenData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].comision,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].impuesto,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].cargos,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                        );
                      }
                    } else if (periodoSelected.month === 12) {
                      if (indexM > 5) {
                        if (a.type === 'producto') {
                          totProd += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        } else {
                          totServ += calcCostos(
                            a.volMeses[m],
                            volumenData[indexInicial].stats[indexStats]
                              .productos[indexP].años[indexYear].volMeses[m],
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].comision,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].impuesto,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].cargos,
                            costoData[indexInicial].stats[indexStats].productos[
                              indexP
                            ].años[indexYear].volMeses[m],
                          );
                        }
                        tot += calcCostos(
                          a.volMeses[m],
                          volumenData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].comision,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].impuesto,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].cargos,
                          costoData[indexInicial].stats[indexStats].productos[
                            indexP
                          ].años[indexYear].volMeses[m],
                        );
                      }
                    }
                  }
                }
              } else {
                if (a.type === 'producto') {
                  totProd += calcCostos(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .comision,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .impuesto,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .cargos,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .años[indexYear].volMeses[m],
                  );
                } else {
                  totServ += calcCostos(
                    a.volMeses[m],
                    volumenData[indexInicial].stats[indexStats].productos[
                      indexP
                    ].años[indexYear].volMeses[m],
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .comision,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .impuesto,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .cargos,
                    costoData[indexInicial].stats[indexStats].productos[indexP]
                      .años[indexYear].volMeses[m],
                  );
                }
                tot += calcCostos(
                  a.volMeses[m],
                  volumenData[indexInicial].stats[indexStats].productos[indexP]
                    .años[indexYear].volMeses[m],
                  costoData[indexInicial].stats[indexStats].productos[indexP]
                    .comision,
                  costoData[indexInicial].stats[indexStats].productos[indexP]
                    .impuesto,
                  costoData[indexInicial].stats[indexStats].productos[indexP]
                    .cargos,
                  costoData[indexInicial].stats[indexStats].productos[indexP]
                    .años[indexYear].volMeses[m],
                );
              }
            });
          });
        });
      });
    });

    setTotalCostos(tot);
    setTotalProd(totProd);
    setTotalServ(totServ);
  };

  const createSelects = () => {
    let paises = [];
    let c = {};

    let canales = [];
    let p = {};

    let productos = [];
    let m = {};
    if (!dataAssump) {
      setYearSelected({
        value: 'año 1',
        label: 'Año 1',
        year: 0,
      });

      setPeriodoSelected({
        value: '1er semestre',
        label: '1er semestre',
        month: 6,
      });
    }

    if (dataAssump) {
      dataAssump.paises.map((p) => {
        c.label = p.label.toUpperCase();
        c.value = p.value;

        paises.push(p);
      });

      dataAssump.canales.map((d) => {
        p.label = d.name.toUpperCase();
        p.value = d.name;

        canales.push(p);
      });

      dataAssump.productos.map((o) => {
        m.label = o.name.toUpperCase();
        m.value = o.name;

        productos.push(m);
      });

      setProductosOptions(productos);
      setCanalesOptions(canales);
      setPaisesOptions(paises);
    }
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (
          data?.volumenData.length !== 0 &&
          data?.costoData.length !== 0 &&
          data?.precioData.length !== 0
        ) {
          calcTotals(data?.volumenData, data?.costoData, data?.precioData);
          calcVols(data?.volumenData);
        }
        if (data?.assumptionData.length !== 0) {
          setDataAssump(data?.assumptionData[0]);
          createSelects();
        }
      })
      .catch((error) => console.error(error));
  }, [yearSelected, periodoSelected]);

  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Dashboard de Costos</h4>
        <span>Costos directos</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="px-4 py-5">
          <div className="flex justify-end gap-[20px]">
            <Select
              className="w-[12%]"
              placeholder="Año"
              onChange={selectYear}
              options={año}
              value={yearSelected}
            />

            {yearSelected.value !== 'todo' && (
              <Select
                className="w-[12%]"
                placeholder="Periodo"
                options={periodo}
                onChange={selectPeriodo}
                value={periodoSelected}
              >
                {periodo.map((a) => (
                  <MenuItem key={a.value} value={a.value}>
                    {a.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
          <div className="mt-[30px] mb-[30px] cursor-default">
            <Total title="Costos Totales" data={totalCostos} />
          </div>
          <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
            <CardNumerica
              type="default"
              title="Costo total productos"
              cantidad={totalServ}
            />
            <CardNumerica
              type="default"
              title="Volumen de productos"
              cantidad={volProd}
            />
            <CardNumerica
              type="default"
              title="Costo medio por producto"
              cantidad={volProd ? totalServ / volProd : 0}
            />
            <CardNumerica
              type="default"
              title="Costo de servicios"
              cantidad={totalProd}
            />
            <CardNumerica
              type="default"
              title="Volumen de servicios"
              cantidad={volServ}
            />
            <CardNumerica
              type="default"
              title="Costo medio por servicio"
              cantidad={volServ ? totalProd / volServ : 0}
            />
          </div>
          <div className="flex justify-between items-center mt-[100px] pl-[20px]">
            <h5 className="cursor-default">
              Representación de Costos sobre Ventas
            </h5>
            <div className="flex gap-[20px]">
              <Select
                className="w-[100%]"
                placeholder="Producto"
                options={productosOptions}
                onChange={(e) => selecOptions('producto', e)}
              />

              <Select
                className="w-[100%]"
                placeholder="Canal"
                options={canalesOptions}
                onChange={(e) => selecOptions('canal', e)}
              />
              <Select
                className="w-[100%]"
                placeholder="País"
                options={paisesOptions}
                onChange={(e) => selecOptions('pais', e)}
              />
            </div>
          </div>
          {canalSelected && productoSelected && paisSelected ? (
            <div className="mt-[50px] mb-[50px]">
              <GraficoDeBarraDos />
            </div>
          ) : (
            <p>Selecciona las tres opciones</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardCostos;
