/* eslint-disable react-hooks/exhaustive-deps */
import BarraDeProgresoHeadcount from 'components/shared/dashboard/BarraDeProgresoHeadcount';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarraHeadcountFour from 'components/shared/dashboard/GraficoDeBarraHeadcountFour';
import GraficoDeBarraHeadcountOne from 'components/shared/dashboard/GraficoDeBarraHeadcountOne';
import GraficoDeBarraHeadcountThree from 'components/shared/dashboard/GraficoDeBarraHeadcountThree';
import GraficoDeBarraHeadcountTwo from 'components/shared/dashboard/GraficoDeBarraHeadcountTwo';
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
import { useMedia } from 'utils/hooks/useMedia';

function DashboardHeadcount() {
  const currentState = useSelector((state) => state.auth.user);
  const [total, setTotal] = useState(0);
  const [cantPers, setCantPers] = useState(0);
  const [infoForm, setInfoForm] = useState();
  const [ftes, setFtes] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalsVentas, setTotalsVentas] = useState([]);
  const [totalsPers, setTotalsPers] = useState([]);
  const [typeView, setTypeView] = useState();
  const [dataHeadcount, setDataHeadcount] = useState();
  const [showLoader, setShowLoader] = useState(true);
  const media = useMedia();

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

  const calcTotalsVentas = () => {
    let tot = 0;
    let totProd = 0;
    let totServ = 0;
    let superTotal = 0;
    let tots = [];
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
                          if (tots[indexM] || tots[indexM] === 0) {
                            tots[indexM] += a.volMeses[MONTHS[indexM]];
                          } else {
                            tots.push(0);
                            tots[indexM] += a.volMeses[MONTHS[indexM]];
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

                          if (tots[indexM] || tots[indexM] === 0) {
                            tots[indexM] += a.volMeses[MONTHS[indexM]];
                          } else {
                            tots.push(0);
                            tots[indexM] += a.volMeses[MONTHS[indexM]];
                          }
                          tot += Number(a.volMeses[MONTHS[indexM]]);
                        }
                      } else if (periodoSelected.month === 4) {
                        if (indexM < 3) {
                          if (o.type === 'producto') {
                            totProd += Number(a.volMeses[MONTHS[indexM]]);
                          } else {
                            totServ += Number(a.volMeses[MONTHS[indexM]]);
                          }

                          if (tots[indexM] || tots[indexM] === 0) {
                            tots[indexM] += a.volMeses[MONTHS[indexM]];
                          } else {
                            tots.push(0);
                            tots[indexM] += a.volMeses[MONTHS[indexM]];
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

                          if (tots[indexM - 6] || tots[indexM - 6] === 0) {
                            tots[indexM - 6] += a.volMeses[MONTHS[indexM]];
                          } else {
                            tots.push(0);
                            tots[indexM - 6] += a.volMeses[MONTHS[indexM]];
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
                      if (tots[indexM] || tots[indexM] === 0) {
                        tots[indexM] += a.volMeses[MONTHS[indexM]];
                      } else {
                        tots.push(0);
                        tots[indexM] += a.volMeses[MONTHS[indexM]];
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
                if (tots[indexY] || tots[indexY] === 0) {
                  tots[indexY] += a.volMeses[MONTHS[indexY]];
                } else {
                  tots.push(0);
                  tots[indexY] += a.volMeses[MONTHS[indexY]];
                }
                tot += Number(a.ventasTotal);
              }
            });
          });
        });
      });
      setTotalVentas(tot);
      setTotalsVentas(tots);
    } else {
      selectYear({ value: 'año 1', label: 'Año 1', year: 0 });
      selectPeriodo({
        value: '1er semestre',
        label: '1er semestre',
        month: 6,
      });
    }
  };

  const calcFte = () => {
    let div = 0;

    if (totalVentas !== 0 || cantPers !== 0) {
      if (periodoSelected.month || periodoSelected.month === 0) {
        if (periodoSelected.month === 0) {
          return totalVentas / cantPers;
        }
        if (periodoSelected.month === 4) {
          div = Math.floor(cantPers / 3);

          return totalVentas / div;
        }
        if (periodoSelected.month === 6 || periodoSelected.month === 12) {
          div = Math.floor(cantPers / 6);
          return totalVentas / div;
        }
      } else {
        div = Math.floor(cantPers / 12);
        // setFte(totalVentas / div);
        return totalVentas / div;
      }
    } else {
      return 0;
    }
  };

  const calcFtes = () => {
    let fte = [];
    if (totalsVentas.length !== 0 && totalsPers.length !== 0) {
      totalsPers.map((p, indexP) => {
        if (!fte[indexP]) {
          if (p === 0 || totalsVentas[indexP] === 0) {
            fte.push(0);
            fte[indexP] = 0;
          } else {
            fte.push(0);
            fte[indexP] = (Number(totalsVentas[indexP]) / Number(p)).toFixed(2);
          }
        } else {
          fte[indexP] = (Number(totalsVentas[indexP]) / Number(p)).toFixed(2);
        }
      });

      setFtes(fte);
    }
  };

  const calcTotals = (data) => {
    let tot = 0;
    let cantPers = 0;
    let tots = [];
    Object.values(data).map((o) => {
      o.puestos.map((d) => {
        d.años.map((a, indexY) => {
          MONTHS.map((m, indexM) => {
            if (yearSelected.year || yearSelected.year === 0) {
              if (indexY === yearSelected.year) {
                if (periodoSelected.month || periodoSelected.month === 0) {
                  if (periodoSelected.month === 0) {
                    if (indexM === 0) {
                      tot += a.volMeses[MONTHS[indexM]] * d.total;
                      cantPers += a.volMeses[MONTHS[indexM]];
                      if (tots[indexM] || tots[indexM] === 0) {
                        tots[indexM] += a.volMeses[MONTHS[indexM]];
                      } else {
                        tots.push(0);
                        tots[indexM] += a.volMeses[MONTHS[indexM]];
                      }
                    }
                    setTypeView(oneMonth);
                  }
                  if (periodoSelected.month === 4) {
                    if (indexM < 3) {
                      tot += a.volMeses[MONTHS[indexM]] * d.total;
                      cantPers += a.volMeses[MONTHS[indexM]];
                      if (tots[indexM] || tots[indexM] === 0) {
                        tots[indexM] += a.volMeses[MONTHS[indexM]];
                      } else {
                        tots.push(0);
                        tots[indexM] += a.volMeses[MONTHS[indexM]];
                      }
                    }
                    setTypeView(trimn);
                  }
                  if (periodoSelected.month === 6) {
                    if (indexM < 6) {
                      tot += a.volMeses[MONTHS[indexM]] * d.total;
                      cantPers += a.volMeses[MONTHS[indexM]];
                      if (tots[indexM] || tots[indexM] === 0) {
                        tots[indexM] += a.volMeses[MONTHS[indexM]];
                      } else {
                        tots.push(0);
                        tots[indexM] += a.volMeses[MONTHS[indexM]];
                      }
                    }
                    setTypeView(firstSem);
                  }
                  if (periodoSelected.month === 12) {
                    if (indexM > 5) {
                      tot += a.volMeses[MONTHS[indexM]] * d.total;
                      cantPers += a.volMeses[MONTHS[indexM]];
                      if (tots[indexM - 6] || tots[indexM - 6] === 0) {
                        tots[indexM - 6] += a.volMeses[MONTHS[indexM]];
                      } else {
                        tots.push(0);
                        tots[indexM - 6] += a.volMeses[MONTHS[indexM]];
                      }
                    }
                    setTypeView(secondSem);
                  }
                } else {
                  tot += a.volMeses[MONTHS[indexM]] * d.total;
                  cantPers += a.volMeses[MONTHS[indexM]];
                  setTypeView(month);
                  if (tots[indexM] || tots[indexM] === 0) {
                    tots[indexM] += a.volMeses[MONTHS[indexM]];
                  } else {
                    tots.push(0);
                    tots[indexM] += a.volMeses[MONTHS[indexM]];
                  }
                }
              }
            } else if (!yearSelected.year) {
              tot += a.volMeses[MONTHS[indexM]] * d.total;
              cantPers += a.volMeses[MONTHS[indexM]];
              setTypeView(year);
              if (tots[indexY] || tots[indexY] === 0) {
                tots[indexY] += a.volMeses[MONTHS[indexM]];
              } else {
                tots.push(0);
                tots[indexY] += a.volMeses[MONTHS[indexM]];
              }
            }
          });
        });
      });
    });

    setTotal(tot);
    setCantPers(cantPers);
    setTotalsPers(tots);
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.puestosPData.length !== 0) {
          setDataHeadcount(data.puestosPData[0].puestosp);
          data.puestosPData[0].puestosp.map((p) => {
            calcTotals(p);
          });
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
          calcTotalsVentas();
          calcFte();
          calcFtes();
        }
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, [yearSelected, periodoSelected]);

  useEffect(() => {
    calcFtes();
  }, [totalsPers, totalsVentas]);

  return (
    <>
    {showLoader ? (
        <MySpinner />
      ) : (
        <>
          <div>
            <div className="border-b-2 mb-8 pb-1">
              <h4 className="cursor-default">Dashboard de Headcount</h4>
              <span className="cursor-default">Headcount</span>
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
                  <Total title="Monto Total" data={total} />
                </div>
                <div className={` ${media === "mobile" ? " flex flex-col gap-y-4" : "grid grid-cols-3 gap-[20px]"} mt-[20px]`}>
                  <CardNumerica
                    type="default"
                    title="Cantidad de Personal"
                    cantidad={cantPers}
                  />
                  <CardNumerica
                    type="default"
                    hasCurrency
                    title="Costo medio por Recurso"
                    cantidad={total > 0 && cantPers > 0 ? total / cantPers : 0}
                  />
                </div>

                {dataHeadcount && (
                  <div className=" mb-[50px] flex flex-col gap-[30px] mt-[100px] ">
                    <h5 className="cursor-default pl-[20px]">
                      Distribución de Headcount Q por Centro de Costo
                    </h5>
                    <GraficoDeBarraHeadcountOne
                      typeView={typeView}
                      dataHeadcount={dataHeadcount}
                      periodoSelected={periodoSelected}
                      yearSelected={yearSelected}
                    />
                  </div>
                )}

                {dataHeadcount && (
                  <div className="mt-[80px] mb-[50px] flex flex-col gap-[30px]">
                    <h5 className="cursor-default pl-[20px]">
                      Distribución del gasto en salario por Centro de Costo
                    </h5>
                    <GraficoDeBarraHeadcountTwo
                      typeView={typeView}
                      dataHeadcount={dataHeadcount}
                      periodoSelected={periodoSelected}
                      yearSelected={yearSelected}
                    />
                  </div>
                )}

                <div className={` ${media === "mobile" ? "flex flex-col" : "flex gap-[30px] mt-[100px]" }` }>
                  <div className={` ${media === "mobile" ? "w-full" : "w-[30%] "} flex flex-col gap-[30px]` }>
                    <h5 className="cursor-default pl-[20px]">FTE</h5>
                    <CardNumerica
                      type="default"
                      title="FTE"
                      hasCurrency
                      cantidad={calcFte()}
                    />
                  </div>

                  {dataHeadcount && (
                    <div className={` ${media === "mobile" ? "w-full" : "w-[70%] " } flex flex-col gap-[30px] mt-[50px]` }>
                      <h5 className="cursor-default">Evolución de Headcount</h5>
                      <GraficoDeBarraHeadcountThree
                        typeView={typeView}
                        dataHeadcount={dataHeadcount}
                        periodoSelected={periodoSelected}
                        yearSelected={yearSelected}
                      />
                    </div>
                  )}
                </div>

                {ftes && (
                  <div className="flex flex-col gap-[30px] mt-[60px]">
                    <h5 className="cursor-default pl-[20px]">
                      Evolución FTE por mes
                    </h5>
                    <GraficoDeBarraHeadcountFour typeView={typeView} ftes={ftes} />
                  </div>
                )}

                <div className="flex gap-[30px] mt-[100px] mb-[50px]">
                  {dataHeadcount && (
                    <div className={` ${media === "mobile" ? "w-full" : "w-[50%]"} flex flex-col gap-[30px]` }>
                      <h5>Gasto en personal por Centro de Costo</h5>
                      <BarraDeProgresoHeadcount
                        dataHeadcount={dataHeadcount}
                        totalVentas={total}
                        yearSelected={yearSelected}
                        periodoSelected={periodoSelected}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>)}
    </>
    
  );
}

export default DashboardHeadcount;
