/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { Button, FormContainer, FormItem, Input, Tabs } from 'components/ui';
import { AÑOS, MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

const { TabContent } = Tabs;

function TablePuestosQ(props) {
  const [infoForm, setInfoForm] = useState();
  const [showRemovePuesto, setShowRemovePuesto] = useState(false);
  const [head, setHeads] = useState(props.head);
  const [visibleItems, setVisibleItems] = useState([0]);
  const [volTotal, setVolTotal] = useState([]);

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

      for (let i = 0; i < head.puestos.length; i++) {
        for (let j = 0; j < head.puestos[i].años.length; j++) {
          for (let s = 0; s < MONTHS.length; s++) {
            const valor = head.puestos[i].años[j].volMeses[MONTHS[s]];
            if (arrayvalores[j].values[s] >= 0) {
              arrayvalores[j].values[s] += parseInt(valor, 10);
            } else {
              arrayvalores[j].values.push(parseInt(valor, 10));
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

  const handleOnChangeInitialValue = (
    cc,
    idPuesto,
    newValue,
    key,
    mes,
    indexYear,
  ) => {
    const newData = { ...infoForm };
    const puestoIndex = newData[cc].puestos.findIndex(
      (puesto) => puesto.id === idPuesto,
    );

    let puesto = {
      ...newData[cc].puestos[puestoIndex],
    };
    switch (key) {
      case 'mes':
        puesto.años = replaceMonth(
          puesto,
          indexYear,
          mes,
          newValue === ''
            ? 0
            : newValue[0] === '0'
            ? newValue.substring(1)
            : newValue,
        );
        break;
      default:
        break;
    }

    newData[cc].puestos[puestoIndex] = puesto;
    setInfoForm(newData);
  };

  const submitInfoForm = () => {
    const copyData = { ...infoForm };
    let submit = true;
    copyData[head].puestos.map((p) => {
      if (p.name === '') {
        submit = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        props.errorMessage('Hay puestos sin nombre');
        props.showAlertError(true);
        setTimeout(() => {
          props.showAlertError(false);
        }, 5000);
      }
    });

    if (submit) {
      props.postPuestoQData(infoForm);
    }
  };

  return (
    <>
      {infoForm &&
        Object.keys(infoForm).map((cc) => (
          <TabContent value={cc} className="mb-[20px]" key={cc}>
            <FormContainer>
              {infoForm[cc].visible && (
                <section className="contenedor">
                  <div>
                    <div>
                      {Object.keys(infoForm[cc].puestos).map((head, index) => (
                        <div className="flex  gap-x-3 gap-y-3 " key={head.name}>
                          {showRemovePuesto &&
                            infoForm[cc].puestos[head].isNew && (
                              <Button
                                shape="circle"
                                size="sm"
                                variant="twoTone"
                                color="red-600"
                                className="col-start-12 col-end-13 row-start-2 mb-0 mt-10"
                                icon={<MdDelete />}
                                onClick={() =>
                                  props.removePuesto(
                                    infoForm[cc].puestos,
                                    infoForm[cc].puestos[head].id,
                                    cc,
                                  )
                                }
                              />
                            )}
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
                              disabled={!infoForm[cc].puestos[head].isNew}
                              type="text"
                              name="name"
                              value={infoForm[cc].puestos[head].name}
                              onChange={(e) =>
                                props.handleEditPuesto(
                                  infoForm[cc].puestos[head],
                                  e.target.value,
                                  e.target.name,
                                )
                              }
                            />
                          </FormItem>
                          {infoForm[cc].puestos[head].años.map(
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
                                            <Input
                                              className="w-[90px]"
                                              type="number"
                                              disabled={
                                                infoForm[cc].puestos[head]
                                                  .name === ''
                                              }
                                              value={
                                                año.volMeses[
                                                  Object.keys(año.volMeses)[
                                                    indexMes
                                                  ]
                                                ]
                                              }
                                              onChange={(e) => {
                                                handleOnChangeInitialValue(
                                                  cc,
                                                  infoForm[cc].puestos[head].id,
                                                  e.target.value,
                                                  'mes',
                                                  MONTHS[indexMes],
                                                  indexYear,
                                                );
                                              }}
                                              name="month"
                                            />
                                          </FormItem>
                                        ),
                                      )}
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
            {infoForm[head].puestos.length > 0 &&
              infoForm[head].puestos.map((puesto, index) => (
                <div
                  key={index}
                  className="flex gap-x-3 w-fit pt-3 ml-[200px] "
                >
                  {puesto.años.map((año, indexYear) => (
                    <div className="flex flex-col" key={indexYear}>
                      {/* {index === 0 && (
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
                      )} */}
                      <div className="flex gap-x-3 gap-y-3">
                        {index === 0 &&
                          visibleItems.includes(indexYear) &&
                          año &&
                          volTotal.length !== 0 &&
                          volTotal[indexYear].values.map((valor, index) => (
                            <p className="w-[90px] text-center">{valor}</p>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="flex gap-x-3 flex-end">
        <Button
          className="border mt-6b  mt-[40px]"
          variant="twoTone"
          color="blue-600"
          onClick={() => {
            props.addPuesto({
              name: '',
              isNew: true,
              años: [...AÑOS],
              id: Math.floor(Math.random() * 1000),
            });
          }}
        >
          Agregar item
        </Button>
        <Button
          className="border mt-6b  mt-[40px]"
          variant="twoTone"
          color="red-600"
          onClick={() => {
            setShowRemovePuesto(!showRemovePuesto);
          }}
        >
          {showRemovePuesto === true ? 'Anular' : 'Eliminar item'}
        </Button>
      </div>
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

export default TablePuestosQ;
