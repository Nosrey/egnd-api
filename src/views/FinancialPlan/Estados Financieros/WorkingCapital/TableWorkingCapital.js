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

  function TableWorkingCapital(props) {
    const [creditosVentas, setCreditosVentas] = useState([]);
    const [bienesDeCambio, setBienesDeCambio] = useState([]);
    const [deudasComerciales, setDeudasComerciales] = useState([]);
    const [posicionAlCierre, setPosicionAlCierre] = useState([]);
    const [variacion, setVariacion] = useState([]);

    // ***************** INPUTS ANIO 0 ******************
    const [inputsValues, setinputsValues] = useState({
        creditosVentas: "0" ,
        bienesDeCambio: "0" ,
        deudasComerciales: "0" ,
    });

   const handleChangeInputs = (key , value) => {
        const copy = {...inputsValues}
        if (value.startsWith("0")) {
            value = value.slice(1);
        }
        copy[key] = value
        setinputsValues(copy)
    }

    // **********************************************

    const currency = useSelector((state) => state.auth.user.currency);


    useEffect(() => {
       setCreditosVentas(props.creditosVentas)
       setBienesDeCambio(props.bienesDeCambio)
       setDeudasComerciales(props.deudasComerciales)
    }, [props]);

    useEffect(() => {
        if (creditosVentas && bienesDeCambio && deudasComerciales) {
            let resultado = [];
            for (let i = 0; i < 11; i++) {
                if (i === 0) {
                    resultado.push(0)
                } else {
                    resultado.push(creditosVentas[i-1] + bienesDeCambio[i-1] - deudasComerciales[i-1])
                }
            }
             setPosicionAlCierre(resultado)
        }
     }, [creditosVentas, bienesDeCambio, deudasComerciales]);

     useEffect(() => {
        if (inputsValues) {
            const copy = {...inputsValues}
            const valor = parseInt(copy.creditosVentas) + parseInt(copy.bienesDeCambio) - parseInt(copy.deudasComerciales)
           
            const copyArray = [...posicionAlCierre]
            copyArray[0]=valor;
            setPosicionAlCierre(copyArray)
        }
     }, [inputsValues]);

     useEffect(() => {
        if (posicionAlCierre) {
            const arrayResultado = [];
            for (let i = 1; i < posicionAlCierre.length; i++) {
                const resultado = posicionAlCierre[i] - posicionAlCierre[i - 1];
                arrayResultado.push(resultado);
            }
            setVariacion(arrayResultado)
        }
     }, [posicionAlCierre]);

      const submitInfoForm = () => {
        console.log(inputsValues)
      }
    return (
      <>
      { 
          <FormContainer>
              <section className="contenedor pl-[25px] pr-[35px]">
            
                {/** *********** Créditos por Ventas  ************ */}
                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px] mt-[49px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Créditos por Ventas'
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
                                      value={inputsValues.creditosVentas}
                                      onChange={(e) => handleChangeInputs('creditosVentas' , e.target.value)}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {creditosVentas.map((año, indexYear) => (
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
                {/** *********** Bienes de Cambio  ************ */}
                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px] mt-[0px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Bienes de Cambio'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                   
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={inputsValues.bienesDeCambio}
                                      onChange={(e) => handleChangeInputs('bienesDeCambio' , e.target.value)}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {bienesDeCambio.map((año, indexYear) => (
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

                {/** *********** Deudas Comerciales  ************ */}
                <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px] mt-[0px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Deudas Comerciales'
                          />
                      </FormItem>
                      <div className="flex flex-col" >

                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      value={inputsValues.deudasComerciales}
                                      onChange={(e) => handleChangeInputs('deudasComerciales' , e.target.value)}
                                      name="initial"
                                      prefix='$'

                                  />
                              </FormItem>
                        </div>
                      {deudasComerciales.map((año, indexYear) => (
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

        
                {/** *********** Posición al Cierre  ************ */}
                  <div
                      className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                      <div className='iconDesplegable'/>        
                    
                      <FormItem className=" mb-1 w-[240px] ">
                          <Input
                              disabled
                              type="text"
                              className="capitalize font-bold bg-blue-100"
                              value= 'Posición al Cierre'
                          />
                      </FormItem>
                      {posicionAlCierre.map((año, indexYear) => (
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

                {/** *********** Variación WC  ************ */}
                <div
                    className="flex  gap-x-3 gap-y-3  mb-6 "
                  >
                    <div className='iconDesplegable'/>
                      <FormItem className=" mb-1 w-[240px] mt-[0px]">
                          <Input
                              disabled
                              type="text"
                              className="capitalize"
                              value= 'Variación WC'
                          />
                      </FormItem>
                      <div className="flex flex-col" >
                   
                              <FormItem
                                  className="mb-0"
                              >
                                  <Input
                                      className="w-[130px]"
                                      type="text"
                                      disabled
                                      name="initial"

                                  />
                              </FormItem>
                        </div>
                      {variacion.map((año, indexYear) => (
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
  
  export default TableWorkingCapital;
  