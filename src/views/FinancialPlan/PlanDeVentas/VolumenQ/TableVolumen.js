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
  Tabs,
  Tooltip,
} from 'components/ui';
import { MONTHS, optionsMonths } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { createVolumen } from 'services/Requests';
import formatNumber from 'utils/formatTotalsValues';

const { TabContent } = Tabs;

function TableVolumen(props) {
  const [infoForm, setInfoForm] = useState(props.data);
  const [infoProducts, setInfoProducts] = useState();
  const [visibleItems, setVisibleItems] = useState([0]);
  const [volTotal, setVolTotal] = useState(0);
  const [totalesCanales, setTotalesCanales] = useState([]);

  // Logica para mostrar las SUMATORIAS VERTICALES , se construye por pais un array de
  // productos donde tengo adentro de cada producto el atributo sum que es un array de las sumatorias
  // verticales de ese producto. No existe la relacion producto -canal porque es una suma de las
  // cantidades de cada producto teniendo en cuenta todo los canales.
  const initialConfig = () => {
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
        };
        for (let x = 0; x < props.productos.length; x++) {
          // cada prod
          const idProd = props.productos[x].uniqueId;
          let myProd = canal.productos.find((prod) => prod.id === idProd);
          let arrayvalores = [];
          for (let j = 0; j < myProd?.años?.length; j++) {
            // año
            for (let s = 0; s < MONTHS.length; s++) {
              const valor = myProd?.años[j]?.volMeses[MONTHS[s]];
              arrayvalores.push(Math.round(valor));
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
          arrayProdAgrupados.push(agrupados[props.productos[x].uniqueId]);
        }
        const copy = [...infoProducts];
        let volumenTotal = 0;

        arrayProdAgrupados.map((prod) => {
          let index = copy.findIndex((el) => el.uniqueId === prod[0].id);
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
            const numerosDelObjeto = copy[x]?.sum?.slice(i * 12, i * 12 + 12);
            const objeto = { numeros: numerosDelObjeto };
            objetos.push(objeto);
          }
          copy[x].sum = objetos;
        }
        setInfoProducts(() => [...copy]);
      }
      console.log([...arrayCanales]);
      setTotalesCanales(() => [...arrayCanales]);
    }
  };

  useEffect(() => {
    initialConfig();
  }, [infoForm]);

  useEffect(() => {
    if (props?.productos) {
      setInfoProducts(() => [...props.productos]);
    }
    if (props?.data) setInfoForm(props?.data);
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

  const fillMonthsPrices = (producto, yearIndex) => {
    let newAños = [...producto.años];
    newAños.forEach((año) => {
      año.volMeses.enero = Number(año.volMeses.enero);
    });
    let volumenActual = producto.volInicial;
    volumenActual = Number(volumenActual);
    let currentMonth = 1;

    for (let i = yearIndex >= 0 ? yearIndex : 0; i < newAños.length; i++) {
      const newMeses = { ...newAños[i].volMeses };
      let volTotal = 0;
      for (let mes in newMeses) {
        if (currentMonth >= producto.inicioMes) {
          newMeses[mes] = Math.round(volumenActual);
          volTotal += Math.round(volumenActual)
          volumenActual *= 1 + producto.tasa / 100;
        } else {
          newMeses[mes] = 0;
        }
        currentMonth++;
      }
      newAños[i] = { ...newAños[i], volMeses: newMeses, volTotal };
    }
    newAños.forEach((año) => {
      año.volMeses.enero = Number(año.volMeses.enero);
    });
    return newAños;
  };

  const replaceMonth = (producto, indexYear, mes, value) => {
    let newAños = [...producto.años];
    const newMeses = { ...newAños[indexYear].volMeses };
    newMeses[mes] = value !== '' ? value : null;
    const volTotal = Object.values(newMeses).reduce(
      (acc, curr) => acc + Math.round(curr),
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
    pais,
    canalName,
    prod,
    newValue,
    key,
    mes,
    indexYear,
  ) => {
    let inputNumero;
    if (typeof newValue === "string") {
      inputNumero = Number(newValue.replace(/\D/g, ''));
    } else {
      inputNumero = newValue
    }

    const newData = { ...infoForm };
    const channelIndex = newData[pais].findIndex(
      (canal) => canal.canalName === canalName,
    );
    const productoIndex = newData[pais][channelIndex].productos.findIndex(
      (producto) => producto.id === prod.id,
    );

    let producto = {
      ...newData[pais][channelIndex].productos[productoIndex],
    };
    switch (key) {
      case 'volumenInicial':
        producto.volInicial = inputNumero;
        producto.años = fillMonthsPrices(producto, -1);
        break;

      case 'tasa':
        producto.tasa = inputNumero;
        producto.años = fillMonthsPrices(producto, -1);
        break;

      case 'mesInicial':
        producto.inicioMes = inputNumero;
        producto.años = fillMonthsPrices(producto, -1);
        break;

      case 'mes':
        producto.años = replaceMonth(
          producto,
          indexYear,
          mes,
          inputNumero === ''
            ? 0
            : inputNumero[0] === '0'
            ? inputNumero.substring(1)
            : inputNumero,
        );
        break;
      default:
        break;
    }

    newData[pais][channelIndex].productos[productoIndex] = producto;
    setInfoForm(newData);
  };

  const formatearNumero = (numero) => {
    const nuevoNum = numero.toLocaleString('es-AR');
    return nuevoNum;
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
      let idUser = localStorage.getItem('userId');
      const { countryName, stats } = countryArray[i];
      const data = { countryName, stats, idUser };
      postVolumenData(data);
    }
  };

  const postVolumenData = (data) => {
    createVolumen(data)
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

  return (
    <>
      {infoForm &&
        Object.keys(infoForm).map((pais) => (
          <TabContent value={pais} className="mb-[20px]" key={pais}>
            <FormContainer>
              {infoForm[pais].map((canal) => (
                <section key={canal.canalName} className="contenedor">
                  <div className="titleChannel">
                    <p className="canal">{canal.canalName}</p>
                  </div>
                  <div>
                    <div>
                      {canal.productos.map((producto) => (
                        <div
                          className="flex  gap-x-3 gap-y-3  mb-6 "
                          key={producto.id}
                        >
                          <FormItem className=" mb-1 w-[210px] mt-[81px]">
                            <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value={producto.name}
                            />
                          </FormItem>
                          <div className="flex flex-col w-[240px] mt-[81px]">
                            <div className="flex w-[240px]  gap-x-2">
                              <FormItem className=" mb-0 w-[130px] ">
                                <Tooltip
                                  placement="top-end"
                                  title="Volumen Inicial"
                                >
                                  <Input
                                    placeholder="Volumen inicial"
                                    type="text"
                                    name="volumenInicial"
                                    value={formatearNumero(producto.volInicial)}
                                    onChange={(e) =>
                                      handleOnChangeInitialValue(
                                        pais,
                                        canal.canalName,
                                        producto,
                                        e.target.value,
                                        'volumenInicial',
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
                                    type="text"
                                    name="tasa"
                                    suffix="%"
                                    value={formatearNumero(producto.tasa)}
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
                                          {año.volMeses[
                                            Object.keys(año.volMeses)[indexMes]
                                          ].toString().length > 7 ? (
                                            <Tooltip
                                              placement="top-end"
                                              title={formatearNumero(
                                                año.volMeses[
                                                  Object.keys(año.volMeses)[
                                                    indexMes
                                                  ]
                                                ],
                                              )}
                                            >
                                              <Input
                                                className="w-[90px]"
                                                type="text"
                                                value={formatearNumero(
                                                  año.volMeses[
                                                    Object.keys(año.volMeses)[
                                                      indexMes
                                                    ]
                                                  ],
                                                )}
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
                                            </Tooltip>
                                          ) : (
                                            <Input
                                              className="w-[90px]"
                                              type="text"
                                              value={formatearNumero(
                                                año.volMeses[
                                                  Object.keys(año.volMeses)[
                                                    indexMes
                                                  ]
                                                ],
                                              )}
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
                                          )}
                                        </FormItem>
                                      ),
                                    )}

                                  <FormItem className="mb-0">
                                    {año.volTotal.toString().length > 7 ? (
                                      <Tooltip
                                        placement="top-end"
                                        title={formatNumber(año.volTotal)}
                                      >
                                        <Input
                                          className="w-[90px]"
                                          type="text"
                                          disabled
                                          value={formatNumber(año.volTotal)}
                                        />
                                      </Tooltip>
                                    ) : (
                                      <Input
                                        className="w-[90px]"
                                        type="text"
                                        disabled
                                        value={formatNumber(año.volTotal)}
                                      />
                                    )}
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
            <p className=" text-[#707470] cursor-default  font-bold mb-3 text-left w-[435px] ">
              Volumen por producto
            </p>
          </div>
          <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
            {infoProducts.length > 0 &&
              infoProducts.map((prod, index) => (
                <div key={index} className="flex gap-x-3 w-fit pt-3 ">
                  <p
                    className={`w-[435px]  pl-[45px] cursor-default  capitalize self-center ${
                      index === 0 ? 'mt-[62px]' : ''
                    }`}
                  >
                    {prod.name}
                  </p>
                  {prod.sum?.map((año, indexYear) => (
                    <div className="flex flex-col" key={indexYear}>
                      {index === 0 && (
                        <div className="titleRowR min-w-[62px]">
                          <p className='cursor-default '> Año {indexYear + 1}</p>
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
                              className="month w-[90px] capitalize cursor-default "
                            >
                              {mes}
                            </p>
                          ))}
                        {index === 0 && <p className="month w-[90px]">Total</p>}
                        {index !== 0 && <p className="month w-[90px]" />}
                      </div>
                      <div className="flex gap-x-3 gap-y-3">
                        {visibleItems?.includes(indexYear) &&
                          año &&
                          año.numeros?.map((valor, index) => (
                            <p className="cursor-default w-[90px] text-center">
                              <Tooltip
                                placement="top-end"
                                title={formatNumber(valor)}
                              >
                                <ShortNumberNotation numero={valor} />
                              </Tooltip>
                            </p>
                          ))}
                        {año.numeros?.length !== 0 && (
                          <p className="cursor-default w-[90px] text-center font-bold">
                            <Tooltip
                              placement="top-end"
                              title={formatNumber(
                                año.numeros?.length !== 0 &&
                                  año?.numeros?.reduce(
                                    (total, current) => total + current,
                                  ),
                              )}
                            >
                              <ShortNumberNotation
                                numero={
                                  año.numeros?.length !== 0 &&
                                  año?.numeros?.reduce(
                                    (total, current) => total + current,
                                  )
                                }
                              />
                            </Tooltip>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>

          <br />
          <br />
          <br />
          {totalesCanales.map((canal, i) => (
            <p
              className=" pl-[45px] text-[#707470] cursor-default   mb-3 text-left w-[435px] "
              key={i}
            >
              <Tooltip placement="top-end" title={formatNumber(canal.sum)}>
                VOLUMEN CANAL '{canal.name}': &nbsp;
                <ShortNumberNotation numero={canal.sum} />
              </Tooltip>
            </p>
          ))}

          <br />
          <p className=" pl-[45px] text-[#707470] font-bold mb-3 text-left w-[435px] ">
            <Tooltip placement="top-end" title={formatNumber(volTotal)}>
              VOLUMEN TOTAL: &nbsp;
              <ShortNumberNotation numero={volTotal} />
            </Tooltip>
          </p>
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

export default TableVolumen;
