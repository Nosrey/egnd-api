/* eslint-disable no-lonely-if */
/* eslint-disable no-restricted-syntax */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import MySpinner from 'components/shared/loaders/MySpinner';
import { FormContainer, FormItem, Input, Tooltip } from 'components/ui';
import { Cuentas } from 'constants/cuentas.constant';
import { AÑOS, MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser } from 'services/Requests';

function ResumenDeGasto() {
  const [infoForm, setInfoForm] = useState();
  const currentState = useSelector((state) => state.auth.user);
  const [puestosQ, setPuestosQ] = useState([]);
  const [puestosP, setPuestosP] = useState([]);
  const [visibleItems, setVisibleItems] = useState([0]);
  const currency = useSelector((state) => state.auth.user.currency);
  const [sumVerticales, setSumVerticales] = useState({});
  const [showLoader, setShowLoader] = useState(true);
  const [info, setInfo] = useState(null);
  const [cuentasSum, setCuentasSum] = useState();

  // Logica para mostrar las SUMATORIAS VERTICALES ,
  const generateSumVertical = () => {
    if (infoForm) {
      const copy = { ...infoForm };
      const keyArray = Object.keys(copy);
      let sumacta = [];
      for (let i = 0; i < keyArray.length; i++) {
        for (let x = 0; x < copy[keyArray[i]].cuentas.length; x++) {
          // admin
          let sumanios = [];
          for (let p = 0; p < copy[keyArray[i]].cuentas[x].años.length; p++) {
            for (let s = 0; s < MONTHS.length; s++) {
              sumanios.push(
                Math.round(
                  copy[keyArray[i]].cuentas[x].años[p].volMeses[MONTHS[s]],
                ),
              );
            }
          }
          sumacta.push(sumanios);
        }
      }
      const sumArray = sumacta.reduce((acc, curr) => {
        curr.forEach((num, index) => {
          acc[index] = (acc[index] || 0) + num;
        });
        return acc;
      }, []);
      const chunks = [];
      let index = 0;
      while (index < sumArray.length) {
        chunks.push(sumArray.slice(index, index + 12));
        index += 12;
      }
      // eslint-disable-next-line arrow-body-style
      setSumVerticales(() => {
        return [...chunks];
      });
    }
  };
  useEffect(() => {
    if (infoForm) {
      generateSumVertical();
      createStructureToSum();
      applySumByAccount();
    }
  }, [infoForm]);

  useEffect(() => {
    let estructura = {};
    console.log('[PQ]', puestosQ);
    if (info) {
      Object.keys(puestosQ).map((cc, index) => {
        let heads = [];
        for (let i = 0; i < Cuentas.length; i++) {
          let head = {};
          head.id = i;
          head['años'] = JSON.parse(JSON.stringify(AÑOS));
          head.name = Cuentas[i];
          head.precioInicial = 0;
          head.tasa = 0;
          head.incremento = 'mensual';
          heads.push(head);
          let h = {};
          h.visible = puestosQ[cc];
          h.cuentas = JSON.parse(JSON.stringify(heads));

          estructura[cc] = JSON.parse(JSON.stringify(h));
        }
      });
      setInfoForm(() => ({ ...estructura }));
    }
  }, [info]);

  const hideYear = (index) => {
    setVisibleItems((prevItems) => {
      if (prevItems.includes(index)) {
        // Si el elemento ya está en la lista, lo eliminamos para ocultarlo
        return prevItems.filter((id) => id !== index);
      } // Si el elemento no está en la lista, lo agregamos para mostrarlo
      return [...prevItems, index];
    });
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        console.log('[datasup]', data);
        if (data?.gastosPorCCData.length !== 0) {
          console.log('[DATA]', data?.gastosPorCCData[0].centroDeCostos[0]);
          setInfoForm(() => ({
            ...data?.gastosPorCCData[0].centroDeCostos[0],
          }));
        } else {
          // uso la data de assumptions para construir
          if (data?.gastosGeneralData[0].centroDeGastos.length !== 0) {
            setInfo(data?.gastosGeneralData[0].centroDeGastos);
          }
        }
        setPuestosQ(data?.gastosGeneralData[0].centroDeGastos);
        if (data?.puestosPData[0]) {
          setPuestosP(data?.puestosPData[0].puestosp[0]);
        }
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const sumMes = (cta, year, mes) => {
    const arrayKeys = Object.keys(infoForm);
    let sum = 0;
    for (let i = 0; i < arrayKeys.length; i++) {
      sum += Math.round(
        infoForm[arrayKeys[i]].cuentas[cta].años[year].volMeses[mes],
      );
    }
    return sum;
  };

  const createStructureToSum = () => {
    let cuentas = [];
    Object.values(infoForm).forEach((i, index) => {
      i.cuentas.forEach((c, indexC) => {
        if (index === 0) {
          let head = {};
          head.id = indexC;
          head.name = c.name;
          head['años'] = [...AÑOS];
          cuentas.push(head);
        }
      });
    });
    applySumByAccount(cuentas);
  };

  const applySumByAccount = (cuentas) => {
    if (cuentas) {
      Object.values(infoForm).forEach((i, index) => {
        i.cuentas.forEach((c, indexC) => {
          c.años.forEach((year, indexYear) => {
            MONTHS.forEach((month, indexMonth) => {
              cuentas[indexC].años[indexYear].volMeses[month] += Number(
                c.años[indexYear].volMeses[month],
              );
            });
          });
        });
      });
    }
  };
  console.log('[INFO]', infoForm);
  return (
    <>
      {showLoader ? (
        <MySpinner />
      ) : (
        <div>
          <div className="border-b-2 mb-8 pb-1">
            <h4 className="cursor-default">Consolidado de Gasto</h4>
            <span className="cursor-default">Gastos de Estructura</span>
          </div>

          <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
            <div className="border-b-2 px-4 py-1">
              <h6 className="cursor-default">Todos los Centros de Costo</h6>
            </div>
            {infoForm ? (
              <div className="container-countries">
                <FormContainer className="cont-countries">
                  <ContainerScrollable
                    contenido={
                      <FormContainer>
                        <>
                          <section className="contenedor">
                            <div>
                              <div>
                                {Object.keys(
                                  infoForm['Administración'].cuentas,
                                ).map((head, index) => (
                                  <div
                                    className="flex  gap-x-3 "
                                    key={head.name}
                                  >
                                    <FormItem
                                      className={`${
                                        index === 0
                                          ? 'mt-12 w-[210px]'
                                          : 'mb-2  w-[210px]'
                                      }`}
                                    >
                                      <Input
                                        className={`${
                                          index === 0
                                            ? 'capitalize mt-10'
                                            : 'capitalize mt-5'
                                        }`}
                                        disabled={
                                          !infoForm['Administración'].cuentas[
                                            head
                                          ].isNew
                                        }
                                        type="text"
                                        name="name"
                                        value={
                                          infoForm['Administración'].cuentas[
                                            head
                                          ].name
                                        }
                                      />
                                    </FormItem>

                                    {infoForm['Administración'].cuentas[
                                      head
                                    ].años.map((año, indexYear) => (
                                      <div
                                        className="flex flex-col"
                                        key={indexYear}
                                      >
                                        {index === 0 && (
                                          <div className="titleRow min-w-[62px]">
                                            <p className="cursor-default">
                                              {' '}
                                              Año {año.año}
                                            </p>
                                            <div
                                              className="iconYear"
                                              onClick={() =>
                                                hideYear(indexYear)
                                              }
                                            >
                                              {visibleItems.includes(
                                                indexYear,
                                              ) ? (
                                                <FiMinus />
                                              ) : (
                                                <FiPlus />
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        <div className="titleMonths gap-x-3 gap-y-1 mt-[18px] flex flex-col">
                                          {index === 0 && (
                                            <div className="titleMonths gap-x-3 flex">
                                              {visibleItems.includes(
                                                indexYear,
                                              ) &&
                                                año &&
                                                Object.keys(año.volMeses).map(
                                                  (mes, indexMes) => (
                                                    <p
                                                      key={indexMes}
                                                      className="month w-[90px]  cursor-default capitalize"
                                                    >
                                                      {
                                                        Object.keys(
                                                          año.volMeses,
                                                        )[indexMes]
                                                      }
                                                    </p>
                                                  ),
                                                )}
                                              <p className="month w-[90px]  cursor-default">
                                                Total
                                              </p>
                                            </div>
                                          )}
                                          <div className="flex gap-x-3 gap-y-3">
                                            {visibleItems.includes(indexYear) &&
                                              año &&
                                              Object.keys(año.volMeses).map(
                                                (mes, indexMes) => (
                                                  <FormItem
                                                    className={`${
                                                      index === 0
                                                        ? 'mb-0'
                                                        : 'mb-0'
                                                    }`}
                                                    key={indexMes}
                                                  >
                                                    <Tooltip
                                                      placement="top-end"
                                                      title={`${mes} - año ${
                                                        indexYear + 1
                                                      }`}
                                                    >
                                                      <Input
                                                        className="w-[90px]"
                                                        type="number"
                                                        disabled
                                                        value={sumMes(
                                                          head,
                                                          indexYear,
                                                          Object.keys(
                                                            año.volMeses,
                                                          )[indexMes],
                                                        )}
                                                        name="month"
                                                        prefix={currency}
                                                      />
                                                    </Tooltip>
                                                  </FormItem>
                                                ),
                                              )}
                                            <FormItem className="mb-0">
                                              <Input
                                                className="w-[90px]"
                                                type="number"
                                                disabled
                                                prefix={currency}
                                                value={
                                                  infoForm['Administración']
                                                    .cuentas[head].precioInicial
                                                    ? año.volTotal
                                                    : 0
                                                }
                                              />
                                            </FormItem>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </section>
                          {sumVerticales && sumVerticales.length !== 0 && (
                            <div className="bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px]">
                              <div className="flex items-center">
                                <p className=" text-[#707470] font-bold  cursor-default mb-3 text-left w-[500px] ">
                                  Total
                                </p>
                              </div>
                              <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
                                <div className="flex gap-x-3 w-fit pt-3 ml-[200px] ">
                                  {AÑOS.map((año, indexYear) => (
                                    <div
                                      className="flex flex-col"
                                      key={indexYear}
                                    >
                                      <div className="titleRowR min-w-[62px]">
                                        <p className="cursor-default">
                                          {' '}
                                          Año {indexYear + 1}
                                        </p>
                                        <div
                                          className="iconYear"
                                          onClick={() => hideYear(indexYear)}
                                        >
                                          {visibleItems.includes(indexYear) ? (
                                            <FiMinus />
                                          ) : (
                                            <FiPlus />
                                          )}
                                        </div>
                                      </div>
                                      <div className="titleMonths gap-x-3 flex mb-3">
                                        {visibleItems.includes(indexYear) &&
                                          año &&
                                          MONTHS.map((mes, indexMes) => (
                                            <p
                                              key={indexMes}
                                              className="month  cursor-default w-[90px] capitalize"
                                            >
                                              {mes}
                                            </p>
                                          ))}
                                        <p className="month w-[90px]">Total</p>
                                      </div>
                                      <div className="flex gap-x-3 gap-y-3">
                                        {visibleItems.includes(indexYear) &&
                                          año &&
                                          sumVerticales.length !== 0 &&
                                          sumVerticales[indexYear]?.map(
                                            (valor, index) => (
                                              <p className="w-[90px] text-center cursor-default">
                                                {currency}
                                                {valor}
                                              </p>
                                            ),
                                          )}
                                        <p className="w-[90px] text-center font-bold cursor-default">
                                          {currency}
                                          {sumVerticales[indexYear]?.reduce(
                                            (acumulador, numero) =>
                                              acumulador + numero,
                                            0,
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      </FormContainer>
                    }
                  />
                </FormContainer>
              </div>
            ) : (
              <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
                <span className="cursor-default">
                  Para acceder a este formulario primero debe completar el
                  formulario de{' '}
                  <Link
                    className="text-indigo-700 underline"
                    to="/gastos-por-cc"
                  >
                    Gastos por Centro de Costo
                  </Link>{' '}
                  .
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default ResumenDeGasto;
