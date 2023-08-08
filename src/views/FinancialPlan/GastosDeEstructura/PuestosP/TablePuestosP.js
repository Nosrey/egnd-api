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
  Tooltip,
} from 'components/ui';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const { TabContent } = Tabs;

function TablePuestosP(props) {
  const [infoForm, setInfoForm] = useState();
  const [head, setHeads] = useState(props.head);
  const [change, setChange] = useState(false);
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

      for (let i = 0; i < head.puestos.length; i++) {
        for (let j = 0; j < head.puestos[i].años.length; j++) {
          for (let s = 0; s < MONTHS.length; s++) {
            const valor =
              head.puestos[i].años[j].volMeses[MONTHS[s]] *
                Number(head.puestos[i].total) || 0;
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

  const fillMonthsPrices = (producto, yearIndex) => {
    setChange(true);
    let newAños = [...producto.años];
    producto.cargaSocial = (producto.precioInicial * props.cargaSocial) / 100;
    producto.total =
      Number(producto.precioInicial) + Number(producto.cargaSocial);
    for (let i = yearIndex >= 0 ? yearIndex : 0; i < newAños.length; i++) {
      const newMeses = { ...newAños[i].volMeses };
      let vT = 0;
      for (let mes in newMeses) {
        newMeses[mes] = Math.round(newAños[i].volMeses[mes]);
        vT += parseInt(newAños[i].volMeses[mes], 10);

        volTotal[i].values[MONTHS.indexOf(mes)] += newAños[i].volMeses[mes];
      }
      newAños[i] = {
        ...newAños[i],
        volMeses: newMeses,
        volTotal: vT * Number(producto.total),
      };
    }
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
    const inputNumero = Number(newValue.replace(/\D/g, ''));

    const newData = { ...props.data };

    const puestoIndex = newData[cc].puestos.findIndex(
      (puesto) => puesto.id === idPuesto,
    );

    let puesto = {
      ...newData[cc].puestos[puestoIndex],
    };
    switch (key) {
      case 'precioInicial':
        puesto.precioInicial = inputNumero;
        puesto.años = fillMonthsPrices(puesto, -1);
        break;

      case 'incremento':
        puesto.incremento = inputNumero;
        break;

      default:
        break;
    }

    newData[cc].puestos[puestoIndex] = puesto;
    setInfoForm(newData);
  };

  const formatearNumero = (numero) => {
    const nuevoNum = numero?.toLocaleString('es-AR');
    return nuevoNum;
  };

  const submitInfoForm = () => {
    const copyData = { ...infoForm };
    let submit = true;

    if (submit) {
      props.postPuestoPData([infoForm]);
    }
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
                              onChange={(e) =>
                                props.handleEditPuesto(
                                  infoForm[cc].puestos[head],
                                  e.target.value,
                                  e.target.name,
                                )
                              }
                            />
                          </FormItem>

                          <div className="flex flex-col">
                            {index === 0 && (
                              <div className="titleRow min-w-[62px]">
                                <p> Rem</p>
                              </div>
                            )}

                            <FormItem
                              className={`${
                                index === 0
                                  ? 'mt-[40px] w-[100px]'
                                  : 'mt-[20px] w-[100px]'
                              }`}
                            >
                              <Tooltip placement="top-end" title="Rem">
                                <Input
                                  placeholder="Rem"
                                  type="text"
                                  name="precioInicial"
                                  prefix={currency}
                                  value={formatearNumero(
                                    infoForm[cc].puestos[head].precioInicial,
                                  )}
                                  onChange={(e) =>
                                    handleOnChangeInitialValue(
                                      cc,
                                      infoForm[cc].puestos[head].id,
                                      e.target.value,
                                      'precioInicial',
                                      null,
                                      null,
                                    )
                                  }
                                />
                              </Tooltip>
                            </FormItem>
                          </div>

                          <div className="flex flex-col">
                            {index === 0 && (
                              <div className="titleRow min-w-[62px]">
                                <p> Cargas S.</p>
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
                                placeholder="Precio inicial"
                                type="text"
                                disabled
                                name="cargaSocial"
                                prefix={currency}
                                value={formatearNumero(
                                  Math.round(
                                    infoForm[cc].puestos[head].cargaSocial || 0,
                                  ),
                                )}
                              />
                            </FormItem>
                          </div>

                          <div className="flex flex-col">
                            {index === 0 && (
                              <div className="titleRow min-w-[62px]">
                                <p>TOTAL</p>
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
                                type="text"
                                name="total"
                                disabled
                                prefix={currency}
                                value={formatearNumero(
                                  Math.round(
                                    infoForm[cc].puestos[head].total || 0,
                                  ),
                                )}
                              />
                            </FormItem>
                          </div>

                          <div className="flex flex-col">
                            {index === 0 && (
                              <div className="titleRow min-w-[100px]">
                                <p>Incremento anual</p>
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
                                type="text"
                                name="incremento"
                                prefix="%"
                                value={formatearNumero(
                                  infoForm[cc].puestos[head].incremento,
                                )}
                                onChange={(e) =>
                                  handleOnChangeInitialValue(
                                    cc,
                                    infoForm[cc].puestos[head].id,
                                    e.target.value,
                                    'incremento',
                                    null,
                                    null,
                                  )
                                }
                              />
                            </FormItem>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </FormContainer>
          </TabContent>
        ))}
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

export default TablePuestosP;
