/* eslint-disable no-restricted-syntax */
import { FormContainer, FormItem, Input, Tabs, Tooltip } from 'components/ui';
import { MONTHS } from 'constants/forms.constants';
import { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import formatNumber from 'utils/formatTotalsValues';

const { TabContent } = Tabs;

function TableChurn(props) {
  const [infoForm, setInfoForm] = useState(props.data);
  const [visibleItems, setVisibleItems] = useState([0]);

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

  const formatearNumero = (numero) => {
    const nuevoNum = numero.toLocaleString('es-AR');
    return nuevoNum;
  };

  const getValueMes = (indexPais, indexCanal, indexProd, indexYear, indexMes) =>
    props.volumenData[indexPais].stats[indexCanal].productos[indexProd].años[
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
      props.assumptionData[0].canales[indexCanal].items[indexProd].volumen;
    const rdo =
      getValueMes(indexPais, indexCanal, indexProd, indexYear, indexMes) /
      vtasXCliente;
    return rdo;
  };

  const getChurn = (indexPais, indexCanal, indexProd, indexYear, indexMes) => {
    const churn =
      props.assumptionData[0].churns[indexCanal].items[indexProd]
        .porcentajeChurn;
    const vtasXCliente =
      props.assumptionData[0].canales[indexCanal].items[indexProd].volumen;
    const volMesPasado = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      Number(indexMes) - 1,
    );

    const rdo = ((volMesPasado / vtasXCliente) * churn) / 100;
    return rdo;
  };

  const getInicio = (indexPais, indexCanal, indexProd, indexYear, indexMes) => {
    const volMesPasado = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      Number(indexMes) - 1,
    );
    const volMesAntepasado = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      Number(indexMes) - 2,
    );
    const vtasXCliente =
      props.assumptionData[0].canales[indexCanal].items[indexProd].volumen;
    const churn =
      props.assumptionData[0].churns[indexCanal].items[indexProd]
        .porcentajeChurn;

    const rdo =
      volMesPasado / vtasXCliente -
      (volMesAntepasado / vtasXCliente -
        ((volMesAntepasado / vtasXCliente) * churn) / 100) -
      ((volMesAntepasado / vtasXCliente) * churn) / 100;
    return rdo;
  };

  const getAltas = (indexPais, indexCanal, indexProd, indexYear, indexMes) => {
    const volMesPasado = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      Number(indexMes) - 1,
    );
    const vtasXCliente =
      props.assumptionData[0].canales[indexCanal].items[indexProd].volumen;
    const churn =
      props.assumptionData[0].churns[indexCanal].items[indexProd]
        .porcentajeChurn;
    const volMes = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      indexMes,
    );
    const rdo =
      volMes / vtasXCliente -
      (volMesPasado / vtasXCliente -
        ((volMesPasado / vtasXCliente) * churn) / 100);
    return rdo;
  };

  const getBajas = (indexPais, indexCanal, indexProd, indexYear, indexMes) => {
    const volMesPasado = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      Number(indexMes) - 1,
    );
    const vtasXCliente =
      props.assumptionData[0].canales[indexCanal].items[indexProd].volumen;
    const churn =
      props.assumptionData[0].churns[indexCanal].items[indexProd]
        .porcentajeChurn;
    const rdo = ((volMesPasado / vtasXCliente) * churn) / 100;
    return rdo;
  };

  const getFinal = (indexPais, indexCanal, indexProd, indexYear, indexMes) =>
    getAltas(indexPais, indexCanal, indexProd, indexYear, indexMes) -
    getBajas(indexPais, indexCanal, indexProd, indexYear, indexMes);

  return (
    <>
      {infoForm &&
        Object.keys(infoForm).map((pais, indexPais) => (
          <TabContent value={pais} className="mb-[20px]" key={pais}>
            <FormContainer>
              {infoForm[pais].map((canal, indexCanal) => (
                <section key={canal.canalName} className="contenedor">
                  <div className="titleChannel">
                    <p className="canal cursor-default">{canal.canalName}</p>
                  </div>
                  <div>
                    <div>
                      {canal.productos.map((producto, indexProd) => (
                        <div
                          className="flex  gap-x-3 gap-y-3  mb-6 "
                          key={producto.id}
                        >
                          <FormItem className=" mb-1 w-[210px] mt-[81px] cursor-default">
                            {/* <p className="mt-[-20px] font-bold">Volumen</p> */}
                            <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value={producto.name}
                            />
                            <p className="mt-20">Clientes</p>
                            <p className="mt-8">Churn numero</p>
                            <p className="mt-8 font-bold">Inicio</p>
                            <p className="mt-8 font-bold">Altas</p>
                            <p className="mt-8 font-bold">Bajas</p>
                            <p className="mt-8 font-bold">Final</p>
                          </FormItem>

                          {producto.años.map((año, indexYear) => (
                            <div className="flex flex-col" key={indexYear}>
                              <div className="titleRow min-w-[62px] ">
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
                              <div className="titleMonths gap-x-3 gap-y-3 mb-[18px] flex flex-col">
                                <div className="titleMonths gap-x-3 flex">
                                  {visibleItems.includes(indexYear) &&
                                    año &&
                                    Object.keys(año.volMeses).map(
                                      (mes, indexMes) => (
                                        <p
                                          key={indexMes}
                                          className="month w-[90px] capitalize cursor-default"
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
                                          <Tooltip
                                            placement="top-end"
                                            title={formatearNumero(
                                              getValueMes(
                                                indexPais,
                                                indexCanal,
                                                indexProd,
                                                indexYear,
                                                indexMes,
                                              ),
                                            )}
                                          >
                                            <Input
                                              className="w-[90px]"
                                              type="text"
                                              disabled
                                              value={formatearNumero(
                                                getValueMes(
                                                  indexPais,
                                                  indexCanal,
                                                  indexProd,
                                                  indexYear,
                                                  indexMes,
                                                ),
                                              )}
                                              name="month"
                                            />
                                          </Tooltip>
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
                                          {getClientes(
                                            indexPais,
                                            indexCanal,
                                            indexProd,
                                            indexYear,
                                            indexMes,
                                          ).toString().length > 7 ? (
                                            <Tooltip
                                              placement="top-end"
                                              title={formatNumber(
                                                getClientes(
                                                  indexPais,
                                                  indexCanal,
                                                  indexProd,
                                                  indexYear,
                                                  indexMes,
                                                ),
                                              )}
                                            >
                                              <Input
                                                className="w-[90px]"
                                                type="text"
                                                disabled
                                                value={formatNumber(
                                                  getClientes(
                                                    indexPais,
                                                    indexCanal,
                                                    indexProd,
                                                    indexYear,
                                                    indexMes,
                                                  ),
                                                )}
                                              />
                                            </Tooltip>
                                          ) : (
                                            <Input
                                              className="w-[90px]"
                                              type="text"
                                              disabled
                                              value={formatNumber(
                                                getClientes(
                                                  indexPais,
                                                  indexCanal,
                                                  indexProd,
                                                  indexYear,
                                                  indexMes,
                                                ),
                                              )}
                                            />
                                          )}
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
                                          {getChurn(
                                            indexPais,
                                            indexCanal,
                                            indexProd,
                                            indexYear,
                                            indexMes,
                                          ).toString().length > 7 ? (
                                            <Tooltip
                                              placement="top-end"
                                              title={
                                                indexMes === 0
                                                  ? ''
                                                  : formatNumber(
                                                      getChurn(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                            >
                                              <Input
                                                className="w-[90px]"
                                                type="text"
                                                disabled
                                                value={
                                                  indexMes === 0
                                                    ? ''
                                                    : formatNumber(
                                                        getChurn(
                                                          indexPais,
                                                          indexCanal,
                                                          indexProd,
                                                          indexYear,
                                                          indexMes,
                                                        ),
                                                      )
                                                }
                                                name="month"
                                              />
                                            </Tooltip>
                                          ) : (
                                            <Input
                                              className="w-[90px]"
                                              type="text"
                                              disabled
                                              value={
                                                indexMes === 0
                                                  ? ''
                                                  : formatNumber(
                                                      getChurn(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                              name="month"
                                            />
                                          )}
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
                                          {(indexMes === 0 || indexMes === 1
                                            ? 0
                                            : formatNumber(
                                                getInicio(
                                                  indexPais,
                                                  indexCanal,
                                                  indexProd,
                                                  indexYear,
                                                  indexMes,
                                                ),
                                              ) < 0
                                            ? 0
                                            : formatNumber(
                                                getInicio(
                                                  indexPais,
                                                  indexCanal,
                                                  indexProd,
                                                  indexYear,
                                                  indexMes,
                                                ),
                                              )
                                          ).length > 7 ? (
                                            <Tooltip
                                              placement="top-end"
                                              title={
                                                indexMes === 0 || indexMes === 1
                                                  ? 0
                                                  : formatNumber(
                                                      getInicio(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    ) < 0
                                                  ? 0
                                                  : formatNumber(
                                                      getInicio(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                            >
                                              <Input
                                                className="w-[90px] border-2 border-solid border-gray-800"
                                                type="text"
                                                disabled
                                                value={
                                                  indexMes === 0 ||
                                                  indexMes === 1
                                                    ? 0
                                                    : formatNumber(
                                                        getInicio(
                                                          indexPais,
                                                          indexCanal,
                                                          indexProd,
                                                          indexYear,
                                                          indexMes,
                                                        ),
                                                      ) < 0
                                                    ? 0
                                                    : formatNumber(
                                                        getInicio(
                                                          indexPais,
                                                          indexCanal,
                                                          indexProd,
                                                          indexYear,
                                                          indexMes,
                                                        ),
                                                      )
                                                }
                                                name="month"
                                              />
                                            </Tooltip>
                                          ) : (
                                            <Input
                                              className="w-[90px] border-2 border-solid border-gray-800"
                                              type="text"
                                              disabled
                                              value={
                                                indexMes === 0 || indexMes === 1
                                                  ? 0
                                                  : formatNumber(
                                                      getInicio(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    ) < 0
                                                  ? 0
                                                  : formatNumber(
                                                      getInicio(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                              name="month"
                                            />
                                          )}
                                        </FormItem>
                                      ),
                                    )}
                                </div>

                                <div className="flex gap-x-3 gap-y-3 ">
                                  {visibleItems.includes(indexYear) &&
                                    año &&
                                    Object.keys(año.volMeses).map(
                                      (mes, indexMes) => (
                                        <FormItem
                                          className="mb-0 "
                                          key={indexMes}
                                        >
                                          {indexMes === 0 ? (
                                            <Input
                                              className="w-[90px] border-2 border-solid border-gray-800"
                                              type="text"
                                              disabled
                                              value={
                                                indexMes === 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    ) < 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                              name="month"
                                            />
                                          ) : formatNumber(
                                              getAltas(
                                                indexPais,
                                                indexCanal,
                                                indexProd,
                                                indexYear,
                                                indexMes,
                                              ),
                                            ).length > 7 ? (
                                            <Tooltip
                                              placement="top-end"
                                              title={
                                                indexMes === 0
                                                  ? 0
                                                  : formatNumber(
                                                      getAltas(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                            >
                                              <Input
                                                className="w-[90px] border-2 border-solid border-grey-800"
                                                type="text"
                                                disabled
                                                value={
                                                  indexMes === 0
                                                    ? 0
                                                    : formatNumber(
                                                        getAltas(
                                                          indexPais,
                                                          indexCanal,
                                                          indexProd,
                                                          indexYear,
                                                          indexMes,
                                                        ),
                                                      )
                                                }
                                                name="month"
                                              />
                                            </Tooltip>
                                          ) : (
                                            <Input
                                              className="w-[90px] border-2 border-solid border-gray-800"
                                              type="text"
                                              disabled
                                              value={
                                                indexMes === 0
                                                  ? 0
                                                  : formatNumber(
                                                      getAltas(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                              name="month"
                                            />
                                          )}
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
                                          {indexMes === 0 ? (
                                            <Input
                                              className="w-[90px] border-2 border-solid border-gray-800"
                                              type="text"
                                              disabled
                                              value={
                                                indexMes === 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    ) < 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                              name="month"
                                            />
                                          ) : formatNumber(
                                              getBajas(
                                                indexPais,
                                                indexCanal,
                                                indexProd,
                                                indexYear,
                                                indexMes,
                                              ),
                                            ).length > 7 ? (
                                            <Tooltip
                                              placement="top-end"
                                              title={
                                                indexMes === 0
                                                  ? 0
                                                  : formatNumber(
                                                      getBajas(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                            >
                                              <Input
                                                className="w-[90px] border-2 border-solid border-gray-800"
                                                type="text"
                                                disabled
                                                value={
                                                  indexMes === 0
                                                    ? 0
                                                    : formatNumber(
                                                        getBajas(
                                                          indexPais,
                                                          indexCanal,
                                                          indexProd,
                                                          indexYear,
                                                          indexMes,
                                                        ),
                                                      )
                                                }
                                                name="month"
                                              />
                                            </Tooltip>
                                          ) : (
                                            <Input
                                              className="w-[90px] border-2 border-solid border-gray-800"
                                              type="text"
                                              disabled
                                              value={
                                                indexMes === 0
                                                  ? 0
                                                  : formatNumber(
                                                      getBajas(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                              name="month"
                                            />
                                          )}
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
                                          {indexMes === 0 ? (
                                            <Input
                                              className="w-[90px] border-2 border-solid border-gray-800"
                                              type="text"
                                              disabled
                                              value={
                                                indexMes === 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    ) < 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                              name="month"
                                            />
                                          ) : formatNumber(
                                              getFinal(
                                                indexPais,
                                                indexCanal,
                                                indexProd,
                                                indexYear,
                                                indexMes,
                                              ),
                                            ) < 0 ? (
                                            <Input
                                              className="w-[90px] border-2 border-solid border-gray-800"
                                              type="text"
                                              disabled
                                              value={0}
                                              name="month"
                                            />
                                          ) : formatNumber(
                                              getFinal(
                                                indexPais,
                                                indexCanal,
                                                indexProd,
                                                indexYear,
                                                indexMes,
                                              ),
                                            ).length > 7 ? (
                                            <Tooltip
                                              placement="top-end"
                                              title={
                                                indexMes === 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    ) < 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                            >
                                              <Input
                                                className="w-[90px] border-2 border-solid border-gray-800"
                                                type="text"
                                                disabled
                                                value={
                                                  indexMes === 0
                                                    ? 0
                                                    : formatNumber(
                                                        getFinal(
                                                          indexPais,
                                                          indexCanal,
                                                          indexProd,
                                                          indexYear,
                                                          indexMes,
                                                        ),
                                                      ) < 0
                                                    ? 0
                                                    : formatNumber(
                                                        getFinal(
                                                          indexPais,
                                                          indexCanal,
                                                          indexProd,
                                                          indexYear,
                                                          indexMes,
                                                        ),
                                                      )
                                                }
                                                name="month"
                                              />
                                            </Tooltip>
                                          ) : (
                                            <Input
                                              className="w-[90px] border-2 border-solid border-gray-800"
                                              type="text"
                                              disabled
                                              value={
                                                indexMes === 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    ) < 0
                                                  ? 0
                                                  : formatNumber(
                                                      getFinal(
                                                        indexPais,
                                                        indexCanal,
                                                        indexProd,
                                                        indexYear,
                                                        indexMes,
                                                      ),
                                                    )
                                              }
                                              name="month"
                                            />
                                          )}
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
    </>
  );
}

export default TableChurn;
