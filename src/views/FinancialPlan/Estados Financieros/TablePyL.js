/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
    FormContainer,
    FormItem,
    Input,
    Tooltip,
  } from 'components/ui';
  import { useEffect , useState} from 'react';
import { useSelector } from 'react-redux';
  
  
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

    const currency = useSelector((state) => state.auth.user.currency);
    
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

    }, [props]);
  
    return (
      <>
      { 
          <FormContainer>
              <section className="contenedor pl-[25px] pr-[35px]">

                {/** *********** Ventas de Producto  ************ */}
                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                      <FormItem className=" mb-1 w-[240px] mt-[49px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Ventas de Producto'
                          />
                      </FormItem>
  
                      {vtasProd.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <div className="titleRow w-[130px]">
                                  <p className="cursor-default"> Año {indexYear + 1 }</p>
                              </div>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px] "
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={(año)}
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
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Ventas de Servicio'
                          />
                      </FormItem>
                      {vtasServ.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={(año)}
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

                {/** *********** Ventas de TOTALES  ************ */}
                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-blue-100"
                              value= 'TOTAL VENTAS'
                          />
                      </FormItem>
                      {vtasTot.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px] font-bold text-base"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold "
                                      type="text"
                                      value={(año)}
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

                {/** *********** Costos de Producto  ************ */}
                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Costo de Mercaderia Vendida'
                          />
                      </FormItem>
  
                      {costoProd.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={(año)}
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
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Costo Servicio Prestado'
                          />
                      </FormItem>
                      {costoServ.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={(año)}
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
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-grey-100"
                              value= 'TOTAL Costos de producción'
                          />
                      </FormItem>
                      {costoProduccionTotal.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={(año)}
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
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Impuestos sobre ventas'
                          />
                      </FormItem>
                      {costoImpuesto.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={(año)}
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
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Costos comerciales'
                          />
                      </FormItem>
                      {costoComision.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={(año)}
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
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Cargos por pasarela de pago'
                          />
                      </FormItem>
                      {costoCargos.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={(año)}
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
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-grey-100"
                              value= 'TOTAL Costos comerciales'
                          />
                      </FormItem>
                      {costoComerciales.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold bg-blue-100"
                                      type="text"
                                      value={(año)}
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

                  {/** *********** Total COSTOS ************ */}
                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-blue-100"
                              value= 'TOTAL COSTOS'
                          />
                      </FormItem>
                      {costoTotales.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {Math.round(año).toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px] font-bold text-base"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}
                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px] font-bold "
                                      type="text"
                                      value={(año)}
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
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'CMG Bruta'
                          />
                      </FormItem>
                      {MBPesos.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix={currency}

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={(año)}
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
                      <FormItem className=" mb-1 w-[240px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'CMG Bruta %'
                          />
                      </FormItem>
                      {MBPorcentaje.map((año, indexYear) => (
                          <div className="flex flex-col" key={indexYear}>
                              <FormItem
                                  className="mb-0"
                              >
                                  {año.toString().length > 3 ? (
                                  <Tooltip
                                      placement="top-end"
                                      title={año}
                                  >
                                      <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={año}
                                      name="year"
                                      disabled
                                      prefix='%'

                                      />
                                  </Tooltip>
                                  ) : (
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={(año)}
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
      </>
    );
  }
  
  export default TablePyL;
  