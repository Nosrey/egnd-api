/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { FormContainer, FormItem, Input, Tabs, Tooltip } from 'components/ui';
import { AÑOS, EMPTY_CARGOS, MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import formatNumber from 'utils/formatTotalsValues';

const { TabContent } = Tabs;

function TablePuestosPxQ(props) {
  const [infoForm, setInfoForm] = useState();
  const [head, setHeads] = useState(props.head);
  const [visibleItems, setVisibleItems] = useState([0]);
  const [volTotal, setVolTotal] = useState([]);
  const currency = useSelector((state) => state.auth.user.currency);

  // Logica para mostrar las SUMATORIAS VERTICALES , se construye por pais un array de
  // productos donde tengo adentro de cada producto el atributo sum que es un array de las sumatorias
  // verticales de ese producto. No existe la relacion producto -canal porque es una suma de las
  // cantidades de cada producto teniendo en cuenta todo los canales.
  const initialConfig = () => {
    if (infoForm && props.head) {
      const head = { ...infoForm[props.head] };
      let valor;

      let arrayvalores = [
        { id: 0, values: [] },
        { id: 1, values: [] },
        { id: 2, values: [] },
        { id: 3, values: [] },
        { id: 4, values: [] },
        { id: 5, values: [] },
        { id: 6, values: [] },
        { id: 7, values: [] },
        { id: 8, values: [] },
        { id: 9, values: [] },
      ];

      for (let i = 0; i < head.puestos.length; i++) {
        for (let j = 0; j < head.puestos[i].años.length; j++) {
          for (let s = 0; s < MONTHS.length; s++) {
            if (j === 0 || head.puestos[i].incremento === 0) {
              valor =
                Number(head.puestos[i].años[j].volMeses[MONTHS[s]]) *
                  Number(head.puestos[i].total) || 0;
            } else {
              valor =
                (Number(head.puestos[i].años[j].volMeses[MONTHS[s]]) *
                  Number(head.puestos[i].total) || 0) +
                ((Number(head.puestos[i].años[j].volMeses[MONTHS[s]]) *
                  Number(head.puestos[i].total) || 0) /
                  100) *
                  head.puestos[i].incremento;
            }

            if (arrayvalores[j].values[s] >= 0) {
              arrayvalores[j].values[s] += valor;
              // arrayvalores[j].values[s] = Number(
              //   arrayvalores[j].values[s],
              // )
            } else {
              arrayvalores[j].values.push(valor);
            }
          }
        }
      }

      setVolTotal([...arrayvalores]);
    }
  };

  useEffect(() => {
    initialConfig();
  }, [infoForm]);

  useEffect(() => {
    if (props.data) setInfoForm(props.data);
    initialConfig();
  }, [props]);

  const hideYear = (index) => {
    setVisibleItems((prevItems) => {
      if (prevItems.includes(index)) {
        // Si el elemento ya está en la lista, lo eliminamos para ocultarlo
        return prevItems.filter((id) => id !== index);
      } // Si el elemento no está en la lista, lo agregamos para mostrarlo
      return [...prevItems, index];
    });
  };

  const calcPercent = (total, percent, indexMes, indexYear, cc, head) => {
    if (!total) {
      total = 0;
    }
    const q =
      props.data[cc].puestos[head].años[indexYear].volMeses[MONTHS[indexMes]];

    let calcs = { ...EMPTY_CARGOS };

    if (indexYear === 0) {
      if (q !== 0) {
        calcs[indexYear][indexMes] = total * q;
        calcs[indexYear][indexMes] = calcs[indexYear][indexMes].toFixed(2);
      } else {
        calcs[indexYear][indexMes] = total * q;
      }
    } else if (q !== 0) {
      calcs[indexYear][indexMes] = total * q;
      calcs[indexYear][indexMes] = calcs[indexYear][indexMes].toFixed(2);
    } else {
      calcs[indexYear][indexMes] = total * q;
    }
    return calcs;
  };

  const totHor = (volTotal, total, indexYear, incremento) => {
    let res;
    if (!volTotal || !total) {
      res = 0;
    }
    if (indexYear === 0 || incremento === 0) {
      res = volTotal * total;
      res = res.toFixed(2);
    } else {
      const inicial = volTotal * total;
      res = inicial + ((volTotal * total) / 100) * incremento;
      res = res.toFixed(2);
    }

    return res;
  };

  const addPercentYear = (cc, indexMes, indexYear, head) => {
    let sum = 0;

    sum =
      Number(
        calcPercent(
          infoForm[cc].puestos[head].total,
          infoForm[cc].puestos[head].incremento,
          indexMes,
          indexYear,
          cc,
          head,
        )[indexYear][indexMes],
      ) +
      Number(
        (calcPercent(
          infoForm[cc].puestos[head].total,
          infoForm[cc].puestos[head].incremento,
          indexMes,
          indexYear,
          cc,
          head,
        )[indexYear][indexMes] /
          100) *
          infoForm[cc].puestos[head].incremento,
      );

    return sum;
  };

  const formatearNumero = (numero) => {
    // string con decimales
    const numeroRedondeado = Math.round(Number(numero)); // paso a nuemro para quitarle los decimales

    const inputNumero = Number(numeroRedondeado.toString().replace(/\D/g, '')); // pero necesito un string para ponerle puntos en los miles con replace
    const nuevoNum = inputNumero.toLocaleString('es-AR');
    return nuevoNum;
  };

  return (
    <>
      {infoForm &&
        Object.keys(infoForm).map((cc, indice) => (
          <TabContent value={cc} className="mb-[20px]" key={cc}>
            <FormContainer>
              {infoForm[cc].visible && (
                <section className="contenedor">
                  <div>
                    <div>
                      {Object.keys(infoForm[cc].puestos).map((head, index) => (
                        <div className="flex  gap-x-3 gap-y-3 " key={head.name}>
                          <FormItem
                            className={`${
                              index === 0 ? 'mt-12 w-[210px]' : 'mb-2 w-[210px]'
                            }`}
                          >
                            <Input
                              className={`${
                                index === 0
                                  ? 'capitalize mt-10'
                                  : 'capitalize mt-5'
                              }`}
                              disabled
                              type="text"
                              name="name"
                              value={infoForm[cc].puestos[head].name}
                            />
                          </FormItem>

                          {infoForm[cc].puestos[head].años.map(
                            (año, indexYear) => (
                              <div className="flex flex-col" key={indexYear}>
                                {index === 0 && (
                                  <div className="titleRow min-w-[62px]">
                                    <p className="cursor-default">
                                      {' '}
                                      Año {año.año}
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
                                )}

                                <div className="titleMonths gap-x-3 gap-y-1 mt-[18px] flex flex-col">
                                  {index === 0 && (
                                    <div className="titleMonths gap-x-3 flex">
                                      {visibleItems.includes(indexYear) &&
                                        año &&
                                        Object.keys(año.volMeses).map(
                                          (mes, indexMes) => (
                                            <p
                                              key={indexMes}
                                              className="month w-[90px] capitalize cursor-default"
                                            >
                                              {
                                                Object.keys(año.volMeses)[
                                                  indexMes
                                                ]
                                              }
                                            </p>
                                          ),
                                        )}
                                      <p className="month w-[90px] cursor-default">
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
                                              index === 0 ? 'mb-0' : 'mb-0'
                                            }`}
                                            key={indexMes}
                                          >
                                            <Tooltip
                                              placement="top-end"
                                              title={
                                                currency +
                                                formatNumber(
                                                  calcPercent(
                                                    infoForm[cc].puestos[head]
                                                      .total,
                                                    infoForm[cc].puestos[head]
                                                      .incremento,
                                                    indexMes,
                                                    indexYear,
                                                    cc,
                                                    head,
                                                  )[indexYear][indexMes],
                                                )
                                              }
                                            >
                                              <Input
                                                className="w-[90px]"
                                                type="text"
                                                disabled
                                                prefix={currency}
                                                value={
                                                  infoForm[cc].puestos[head]
                                                    .incremento === 0 ||
                                                  indexYear === 0
                                                    ? formatearNumero(
                                                        calcPercent(
                                                          infoForm[cc].puestos[
                                                            head
                                                          ].total,
                                                          infoForm[cc].puestos[
                                                            head
                                                          ].incremento,
                                                          indexMes,
                                                          indexYear,
                                                          cc,
                                                          head,
                                                        )[indexYear][indexMes],
                                                      )
                                                    : addPercentYear(
                                                        cc,
                                                        indexMes,
                                                        indexYear,
                                                        head,
                                                      )
                                                }
                                                name="month"
                                              />
                                            </Tooltip>
                                          </FormItem>
                                        ),
                                      )}

                                    <FormItem className="mb-0">
                                      <Tooltip
                                        placement="top-end"
                                        title={
                                          currency +
                                          formatearNumero(
                                            totHor(
                                              infoForm[cc].puestos[head].total,
                                              infoForm[cc].puestos[head].años[
                                                indexYear
                                              ].volTotal,
                                            ),
                                          )
                                        }
                                      >
                                        <Input
                                          className="w-[90px]"
                                          type="text"
                                          disabled
                                          prefix={currency}
                                          value={formatearNumero(
                                            totHor(
                                              infoForm[cc].puestos[head].total,
                                              infoForm[cc].puestos[head].años[
                                                indexYear
                                              ].volTotal,
                                              indexYear,
                                              infoForm[cc].puestos[head]
                                                .incremento,
                                            ),
                                          )}
                                        />
                                      </Tooltip>
                                    </FormItem>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </FormContainer>
          </TabContent>
        ))}

      {infoForm && (
        <div className="bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px] h-[230px]">
          <div className="flex items-center">
            <p className=" text-[#707470] font-bold mb-3 text-left cursor-default w-[500px] ">
              Total
            </p>
          </div>
          <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
            {infoForm[head].puestos.length > 0 &&
              infoForm[head].puestos.map((puesto, index) => (
                <div
                  key={index}
                  className="flex gap-x-3 w-fit pt-3 ml-[200px] "
                >
                  {AÑOS.map((año, indexYear) => (
                    <div className="flex flex-col" key={indexYear}>
                      {index === 0 && (
                        <div className="titleRowR min-w-[62px]">
                          <p className="cursor-default"> Año {indexYear + 1}</p>
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
                      )}
                      <div className="titleMonths gap-x-3 flex mb-3">
                        {visibleItems.includes(indexYear) &&
                          año &&
                          index === 0 &&
                          MONTHS.map((mes, indexMes) => (
                            <p
                              key={indexMes}
                              className="month w-[90px] cursor-default capitalize"
                            >
                              {mes}
                            </p>
                          ))}
                        {index === 0 && (
                          <p className="month w-[90px] cursor-default">Total</p>
                        )}
                        {index !== 0 && <p className="month w-[90px]" />}
                      </div>
                      <div className="flex gap-x-3 gap-y-3">
                        {index === 0 &&
                          visibleItems.includes(indexYear) &&
                          año &&
                          volTotal.length !== 0 &&
                          volTotal[indexYear].values.map((valor, index) => (
                            <p className="w-[90px] text-center cursor-default">
                              <Tooltip
                                placement="top-end"
                                title={currency + formatearNumero(valor)}
                              >
                                {currency}
                                {formatearNumero(valor)}
                              </Tooltip>
                            </p>
                          ))}
                        <p className="w-[90px] text-center font-bold cursor-default">
                          <Tooltip
                            placement="top-end"
                            title={
                              currency +
                              formatearNumero(
                                volTotal[indexYear]?.values.reduce(
                                  (total, current) =>
                                    Math.round(Number(total) + Number(current)),
                                  0,
                                ),
                              )
                            }
                          >
                            {index === 0 && currency}
                            {index === 0 &&
                              volTotal[indexYear] &&
                              formatearNumero(
                                volTotal[indexYear]?.values.reduce(
                                  (total, current) =>
                                    Math.round(Number(total) + Number(current)),
                                  0,
                                ),
                              )}
                          </Tooltip>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default TablePuestosPxQ;
