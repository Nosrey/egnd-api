/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
import {
  Avatar,
  FormContainer,
  FormItem,
  Input,
  Tabs,
} from 'components/ui'
import { MONTHS } from 'constants/forms.constants'
import { useState, useEffect } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

const { TabContent } = Tabs

function TableMargen(props) {
  const [infoForm] = useState(props.data)
  const [infoProducts, setInfoProducts] = useState(props.productos)
  const [visibleItems, setVisibleItems] = useState([0])
  const [volTotal, setVolTotal] = useState(0)
  const [totalesCanales, setTotalesCanales] = useState([])
  const moneda = props.currency

  // Logica para mostrar las SUMATORIAS VERTICALES , se construye por pais un array de 
  // productos donde tengo adentro de cada producto el atributo sum que es un array de las sumatorias 
  // verticales de ese producto. No existe la relacion producto -canal porque es una suma de las 
  // ventas de cada producto teniendo en cuenta todos los canales.
  const initialConfig = () => {
    if (infoForm && props.country) {
      const pais = [...infoForm[props.country]]
      const arrayP = []
      const arrayCanales = []
      for (let i = 0; i < pais.length; i++) {// cada canal
        const canal = pais[i]
        let canalInfo = {
          name: canal.canalName,
          sum: 0
        }
        for (let x = 0; x < props.productos.length; x++) {// cada prod
          const idProd = props.productos[x].id
          let myProd = canal.productos.find(prod => prod.id === idProd)
          let arrayvalores = []
          for (let j = 0; j < myProd.años.length; j++) { // año
            for (let s = 0; s < MONTHS.length; s++) {
              const valor = myProd.años[j].volMeses[MONTHS[s]]
              arrayvalores.push(parseInt(valor, 10))
            }
          }
          canalInfo.sum += arrayvalores.reduce((acumulador, valorActual) => acumulador + valorActual, 0)
          arrayP.push({ ...myProd, sum: arrayvalores })
        }
        arrayCanales.push(canalInfo);
        const agrupados = arrayP.reduce((resultado, objeto) => {
          if (!resultado[objeto.id]) {
            resultado[objeto.id] = [];
          }
          resultado[objeto.id].push(objeto);
          return resultado;
        }, {});

        const arrayProdAgrupados = [] // este es mi array de arrays prod 1 , prod2,etc
        for (let x = 0; x < props.productos.length; x++) {
          arrayProdAgrupados.push(agrupados[props.productos[x].id])
        }
        const copy = [...infoProducts]
        let volumenTotal = 0
        arrayProdAgrupados.map((prod) => {
          let index = copy.findIndex((el) => el.id === prod[0].id)
          const data = prod;
          const totalSum = data.reduce((accumulator, currentValue) => currentValue.sum.map((value, index) => value + accumulator[index]), Array(data[0].sum.length).fill(0));

          volumenTotal += totalSum.reduce((accumulator, currentValue) => accumulator + currentValue);
          return copy[index] = { ...copy[index], sum: totalSum }
        })
        setVolTotal(volumenTotal)
        for (let x = 0; x < copy.length; x++) {
          const objetos = [];
          for (let i = 0; i < 10; i++) {
            const numerosDelObjeto = copy[x].sum.slice(i * 12, i * 12 + 12);
            const objeto = { numeros: numerosDelObjeto };
            objetos.push(objeto);
          }
          copy[x].sum = objetos
        }
        setInfoProducts(() => [...copy])
      }
      setTotalesCanales(() => [...arrayCanales])
    }
  }
  useEffect(() => {
    initialConfig();
  }, [infoForm])
  useEffect(() => {
    initialConfig();
  }, [props])

  const hideYear = (index) => {
    setVisibleItems((prevItems) => {
      if (prevItems.includes(index)) {// Si el elemento ya está en la lista, lo eliminamos para ocultarlo
        return prevItems.filter((id) => id !== index)
      } // Si el elemento no está en la lista, lo agregamos para mostrarlo
      return [...prevItems, index]

    })
  }

  console.log(props.costoData)


  return (
    <>
      {infoForm &&
        Object.keys(infoForm).map((pais) => (
          <TabContent value={pais} className="mb-[20px]" key={pais}>
            <FormContainer>
              {infoForm[pais].map((canal) => (
                <section
                  key={canal.canalName}
                  className="contenedor"
                >
                  <div className="titleChannel">
                    <p className="canal">
                      {canal.canalName}
                    </p>
                  </div>
                  <div>
                    <div>
                      {canal.productos.map((producto) => (
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
                          </FormItem>
                          {producto.años.map((año, indexYear) => (
                            <div className="flex flex-col" key={indexYear}>
                              <div className="titleRow min-w-[62px]">
                                <p>{' '}Año{' '}{año.año}</p>
                                <div className="iconYear"
                                  onClick={() => hideYear(indexYear)}
                                >
                                  {visibleItems.includes(indexYear) ? (<FiMinus />) : (<FiPlus />)}
                                </div>
                              </div>
                              <div className="titleMonths gap-x-3 gap-y-3 mb-[18px] flex flex-col">
                                <div className="titleMonths gap-x-3 flex">
                                  {visibleItems.includes(indexYear) && año &&
                                    Object.keys(año.volMeses).map(
                                      (mes, indexMes) => (
                                        <p key={indexMes} className="month w-[90px] capitalize">
                                          {Object.keys(año.volMeses)[indexMes]}
                                        </p>)
                                    )
                                  }

                                  <p className='month w-[90px]'>Total</p>
                                </div>
                                <div className="flex gap-x-3 gap-y-3">
                                  {visibleItems.includes(indexYear) && año &&
                                    Object.keys(año.volMeses).map((mes, indexMes) => (
                                      <FormItem className="mb-0" key={indexMes}>
                                        <Input
                                          className="w-[90px]"
                                          type="number"
                                          value={año.volMeses[Object.keys(año.volMeses)[indexMes]]}
                                          disabled
                                          prefix={moneda}
                                          name="month"
                                        />
                                      </FormItem>
                                    )
                                    )}

                                  <FormItem className="mb-0" >
                                    <Input
                                      className="w-[90px]"
                                      type="number"
                                      disabled
                                      value={año.ventasTotal}
                                      prefix={moneda}
                                    />
                                  </FormItem>
                                </div>
                              </div>
                            </div>
                          )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </FormContainer>
          </TabContent>
        ))}

      {
        infoProducts &&
        <div className='bg-indigo-50 px-[25px] py-[30px] pb-[40px] w-fit rounded mt-[60px]'>
          <div className='flex items-center'>
            <p className=' text-[#707470] font-bold mb-3 text-left w-[260px] '>Venta por producto</p>
          </div>
          <div className='w-fit pt-3 border border-neutral-600 border-x-0 border-b-0'>
            {infoProducts.length > 0 && infoProducts.map((prod, index) => (
              <div key={index} className='flex gap-x-3 w-fit pt-3 '>
                <p className={`w-[260px]  pl-[45px] capitalize self-center ${index === 0 ? 'mt-[62px]' : ''}`}>{prod.name}</p>

                {prod.sum?.map((año, indexYear) => (
                  <div className="flex flex-col" key={indexYear}>
                    {index === 0 &&
                      <div className="titleRowR min-w-[62px]">
                        <p>{' '}Año{' '}{indexYear + 1}</p>
                        <div className="iconYear"
                          onClick={() => hideYear(indexYear)}
                        >
                          {visibleItems.includes(indexYear) ? (<FiMinus />) : (<FiPlus />)}
                        </div>
                      </div>
                    }

                    <div className="titleMonths gap-x-3 flex mb-3">
                      {visibleItems.includes(indexYear) && año && index === 0 &&
                        MONTHS.map(
                          (mes, indexMes) => (
                            <p key={indexMes} className="month w-[90px] capitalize">
                              {mes}
                            </p>
                          )
                        )}
                      {index === 0 && <p className='month w-[90px]'>Total</p>}
                      {index !== 0 && <p className='month w-[90px]' />}
                    </div>
                    <div className="flex gap-x-3 gap-y-3">
                      {visibleItems.includes(indexYear) && año &&
                        año.numeros?.map((valor, index) => (<p className="w-[90px] text-center">{moneda}{valor}</p>))
                      }
                      <p className="w-[90px] text-center font-bold">{año.numeros.reduce((total, current) => total + current)}</p>
                    </div>
                  </div>
                ))
                }
              </div>
            ))}
          </div>

          <br />
          <br />
          <br />
          {totalesCanales.map((canal, i) => (
            <p className=' pl-[45px] text-[#707470]  mb-3 text-left w-[500px] ' key={i}>VENTA CANAL '{canal.name}': {moneda}{canal.sum}</p>
          ))}

          <br />
          <p className=' pl-[45px] text-[#707470] font-bold mb-3 text-left w-[500px] '>VENTA TOTAL: {moneda}{volTotal}</p>

        </div>
      }
    </>
  )
}

export default TableMargen