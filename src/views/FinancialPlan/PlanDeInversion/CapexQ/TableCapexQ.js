/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import ShortNumberNotation from 'components/shared/shortNumberNotation/ShortNumberNotation';
import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Select,
  Tooltip,
} from 'components/ui';
import { AÑOS, MONTHS, optionsBienes } from 'constants/forms.constants';
import { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

function TableCapexQ(props) {
  const [visibleItems, setVisibleItems] = useState([0]);
  const [showRemoveProd, setShowRemoveProd] = useState(false);

  const currency = useSelector((state) => state.auth.user.currency);

  const hideYear = (index) => {
    setVisibleItems((prevItems) => {
      if (prevItems.includes(index)) {
        // Si el elemento ya está en la lista, lo eliminamos para ocultarlo
        return prevItems.filter((id) => id !== index);
      } // Si el elemento no está en la lista, lo agregamos para mostrarlo
      return [...prevItems, index];
    });
  };

  const handleChangeBien = (id, e) => {
    const bien = props.data.findIndex((bien) => bien.id === id);
    const copyBien = [...props.data];
    copyBien[bien].bien = e.value;
    copyBien[bien].unidad = e.medida;

    props.setBienes([...copyBien]);
  };

  const handleChangeDesc = (id, e) => {
    const bien = props.data.findIndex((bien) => bien.id === id);
    const copyBien = [...props.data];
    copyBien[bien].descripcion = e.target.value;

    props.setBienes([...copyBien]);
  };

  const handleChangeValues = (id, e, year, month) => {
    const inputNumero = Number(e.target.value.replace(/\D/g, ''));

    const bien = props.data.findIndex((bien) => bien.id === id);
    const copyBien = [...props.data];
    copyBien[bien].años[year].volMeses[month] = inputNumero;
    copyBien[bien].años[year].volTotal = Object.values(
      copyBien[bien].años[year].volMeses,
    ).reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue),
      0,
    );

    props.setBienes([...copyBien]);
  };

  const removeBien = (id) => {
    props.setBienes(props.data.filter((item) => id !== item.id));
    if (props.data.length === 1) {
      props.setBienes([
        {
          id: uuid(),
          bien: '',
          descripcion: '',
          unidad: '',
          años: JSON.parse(JSON.stringify(AÑOS)),
        },
      ]);
    }
  };

  const calcTotals = () => {
    let total = [];
    props.data.map((d) => {
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
  };

  const formatearNumero = (numero) => {
    const numeroRedondeado = Math.round(numero);
    const nuevoNum = numeroRedondeado.toLocaleString('es-AR');
    return nuevoNum;
  };

  const totals = calcTotals();

  return (
    <>
      {props.data && (
        <div>
          <FormContainer>
            <section className="contenedor">
              {props.data.map((cta, index) => (
                <div className="flex  gap-x-3 " key={cta.id}>
                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Bien</p>
                      </div>
                    )}

                    <div className="inline-block flex items-center gap-4">
                      {showRemoveProd && (
                        <Button
                          shape="circle"
                          size="sm"
                          variant="twoTone"
                          color="red-600"
                          className="mb-0"
                          icon={<MdDelete />}
                          onClick={() => removeBien(cta.id)}
                        />
                      )}
                      <FormItem
                        className={`${
                          index === 0
                            ? 'mt-[40px] w-[200px] '
                            : 'mt-[20px] w-[200px]'
                        }`}
                      >
                        <Select
                          name="bien"
                          placeholder="Seleccione un Bien"
                          options={optionsBienes}
                          value={optionsBienes.filter(
                            (option) => option.value === cta.bien,
                          )}
                          onChange={(e) => handleChangeBien(cta.id, e)}
                        />
                      </FormItem>
                    </div>
                  </div>

                  <div className="flex flex-col ">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p> Descripción</p>
                      </div>
                    )}

                    <FormItem
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[300px]'
                          : 'mt-[20px] w-[300px]'
                      }`}
                    >
                      <Input
                        name="descripcion"
                        value={cta.descripcion}
                        onChange={(e) => handleChangeDesc(cta.id, e)}
                      />
                    </FormItem>
                  </div>

                  <div className="flex flex-col">
                    {index === 0 && (
                      <div className="titleRow min-w-[62px]">
                        <p>Unidad</p>
                      </div>
                    )}

                    <FormItem
                      className={`${
                        index === 0
                          ? 'mt-[40px] w-[100px]'
                          : 'mt-[20px] w-[100px]'
                      }`}
                    >
                      <Input name="unidad" disabled value={cta.unidad} />
                    </FormItem>
                  </div>

                  {cta.años.map((año, indexYear) => (
                    <div className="flex flex-col" key={indexYear}>
                      {index === 0 && (
                        <div className="titleRow min-w-[62px]">
                          <p className="cursor-default"> Año {año.año}</p>
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
                                  title={formatearNumero(
                                    cta.años[indexYear].volMeses[mes],
                                  )}
                                  name="month"
                                  onChange={(e) => {
                                    handleChangeValues(
                                      cta.id,
                                      e,
                                      indexYear,
                                      mes,
                                    );
                                  }}
                                >
                                  <Input
                                    className="w-[90px]"
                                    type="text"
                                    value={formatearNumero(
                                      cta.años[indexYear].volMeses[mes],
                                    )}
                                    name="month"
                                    onChange={(e) => {
                                      handleChangeValues(
                                        cta.id,
                                        e,
                                        indexYear,
                                        mes,
                                      );
                                    }}
                                  />
                                </Tooltip>
                              </FormItem>
                            ))}
                          <FormItem className="mb-0">
                            <Tooltip
                              placement="top-end"
                              title={formatearNumero(
                                cta.años[indexYear].volTotal,
                              )}
                            >
                              <Input
                                className="w-[90px]"
                                type="text"
                                value={formatearNumero(
                                  cta.años[indexYear].volTotal,
                                )}
                                disabled
                              />
                            </Tooltip>
                          </FormItem>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>
            <div className="flex justify-between gap-x-2 w-[300px]">
              {props.data ? (
                <Button
                  style={{
                    width: '47%',
                  }}
                  className=" flex justify-center items-center"
                  // variant="solid"
                  variant="twoTone"
                  // color="blue-600"
                  color="red-600"
                  onClick={() => {
                    setShowRemoveProd(!showRemoveProd);
                  }}
                >
                  {showRemoveProd === true ? 'Anular' : 'Eliminar item'}
                </Button>
              ) : (
                <div
                  style={{
                    width: '47%',
                  }}
                  className=" flex justify-center items-center"
                />
              )}

              <Button
                style={{
                  width: '47%',
                }}
                className=" flex justify-center items-center"
                // variant="solid"
                variant="twoTone"
                type="button"
                onClick={() => {
                  props.addBien({
                    id: uuid(),
                    bien: '',
                    descripcion: '',
                    unidad: '',
                    tasa: 0,
                    precioInicial: 0,
                    incremento: 'mensual',
                    años: JSON.parse(JSON.stringify(AÑOS)),
                  });
                }}
              >
                Agregar item
              </Button>
            </div>
          </FormContainer>
        </div>
      )}

      {props.data.length !== 0 && (
        <div className="bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px]">
          <div className="flex items-center">
            <p className=" text-[#707470] font-bold mb-3 cursor-default text-left w-[500px] ">
              Inversion neta (alta)
            </p>
          </div>
          <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
            {props.data.length > 0 && (
              <div className="flex gap-x-3 w-fit pt-3 ml-[620px] ">
                {AÑOS.map((año, indexYear) => (
                  <div className="flex flex-col" key={indexYear}>
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
                    <div className="titleMonths gap-x-3 flex mb-3">
                      {visibleItems.includes(indexYear) &&
                        año &&
                        MONTHS.map((mes, indexMes) => (
                          <p
                            key={indexMes}
                            className="month cursor-default w-[90px] capitalize"
                          >
                            {mes}
                          </p>
                        ))}
                      <p className="month w-[90px] cursor-default">Total</p>
                    </div>
                    <div className="flex gap-x-3 gap-y-3">
                      {visibleItems.includes(indexYear) &&
                        año &&
                        props.data.length !== 0 &&
                        MONTHS.map((valor, index) => (
                          <Tooltip
                            placement="top-end"
                            title={formatearNumero(totals[indexYear][index])}
                          >
                            <p className="w-[90px] text-center cursor-default">
                              <ShortNumberNotation
                                numero={totals[indexYear][index]}
                              />
                            </p>
                          </Tooltip>
                        ))}
                      <Tooltip
                        placement="top-end"
                        title={formatearNumero(
                          totals[indexYear].reduce(
                            (acumulador, numero) => acumulador + numero,
                            0,
                          ),
                        )}
                      >
                        <p className="w-[90px] text-center font-bold cursor-default">
                          <ShortNumberNotation
                            numero={totals[indexYear].reduce(
                              (acumulador, numero) => acumulador + numero,
                              0,
                            )}
                          />
                        </p>
                      </Tooltip>
                    </div>
                  </div>
                ))}
                /
              </div>
            )}
          </div>
        </div>
      )}
      <Button
        className="border mt-6b btnSubmitTable mt-[40px]"
        variant="solid"
        type="submit"
        onClick={props.submit}
      >
        Guardar
      </Button>
    </>
  );
}

export default TableCapexQ;
