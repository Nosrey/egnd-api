/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Tabs,
  Select,
  Tooltip,
} from 'components/ui';
import { AÑOS, MONTHS, optionsIncremento } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';

const { TabContent } = Tabs;

function TablePuestosPxQ(props) {
  const [infoForm, setInfoForm] = useState();
  const [showRemovePuesto, setShowRemovePuesto] = useState(false);
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

      for (let i = 0; i < head.cuentas.length; i++) {
        for (let j = 0; j < head.cuentas[i].años.length; j++) {
          for (let s = 0; s < MONTHS.length; s++) {
            const valor =
              head.cuentas[i].años[j].volMeses[MONTHS[s]] *
                Number(head.cuentas[i].total) || 0;
            if (arrayvalores[j].values[s] >= 0) {
              arrayvalores[j].values[s] += valor;
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

  const replaceMonth = (producto, indexYear, mes, value) => {
    console.log(value);
    let newAños = [...producto.años];
    const newMeses = { ...newAños[indexYear].volMeses };
    newMeses[mes] = value !== '' ? value : null;
    const volTotal = Object.values(newMeses).reduce(
      (acc, curr) => acc + parseInt(curr, 10),
      0,
    );
    newAños[indexYear] = {
      ...newAños[indexYear],
      volMeses: newMeses,
      volTotal,
    };

    return newAños;
  };

  const fillMonthsPrices = (cuenta, yearIndex) => {
    let newAños = [...cuenta.años];
    let precioActual = cuenta.precioInicial;
    let currentMonth = 1;
    for (let i = yearIndex >= 0 ? yearIndex : 0; i < newAños.length; i++) {
      const newMeses = { ...newAños[i].volMeses };
      let volTotal = 0;
      for (let mes in newMeses) {
        newMeses[mes] = parseInt(precioActual, 10);
        volTotal += parseInt(parseInt(precioActual, 10), 10);
        if (cuenta.incremento === 'mensual') {
          precioActual *= 1 + parseInt(cuenta.tasa, 10) / 100;
          currentMonth++;
        } else if (cuenta.incremento === 'trimestral') {
          if (
            mes === 'marzo' ||
            mes === 'junio' ||
            mes === 'septiembre' ||
            mes === 'diciembre'
          ) {
            precioActual *= 1 + parseInt(cuenta.tasa, 10) / 100;
            currentMonth++;
          }
        } else if (cuenta.incremento === 'anual') {
          if (mes === 'diciembre') {
            precioActual *= 1 + parseInt(cuenta.tasa, 10) / 100;
            currentMonth++;
          }
        }
        currentMonth++;
      }
      newAños[i] = {
        ...newAños[i],
        volMeses: newMeses,
        volTotal,
      };
    }
    return newAños;
  };

  const handleOnChangeInitialValue = (
    cc,
    idCuenta,
    newValue,
    key,
    mes,
    indexYear,
  ) => {
    const newData = { ...infoForm };
    const ctaIndex = newData[cc].cuentas.findIndex(
      (cta) => cta.id === idCuenta,
    );

    let cuenta = {
      ...newData[cc].cuentas[ctaIndex],
    };
    switch (key) {
      case 'mes':
        cuenta.años = replaceMonth(
          cuenta,
          indexYear,
          mes,
          newValue === ''
            ? 0
            : newValue[0] === '0'
            ? newValue.substring(1)
            : newValue,
        );
        break;
      case 'precioInicial':
        cuenta.precioInicial = newValue;
        cuenta.años = fillMonthsPrices(cuenta, -1);
        break;

      case 'tasa':
        cuenta.tasa = newValue;
        cuenta.años = fillMonthsPrices(cuenta, -1);
        break;

      case 'mesInicial':
        cuenta.incremento = newValue;
        cuenta.años = fillMonthsPrices(cuenta, -1);
        break;

      default:
        break;
    }

    newData[cc].cuentas[ctaIndex] = cuenta;
    setInfoForm(newData);
  };

  const submitInfoForm = () => {
    const copyData = { ...infoForm };
    console.log(copyData);
    // let submit = true;

    // if (submit) {
    //   props.postPuestoPxQData([infoForm]);
    // }
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
                      {}
                      {Object.keys(infoForm[cc].cuentas).map((head, index) => (
                        <div className="flex  gap-x-3 " key={head.name}>
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
                              disabled={!infoForm[cc].cuentas[head].isNew}
                              type="text"
                              name="name"
                              value={infoForm[cc].cuentas[head].name}
                              onChange={(e) =>
                                props.handleEditPuesto(
                                  infoForm[cc].cuentas[head],
                                  e.target.value,
                                  e.target.name,
                                )
                              }
                            />
                          </FormItem>

                          <div className="flex flex-col">
                            {index === 0 && (
                              <div className="titleRow min-w-[62px]">
                                <p> Valor Inicial</p>
                              </div>
                            )}

                            <FormItem
                              className={`${
                                index === 0
                                  ? 'mt-[40px] w-[100px]'
                                  : 'mt-[20px] w-[100px]'
                              }`}
                            >
                              <Input
                                type="number"
                                name="precioInicial"
                                prefix={currency}
                                value={infoForm[cc].cuentas[head].precioInicial}
                                onChange={(e) =>
                                  handleOnChangeInitialValue(
                                    cc,
                                    infoForm[cc].cuentas[head].id,
                                    e.target.value,
                                    'precioInicial',
                                    null,
                                    null,
                                  )
                                }
                              />
                            </FormItem>
                          </div>

                          <div className="flex flex-col">
                            {index === 0 && (
                              <div className="titleRow min-w-[62px]">
                                <p> Tasa</p>
                              </div>
                            )}

                            <FormItem
                              className={`${
                                index === 0
                                  ? 'mt-[40px] w-[100px]'
                                  : 'mt-[20px] w-[100px]'
                              }`}
                            >
                              <Input
                                placeholder="0"
                                type="number"
                                name="tasa"
                                prefix="%"
                                value={parseInt(
                                  infoForm[cc].cuentas[head].tasa,
                                  10,
                                )}
                                onChange={(e) =>
                                  handleOnChangeInitialValue(
                                    cc,
                                    infoForm[cc].cuentas[head].id,
                                    e.target.value,
                                    'tasa',
                                    null,
                                    null,
                                  )
                                }
                              />
                            </FormItem>
                          </div>

                          <div className="flex flex-col">
                            {index === 0 && (
                              <div className="titleRow min-w-[62px]">
                                <p>Incremento</p>
                              </div>
                            )}

                            <FormItem
                              className={`${
                                index === 0
                                  ? 'mt-[40px] w-[100px]'
                                  : 'mt-[20px] w-[100px]'
                              }`}
                            >
                              <Select
                                name="incremento"
                                placeholder="Inicio de Actividades"
                                options={optionsIncremento}
                                value={optionsIncremento.filter(
                                  (option) =>
                                    option.value ===
                                    infoForm[cc].cuentas[head].incremento,
                                )}
                                onChange={(e) =>
                                  handleOnChangeInitialValue(
                                    cc,
                                    infoForm[cc].cuentas[head].id,
                                    e.value,
                                    'mesInicial',
                                  )
                                }
                              />
                            </FormItem>
                          </div>

                          {infoForm[cc].cuentas[head].años.map(
                            (año, indexYear) => (
                              <div className="flex flex-col" key={indexYear}>
                                {index === 0 && (
                                  <div className="titleRow min-w-[62px]">
                                    <p> Año {año.año}</p>
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
                                              className="month w-[90px] capitalize"
                                            >
                                              {
                                                Object.keys(año.volMeses)[
                                                  indexMes
                                                ]
                                              }
                                            </p>
                                          ),
                                        )}
                                      <p className="month w-[90px]">Total</p>
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
                                              title={`${mes} - año ${
                                                indexYear + 1
                                              }`}
                                            >
                                              <Input
                                                className="w-[90px]"
                                                type="number"
                                                value={
                                                  infoForm[cc].cuentas[head]
                                                    .años[indexYear].volMeses[
                                                    Object.keys(año.volMeses)[
                                                      indexMes
                                                    ]
                                                  ]
                                                }
                                                name="month"
                                                prefix={currency}
                                                onChange={(e) => {
                                                  handleOnChangeInitialValue(
                                                    cc,
                                                    infoForm[cc].cuentas[head]
                                                      .id,
                                                    e.target.value,
                                                    'mes',
                                                    MONTHS[indexMes],
                                                    indexYear,
                                                  );
                                                }}
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
                                        value={
                                          infoForm[cc].cuentas[head]
                                            .precioInicial
                                            ? año.volTotal
                                            : 0
                                        }
                                      />
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
        <div className="bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px]">
          <div className="flex items-center">
            <p className=" text-[#707470] font-bold mb-3 text-left w-[500px] ">
              Total
            </p>
          </div>
          <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
            {infoForm[head].cuentas.length > 0 &&
              infoForm[head].cuentas.map((puesto, index) => (
                <div
                  key={index}
                  className="flex gap-x-3 w-fit pt-3 ml-[550px] "
                >
                  {AÑOS.map((año, indexYear) => (
                    <div className="flex flex-col" key={indexYear}>
                      {index === 0 && (
                        <div className="titleRowR min-w-[62px]">
                          <p> Año {indexYear + 1}</p>
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
                              className="month w-[90px] capitalize"
                            >
                              {mes}
                            </p>
                          ))}
                        {index === 0 && <p className="month w-[90px]">Total</p>}
                        {index !== 0 && <p className="month w-[90px]" />}
                      </div>
                      <div className="flex gap-x-3 gap-y-3">
                        {index === 0 &&
                          visibleItems.includes(indexYear) &&
                          año &&
                          volTotal.length !== 0 &&
                          volTotal[indexYear].values.map((valor, index) => (
                            <p className="w-[90px] text-center">{valor}</p>
                          ))}
                        <p className="w-[90px] text-center font-bold">
                          {index === 0 &&
                            volTotal[indexYear] &&
                            volTotal[indexYear].values.reduce(
                              (total, current) => total + current,
                            )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
      <Button
        className="border mt-6b btnSubmitTable mt-[40px]"
        variant="solid"
        type="submit"
        onClick={submitInfoForm}
      >
        Guardar
      </Button>
    </>
  );
}

export default TablePuestosPxQ;
