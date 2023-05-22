/* eslint-disable no-restricted-syntax */
import {
  Avatar,
  Button,
  FormContainer,
  FormItem,
  Input,
  Select,
  Tabs,
  Tooltip,
} from 'components/ui';
import { MONTHS } from 'constants/forms.constants';
import { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { createCosto } from 'services/Requests';
import formatNumber from 'utils/formatTotalsValues';

const { TabContent } = Tabs;

const optionsMonths = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

function TableCosto(props) {
  const [infoForm, setInfoForm] = useState(props.data);
  const [visibleItems, setVisibleItems] = useState([0]);

  const moneda = props.currency;

  const hideYear = (index) => {
    setVisibleItems((prevItems) => {
      if (prevItems.includes(index)) {
        // Si el elemento ya está en la lista, lo eliminamos para ocultarlo
        return prevItems.filter((id) => id !== index);
      }
      // Si el elemento no está en la lista, lo agregamos para mostrarlo
      return [...prevItems, index];
    });
  };

  const resolveResul = (vol, precio, div) => {
    let value = 0;

    if (div !== 0) {
      const mult = vol * precio;
      value = (div * mult) / 100;
      value = value.toFixed(1);
    }
    return value;
  };

  const submitInfoForm = () => {
    const copyData = { ...infoForm };
    const countryArray = [];

    for (const countryName in copyData) {
      const statsArray = copyData[countryName];
      const countryObject = { countryName, stats: [] };

      for (let i = 0; i < statsArray.length; i++) {
        countryObject.stats.push(statsArray[i]);
      }

      countryArray.push(countryObject);
    }

    for (let i = 0; i < countryArray.length; i++) {
      let idUser = localStorage.getItem('userId')
      const { countryName, stats } = countryArray[i];
      const data = { countryName, stats, idUser };
      postCostoData(data);
    }
  };

  const postCostoData = (data) => {
    createCosto(data)
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        props.showAlertSuces(true);
        setTimeout(() => {
          props.showAlertSuces(false);
        }, 5000);
      })
      .catch((error) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        props.showAlertError(true);
        setTimeout(() => {
          props.showAlertError(false);
        }, 5000);
      });
  };
  const fillMonthsPrices = (producto, yearIndex) => {
    const newAños = [...producto.años];
    let precioActual = producto.precioInicial;
    let currentMonth = 1;

    for (let i = yearIndex >= 0 ? yearIndex : 0; i < newAños.length; i++) {
      const newMeses = { ...newAños[i].volMeses };
      for (const mes in newMeses) {
        if (currentMonth >= producto.inicioMes) {
          newMeses[mes] = precioActual;
          precioActual *= 1 + producto.tasa / 100;
        } else {
          newMeses[mes] = 0;
        }
        currentMonth++;
      }
      newAños[i] = { ...newAños[i], volMeses: newMeses };
    }

    return newAños;
  };

  const replaceMonth = (producto, indexYear, mes, value) => {
    const newAños = [...producto.años];
    const newMeses = { ...newAños[indexYear].volMeses };
    newMeses[mes] = value;
    newAños[indexYear] = { ...newAños[indexYear], volMeses: newMeses };

    return newAños;
  };

  const handleOnChangeInitialValue = (
    pais,
    canalName,
    prod,
    newValue,
    key,
    mes,
    indexYear,
  ) => {
    const newData = { ...infoForm };
    const channelIndex = newData[pais].findIndex(
      (canal) => canal.canalName === canalName,
    );
    const productoIndex = newData[pais][channelIndex].productos.findIndex(
      (producto) => producto.id === prod.id,
    );

    const producto = {
      ...newData[pais][channelIndex].productos[productoIndex],
    };
    switch (key) {
      case 'precioInicial':
        producto.precioInicial = newValue;
        producto.años = fillMonthsPrices(producto, -1);
        break;

      case 'tasa':
        producto.tasa = newValue;
        producto.años = fillMonthsPrices(producto, -1);
        break;

      case 'mesInicial':
        producto.inicioMes = newValue;
        producto.años = fillMonthsPrices(producto, -1);
        break;
      case 'comision':
        producto.comision = newValue;
        break;

      case 'impuesto':
        producto.impuesto = newValue;
        break;

      case 'cargos':
        producto.cargos = newValue;
        break;

      case 'mes':
        producto.años = replaceMonth(producto, indexYear, mes, newValue);
        break;
      default:
        break;
    }

    newData[pais][channelIndex].productos[productoIndex] = producto;
    setInfoForm(newData);
  };
  return (
    <>
      {infoForm &&
        Object.keys(infoForm).map((pais, indexPais) => (
          <TabContent value={pais} className="mb-[20px]" key={pais}>
            <FormContainer>
              {infoForm[pais].map((canal, indexCanal) => (
                <section key={canal.canalName} className="contenedor">
                  <div className="titleChannel">
                    <p className="canal">{canal.canalName}</p>
                  </div>
                  <div>
                    <div>
                      {canal.productos.map((producto, indexProd) => (
                        <div
                          className="flex  gap-x-3 gap-y-3  mb-6 "
                          key={producto.id}
                        >
                          {/* <Avatar className="w-[50px] mt-[81px] mb-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                            {producto.id.toString()}
                          </Avatar> */}
                          <FormItem className=" mb-1 w-[210px] mt-[81px]">
                            <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value={producto.name}
                            />
                            <p className="mt-20">Comisiones</p>
                            <p className="mt-8">Impuestos Comerciales</p>
                            <p className="mt-8">Cargos por pasarela cobro</p>
                          </FormItem>
                          <div className="flex flex-col w-[240px] mt-[81px]">
                            <div className="flex w-[240px]  gap-x-2">
                              <FormItem className=" mb-0 w-[130px] ">
                                <Tooltip
                                  placement="top-end"
                                  title="Precio Inicial"
                                >
                                  <Input
                                    placeholder="Precio inicial"
                                    type="number"
                                    name="precioInicial"
                                    prefix={moneda}
                                    value={producto.precioInicial}
                                    onChange={(e) =>
                                      handleOnChangeInitialValue(
                                        pais,
                                        canal.canalName,
                                        producto,
                                        e.target.value,
                                        'precioInicial',
                                      )
                                    }
                                  />
                                </Tooltip>
                              </FormItem>
                              <FormItem className="mb-0 w-[90px]">
                                <Tooltip
                                  placement="top-end"
                                  title="Crecimiento Mensual"
                                >
                                  <Input
                                    placeholder="Crecimiento Mensual"
                                    type="number"
                                    name="tasa"
                                    suffix="%"
                                    value={producto.tasa}
                                    onChange={(e) =>
                                      handleOnChangeInitialValue(
                                        pais,
                                        canal.canalName,
                                        producto,
                                        e.target.value,
                                        'tasa',
                                      )
                                    }
                                  />
                                </Tooltip>
                              </FormItem>
                            </div>

                            <FormItem className=" mb-0 w-[230px] mt-[12px]">
                              <Tooltip
                                placement="top-end"
                                title="Fecha Inicial"
                              >
                                <Select
                                  className="w-[230px] "
                                  placeholder="Inicio de Actividades"
                                  options={optionsMonths}
                                  value={optionsMonths.filter(
                                    (option) =>
                                      option.value === producto.inicioMes,
                                  )}
                                  onChange={(e) =>
                                    handleOnChangeInitialValue(
                                      pais,
                                      canal.canalName,
                                      producto,
                                      e.value,
                                      'mesInicial',
                                    )
                                  }
                                />
                              </Tooltip>
                            </FormItem>

                            <FormItem className="mb-0 mt-2 w-[90px]">
                              <Input
                                type="number"
                                name="comision"
                                suffix="%"
                                value={producto.comision}
                                onChange={(e) =>
                                  handleOnChangeInitialValue(
                                    pais,
                                    canal.canalName,
                                    producto,
                                    e.target.value,
                                    'comision',
                                  )
                                }
                              />
                            </FormItem>

                            <FormItem className="mb-0 mt-4 w-[90px]">
                              <Input
                                type="number"
                                name="impuesto"
                                suffix="%"
                                value={producto.impuesto}
                                onChange={(e) =>
                                  handleOnChangeInitialValue(
                                    pais,
                                    canal.canalName,
                                    producto,
                                    e.target.value,
                                    'impuesto',
                                  )
                                }
                              />
                            </FormItem>

                            <FormItem className="mb-0 mt-2 w-[90px]">
                              <Input
                                type="number"
                                name="cargos"
                                suffix="%"
                                value={producto.cargos}
                                onChange={(e) =>
                                  handleOnChangeInitialValue(
                                    pais,
                                    canal.canalName,
                                    producto,
                                    e.target.value,
                                    'cargos',
                                  )
                                }
                              />
                            </FormItem>
                          </div>

                          {producto.años.map((año, indexYear) => (
                            <div className="flex flex-col" key={indexYear}>
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
                              <div className="titleMonths gap-x-3 gap-y-3 mb-[18px] flex flex-col">
                                <div className="titleMonths gap-x-3 flex">
                                  {visibleItems.includes(indexYear) &&
                                    año &&
                                    Object.keys(año.volMeses).map(
                                      (mes, indexMes) => (
                                        <p
                                          key={indexMes}
                                          className="month w-[90px] capitalize"
                                        >
                                          {Object.keys(año.volMeses)[indexMes]}
                                        </p>
                                      ),
                                    )}
                                </div>
                                <div className="flex gap-x-3 gap-y-3">
                                  {visibleItems.includes(indexYear) &&
                                    año &&
                                    Object.keys(año.volMeses).map(
                                      (mes, indexMes) => (
                                        <FormItem
                                          className="mb-0"
                                          key={indexMes}
                                        >
                                          <Input
                                            className="w-[90px]"
                                            type="number"
                                            prefix={moneda}
                                            value={
                                              año.volMeses[
                                                Object.keys(año.volMeses)[
                                                  indexMes
                                                ]
                                              ]
                                            }
                                            onChange={(e) => {
                                              handleOnChangeInitialValue(
                                                pais,
                                                canal.canalName,
                                                producto,
                                                e.target.value,
                                                'mes',
                                                mes,
                                                indexYear,
                                              );
                                            }}
                                            name="month"
                                          />
                                        </FormItem>
                                      ),
                                    )}
                                </div>

                                <div className="flex gap-x-3 gap-y-3 mt-12">
                                  {visibleItems.includes(indexYear) &&
                                    año &&
                                    Object.keys(año.volMeses).map(
                                      (mes, indexMes) => (
                                        <FormItem
                                          className="mb-0"
                                          key={indexMes}
                                        >
                                          <Input
                                            className="w-[90px]"
                                            type="text"
                                            disabled
                                            prefix={moneda}
                                            value={formatNumber(resolveResul(
                                              props.volumenData[indexPais]
                                                .stats[indexCanal].productos[
                                                indexProd
                                              ].años[indexYear].volMeses[
                                                MONTHS[indexMes]
                                              ],
                                              props.precioData[indexPais].stats[
                                                indexCanal
                                              ].productos[indexProd].años[
                                                indexYear
                                              ].volMeses[MONTHS[indexMes]],
                                              producto.comision,
                                            ))}
                                          />
                                        </FormItem>
                                      ),
                                    )}
                                </div>

                                <div className="flex gap-x-3 gap-y-3">
                                  {visibleItems.includes(indexYear) &&
                                    año &&
                                    Object.keys(año.volMeses).map(
                                      (mes, indexMes) => (
                                        <FormItem
                                          className="mb-0"
                                          key={indexMes}
                                        >
                                          <Input
                                            className="w-[90px]"
                                            type="text"
                                            disabled
                                            prefix={moneda}
                                            value={formatNumber(resolveResul(
                                              props.volumenData[indexPais]
                                                .stats[indexCanal].productos[
                                                indexProd
                                              ].años[indexYear].volMeses[
                                                MONTHS[indexMes]
                                              ],
                                              props.precioData[indexPais].stats[
                                                indexCanal
                                              ].productos[indexProd].años[
                                                indexYear
                                              ].volMeses[MONTHS[indexMes]],
                                              producto.impuesto,
                                            ))}
                                            onChange={(e) => {
                                              props.handleOnChangeInitialValue(
                                                pais,
                                                canal.canalName,
                                                producto,
                                                e.target.value,
                                                'mes',
                                                mes,
                                                indexYear,
                                              );
                                            }}
                                            name="month"
                                          />
                                        </FormItem>
                                      ),
                                    )}
                                </div>

                                <div className="flex gap-x-3 gap-y-3">
                                  {visibleItems.includes(indexYear) &&
                                    año &&
                                    Object.keys(año.volMeses).map(
                                      (mes, indexMes) => (
                                        <FormItem
                                          className="mb-0"
                                          key={indexMes}
                                        >
                                          <Input
                                            className="w-[90px]"
                                            type="text"
                                            disabled
                                            prefix={moneda}
                                            value={formatNumber(resolveResul(
                                              props.volumenData[indexPais]
                                                .stats[indexCanal].productos[
                                                indexProd
                                              ].años[indexYear].volMeses[
                                                MONTHS[indexMes]
                                              ],
                                              props.precioData[indexPais].stats[
                                                indexCanal
                                              ].productos[indexProd].años[
                                                indexYear
                                              ].volMeses[MONTHS[indexMes]],
                                              producto.cargos,
                                            ))}
                                            onChange={(e) => {
                                              props.handleOnChangeInitialValue(
                                                pais,
                                                canal.canalName,
                                                producto,
                                                e.target.value,
                                                'mes',
                                                mes,
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
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
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

export default TableCosto;