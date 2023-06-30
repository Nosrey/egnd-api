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
  Select,
  Tabs,
  Tooltip,
} from 'components/ui';
import { AÑOS, MONTHS, optionsIncremento } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { createGastosPorCC } from 'services/Requests';

const { TabContent } = Tabs;

function TablePuestosPxQ(props) {
  const [infoForm, setInfoForm] = useState();
  const [head, setHeads] = useState(props.head);
  const [visibleItems, setVisibleItems] = useState([0]);
  const currency = useSelector((state) => state.auth.user.currency);
  const [sumVerticales, setSumVerticales] = useState({});
  const [volTotal, setVolTotal] = useState([]);

  const initialConfig = () => {
    if (props.puestosP && props.head) {
      const head = { ...props.puestosP[props.head] };

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
            let valor =
              Number(head.puestos[i].años[j].volMeses[MONTHS[s]]) *
                Number(head.puestos[i].total) || 0;

            if (arrayvalores[j].values[s] >= 0) {
              arrayvalores[j].values[s] += valor;
              arrayvalores[j].values[s] = Number(
                arrayvalores[j].values[s],
              ).toFixed(2);
            } else {
              arrayvalores[j].values.push(valor);
            }
          }
        }
      }
      setVolTotal([...arrayvalores]);
    }
  };

  // Logica para mostrar las SUMATORIAS VERTICALES ,
  const generateSumVertical = () => {
    if (infoForm) {
      const copy = { ...infoForm };
      const keyArray = Object.keys(copy);
      for (let i = 0; i < keyArray.length; i++) {
        // admin
        const suma = [];
        for (let x = 0; x < copy[keyArray[i]].cuentas.length; x++) {
          const sumacta = [];
          let cuenta = copy[keyArray[i]].cuentas[x];
          for (let p = 0; p < cuenta.años.length; p++) {
            for (let s = 0; s < MONTHS.length; s++) {
              sumacta.push(cuenta.años[p].volMeses[MONTHS[s]]);
            }
          }
          suma.push(sumacta);
        }
        // obtengo un array de 120 nrs
        const resultadoAcumulado = suma.reduce((acumulador, array) =>
          acumulador.map(
            (valor, índice) =>
              parseInt(valor, 10) + parseInt(array[índice], 10),
          ),
        );
        // obtengo 10 arrays de 12 num cda unos , osea uno por anio
        const chunks = [];
        let index = 0;
        while (index < resultadoAcumulado.length) {
          chunks.push(resultadoAcumulado.slice(index, index + 12));
          index += 12;
        }
        copy[keyArray[i]].sum = chunks;
      }
      // eslint-disable-next-line arrow-body-style
      setSumVerticales(() => {
        return { ...copy };
      });
    }
  };

  useEffect(() => {
    if (infoForm && props.head) {
      initialConfig();
      setHeads(props.head);
      generateSumVertical();
    }
  }, [infoForm]);

  useEffect(() => {
    initialConfig();
    if (props.data) setInfoForm(props.data);
    setHeads(props.head);
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
    let idUser = localStorage.getItem('userId');
    const keyArray = Object.keys(infoForm);
    const copy = { ...infoForm };
    for (let x = 0; x < keyArray.length; x++) {
      copy[keyArray[x]].sum = [];
    }
    const body = [copy];
    const data = { body, idUser };

    // createGastosPorCC(data)
    //   .then(() => {
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    //     props.showAlertSuces(true);
    //     setTimeout(() => {
    //       props.showAlertSuces(false);
    //     }, 5000);
    //   })
    //   .catch((error) => {
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    //     props.showAlertError(true);
    //     setTimeout(() => {
    //       props.showAlertError(false);
    //     }, 5000);
    //   });
  };

  return (
    <>
      {infoForm && (
        <FormContainer>
          {infoForm[head].visible && (
            <section className="contenedor">
              {Object.keys(infoForm[head].cuentas).map((cta, index) => (
                <div className="flex  gap-x-3 " key={cta.name}>
                  <FormItem
                    className={`${
                      index === 0 ? 'mt-12 w-[210px]' : 'mb-2  w-[210px]'
                    }`}
                  >
                    <Input
                      className={`${
                        index === 0 ? 'capitalize mt-10' : 'capitalize mt-5'
                      }`}
                      disabled={!infoForm[head].cuentas[cta].isNew}
                      type="text"
                      name="name"
                      value={infoForm[head].cuentas[cta].name}
                      onChange={(e) =>
                        props.handleEditPuesto(
                          infoForm[head].cuentas[cta],
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
                        disabled={index === 0}
                        prefix={currency}
                        value={infoForm[head].cuentas[cta].precioInicial}
                        onChange={(e) =>
                          handleOnChangeInitialValue(
                            head,
                            infoForm[head].cuentas[cta].id,
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
                        disabled={index === 0}
                        prefix="%"
                        value={parseInt(infoForm[head].cuentas[cta].tasa, 10)}
                        onChange={(e) =>
                          handleOnChangeInitialValue(
                            head,
                            infoForm[head].cuentas[cta].id,
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
                      {index === 0 ? (
                        <Input type="number" disabled />
                      ) : (
                        <Select
                          name="incremento"
                          placeholder="Inicio de Actividades"
                          options={optionsIncremento}
                          value={optionsIncremento.filter(
                            (option) =>
                              option.value ===
                              infoForm[head].cuentas[cta].incremento,
                          )}
                          onChange={(e) =>
                            handleOnChangeInitialValue(
                              head,
                              infoForm[head].cuentas[cta].id,
                              e.value,
                              'mesInicial',
                            )
                          }
                        />
                      )}
                    </FormItem>
                  </div>

                  {infoForm[head].cuentas[cta].años.map((año, indexYear) => (
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
                              Object.keys(año.volMeses).map((mes, indexMes) => (
                                <p
                                  key={indexMes}
                                  className="month w-[90px] capitalize"
                                >
                                  {Object.keys(año.volMeses)[indexMes]}
                                </p>
                              ))}
                            <p className="month w-[90px]">Total</p>
                          </div>
                        )}
                        <div className="flex gap-x-3 gap-y-3">
                          {visibleItems.includes(indexYear) &&
                            año &&
                            Object.keys(año.volMeses).map((mes, indexMes) => (
                              <FormItem
                                className={`${index === 0 ? 'mb-0' : 'mb-0'}`}
                                key={indexMes}
                              >
                                <Tooltip
                                  placement="top-end"
                                  title={
                                    index === 0
                                      ? volTotal[indexYear].values[indexMes]
                                      : infoForm[head].cuentas[cta].años[
                                          indexYear
                                        ].volMeses[
                                          Object.keys(año.volMeses)[indexMes]
                                        ]
                                  }
                                >
                                  <Input
                                    className="w-[90px]"
                                    type="number"
                                    disabled={index === 0}
                                    value={
                                      index === 0
                                        ? volTotal[indexYear].values[indexMes]
                                        : infoForm[head].cuentas[cta].años[
                                            indexYear
                                          ].volMeses[
                                            Object.keys(año.volMeses)[indexMes]
                                          ]
                                    }
                                    name="month"
                                    prefix={currency}
                                    onChange={(e) => {
                                      handleOnChangeInitialValue(
                                        head,
                                        infoForm[head].cuentas[cta].id,
                                        e.target.value,
                                        'mes',
                                        MONTHS[indexMes],
                                        indexYear,
                                      );
                                    }}
                                  />
                                </Tooltip>
                              </FormItem>
                            ))}
                          <FormItem className="mb-0">
                            <Input
                              className="w-[90px]"
                              type="number"
                              disabled
                              prefix={currency}
                              value={
                                infoForm[head].cuentas[cta].precioInicial
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
            </section>
          )}
        </FormContainer>
      )}

      {infoForm && Object.keys(sumVerticales).length !== 0 && (
        <div className="bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px]">
          <div className="flex items-center">
            <p className=" text-[#707470] font-bold mb-3 text-left w-[500px] ">
              Total
            </p>
          </div>
          <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
            {sumVerticales[head].sum.length > 0 && (
              <div className="flex gap-x-3 w-fit pt-3 ml-[520px] ">
                {AÑOS.map((año, indexYear) => (
                  <div className="flex flex-col" key={indexYear}>
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
                    <div className="titleMonths gap-x-3 flex mb-3">
                      {visibleItems.includes(indexYear) &&
                        año &&
                        MONTHS.map((mes, indexMes) => (
                          <p
                            key={indexMes}
                            className="month w-[90px] capitalize"
                          >
                            {mes}
                          </p>
                        ))}
                      <p className="month w-[90px]">Total</p>
                    </div>
                    <div className="flex gap-x-3 gap-y-3">
                      {visibleItems.includes(indexYear) &&
                        año &&
                        sumVerticales[head].sum.length !== 0 &&
                        sumVerticales[head].sum[indexYear].map(
                          (valor, index) => (
                            <p className="w-[90px] text-center">{valor}</p>
                          ),
                        )}
                      <p className="w-[90px] text-center font-bold">
                        {sumVerticales[head].sum[indexYear].reduce(
                          (acumulador, numero) => acumulador + numero,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
