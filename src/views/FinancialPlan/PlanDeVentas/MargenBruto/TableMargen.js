/* eslint-disable no-restricted-globals */
import ShortNumberNotation from 'components/shared/shortNumberNotation/ShortNumberNotation';
import { FormContainer, FormItem, Input, Tabs, Tooltip } from 'components/ui';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import formatNumber, { formatearNumero } from 'utils/formatTotalsValues';

const { TabContent } = Tabs;

function TableMargen(props) {
  const [infoForm] = useState(props.data);
  const [infoProducts, setInfoProducts] = useState(props.productos);
  const [visibleItems, setVisibleItems] = useState([0]);
  const [volTotal, setVolTotal] = useState(0);
  const [totalesCanales, setTotalesCanales] = useState([]);
  const moneda = props.currency;

  
  // Logica para mostrar las SUMATORIAS VERTICALES , se construye por pais un array de
  // productos donde tengo adentro de cada producto el atributo sum que es un array de las sumatorias
  // verticales de ese producto. No existe la relacion producto -canal porque es una suma de las
  // ventas de cada producto teniendo en cuenta todos los canales.
  const initialConfig = () => {
    if (infoForm && props.country) {
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
      setTotalesCanales(() => [...arrayCanales]);
    }
  };

  useEffect(() => {
    initialConfig();
  }, [infoForm, props]);


  const hideYear = (index) => {
    setVisibleItems((prevItems) => {
      if (prevItems.includes(index)) {
        // Si el elemento ya está en la lista, lo eliminamos para ocultarlo
        return prevItems.filter((id) => id !== index);
      } // Si el elemento no está en la lista, lo agregamos para mostrarlo
      return [...prevItems, index];
    });
  };

  const getVentasResult = (indexCountry, indexCanal, indexP, indexYear, indexMonth) => { 
    const pcio = props.precioData[indexCountry].stats[indexCanal].productos[indexP].años[indexYear].volMeses[MONTHS[indexMonth]];
    const vol = props.volumenData[indexCountry].stats[indexCanal].productos[indexP].años[indexYear].volMeses[MONTHS[indexMonth]];
    const ventas = pcio * vol;
    return ventas;
  }

  const getMargenBrutoResult = (indexCountry, indexCanal, indexP, indexYear, indexMonth) => {
    const vol = props.volumenData[indexCountry].stats[indexCanal].productos[indexP].años[indexYear].volMeses[MONTHS[indexMonth]];

    const costo = props.costoData[indexCountry].stats[indexCanal].productos[indexP].años[indexYear].volMeses[MONTHS[indexMonth]];
    const comisionPercent = props.costoData[indexCountry].stats[indexCanal].productos[indexP].comision;
    const cargosPercent = props.costoData[indexCountry].stats[indexCanal].productos[indexP].cargos;
    const impuestoPercent = props.costoData[indexCountry].stats[indexCanal].productos[indexP].impuesto

    const ventas = getVentasResult(indexCountry, indexCanal, indexP, indexYear, indexMonth);
    
    const comision = comisionPercent * ventas / 100;
    const cargos = cargosPercent * ventas / 100;
    const impuesto = impuestoPercent * ventas / 100;

    const costoTot = (costo * vol) + impuesto + comision + cargos;

    const rdo = ventas - costoTot;
    return rdo; 
  }

  // TOTALES HORIZONTALES
  const getTotMargenBrutoAnual = (indexCountry, indexCanal, indexP, indexYear) => {
    const arrValoresYear = []
    for (let i = 0; i < MONTHS.length; i++) {
      arrValoresYear.push(Math.round(getMargenBrutoResult(indexCountry, indexCanal, indexP, indexYear, i)));
    }
    const totAnual = arrValoresYear.reduce((total, valor) => total + valor, 0);
    return totAnual;
  }

  const getTotVentasAnual = (indexCountry, indexCanal, indexP, indexYear) => {
    const arrValoresYear = []
    for (let i = 0; i < MONTHS.length; i++) {
      arrValoresYear.push(getVentasResult(indexCountry, indexCanal, indexP, indexYear, i));
    }
    const totAnual = arrValoresYear.reduce((total, valor) => total + valor, 0);
    return totAnual;
  }
//  FIN TOTALES HORIZONTALES


    // TOTALES VERTICALES
  const getSumVerticalPorMes = (indexCountry, indexYear, indexMes, idProd, country) => {
    // identifico de que producto estoy hablando encontrandolo por su id
    const indexProd = infoForm[country][0].productos.findIndex((prod) => prod.id === idProd);

    const valoresDeMiProdEsteMes = [];
    for (let i = 0; i <infoForm[country].length; i++) { // recorro mis canales
      // por cada canal me traigo el MB de mi prod ese mes EJ: Enero para el B2B y B2C
      valoresDeMiProdEsteMes.push(getMargenBrutoResult(indexCountry,i, indexProd, indexYear, indexMes))
      
    }
    const totMensual = valoresDeMiProdEsteMes.reduce((total, valor) => total + valor, 0);
    return totMensual;
  }

  const getSumVerticalAnual = (indexCountry, indexYear, idProd, country) => {
    // identifico de que producto estoy hablando encontrandolo por su id
    const indexProd = infoForm[country][0].productos.findIndex((prod) => prod.id === idProd);

    const valoresDeMiProdEsteAño = [];
    for (let i = 0; i <infoForm[country].length; i++) { // recorro mis canales
      // por cada canal me traigo el MB de mi prod ese mes EJ: Enero para el B2B y B2C
      valoresDeMiProdEsteAño.push(getTotMargenBrutoAnual(indexCountry,i, indexProd, indexYear))
      
    }
    const totAnual = valoresDeMiProdEsteAño.reduce((total, valor) => total + valor, 0);
    return totAnual;
  }
    // FIN TOTALES VERTICALES


    // PORCENTAJES
  const calculatePercent = (indexCountry, indexCanal, indexP, indexYear, indexMes) => {
    // margen bruto x 100 / ventas 
    const percent = (getMargenBrutoResult(indexCountry, indexCanal, indexP, indexYear, indexMes) * 100 ) /
    getVentasResult(indexCountry, indexCanal, indexP, indexYear, indexMes)
     return isNaN(percent) ? 0 : Math.round(percent)
  }

  const calculateAnualPercent = (indexCountry, indexCanal, indexP, indexYear) => {
    // margen bruto total x 100 / ventas totales
    const percent = (getTotMargenBrutoAnual(indexCountry, indexCanal, indexP, indexYear) * 100 ) /
     getTotVentasAnual(indexCountry, indexCanal, indexP, indexYear)
     return isNaN(percent) ? 0 : Math.round(percent)
  }
  // FIN PORCENTAJES
  
  return (
    <>
      {infoForm && props.precioData && props.costoData && props.volumenData &&
        Object.keys(infoForm).map((pais, indexCountry) => (
          <TabContent value={pais} className="mb-[20px]" key={pais}>
            <FormContainer>
              {infoForm[pais].map((canal, indexCanal) => (
                <section key={canal.canalName} className="contenedor">
                  <div className="titleChannel">
                    <p className="canal cursor-default">{canal.canalName}</p>
                  </div>
                  <div>
                    <div>
                      {canal.productos.map((producto, indexP) => (
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
                          {producto.años.map((año, indexYear) => (
                            <div className="flex flex-col" key={indexYear}>
                              <div className="titleRow min-w-[62px]">
                                <p className='cursor-default'> Año {año.año}</p>
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
                                          className="month w-[90px] cursor-default capitalize"
                                        >
                                          {Object.keys(año.volMeses)[indexMes]}
                                        </p>
                                      ),
                                    )}

                                  <p className="month w-[90px] cursor-default">Total</p>
                                </div>
                                {}
                                <div className="flex gap-x-3 gap-y-3">
                                  {visibleItems.includes(indexYear) &&
                                    año &&
                                    Object.keys(año.volMeses).map(
                                      (mes, indexMes) => (
                                        <div className="flex flex-col">
                                          <FormItem
                                            className="mb-0"
                                            key={indexMes}
                                          >
                                            <Tooltip
                                              placement="top-end"
                                              title={moneda + formatearNumero(Math.round(getMargenBrutoResult(indexCountry, indexCanal, indexP, indexYear, indexMes)).toString()) }
                                            >
                                              <Input
                                              className="w-[90px]"
                                              type="text"
                                              value={formatearNumero(Math.round(getMargenBrutoResult(indexCountry, indexCanal, indexP, indexYear, indexMes)).toString())}
                                              disabled
                                              prefix={moneda}
                                              name="month"
                                            />
                                            </Tooltip>
                                          </FormItem>
                                          {/* si es rdo positivo o negativo lo muestro con distinta clase */}
                                           {calculatePercent(indexCountry, indexCanal, indexP, indexYear, indexMes)
                                            >= 0 ?
                                              <div className="rounded-lg bg-green-200 w-[55px] ml-[auto] mr-[auto] mt-[6px]">
                                                <p className="text-xs cursor-default font-semibold text-center text-green-950">
                                                  {calculatePercent(indexCountry, indexCanal, indexP, indexYear, indexMes)} 
                                                      %
                                                </p>
                                              </div>
                                              :
                                              <div className="rounded-lg bg-rose-200 w-[55px] ml-[auto] mr-[auto] mt-[6px]">
                                                <p className="text-xs cursor-default font-semibold text-center text-rose-950">
                                                  {calculatePercent(indexCountry, indexCanal, indexP, indexYear, indexMes)} 
                                                      %
                                                </p>
                                              </div>
                                            }                                            
                                        </div>
                                      ),
                                    )}

                                  <div className="">
                                    <FormItem className="mb-0">
                                       <Tooltip
                                          placement="top-end"
                                          title={moneda + formatearNumero(Math.round(getTotMargenBrutoAnual(indexCountry,indexCanal, indexP, indexYear)).toString()) }
                                        >
                                          <Input
                                            className="w-[90px]"
                                            type="text"
                                            disabled
                                            value={formatearNumero(Math.round(getTotMargenBrutoAnual(indexCountry,indexCanal, indexP, indexYear)).toString())}
                                            prefix={moneda}
                                          />
                                        </Tooltip>
                                      
                                    </FormItem>
                                    {/* si es rdo positivo o negativo lo muestro con distinta clase */}
                                    {calculateAnualPercent(indexCountry, indexCanal, indexP, indexYear) 
                                      >= 0 ?
                                      <div className="rounded-lg bg-green-200 w-[55px] ml-[auto] mr-[auto] mt-[6px]">
                                        <p className="text-xs cursor-default font-semibold text-center text-green-950">
                                          {calculateAnualPercent(indexCountry, indexCanal, indexP, indexYear) } 
                                              %
                                        </p>
                                      </div>
                                      :
                                      <div className="rounded-lg bg-rose-200  cursor-default w-[55px] ml-[auto] mr-[auto] mt-[6px]">
                                        <p className="text-xs font-semibold  cursor-default  text-center text-rose-950">
                                          {calculateAnualPercent(indexCountry, indexCanal, indexP, indexYear) } 
                                              %
                                        </p>
                                      </div>
                                    }
                                  </div>
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
            
            {/* SUMATORIA VERTICAL */}
            <div className="bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px]">
              <div className="flex items-center">
                <p className="cursor-default text-[#707470] font-bold mb-3 text-left w-[185px] ">
                  Margen Bruto por item
                </p>
              </div>
              <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
                {infoProducts.length > 0 &&
                  infoProducts.map((prod, index) => (
                    <div key={index} className="flex gap-x-3 w-fit pt-3 ">
                      <p
                        className={`w-[185px] cursor-default  pl-[45px] capitalize self-center ${
                          index === 0 ? 'mt-[62px]' : ''
                        }`}
                      >
                        {prod.name}
                      </p>
                      {prod.sum?.map((año, indexYear) => (
                        <div className="flex flex-col" key={indexYear}>
                          {index === 0 && (
                            <div className="titleRowR min-w-[62px]">
                              <p className='cursor-default'> Año {indexYear + 1}</p>
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
                                  className="month cursor-default w-[90px] capitalize"
                                >
                                  {mes}
                                </p>
                              ))}
                            {index === 0 && <p className="month w-[90px]  cursor-default ">Total</p>}
                            {index !== 0 && <p className="month w-[90px]" />}
                          </div>
                          <div className="flex gap-x-3 gap-y-3">
                              {visibleItems.includes(indexYear) && MONTHS.map((mes, indexMes) => (
                                <p className="w-[90px] cursor-default text-center cursor-default">
                                  <Tooltip
                                    placement="top-end"
                                    title={moneda + formatearNumero(getSumVerticalPorMes(indexCountry, indexYear, indexMes, prod.uniqueId, pais).toString())}
                                  >
                                      {moneda}
                                      <ShortNumberNotation numero={getSumVerticalPorMes(indexCountry, indexYear, indexMes, prod.uniqueId, pais)} />
                                  </Tooltip>
                                  
                                </p>
                              ))}
                            <p className="w-[90px] cursor-default text-center font-bold cursor-default">
                              <Tooltip
                                placement="top-end"
                                title={moneda + formatearNumero(getSumVerticalAnual(indexCountry, indexYear, prod.uniqueId, pais).toString())}
                              >
                                  {moneda}
                                  <ShortNumberNotation numero={getSumVerticalAnual(indexCountry, indexYear, prod.uniqueId, pais)} />
                              </Tooltip>
                                
                            </p>{' '}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </TabContent>
        ))}
    </>
  );
}

export default TableMargen;
