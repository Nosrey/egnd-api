/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
    Button,
    FormContainer,
    FormItem,
    Input,
    Tooltip,
  } from 'components/ui';
  import { useEffect , useState} from 'react';
import { useSelector } from 'react-redux';
import { formatNumberPrestamos } from 'utils/formatTotalsValues';
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";


const impGanancias = 20 // traer del pyl y si no lo cargo mando un cero PONER COSTOS EN UN SOLO ACORDION  y ESTILOS , tomar datos para enviar al back poner boton guardar
  function TablePyL(props) {
    const [vtasTot, setVtasTot] = useState([]);
    const [vtasProd, setVtasProd] = useState([]);
    const [vtasServ, setVtasServ] = useState([]);
    const [costoProd, setCostoProd] = useState([]);
    const [costoServ, setCostoServ] = useState([]);
    const [costoProduccionTotal, setCostoProduccionTotal] = useState([]);
    const [costoComision, setCostoComision] = useState([]);
    const [costoImpuesto, setCostoImpuesto] = useState([]);
    const [costoCargos, setCostoCargos] = useState([]);
    const [costoComerciales, setCostoComerciales] = useState([]);
    const [costoTotales, setCostoTotales] = useState([]);
    const [MBPesos, setMBPesos] = useState([]);
    const [MBPorcentaje, setMBPorcentaje] = useState([]);
    const [ctasListado, setCtasListado] = useState([]);
    const [gastoEnCtas, setGastoEnCtas] = useState([]);
    const [gastoEnCtasTotal, setGastoEnCtasTotal] = useState([]);
    const [EBITDA, setEBITDA] = useState([]);
    const [EBITDAPorcentaje, setEBITDAPorcentaje] = useState([]);
    const [amortizaciones, setAmortizaciones] = useState([]);
    const [EBIT, setEBIT] = useState([]);
    const [EBITPorcentaje, setEBITPorcentaje] = useState([]);
    const [intereses, setIntereses] = useState([]);
    const [BAT, setBAT] = useState([]);
    const [IIGG, setIIGG] = useState([]);
    const [rdoNeto, setRdoNeto] = useState([]);
    const [RNPorcentaje, setRNPorcentaje] = useState([]);


    const [hiddenItems, setHiddenItems] = useState([true, true, true, true]);
    const [allOpen, setAllOpen] = useState(false);

    const currency = useSelector((state) => state.auth.user.currency);

    const playAccordion = (index) => {
        const copy = [...hiddenItems]
        copy[index] = !copy[index]
        setHiddenItems(copy)
    }
    
    const closeAll = () => {
        setHiddenItems([true, true, true, true]);
        setAllOpen(false)
    } 

    const openAll = () => {
        setHiddenItems([false, false, false, false])
        setAllOpen(true)
    } 

    useEffect(() => {
        if (hiddenItems) {
            let todasSonTrue = hiddenItems.every(valor => valor === true);
            let todasSonFalse = hiddenItems.every(valor => valor === false);

            if (todasSonTrue) {
                setAllOpen(false)
            }
            if (todasSonFalse) {
                setAllOpen(true)
            }
        }
        
      }, [hiddenItems]);

    useEffect(() => {
       setVtasTot(props.vtasTot)
       setVtasProd(props.vtasProd)
       setVtasServ(props.vtasServ)
       setCostoProd(props.costoProd)
       setCostoServ(props.costoServ)
       setCostoProduccionTotal(props.costoProduccionTotal)
       setCostoComision(props.costoComision)
       setCostoImpuesto(props.costoImpuesto)
       setCostoCargos(props.costoCargos)
       setCostoComerciales(props.costoComerciales)
       setCostoTotales(props.costoTotales)
       setMBPesos(props.mbPesos)
       setMBPorcentaje(props.mbPorcentaje)
       setGastoEnCtas(props.gastoEnCtas)
       setCtasListado(props.ctasListado)
       setAmortizaciones(props.amortizaciones)
        setIntereses(props.intereses)
    }, [props]);

    useEffect(() => {
       if (gastoEnCtas) {
        const arrayGastosCtasTotales = []
        for (let j = 0; j < 10; j++) {
            let sum=0
            for (let i = 0; i < gastoEnCtas.length; i++) {
            sum += gastoEnCtas[i][j]
            
            }
            arrayGastosCtasTotales.push(sum)
        }
        setGastoEnCtasTotal(arrayGastosCtasTotales)
       }
       
     }, [gastoEnCtas]);

     useEffect(() => {
        if (gastoEnCtasTotal && MBPesos) {
            console.log(gastoEnCtas)
            let resultado = [];
            for (let i = 0; i < MBPesos.length; i++) {
                resultado.push(MBPesos[i] - gastoEnCtasTotal[i])
            }
             setEBITDA(resultado)
        }
        
      }, [gastoEnCtasTotal, MBPesos]);

      useEffect(() => {
        if (EBITDA) {
            let resultado = [];
            for (let i = 0; i < EBITDA.length; i++) {
                resultado.push(EBITDA[i] / vtasTot[i])
            }
             setEBITDAPorcentaje(resultado)
        }
        
      }, [EBITDA]);

      useEffect(() => {
        if (EBITDA && amortizaciones) {
            let resultado = [];
            for (let i = 0; i < EBITDA.length; i++) {
                resultado.push(EBITDA[i] - amortizaciones[i])
            }
             setEBIT(resultado)
        }
        
      }, [EBITDA, amortizaciones]);

      useEffect(() => {
        if (EBIT) {
            let resultado = [];
            for (let i = 0; i < EBIT.length; i++) {
                resultado.push(EBIT[i] / vtasTot[i])
            }
             setEBITPorcentaje(resultado)
        }
        
      }, [EBIT]);

      useEffect(() => {
        if (EBIT && intereses) {
            let resultado = [];
            for (let i = 0; i < EBIT.length; i++) {
                resultado.push(EBIT[i] - intereses[i])
            }
             setBAT(resultado)
        }
        
      }, [EBIT, intereses])

      useEffect(() => {
        if (BAT && impGanancias) {
            let resultado = [];
            for (let i = 0; i < BAT.length; i++) {
                const valor = BAT > 0 ? (BAT[i] * impGanancias / 100) : 0;
                resultado.push(valor)
            }
            setIIGG(resultado)
        }
      }, [BAT])

      useEffect(() => {
        if (BAT && IIGG) {
            let resultado = [];
            for (let i = 0; i < BAT.length; i++) {
                resultado.push(BAT[i] - IIGG[i])
            }
            setRdoNeto(resultado)
        }
      }, [IIGG, BAT])

      useEffect(() => {
        if (rdoNeto && vtasTot) {
            let resultado = [];
            for (let i = 0; i < rdoNeto.length; i++) {
                resultado.push(rdoNeto[i] / vtasTot[i])
            }
             setRNPorcentaje(resultado)
        }
        
      }, [rdoNeto, vtasTot]);

      const submitInfoForm = () => {
        console.log("rdo")
      }
    return (
      <>
      { 
          <FormContainer>
            <div className='flex justify-end mt-[0px] mb-[10px]'>
                {allOpen ?
                    <span className='cursor-pointer text-blue-700 text-sm' onClick={closeAll}> Cerrar Todos</span> 
                    :
                    <span  className='cursor-pointer text-blue-700 text-sm' onClick={openAll}> Abrir Todos</span> 
                }
            </div>
              <section className="contenedor pl-[25px] pr-[35px]">
              { !hiddenItems[0] ? <>
                {/** *********** Ventas de Producto  ************ */}
                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px] mt-[49px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Ventas de Producto'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                      <div className="titleRow w-[130px]">
                                  <p className="cursor-default"> Año 0</p>
                              </div>
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {vtasProd.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <div className="titleRow w-[130px]">
                                  <p className="cursor-default"> Año {indexYear + 1 }</p>
                              </div>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] "
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      prefix={currency}
                                      disabled
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                {/** *********** Ventas de Servicio  ************ */}

                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >         
                  <div className='iconDesplegable'/>           
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Ventas de Servicio'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {vtasServ.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}
            </>
            :
            <div
                className="flex  gap-x-3"
            >
                <div className="titleRow w-[130px] ml-[280px]">
                    <p className="cursor-default"> Año 0</p>
                </div>
                {vtasProd.map((año, indexYear) => (
                    <div key={indexYear} className="titleRow w-[130px]">
                        <p className="cursor-default"> Año {indexYear + 1 }</p>
                    </div>
                ))}
            </div>    
        
        }
                {/** *********** Ventas de TOTALES  ************ */}
                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable' onClick={()=> playAccordion(0)}>
                        { hiddenItems[0] ? <CiCirclePlus /> : <CiCircleMinus />}
                    </div>
                    
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-blue-100"
                              value= 'TOTAL VENTAS'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {vtasTot.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold text-base"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold "
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                { !hiddenItems[1] && <>
                {/** *********** Costos de Producto  ************ */}
                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Costo de Mercaderia Vendida'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {costoProd.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      prefix={currency}
                                      disabled
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                {/** *********** Costos de Servicio  ************ */}

                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >       
                  <div className='iconDesplegable'/>             
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Costo Servicio Prestado'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {costoServ.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}
               
                {/** *********** Costode produccion total  ************ */}
                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>

                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-grey-100"
                              value= 'TOTAL Costos de producción'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {costoProduccionTotal.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

               
                  {/** *********** Costos de Impuestos sobre ventas  ************ */}
                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >       
                  <div className='iconDesplegable'/>             
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Impuestos sobre ventas'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {costoImpuesto.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                {/** *********** Costos de Costos comerciales  ************ */}

                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >                
                  <div className='iconDesplegable'/>   
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Costos comerciales'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {costoComision.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                 {/** *********** Costos de Cargos por pasarela de pago  ************ */}

                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >      
                  <div className='iconDesplegable'/>              
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Cargos por pasarela de pago'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {costoCargos.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}
               

                {/** *********** total de costos de comisiones  ************ */}
                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable' />
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-grey-100"
                              value= 'TOTAL Costos comerciales'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {costoComerciales.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}
                </>}
                  {/** *********** Total COSTOS ************ */}
                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable' onClick={()=> playAccordion(1)}>
                    { hiddenItems[1] ? <CiCirclePlus /> : <CiCircleMinus />}
                    </div>
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-blue-100"
                              value= 'TOTAL COSTOS'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {costoTotales.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold text-base"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold "
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}


                {/** *********** CMG Bruta  ************ */}
                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-grey-100"
                              value= 'CMG Bruta'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {MBPesos.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                {/** *********** CMG Bruta %  ************ */}
                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >        
                  <div className='iconDesplegable'/>           
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'CMG Bruta %'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='%'

                                  />
                              </FormItem>
                        </div>
                      {MBPorcentaje.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={`%${formatNumberPrestamos(año.toFixed(2))}`}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix='%'

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix='%'

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}
                <div className='linea'/>
                { !hiddenItems[2] && <>
                
                {/** *********** GASTO POR CUENTAS  ************ */}

                {
                    ctasListado.map((ctaName, indexCta) =>(

                    <div
                    className="flex  gap-x-3 gap-y-3  mb-6 "
                        >   
                        <div className='iconDesplegable'/>                 
                            <FormItem className=" mb-1 w-[240px]">
                                <Input
                                    disabled
                                    type="text"
                                    className="capitalize"
                                    value= {ctaName}
                                />
                            </FormItem>
                            <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                            {gastoEnCtas[indexCta].map((anio, indexanio) => (
                                <div className="flex flex-col" key={indexanio}>
                                    <FormItem
                                        className="mb-0"
                                    >
                                        {anio.toString().length > 5 ? (
                                        <Tooltip
                                            placement="top-end"
                                            title={currency + formatNumberPrestamos(anio)}
                                        >
                                            <Input
                                            className="w-[130px]"
                                            type="text"
                                            value={formatNumberPrestamos(anio)}
                                            name="year"
                                            disabled
                                            prefix={currency}

                                            />
                                        </Tooltip>
                                        ) : (
                                        <Input
                                            className="w-[130px]"
                                            type="text"
                                            value={formatNumberPrestamos(anio)}
                                            name="year"
                                            disabled
                                            prefix={currency}

                                        />
                                        )}
                                    </FormItem>
                                </div>
                            ))}
                        </div>
                    ))
                }
                 {/** *********** ****************  ************ */}
                </>}
                 {/** *********** TOTAL GASTOS ESTRUCURAS  ************ */}
                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                 <div className='iconDesplegable' onClick={()=> playAccordion(2)}>
                    { hiddenItems[2] ? <CiCirclePlus /> : <CiCircleMinus />}
                </div>
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-blue-100"
                              value= 'TOTAL GASTOS ESTRUCTURA'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {gastoEnCtasTotal.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold text-base"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold "
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                { !hiddenItems[3] && <>
                 {/** *********** EBITDA  ************ */}

                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-grey-100"
                              value= 'EBITDA'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {EBITDA.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                
                {/** *********** EBITDA %  ************ */}

                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >      
                  <div className='iconDesplegable'/>              
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'EBITDA %'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='%'

                                  />
                              </FormItem>
                        </div>
                      {EBITDAPorcentaje.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={`%${formatNumberPrestamos(año.toFixed(2))}`}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix='%'

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix='%'

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                {/** *********** Amortizaciones  ************ */}

                   <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >   <div className='iconDesplegable'/>                 
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Amortizaciones'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {amortizaciones.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                 {/** *********** EBIT  ************ */}

                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-grey-100"
                              value= 'EBIT'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {EBIT.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                 {/** *********** EBIT %  ************ */}

                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >          
                  <div className='iconDesplegable'/>          
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'EBIT %'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='%'

                                  />
                              </FormItem>
                        </div>
                      {EBITPorcentaje.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={`%${formatNumberPrestamos(año.toFixed(2))}`}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix='%'

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix='%'

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                 {/** *********** Intereses  ************ */}

                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >        
                  <div className='iconDesplegable'/>            
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Intereses'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {intereses.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                {/** *********** BAT  ************ */}

                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-grey-100"
                              value= 'BAT'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {BAT.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                 {/** *********** IIGG  ************ */}

                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >       
                  <div className='iconDesplegable'/>             
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'IIGG'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {IIGG.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}
                </> }

                 {/** *********** Resultado Neto  ************ */}

                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable' onClick={()=> playAccordion(3)}>
                     { hiddenItems[3] ? <CiCirclePlus /> : <CiCircleMinus />}
                    </div>
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-grey-100"
                              value= 'Resultado Neto'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {rdoNeto.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={currency + formatNumberPrestamos(año.toFixed(2))}
                                  >
                                      <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}

                 {/** *********** RN %  ************ */}

                 <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >       
                  <div className='iconDesplegable'/>             
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'RN %'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={0}
                                      name="initial"
                                      prefix='%'

                                  />
                              </FormItem>
                        </div>
                      {RNPorcentaje.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 5 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={`%${formatNumberPrestamos(año.toFixed(2))}`}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix='%'

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={formatNumberPrestamos(año.toFixed(2))}
                                      name="year"
                                      disabled
                                      prefix='%'

                                  />
                                  )}
                              </FormItem>
                          </div>
                      ))}
                  </div>
                {/** *********** ****************  ************ */}
              </section>
          </FormContainer>
      
      }
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
  
  export default TablePyL;
  