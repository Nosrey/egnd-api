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
  Tooltip,
} from 'components/ui';
import { AÑOS, MONTHS, optionsIncremento } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { createCapexP } from 'services/Requests';

function TableCapexP(props) {
  const [infoForm, setInfoForm] = useState();
  const [visibleItems, setVisibleItems] = useState([0]);
  const currency = useSelector((state) => state.auth.user.currency);

  useEffect(() => {
    if (props.data) setInfoForm(props.data);
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

  const handleOnChangeInitialValue = (id, newValue, key, mes, indexYear) => {
    const newData = [...infoForm];
    const ctaIndex = newData.findIndex((bien) => bien.id === id);

    let cuenta = {
      ...newData[ctaIndex],
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

    newData[ctaIndex] = cuenta;
    setInfoForm(newData);
  };

  const submitInfoForm = () => {
    createCapexP(infoForm)
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        props.showAlertSuces(true);
        setTimeout(() => {
          props.showAlertSuces(false);
        }, 5000);
      })
      .catch((error) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        props.errorMessage('Ha ocurrido un error');
        props.showErrorAlert(true);
        setTimeout(() => {
          props.showErrorAlert(false);
        }, 5000);
      });
  };

  const calcTotals = () => {
    let total = [];
    if (infoForm) {
      infoForm.map((d) => {
        for (let i = 0; i <= 9; i++) {
          if (!total[i]) {
            total.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          }
          for (let j = 0; j <= 11; j++) {
            total[i][j] += Number(d.años[i].volMeses[MONTHS[j]]);
          }
        }
      });

      return total;
    }
  };

  const totals = calcTotals();

  return (
    <>
      {infoForm && (
        <FormContainer>
          {infoForm && (
            <section className="contenedor">
              {infoForm.map((cta, index) => (
                <div className="flex  gap-x-3 " key={cta.name}>
                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Bien</p>
                      </div>
                    )}
                    <FormItem
                      className={`${
                        index === 0 ? 'w-[210px]' : 'mb-2  w-[210px]'
                      }`}
                    >
                      <Input
                        className={`${
                          index === 0 ? 'capitalize mt-10' : 'capitalize mt-5'
                        }`}
                        disabled
                        type="text"
                        name="name"
                        value={cta.bien}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Descripcion</p>
                      </div>
                    )}
                    <FormItem
                      className={`${
                        index === 0 ? 'w-[210px]' : 'mb-2  w-[210px]'
                      }`}
                    >
                      <Input
                        className={`${
                          index === 0 ? 'capitalize mt-10' : 'capitalize mt-5'
                        }`}
                        disabled
                        type="text"
                        name="name"
                        value={cta.descripcion}
                      />
                    </FormItem>
                  </div>

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
                        value={cta.precioInicial}
                        onChange={(e) =>
                          handleOnChangeInitialValue(
                            cta.id,
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
                        type="number"
                        name="tasa"
                        prefix="%"
                        value={cta.tasa}
                        onChange={(e) =>
                          handleOnChangeInitialValue(
                            cta.id,
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
                          (option) => option.value === cta.incremento,
                        )}
                        onChange={(e) =>
                          handleOnChangeInitialValue(
                            cta.id,
                            e.value,
                            'mesInicial',
                          )
                        }
                      />
                    </FormItem>
                  </div>

                  {cta.años.map((año, indexYear) => (
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
                                  title={`${mes} - año ${indexYear + 1}`}
                                >
                                  <Input
                                    className="w-[90px]"
                                    type="number"
                                    value={
                                      cta.años[indexYear].volMeses[
                                        Object.keys(año.volMeses)[indexMes]
                                      ]
                                    }
                                    name="month"
                                    prefix={currency}
                                    onChange={(e) => {
                                      handleOnChangeInitialValue(
                                        cta.id,
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

      {infoForm && (
        <div className="bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px]">
          <div className="flex items-center">
            <p className=" text-[#707470] font-bold mb-3 text-left w-[500px] ">
              Inversion neta (alta)
            </p>
          </div>
          <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
            {infoForm.length > 0 && (
              <div className="flex gap-x-3 w-fit pt-3 ml-[750px] ">
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
                    </div>
                    <div className="flex gap-x-3 gap-y-3">
                      {visibleItems.includes(indexYear) &&
                        año &&
                        props.data.length !== 0 &&
                        MONTHS.map((valor, index) => (
                          <p className="w-[90px] text-center">
                            <p className="w-[90px] text-center">
                              {currency}
                              {totals[indexYear][index]}
                            </p>
                          </p>
                        ))}
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

export default TableCapexP;
