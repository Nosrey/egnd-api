import BarraDeProgresoGastos from 'components/shared/dashboard/BarraDeProgresoGastos';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarraGastos from 'components/shared/dashboard/GraficoDeBarraGastos';
import GraficoDeBarraGastosFirst from 'components/shared/dashboard/GraficoDeBarraGastosFirst';
import ProgresoCircular from 'components/shared/dashboard/ProgresoCircular';
import Total from 'components/shared/dashboard/Total';
import MySpinner from 'components/shared/loaders/MySpinner';
import { MenuItem, Select } from 'components/ui';
import {
  año,
  firstSem,
  month,
  oneMonth,
  periodo,
  secondSem,
  trimn,
  year,
} from 'constants/dashboard.constant';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { showMultiplicacionPxQ } from 'utils/calcs';

function DashboardGastos() {
  const [showLoader, setShowLoader] = useState(true);
  const currentState = useSelector((state) => state.auth.user);
  const [total, setTotal] = useState(0);
  const [totalMarkenting, setTotalMarkenting] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalsView, setTotalsView] = useState();
  const [infoForm, setInfoForm] = useState();
  const [infoFormVentas, setInfoFormVentas] = useState();
  const [cantPers, setCantPers] = useState(0);
  const [dataCuentasView, setDataCuentasView] = useState();
  const [totalPorCuenta, setTotalPorCuenta] = useState([]);
  const [nameDataView, setNameDataView] = useState([]);
  const [typeView, setTypeView] = useState();

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

  const calcTotals = () => {
    let tot = 0;
    let totMarketing = 0;
    let tots = [];
    let cuentas = [];
    let totalPerCuenta = [];
    let nameCuentas = [];
    Object.values(infoForm).map((head, indexHead) => {
      if (head.visible) {
        head.cuentas.map((cuenta, indexC) => {
          cuenta.años.map((año, indexY) => {
            if (!cuentas[cuenta.id]) {
              cuentas.push([]);
              totalPerCuenta.push(0);
              nameCuentas.push(cuenta.name);
            }
            MONTHS.map((mes, indexM) => {
              if (yearSelected.year || yearSelected.year === 0) {
                if (indexY === yearSelected.year) {
                  if (periodoSelected.month || periodoSelected.month === 0) {
                    if (periodoSelected.month === 0) {
                      if (indexM === 0) {
                        tot += año.volMeses[mes];
                        if (indexHead === 3) totMarketing += año.volMeses[mes];
                        setTypeView(oneMonth);
                        if (tots[indexM] || tots[indexM] === 0) {
                          tots[indexM] += año.volMeses[mes];
                        } else {
                          tots.push(0);
                          tots[indexM] += año.volMeses[mes];
                        }
                        if (
                          cuentas[cuenta.id][indexM] ||
                          cuentas[cuenta.id][indexM] === 0
                        ) {
                          totalPerCuenta[cuenta.id] += parseInt(
                            año.volMeses[mes],
                          );
                          cuentas[cuenta.id][indexM] += parseInt(
                            año.volMeses[mes],
                          );
                        } else {
                          cuentas[cuenta.id].push(0);
                          cuentas[cuenta.id][indexM] += parseInt(
                            año.volMeses[mes],
                          );
                          totalPerCuenta[cuenta.id] += parseInt(
                            año.volMeses[mes],
                          );
                        }
                      }
                    }
                    if (periodoSelected.month === 4) {
                      if (indexM < 3) {
                        if (indexHead === 3) totMarketing += año.volMeses[mes];
                        tot += año.volMeses[mes];
                        setTypeView(trimn);
                        if (tots[indexM] || tots[indexM] === 0) {
                          tots[indexM] += año.volMeses[mes];
                        } else {
                          tots.push(0);
                          tots[indexM] += año.volMeses[mes];
                        }
                        if (
                          cuentas[cuenta.id][indexM] ||
                          cuentas[cuenta.id][indexM] === 0
                        ) {
                          cuentas[cuenta.id][indexM] += parseInt(
                            año.volMeses[mes],
                          );
                          totalPerCuenta[cuenta.id] += parseInt(
                            año.volMeses[mes],
                          );
                        } else {
                          cuentas[cuenta.id].push(0);
                          cuentas[cuenta.id][indexM] += parseInt(
                            año.volMeses[mes],
                          );
                          totalPerCuenta[cuenta.id] += parseInt(
                            año.volMeses[mes],
                          );
                        }
                      }
                    }
                    if (periodoSelected.month === 6) {
                      if (indexM < 6) {
                        if (indexHead === 3) totMarketing += año.volMeses[mes];
                        tot += año.volMeses[mes];
                        setTypeView(firstSem);
                        if (tots[indexM] || tots[indexM] === 0) {
                          tots[indexM] += año.volMeses[mes];
                        } else {
                          tots.push(0);
                          tots[indexM] += año.volMeses[mes];
                        }
                        if (
                          cuentas[cuenta.id][indexM] ||
                          cuentas[cuenta.id][indexM] === 0
                        ) {
                          cuentas[cuenta.id][indexM] += parseInt(
                            año.volMeses[mes],
                          );
                          totalPerCuenta[cuenta.id] += parseInt(
                            año.volMeses[mes],
                          );
                        } else {
                          cuentas[cuenta.id].push(0);
                          cuentas[cuenta.id][indexM] += parseInt(
                            año.volMeses[mes],
                          );
                          totalPerCuenta[cuenta.id] += parseInt(
                            año.volMeses[mes],
                          );
                        }
                      }
                    }
                    if (periodoSelected.month === 12) {
                      if (indexM > 5) {
                        tot += año.volMeses[mes];
                        if (indexHead === 3) totMarketing += año.volMeses[mes];
                        setTypeView(secondSem);
                        if (tots[indexM - 6] || tots[indexM - 6] === 0) {
                          tots[indexM - 6] += año.volMeses[mes];
                        } else {
                          tots.push(0);
                          tots[indexM - 6] += año.volMeses[mes];
                        }
                        if (
                          cuentas[cuenta.id][indexM] ||
                          cuentas[cuenta.id][indexM] === 0
                        ) {
                          cuentas[cuenta.id][indexM] += parseInt(
                            año.volMeses[mes],
                          );
                          totalPerCuenta[cuenta.id] += parseInt(
                            año.volMeses[mes],
                          );
                        } else {
                          cuentas[cuenta.id].push(0);
                          cuentas[cuenta.id][indexM] += parseInt(
                            año.volMeses[mes],
                          );
                          totalPerCuenta[cuenta.id] += parseInt(
                            año.volMeses[mes],
                          );
                        }
                      }
                    }
                  } else {
                    tot += año.volMeses[mes];
                    if (indexHead === 3) totMarketing += año.volMeses[mes];
                    setTypeView(month);
                    if (tots[indexM] || tots[indexM] === 0) {
                      tots[indexM] += año.volMeses[mes];
                    } else {
                      tots.push(0);
                      tots[indexM] += año.volMeses[mes];
                    }
                    if (
                      cuentas[cuenta.id][indexM] ||
                      cuentas[cuenta.id][indexM] === 0
                    ) {
                      cuentas[cuenta.id][indexM] += parseInt(año.volMeses[mes]);
                      totalPerCuenta[cuenta.id] += parseInt(año.volMeses[mes]);
                    } else {
                      cuentas[cuenta.id].push(0);
                      cuentas[cuenta.id][indexM] += parseInt(año.volMeses[mes]);
                      totalPerCuenta[cuenta.id] += parseInt(año.volMeses[mes]);
                    }
                  }
                }
              } else if (!yearSelected.year) {
                tot += año.volMeses[mes];
                if (indexHead === 3) totMarketing += año.volMeses[mes];
                setTypeView(year);
                if (tots[indexY] || tots[indexY] === 0) {
                  tots[indexY] += año.volMeses[mes];
                } else {
                  tots.push(0);
                  tots[indexY] += año.volMeses[mes];
                }
                if (
                  cuentas[cuenta.id][indexY] ||
                  cuentas[cuenta.id][indexY] === 0
                ) {
                  cuentas[cuenta.id][indexY] += parseInt(año.volMeses[mes]);
                  totalPerCuenta[cuenta.id] += parseInt(año.volMeses[mes]);
                } else {
                  cuentas[cuenta.id].push(0);
                  cuentas[cuenta.id][indexY] += parseInt(año.volMeses[mes]);
                  totalPerCuenta[cuenta.id] += parseInt(año.volMeses[mes]);
                }
              }
            });
          });
        });
      }
    });
    setTotalMarkenting(totMarketing);
    setTotalPorCuenta(totalPerCuenta);
    setNameDataView(nameCuentas);
    setDataCuentasView(cuentas);
    setTotal(tot);
    setTotalsView(tots);
  };

  const calcTotalsVentas = () => {
    let tot = 0;

    if (infoFormVentas) {
      Object.values(infoFormVentas).map((m) => {
        m.map((p) => {
          p.productos.map((o, indexO) => {
            o.años.map((a, indexY) => {
              if (yearSelected.year || yearSelected.year === 0) {
                MONTHS.map((s, indexM) => {
                  if (yearSelected.year === indexY) {
                    if (periodoSelected.month || periodoSelected.month === 0) {
                      if (periodoSelected.month === 0) {
                        if (indexM === 0) {
                          tot += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      } else if (periodoSelected.month === 6) {
                        if (indexM < 6) {
                          tot += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      } else if (periodoSelected.month === 4) {
                        if (indexM < 3) {
                          tot += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      } else if (periodoSelected.month === 12) {
                        if (indexM > 5) {
                          tot += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      }
                    } else {
                      tot += Number(a.ventasTotal);
                    }
                  }
                });
              } else {
                tot += Number(a.ventasTotal);
              }
            });
          });
        });
      });
      setTotalVentas(tot);
    } else {
      selectYear({ value: 'año 1', label: 'Año 1', year: 0 });
      selectPeriodo({
        value: '1er semestre',
        label: '1er semestre',
        month: 6,
      });
    }
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.gastosGeneralData.length !== 0) {
          if (data.gastosPorCCData.length !== 0) {
            // tengo data precargada en este form
            setInfoForm(data?.gastosPorCCData[0].centroDeCostos[0]);
          }
        }
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, [yearSelected, periodoSelected]);

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.volumenData.length !== 0 && data?.precioData.length !== 0) {
          // seteo la info delvolumen para usar par alos cliente sporque si uso info form estoy usando el valor de ventas
          const datosPrecargadosVol = {};
          let volDataOrdenada = JSON.parse(
            localStorage.getItem('volumenData'),
          ).sort((a, b) => a.countryName.localeCompare(b.countryName));
          for (let i = 0; i < volDataOrdenada.length; i++) {
            datosPrecargadosVol[volDataOrdenada[i].countryName] =
              volDataOrdenada[i].stats;
          }
          // **********************************
          // **********************************

          // Seteo la info de ventas PxQ
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
          setInfoFormVentas(() => ({ ...datosPrecargados }));
          // **********************************
          // **********************************

          calcTotalsVentas();
        }
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, [yearSelected, periodoSelected]);

  useEffect(() => {
    if (infoForm) calcTotals();
  }, [infoForm]);

  return (
    <>
      {showLoader ? (
        <MySpinner />
      ) : (
        <>
          <div>
            <div className="border-b-2 mb-8 pb-1">
              <h4 className="cursor-default">
                Dashboard de Gastos de Estructura
              </h4>
              <span className="cursor-default">Gastos de Estructura</span>
            </div>
            <div className="border-solid border-2 border-#e5e7eb rounded-lg">
              <div className="px-4 py-5">
                <div className="flex justify-end gap-[20px]">
                  <Select
                    className="w-[12%] min-w-[115px]"
                    placeholder="Año"
                    onChange={selectYear}
                    options={año}
                    value={yearSelected}
                  />

                  {yearSelected.value !== 'todo' && (
                    <Select
                      className="w-[12%] min-w-[115px]"
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
                  <Total title="Gastos Totales" data={total} />
                </div>
                <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
                  <CardNumerica
                    type="default"
                    title="Nuevos clientes"
                    cantidad={12}
                  />
                </div>

                <div className=" mt-[40px]">
                  <h5>Distribución de Gasto por mes</h5>
                  <div className="flex w-[100%] gap-[30px] items-center">
                    <div className="w-[50%]">
                      <GraficoDeBarraGastosFirst
                        typeView={typeView}
                        dataView={totalsView}
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center gap-[20px] w-[50%]">
                      {infoForm && infoForm.Marketing.visible && (
                        <ProgresoCircular
                          ancho={100}
                          title="Gasto en MKT sobre Ventas"
                          data={
                            totalVentas !== 0
                              ? (totalMarkenting * 100) / totalVentas
                              : 0
                          }
                        />
                      )}
                      <ProgresoCircular
                        ancho={100}
                        title="Costo de Adquisición por Cliente"
                        data={12}
                      />
                    </div>
                  </div>
                </div>

                <div className=" mb-[50px] flex flex-col gap-[30px] mt-[100px] ">
                  <h5 className="cursor-default pl-[20px]">
                    Distribución de gasto por Centro de Costo
                  </h5>
                  <GraficoDeBarraGastos
                    nameData={nameDataView}
                    cuentasData={dataCuentasView}
                    typeView={typeView}
                  />
                </div>

                {totalPorCuenta.length !== 0 && nameDataView.length !== 0 && (
                  <div className="flex gap-[30px] mt-[40px] flex-col">
                    <h5>TOP 3 Cuentas Contables con más gasto</h5>
                    <div className="w-[70%] flex flex-col gap-[30px]">
                      <BarraDeProgresoGastos
                        data={totalPorCuenta}
                        totalVentas={total}
                        nameCuentas={nameDataView}
                        periodoSelected={periodoSelected}
                        yearSelected={yearSelected}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DashboardGastos;
