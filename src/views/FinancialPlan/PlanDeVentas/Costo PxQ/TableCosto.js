/* eslint-disable no-restricted-syntax */
import { Avatar, FormContainer, FormItem, Input, Tabs } from 'components/ui';
import { MONTHS, OPTIONS_COUNTRY } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

const { TabContent } = Tabs;

function TableCosto(props) {
  const [infoForm, setInfoForm] = useState(props.data);
  const [visibleItems, setVisibleItems] = useState([0]);
  const [infoProducts, setInfoProducts] = useState([]);
  const [volTotal, setVolTotal] = useState(0);
  const [totalesCanales, setTotalesCanales] = useState([]);
  const [viewTotals, setViewTotals] = useState([]);
  let totals = [];

  const configIncial = () => {
    if (infoForm) {
      Object.keys(infoForm).map((pais, indexPais) => (totals[pais] = {}));

      OPTIONS_COUNTRY.map(
        (o) =>
          infoForm[o.value] &&
          infoForm[o.value].map((i) => (totals[o.value] = {})),
      );

      OPTIONS_COUNTRY.map(
        (o) =>
          infoForm[o.value] &&
          infoForm[o.value].map((i) =>
            i.productos.map((p) => (totals[o.value][p.name] = [])),
          ),
      );
    }
  };

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
    div = parseInt(div);
    vol = parseInt(vol);
    precio = parseInt(precio);

    let value = 0;
    const mult = vol * precio;

    if (div !== 0) {
      value = (div * mult) / 100;
      value = value.toFixed(1);
    }
    return parseInt(value);
  };

  const resolveResulPlane = (vol, precio, div) => {
    let value = 0;
    if (div !== 0) {
      const mult = vol * precio;
      value = (div * mult) / 100;
      value = value.toFixed(1);
    }

    return parseInt(value);
  };

  const resolveTotalYear = (indexPais, indexCanal, indexProd, indexYear) => {
    let totalparcial = 0;

    for (let i = 0; i <= 11; i++) {
      totalparcial +=
        props.volumenData[indexPais].stats[indexCanal].productos[indexProd]
          .años[indexYear].volMeses[MONTHS[i]] *
        props.costoData[indexPais].stats[indexCanal].productos[indexProd].años[
          indexYear
        ].volMeses[MONTHS[i]];
    }

    return totalparcial;
  };

  const resolveTotalYearPercent = (
    indexPais,
    indexCanal,
    indexProd,
    indexYear,
    dividendo,
  ) => {
    let totalparcial = 0;

    for (let i = 0; i <= 11; i++) {
      totalparcial += resolveResulPlane(
        props.volumenData[indexPais].stats[indexCanal].productos[indexProd]
          .años[indexYear].volMeses[MONTHS[i]],
        props.precioData[indexPais].stats[indexCanal].productos[indexProd].años[
          indexYear
        ].volMeses[MONTHS[i]],
        dividendo,
      );
    }

    return totalparcial;
  };

  const calcTotales = () => {
    if (infoProducts.length !== 0 && infoProducts[0].sum !== 0) {
      props.precioData.map((p, indexInicial) =>
        p.stats.map((s, indexStats) =>
          s.productos.map((o, indexP) =>
            o.años.map((a, indexYear) =>
              MONTHS.forEach((m, indexMonth) => {
                if (!totals[p.countryName][o.name][indexYear]) {
                  totals[p.countryName][o.name].push([
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ]);
                  totals[p.countryName][o.name][indexYear][indexMonth] +=
                    resolveResul(
                      a.volMeses[m],
                      props.volumenData[indexInicial].stats[indexStats]
                        .productos[indexP].años[indexYear].volMeses[m],

                      props.costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].comision,
                    ) +
                    resolveResul(
                      a.volMeses[m],
                      props.volumenData[indexInicial].stats[indexStats]
                        .productos[indexP].años[indexYear].volMeses[m],

                      props.costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].impuesto,
                    ) +
                    resolveResul(
                      a.volMeses[m],
                      props.volumenData[indexInicial].stats[indexStats]
                        .productos[indexP].años[indexYear].volMeses[m],

                      props.costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].cargos,
                    ) +
                    parseInt(
                      props.volumenData[indexInicial].stats[indexStats]
                        .productos[indexP].años[indexYear].volMeses[m] *
                        props.costoData[indexInicial].stats[indexStats]
                          .productos[indexP].años[indexYear].volMeses[m],
                    );
                } else {
                  totals[p.countryName][o.name][indexYear][indexMonth] +=
                    resolveResul(
                      a.volMeses[m],
                      props.volumenData[indexInicial].stats[indexStats]
                        .productos[indexP].años[indexYear].volMeses[m],

                      props.costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].comision,
                    ) +
                    resolveResul(
                      a.volMeses[m],
                      props.volumenData[indexInicial].stats[indexStats]
                        .productos[indexP].años[indexYear].volMeses[m],

                      props.costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].impuesto,
                    ) +
                    resolveResul(
                      a.volMeses[m],
                      props.volumenData[indexInicial].stats[indexStats]
                        .productos[indexP].años[indexYear].volMeses[m],

                      props.costoData[indexInicial].stats[indexStats].productos[
                        indexP
                      ].cargos,
                    ) +
                    parseInt(
                      props.volumenData[indexInicial].stats[indexStats]
                        .productos[indexP].años[indexYear].volMeses[m] *
                        props.costoData[indexInicial].stats[indexStats]
                          .productos[indexP].años[indexYear].volMeses[m],
                    );
                }
              }),
            ),
          ),
        ),
      );
      setViewTotals({ ...totals });
    }
  };

  console.log('view', viewTotals);

  useEffect(() => {
    if (infoForm && props.country && infoProducts) {
      const pais = [...infoForm[props.country]];
      const arrayP = [];
      const arrayCanales = [];
      for (let i = 0; i < pais.length; i++) {
        // cada canal
        const canal = pais[i];
        let canalInfo = {
          name: canal.canalName,
          sum: 0,
          id: i,
        };
        for (let x = 0; x < props.productos.length; x++) {
          // cada prod
          const idProd = props.productos[x].id;
          let myProd = canal.productos.find((prod) => prod.id === idProd);
          let prodChannel = props.volumenData[props.indexCountry].stats[
            canalInfo.id
          ].productos.find((prod) => prod.id === idProd);
          let arrayvalores = [];
          for (let j = 0; j < myProd.años.length; j++) {
            // año
            for (let s = 0; s < MONTHS.length; s++) {
              const valor =
                myProd.años[j].volMeses[MONTHS[s]] *
                prodChannel.años[j].volMeses[MONTHS[s]];
              arrayvalores.push(parseInt(valor, 10));
            }
          }
          canalInfo.sum += arrayvalores.reduce(
            (acumulador, valorActual) => acumulador + valorActual,
            0,
          );
          arrayP.push({ ...myProd, sum: arrayvalores });
        }
        arrayCanales.push(canalInfo);

        const agrupados = arrayP.reduce((resultado, objeto) => {
          if (!resultado[objeto.id]) {
            resultado[objeto.id] = [];
          }
          resultado[objeto.id].push(objeto);
          return resultado;
        }, {});

        const arrayProdAgrupados = []; // este es mi array de arrays prod 1 , prod2,etc
        for (let x = 0; x < props.productos.length; x++) {
          arrayProdAgrupados.push(agrupados[props.productos[x].id]);
        }
        const copy = [...infoProducts];
        let volumenTotal = 0;
        arrayProdAgrupados.map((prod) => {
          let index = copy.findIndex((el) => el.id === prod[0].id);
          const data = prod;
          const totalSum = data.reduce(
            (accumulator, currentValue) =>
              currentValue.sum.map(
                (value, index) => value + accumulator[index],
              ),
            Array(data[0].sum.length).fill(0),
          );

          volumenTotal += totalSum.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
          );
          return (copy[index] = { ...copy[index], sum: totalSum });
        });
        setVolTotal(volumenTotal);
        for (let x = 0; x < copy.length; x++) {
          const objetos = [];
          for (let i = 0; i < 10; i++) {
            const numerosDelObjeto = copy[x].sum.slice(i * 12, i * 12 + 12);
            const objeto = { numeros: numerosDelObjeto };
            objetos.push(objeto);
          }
          copy[x].sum = objetos;
        }
        setInfoProducts(() => [...copy]);
      }
      setTotalesCanales(() => [...arrayCanales]);
      configIncial();
      calcTotales();
    }
  }, [infoForm]);

  useEffect(() => {
    if (props.productos) {
      setInfoProducts(() => [...props.productos]);
    }
    if (props.data) setInfoForm(props.data);
    configIncial();
    calcTotales();
  }, [props, infoForm]);

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
                          <Avatar className="w-[50px] mt-[81px] mb-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                            {producto.id.toString()}
                          </Avatar>
                          <FormItem className=" mb-1 w-[210px] mt-[81px]">
                            <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value={producto.name}
                            />
                            <p className="mt-8">Comisiones</p>
                            <p className="mt-8">Impuestos Comerciales</p>
                            <p className="mt-8">Cargos por pasarela cobro</p>
                          </FormItem>
                          <div className="flex flex-col w-[240px] mt-[138px]">
                            <FormItem className="mb-0 mt-2 w-[90px]">
                              <Input
                                type="number"
                                name="comision"
                                disabled
                                suffix="%"
                                value={producto.comision}
                              />
                            </FormItem>

                            <FormItem className="mb-0 mt-4 w-[90px]">
                              <Input
                                type="number"
                                name="impuesto"
                                disabled
                                suffix="%"
                                value={producto.impuesto}
                              />
                            </FormItem>

                            <FormItem className="mb-0 mt-2 w-[90px]">
                              <Input
                                type="number"
                                name="cargos"
                                disabled
                                suffix="%"
                                value={producto.cargos}
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
                                  <p className="month w-[90px]">Total</p>
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
                                            disabled
                                            value={
                                              props.volumenData[indexPais]
                                                .stats[indexCanal].productos[
                                                indexProd
                                              ].años[indexYear].volMeses[
                                                MONTHS[indexMes]
                                              ] *
                                              props.costoData[indexPais].stats[
                                                indexCanal
                                              ].productos[indexProd].años[
                                                indexYear
                                              ].volMeses[MONTHS[indexMes]]
                                            }
                                          />
                                        </FormItem>
                                      ),
                                    )}
                                  <FormItem className="mb-0">
                                    <Input
                                      className="w-[90px]"
                                      type="number"
                                      disabled
                                      value={resolveTotalYear(
                                        indexPais,
                                        indexCanal,
                                        indexProd,
                                        indexYear,
                                      )}
                                    />
                                  </FormItem>
                                </div>

                                <div className="flex gap-x-3 gap-y-3 mt-2">
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
                                            id={`${indexYear}-${MONTHS[indexMes]}-comision`}
                                            type="number"
                                            disabled
                                            prefix={moneda}
                                            value={resolveResul(
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
                                            )}
                                          />
                                        </FormItem>
                                      ),
                                    )}
                                  <FormItem className="mb-0">
                                    <Input
                                      className="w-[90px]"
                                      type="number"
                                      disabled
                                      value={resolveTotalYearPercent(
                                        indexPais,
                                        indexCanal,
                                        indexProd,
                                        indexYear,
                                        producto.comision,
                                      )}
                                    />
                                  </FormItem>
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
                                            disabled
                                            prefix={moneda}
                                            value={resolveResul(
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
                                            )}
                                          />
                                        </FormItem>
                                      ),
                                    )}
                                  <FormItem className="mb-0">
                                    <Input
                                      className="w-[90px]"
                                      type="number"
                                      disabled
                                      value={resolveTotalYearPercent(
                                        indexPais,
                                        indexCanal,
                                        indexProd,
                                        indexYear,
                                        producto.impuesto,
                                      )}
                                    />
                                  </FormItem>
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
                                            id={`${indexYear}-${MONTHS[indexMes]}-cargos`}
                                            disabled
                                            prefix={moneda}
                                            value={resolveResul(
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
                                            )}
                                          />
                                        </FormItem>
                                      ),
                                    )}
                                  <FormItem className="mb-0">
                                    <Input
                                      className="w-[90px]"
                                      type="number"
                                      disabled
                                      value={resolveTotalYearPercent(
                                        indexPais,
                                        indexCanal,
                                        indexProd,
                                        indexYear,
                                        producto.cargos,
                                      )}
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
              ))}
            </FormContainer>
          </TabContent>
        ))}
      {infoProducts && (
        <div className="bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px]">
          <div className="flex items-center">
            <p className=" text-[#707470] font-bold mb-3 text-left w-[500px] ">
              Costo por producto
            </p>
          </div>
          <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
            {infoProducts &&
              infoProducts.map((prod, index) => (
                <div key={index} className="flex gap-x-3 w-fit pt-3 ">
                  <p
                    className={`w-[500px]  pl-[45px] capitalize self-center ${
                      index === 0 ? 'mt-[62px]' : ''
                    }`}
                  >
                    {prod.name}
                  </p>

                  {viewTotals.length !== 0 &&
                    viewTotals[props.country][prod.name].map(
                      (año, indexYear) => (
                        <div className="flex flex-col" key={indexYear}>
                          {index === 0 && (
                            <div
                              className="titleRowR min-w-[62px]"
                              key={indexYear * 1000}
                            >
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
                            {index === 0 && (
                              <p className="month w-[90px]">Total</p>
                            )}
                            {index !== 0 && <p className="month w-[90px]" />}
                          </div>
                          <div className="flex gap-x-3 gap-y-3">
                            {visibleItems.includes(indexYear) &&
                              año &&
                              MONTHS.map((valor, indexNum) => (
                                <p className="w-[90px] text-center">
                                  {
                                    viewTotals[props.country][prod.name][
                                      indexYear
                                    ][indexNum]
                                  }
                                </p>
                              ))}
                            <p className="w-[90px] text-center font-bold">
                              {año.reduce(
                                (total, current) =>
                                  parseInt(total) + parseInt(current),
                              )}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                </div>
              ))}
          </div>

          <br />
          <br />
          <br />
          {totalesCanales.map((canal, i) => (
            <p
              className=" pl-[45px] text-[#707470]  mb-3 text-left w-[500px] "
              key={i}
            >
              COSTO CANAL '{canal.name}': {canal.sum}
            </p>
          ))}

          <br />
          <p className=" pl-[45px] text-[#707470] font-bold mb-3 text-left w-[500px] ">
            COSTO TOTAL: {volTotal}
          </p>
        </div>
      )}
    </>
  );
}

export default TableCosto;
