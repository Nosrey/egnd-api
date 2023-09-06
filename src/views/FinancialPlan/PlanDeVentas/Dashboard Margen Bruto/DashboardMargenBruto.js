/* eslint-disable no-restricted-globals */
/* eslint-disable no-multi-assign */
import BarraDeProgresoMargenBruto from 'components/shared/dashboard/BarraDeProgresoMargenBruto';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarraMargenBruto from 'components/shared/dashboard/GraficoDeBarraMargenBruto';
import ProgresoCircular from 'components/shared/dashboard/ProgresoCircular';
import Total from 'components/shared/dashboard/Total';
import MySpinner from 'components/shared/loaders/MySpinner';
import { MenuItem, Select } from 'components/ui';
import { año, periodo } from 'constants/dashboard.constant';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { useMedia } from 'utils/hooks/useMedia';

function DashboardMargenBruto() {
  const media = useMedia();
  const [defaultCountry, setDefaultCountry] = useState('');
  const [costoData, setCostoData] = useState([]);
  const [dataAssump, setDataAssump] = useState();
  const [volumenData, setVolumenData] = useState([]);
  const [precioData, setPrecioData] = useState([]);
  const [products, setProducts] = useState([]);
  const [infoForm, setInfoForm] = useState();
  const [country, setCountry] = useState(defaultCountry);
  const [showLoader, setShowLoader] = useState(true);
  const [totPerMonth, setTotPerMonth] = useState(0);
  const [percentMArgen, setPercentMArgen] = useState(0);
  const [margenClient, setMargenClient] = useState(0);
  const [totalMargen, setTotalMargen] = useState(0);
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

  const showMultiplicacionPxQ = (dataVolumen, dataPrecio) => {
    for (let i = 0; i < dataVolumen.length; i++) {
      // entro a cada pais
      for (let x = 0; x < dataVolumen[i].stats.length; x++) {
        // a cada canal
        for (let j = 0; j < dataVolumen[i].stats[x].productos.length; j++) {
          // cada producto
          for (
            let t = 0;
            t < dataVolumen[i].stats[x].productos[j].años.length;
            t++
          ) {
            // año
            const totalesAnio = [];
            MONTHS.forEach((month) => {
              // OBTENGO EL VALOR DE CADA OUTPUT QUE ES PRECIO X VOLUMEN
              const volMes =
                dataVolumen[i].stats[x].productos[j].años[t].volMeses[month];
              const precioMes =
                dataPrecio[i].stats[x].productos[j].años[t].volMeses[month];
              const ventaMes = (dataVolumen[i].stats[x].productos[j].años[
                t
              ].volMeses[month] =
                parseInt(volMes, 10) * parseInt(precioMes, 10));
              totalesAnio.push(ventaMes);
              return ventaMes;
            });
            const totalVentasAnual = totalesAnio.reduce((a, b) => a + b, 0); // CALCULO EL TOTAL POR Anio
            dataVolumen[i].stats[x].productos[j].años[t].ventasTotal =
              totalVentasAnual;
          }
        }
      }
    }
    return dataVolumen;
  };

  const getVentasResult = (
    indexCountry,
    indexCanal,
    indexP,
    indexYear,
    indexMonth,
  ) => {
    const pcio =
      precioData[indexCountry].stats[indexCanal].productos[indexP].años[
        indexYear
      ].volMeses[MONTHS[indexMonth]];
    const vol =
      volumenData[indexCountry].stats[indexCanal].productos[indexP].años[
        indexYear
      ].volMeses[MONTHS[indexMonth]];
    const ventas = pcio * vol;
    return ventas;
  };

  const getMargenBrutoResult = (
    indexCountry,
    indexCanal,
    indexP,
    indexYear,
    indexMonth,
  ) => {
    const vol =
      volumenData[indexCountry].stats[indexCanal].productos[indexP].años[
        indexYear
      ].volMeses[MONTHS[indexMonth]];

    const costo =
      costoData[indexCountry].stats[indexCanal].productos[indexP].años[
        indexYear
      ].volMeses[MONTHS[indexMonth]];
    const comisionPercent =
      costoData[indexCountry].stats[indexCanal].productos[indexP].comision;
    const cargosPercent =
      costoData[indexCountry].stats[indexCanal].productos[indexP].cargos;
    const impuestoPercent =
      costoData[indexCountry].stats[indexCanal].productos[indexP].impuesto;

    const ventas = getVentasResult(
      indexCountry,
      indexCanal,
      indexP,
      indexYear,
      indexMonth,
    );

    const comision = (comisionPercent * ventas) / 100;
    const cargos = (cargosPercent * ventas) / 100;
    const impuesto = (impuestoPercent * ventas) / 100;

    const costoTot = costo * vol + impuesto + comision + cargos;

    const rdo = ventas - costoTot;
    return rdo;
  };

  const calcTotals = () => {
    let tot = 0;
    let margenByClient = 0;
    let percent = 0;
    let totPerMonth = [];

    if (infoForm) {
      Object.values(infoForm).map((m, indexCountry) => {
        m.map((p, indexChannel) => {
          p.productos.map((o, indexO) => {
            o.años.map((a, indexY) => {
              if (yearSelected.year || yearSelected.year === 0) {
                MONTHS.map((s, indexM) => {
                  if (yearSelected.year === indexY) {
                    if (periodoSelected.month || periodoSelected.month === 0) {
                      if (periodoSelected.month === 0) {
                        if (indexM === 0) {
                          tot += Math.round(
                            getMargenBrutoResult(
                              indexCountry,
                              indexChannel,
                              indexO,
                              indexY,
                              indexM,
                            ),
                          );
                          percent += Math.abs(
                            calculatePercent(
                              indexCountry,
                              indexChannel,
                              indexO,
                              indexY,
                              indexM,
                            ),
                          );

                          if (!totPerMonth[indexM]) {
                            totPerMonth.push(0);
                          }
                          totPerMonth[indexM] += Math.round(
                            getMargenBrutoResult(
                              indexCountry,
                              indexChannel,
                              indexO,
                              indexY,
                              indexM,
                            ),
                          );

                          margenByClient = getAcumulateClients(
                            0,
                            yearSelected.year,
                          );
                        }
                      } else if (periodoSelected.month === 6) {
                        if (indexM < 6) {
                          tot += Math.round(
                            getMargenBrutoResult(
                              indexCountry,
                              indexChannel,
                              indexO,
                              indexY,
                              indexM,
                            ),
                          );
                          percent +=
                            Math.abs(
                              calculatePercent(
                                indexCountry,
                                indexChannel,
                                indexO,
                                indexY,
                                indexM,
                              ),
                            ) / 6;
                          if (!totPerMonth[indexM]) {
                            totPerMonth.push(0);
                          }
                          totPerMonth[indexM] += Math.round(
                            getMargenBrutoResult(
                              indexCountry,
                              indexChannel,
                              indexO,
                              indexY,
                              indexM,
                            ),
                          );

                          margenByClient = getAcumulateClients(
                            5,
                            yearSelected.year,
                          );
                        }
                      } else if (periodoSelected.month === 4) {
                        if (indexM < 3) {
                          tot += Math.round(
                            getMargenBrutoResult(
                              indexCountry,
                              indexChannel,
                              indexO,
                              indexY,
                              indexM,
                            ),
                          );
                          percent +=
                            Math.abs(
                              calculatePercent(
                                indexCountry,
                                indexChannel,
                                indexO,
                                indexY,
                                indexM,
                              ),
                            ) / 3;
                          if (!totPerMonth[indexM]) {
                            totPerMonth.push(0);
                          }
                          totPerMonth[indexM] += Math.round(
                            getMargenBrutoResult(
                              indexCountry,
                              indexChannel,
                              indexO,
                              indexY,
                              indexM,
                            ),
                          );
                          margenByClient = getAcumulateClients(
                            2,
                            yearSelected.year,
                          );
                        }
                      } else if (periodoSelected.month === 12) {
                        if (indexM > 5) {
                          tot += Math.round(
                            getMargenBrutoResult(
                              indexCountry,
                              indexChannel,
                              indexO,
                              indexY,
                              indexM,
                            ),
                          );

                          percent +=
                            Math.abs(
                              calculatePercent(
                                indexCountry,
                                indexChannel,
                                indexO,
                                indexY,
                                indexM,
                              ),
                            ) / 6;
                          if (!totPerMonth[indexM - 6]) {
                            totPerMonth.push(0);
                          }
                          totPerMonth[indexM - 6] += Math.round(
                            getMargenBrutoResult(
                              indexCountry,
                              indexChannel,
                              indexO,
                              indexY,
                              indexM,
                            ),
                          );
                        }
                        margenByClient = getAcumulateClients(
                          11,
                          yearSelected.year,
                        );
                      }
                    } else {
                      tot += Math.round(
                        getMargenBrutoResult(
                          indexCountry,
                          indexChannel,
                          indexO,
                          indexY,
                          indexM,
                        ),
                      );

                      percent +=
                        Math.abs(
                          calculatePercent(
                            indexCountry,
                            indexChannel,
                            indexO,
                            indexY,
                            indexM,
                          ),
                        ) / 12;
                      if (!totPerMonth[indexM]) {
                        totPerMonth.push(0);
                      }
                      totPerMonth[indexM] += Math.round(
                        getMargenBrutoResult(
                          indexCountry,
                          indexChannel,
                          indexO,
                          indexY,
                          indexM,
                        ),
                      );
                      margenByClient = getAcumulateClients(
                        11,
                        yearSelected.year,
                      );
                    }
                  }
                });
              } else {
                for (let i = 0; i <= 11; i++) {
                  tot += Math.round(
                    getMargenBrutoResult(
                      indexCountry,
                      indexChannel,
                      indexO,
                      indexY,
                      i,
                    ),
                  );
                  percent +=
                    Math.abs(
                      calculatePercent(
                        indexCountry,
                        indexChannel,
                        indexO,
                        indexY,
                        i,
                      ),
                    ) / 12;
                  if (!totPerMonth[i]) {
                    totPerMonth.push(0);
                  }
                  totPerMonth[i] += Math.round(
                    getMargenBrutoResult(
                      indexCountry,
                      indexChannel,
                      indexO,
                      indexY,
                      i,
                    ),
                  );
                }
                margenByClient = getAcumulateClients(11, yearSelected.year);
              }
            });
          });
        });
      });
      setTotPerMonth(totPerMonth);
      setTotalMargen(tot);
      setMargenClient(margenByClient);
      setPercentMArgen(Math.round(percent));
    } else {
      selectYear({ value: 'año 1', label: 'Año 1', year: 0 });
      selectPeriodo({
        value: '1er semestre',
        label: '1er semestre',
        month: 6,
      });
    }
  };

  const calculatePercent = (
    indexCountry,
    indexCanal,
    indexP,
    indexYear,
    indexMes,
  ) => {
    // margen bruto x 100 / ventas
    const percent =
      (getMargenBrutoResult(
        indexCountry,
        indexCanal,
        indexP,
        indexYear,
        indexMes,
      ) *
        100) /
      getVentasResult(indexCountry, indexCanal, indexP, indexYear, indexMes);
    return isNaN(percent) ? 0 : Math.round(percent);
  };

  const getValueMes = (indexPais, indexCanal, indexProd, indexYear, indexMes) =>
    volumenData[indexPais].stats[indexCanal].productos[indexProd].años[
      indexYear
    ].volMeses[MONTHS[indexMes]];

  const getClientes = (
    indexPais,
    indexCanal,
    indexProd,
    indexYear,
    indexMes,
  ) => {
    const vtasXCliente =
      dataAssump.canales[indexCanal].items[indexProd].volumen;
    const rdo =
      getValueMes(indexPais, indexCanal, indexProd, indexYear, indexMes) /
      vtasXCliente;
    return rdo;
  };

  const getAcumulateClients = (indexMonth, indexYear) => {
    let client = 0;
    volumenData.map((v, indexC) => {
      v.stats.map((s, indexS) => {
        s.productos.map((p, indexP) => {
          client += Math.trunc(
            getClientes(indexC, indexS, indexP, indexYear, indexMonth),
          );
        });
      });
    });

    return client;
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data.assumptionData[0]) {
          setDataAssump(data.assumptionData[0]);
        }
        if (
          data?.volumenData.length !== 0 &&
          data?.precioData.length !== 0 &&
          data?.costoData.length !== 0
        ) {
          // Para que no haya cruce de datos entre pais, ordeno alfabeticamente data de volumen antes de guardarla
          const ordererCostoData = data?.costoData.sort((a, b) =>
            a.countryName.localeCompare(b.countryName),
          );
          setCostoData(ordererCostoData);

          // REVISAR PORQUE RAZON EN LA DATA ME LLEGA MAL LA INFO SOLO DE VOLUMEN, NO DEVUELVE LO MISMO QE EL ENDPOINT
          const vol = JSON.parse(localStorage.getItem('volumenData'));
          const ordererVolData = vol.sort((a, b) =>
            a.countryName.localeCompare(b.countryName),
          );
          setVolumenData(ordererVolData);

          const ordererPcioData = data?.precioData.sort((a, b) =>
            a.countryName.localeCompare(b.countryName),
          );
          setPrecioData(ordererPcioData);

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
          setProducts(data?.assumptionData[0].productos);
          calcTotals();
        }
        setDefaultCountry(data?.assumptionData[0]?.paises[0]?.value);
        setCountry(data?.assumptionData[0]?.paises[0]?.value);
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, [yearSelected, periodoSelected]);

  return (
    <>
      {showLoader ? (
        <MySpinner />
      ) : (
        <>
          <div>
            <div className="border-b-2 mb-8 pb-1">
              <h4 className="cursor-default">Dashboard de Margen Bruto</h4>
              <span className="cursor-default">Costos directos</span>
            </div>
            <div className="border-solid border-2 border-#e5e7eb rounded-lg">
              <div className="px-4 py-5 pb-[60px]">
                <div className="flex justify-end gap-[20px]">
                  <Select
                    className="w-[12%] min-w-[115px]"
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
                      className="w-[12%] min-w-[115px]"
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
                <div className="mt-[30px] mb-[30px] cursor-default">
                  <Total title="Margen Bruto Nominal" data={totalMargen} />
                </div>
                <div
                  className={`${
                    media === 'mobile' ? '' : 'grid grid-cols-3 '
                  }  gap-[20px] mt-[20px]`}
                >
                  <CardNumerica
                    type="default"
                    title="Margen Bruto por Cliente"
                    hasCurrency
                    cantidad={totalMargen / margenClient}
                  />
                </div>

                <div className=" mt-[40px]">
                  <h5 className="cursor-default">
                    Proyección Margen Bruto Nominal
                  </h5>
                  <div
                    className={`flex ${
                      media === 'mobile' ? 'flex-col' : ''
                    } w-[100%] gap-[30px]  justify-between`}
                  >
                    <div
                      className={`${
                        media === 'mobile' ? 'w-[100%]' : 'w-[60%]'
                      } `}
                    >
                      <GraficoDeBarraMargenBruto
                        data={infoForm}
                        yearSelected={yearSelected}
                        periodoSelected={periodoSelected}
                        totPerMonth={totPerMonth}
                      />
                    </div>
                    <ProgresoCircular
                      className={`${
                        media === 'mobile' ? 'h-[70%]' : 'h-[60%]'
                      } `}
                      ancho={`${media === 'mobile' ? 'w-[100%]' : ''} `}
                      title="Margen Bruto Porcentual"
                      data={percentMArgen}
                    />
                  </div>
                </div>

                <div
                  className={`flex gap-[30px] mt-[50px] ${
                    media === 'mobile' ? 'flex-col' : ''
                  } `}
                >
                  <div
                    className={` ${
                      media === 'mobile' ? 'w-[100%]' : 'w-[50%]'
                    } flex flex-col gap-[30px]`}
                  >
                    <h5 className="cursor-default">Margen Bruto por País</h5>
                    <BarraDeProgresoMargenBruto
                      dataAssump={dataAssump}
                      type="pais"
                      getMargenResult={getMargenBrutoResult}
                      totalVentas={12}
                      selectYear={yearSelected}
                      periodoSelected={periodoSelected}
                      infoForm={infoForm}
                    />
                  </div>
                  <div
                    className={` ${
                      media === 'mobile' ? 'w-[100%]' : 'w-[50%]'
                    } flex flex-col gap-[30px]`}
                  >
                    <h5 className="cursor-default">Margen Bruto por Canal</h5>
                    <BarraDeProgresoMargenBruto
                      dataAssump={dataAssump}
                      type="canal"
                      getMargenResult={getMargenBrutoResult}
                      totalVentas={12}
                      selectYear={yearSelected}
                      periodoSelected={periodoSelected}
                      infoForm={infoForm}
                    />
                  </div>
                </div>

                <div
                  className={`flex gap-[30px] mt-[40px] ${
                    media === 'mobile' ? 'flex-col' : ''
                  } `}
                >
                  <div
                    className={` ${
                      media === 'mobile' ? 'w-[100%]' : 'w-[50%]'
                    } flex flex-col gap-[30px]`}
                  >
                    <h5 className="cursor-default">
                      Margen Bruto por Producto
                    </h5>
                    <BarraDeProgresoMargenBruto
                      dataAssump={dataAssump}
                      type="producto"
                      getMargenResult={getMargenBrutoResult}
                      totalVentas={12}
                      selectYear={yearSelected}
                      periodoSelected={periodoSelected}
                      infoForm={infoForm}
                    />
                  </div>
                  <div
                    className={` ${
                      media === 'mobile' ? 'w-[100%]' : 'w-[50%]'
                    } flex flex-col gap-[30px]`}
                  >
                    <h5 className="cursor-default">
                      Margen Bruto por Servicio
                    </h5>
                    <BarraDeProgresoMargenBruto
                      dataAssump={dataAssump}
                      type="servicio"
                      getMargenResult={getMargenBrutoResult}
                      totalVentas={12}
                      selectYear={yearSelected}
                      periodoSelected={periodoSelected}
                      infoForm={infoForm}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DashboardMargenBruto;
