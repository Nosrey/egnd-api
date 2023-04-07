import React, { useEffect, useState, useRef } from 'react'
import { getUser } from 'services/Requests'
import { Tabs, Input, Tooltip, DatePicker } from 'components/ui'
import {
    Button,
    FormItem,
    FormContainer,
    Avatar,
} from 'components/ui'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { AÑOS, MONTHS, MESES } from 'constants/forms.constants'
const { TabNav, TabList, TabContent } = Tabs


function PrecioP() {
    const [info, setInfo] = useState(null)
    const [defaultCountry, setDefaultCountry] = useState('')
    const [infoForm, setInfoForm] = useState()
    useEffect(() => {
        // console.log(info)
        let estructura = {}
        if(info && info[0]) {
            for (let i = 0; i < info[0]?.paises.length; i++) {
                let productos =[]
                const realProds = info[0]?.productos.filter((prod)=> prod.type !== "servicio")
                for (let x = 0; x < realProds.length; x++) {
                    let prod = {}
                    prod["id"] = realProds[x].id
                    prod["volInicial"] = 0
                    prod["precioInicial"] = 0
                    prod["tasa"] = 0
                    prod["inicioMes"] = 1
                    prod["fecha"] = ""
                    prod["años"]=[...AÑOS]
                    productos.push(prod)
                }
                let canales =[]
                for (let x = 0; x < info[0]?.canales.length; x++) {
                    let canal = {}
                    canal["canalName"] = info[0]?.canales[x].name
                    canal["productos"] = [...productos]
                    canales.push(canal)
                }
                estructura[info[0]?.paises[i].value] = [...canales]
               
            }
            setInfoForm( () => {
                return {...estructura}
            })
            console.log(estructura)
        }
       
    }, [info])


    useEffect(() => {
        getUser()
            .then((data) => {
                setInfo(data?.assumptionData)
                setDefaultCountry(data?.assumptionData[0]?.paises[0]?.value)
            })
            .catch((error) => console.error(error))
    }, [])


    //  Table SCROLL EFFECT 
    const [scrollPosition, setScrollPosition] = useState(0)
    const containerTableRef = useRef(null)
    const btnLeftRef = useRef(null)
    const btnRightRef = useRef(null)

    const [activeDrag, setActiveDrag] = useState(false)

    const iconVisibility = () => {
        const containerTable = containerTableRef.current
        const btnLeft = btnLeftRef && btnLeftRef.current
        const btnRight = btnRightRef && btnRightRef.current

        let scrollLeftValue = Math.ceil(containerTable.scrollLeft)
        const tableWidth = containerTable.offsetWidth
        const contentWidth = containerTable.scrollWidth

        if (scrollLeftValue === 0) {
            btnLeft && (btnLeft.style.display = 'none')
        } else {
            btnLeft && (btnLeft.style.display = 'block')
        }

        if (contentWidth - tableWidth <= scrollLeftValue) {
            btnRight && (btnRight.style.display = 'none')
        } else {
            btnRight && (btnRight.style.display = 'block')
        }
    }

    // useEffect(() => {
    //     iconVisibility()
    // }, [])

    const handleRightClick = () => {
        const newPosition = scrollPosition + 450
        containerTableRef.current.scrollLeft = newPosition
        setScrollPosition(newPosition)
        setTimeout(() => iconVisibility(), 50)
    }

    const handleLeftClick = () => {
        const newPosition = scrollPosition - 450
        containerTableRef.current.scrollLeft = newPosition
        setScrollPosition(newPosition)
        setTimeout(() => iconVisibility(), 50)
    }

    const handleMouseDown = () => {
        setActiveDrag(true)
        containerTableRef.current.classList.add('dragging')
    }

    const handleMouseMove = (drag) => {
        if (!activeDrag) return
        containerTableRef.current.scrollLeft -= drag.movementX
        iconVisibility()
    }

    const handleMouseUp = () => {
        setActiveDrag(false)
        containerTableRef.current.classList.remove('dragging')
    }

    // FIN TABLE SCROLL 

    const [visibleItems, setVisibleItems] = useState([]);

    const hideYear = (index) => {

        setVisibleItems((prevItems) => {
            if (prevItems.includes(index)) {
              // Si el elemento ya está en la lista, lo eliminamos para ocultarlo
              return prevItems.filter((id) => id !== index);
            } else {
              // Si el elemento no está en la lista, lo agregamos para mostrarlo
              return [...prevItems, index];
            }
          });
    }

    // calculo de campos

    const calculateMonthValue = (index, valorInicial, percentage) => {
        const value = valorInicial * Math.pow(1 + percentage / 100, index);
        return value; 
    };

    

    const handleEditInput = (e, indexYear, indexProd, country, indexChannel , month) => {   
        let copyInfoForm = {...infoForm}
        if (e.target.name === "inicial" && indexYear == null) {
            // actualizo esta info
            copyInfoForm[country][indexChannel].productos[indexProd].volInicial = e.target.value;

            //actualizo todos los campos de volumen de este producto en base a este cambio por los 10 años
            let initValue = parseInt(e.target.value)
            let initPercentaje = copyInfoForm[country][indexChannel].productos[indexProd].tasa 
            for (let i = 0; i < 10; i++) { 
                const mesesActualizados = {
                    enero: calculateMonthValue(0 , initValue , initPercentaje),
                    febrero: calculateMonthValue(1 , initValue , initPercentaje), 
                    marzo: calculateMonthValue(2 , initValue , initPercentaje),
                    abril: calculateMonthValue(3 , initValue , initPercentaje),
                    mayo: calculateMonthValue(4 , initValue , initPercentaje),
                    junio: calculateMonthValue(5 , initValue , initPercentaje),
                    julio: calculateMonthValue(6 , initValue , initPercentaje),
                    agosto: calculateMonthValue(7 , initValue , initPercentaje),
                    septiembre: calculateMonthValue(8 , initValue , initPercentaje),
                    octubre: calculateMonthValue(9 , initValue , initPercentaje),
                    noviembre: calculateMonthValue(10 , initValue , initPercentaje),
                    diciembre: calculateMonthValue(11 , initValue , initPercentaje),
                }
                copyInfoForm[country][indexChannel].productos[indexProd].años[i].volMeses = {...mesesActualizados}
                initValue= calculateMonthValue(12 , initValue , initPercentaje)
                
            }
        }
        if (e.target.name === "tasa" && indexYear == null) {
            // actualizo esta info
            copyInfoForm[country][indexChannel].productos[indexProd].tasa = e.target.value;

             //actualizo todos los campos de volumen de este producto en base a este cambio por los 10 años
             let initValue = copyInfoForm[country][indexChannel].productos[indexProd].volInicial;
             let initPercentaje =  parseInt(e.target.value);
             for (let i = 0; i < 10; i++) { 
                 const mesesActualizados = {
                     enero: calculateMonthValue(0 , initValue , initPercentaje),
                     febrero: calculateMonthValue(1 , initValue , initPercentaje), 
                     marzo: calculateMonthValue(2 , initValue , initPercentaje),
                     abril: calculateMonthValue(3 , initValue , initPercentaje),
                     mayo: calculateMonthValue(4 , initValue , initPercentaje),
                     junio: calculateMonthValue(5 , initValue , initPercentaje),
                     julio: calculateMonthValue(6 , initValue , initPercentaje),
                     agosto: calculateMonthValue(7 , initValue , initPercentaje),
                     septiembre: calculateMonthValue(8 , initValue , initPercentaje),
                     octubre: calculateMonthValue(9 , initValue , initPercentaje),
                     noviembre: calculateMonthValue(10 , initValue , initPercentaje),
                     diciembre: calculateMonthValue(11 , initValue , initPercentaje),
                 }
                 copyInfoForm[country][indexChannel].productos[indexProd].años[i].volMeses = {...mesesActualizados}

                 initValue= calculateMonthValue(12 , initValue , initPercentaje)
                 
             }
        }
        if (e.target.name === "month") {
            copyInfoForm[country][indexChannel].productos[indexProd].años[indexYear].volMeses[month]  = parseInt(e.target.value);
            const mesesActualizados = copyInfoForm[country][indexChannel].productos[indexProd].años[indexYear].volMeses;
        }
       setInfoForm(() => {
        return {...copyInfoForm}
       })
    }
        
    const fillMonthsPrices = (producto, yearIndex, productoIndex, startMonth) => {
        let newAños = [...producto.años];
        let precioActual = producto.precioInicial;
        let currentMonth = 1;
      
        for (let i = yearIndex >= 0 ? yearIndex : 0; i < newAños.length; i++) {
          const newMeses = { ...newAños[i].volMeses };
          for (let mes in newMeses) {
            if (currentMonth >= startMonth) {
              newMeses[mes] = precioActual;
            } else {
              newMeses[mes] = 0;
            }
            precioActual *= 1 + producto.tasa / 100;
            currentMonth++;
          }
          newAños[i] = { ...newAños[i], volMeses: newMeses };
        }
      
        return newAños;
      };

    const handleOnChangeInitialValue = (pais, canalName, productoId, newValue) => {
        const newData = { ...infoForm };
        const productoIndex = newData[pais][0].productos.findIndex(
          (producto) => producto.id === productoId
        );
        const producto = newData[pais][0].productos[productoIndex];
        producto.precioInicial = newValue;
        console.log(`new precioInicial for productoId ${productoId}:`, producto.precioInicial);
        const yearIndex = -1;
        const newAños = fillMonthsPrices(producto, yearIndex, productoIndex, producto.inicioMes);
        newData[pais][0].productos[productoIndex].años = newAños;
        setInfoForm(newData);
      };

      const handleOnChangeTasa = (pais, canalName, productoId, newValue) => {
        const newData = { ...infoForm };
        const productoIndex = newData[pais][0].productos.findIndex(
          (producto) => producto.id === productoId
        );
        const producto = newData[pais][0].productos[productoIndex];
        producto.tasa = newValue;
        console.log(`new tasa for productoId ${productoId}:`, producto.tasa);
        const yearIndex = -1;
        const newAños = fillMonthsPrices(producto, yearIndex, productoIndex, producto.inicioMes);
        newData[pais][0].productos[productoIndex].años = newAños;
        setInfoForm(newData);
      };
  
      const handleOnChangeStartMonth = (pais, canalName, productoId, newValue) => {
        const newData = { ...infoForm };
        const productoIndex = newData[pais][0].productos.findIndex(
          (producto) => producto.id === productoId
        );
        const producto = newData[pais][0].productos[productoIndex];
        producto.inicioMes = newValue;
        console.log(`new inicioMes for productoId ${productoId}:`, producto.inicioMes);
        const yearIndex = -1;
        const newAños = fillMonthsPrices(producto, yearIndex, productoIndex, producto.inicioMes);
        newData[pais][0].productos[productoIndex].años = newAños;
        setInfoForm(newData);
      };

    return (
        <div>
            {console.log("INFOOOO!!: ", infoForm)}

            <div className="border-b-2 mb-8 pb-1">
                <h4>Precio (P)</h4>
                <span>Plan de ventas</span>
            </div>

            <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
                <div className="border-b-2 px-4 py-1">
                    <h6>Carga de productos / servicios</h6>
                </div>
                {info && (
                    <Tabs defaultValue={defaultCountry}>
                        <TabList>
                            {infoForm && Object.keys(infoForm).map((pais, index)=> (
                                    <TabNav key={index} value={pais}>
                                        <div>{pais}</div>
                                    </TabNav>
                                ))}
                        </TabList>
                  
                            <div className="container-countries">
                                <FormContainer className="cont-countries">
                                    <div
                                        className="wrapper p-4 overflow-x-auto scroll-smooth "
                                        ref={containerTableRef}
                                        onScroll={iconVisibility}
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                    >
                                        <MdKeyboardArrowLeft
                                            onClick={handleLeftClick}
                                            className="text-8xl absolute left-0 top-[50vh] z-50 cursor-pointer"
                                            ref={btnLeftRef}
                                        />
                                        <MdKeyboardArrowRight
                                            onClick={handleRightClick}
                                            className="text-8xl absolute right-0 top-[50vh] z-50 cursor-pointer"
                                            ref={btnRightRef}
                                        />
                                        {infoForm && Object.keys(infoForm).map((pais) => (
                                                <TabContent
                                                    value={pais}
                                                    className="mb-[20px]"
                                                    key={pais}>
                                                    <FormContainer>
                                                        {infoForm[pais].map((canal)=> (
                                                                <section key={canal.canalName} className="contenedor">
                                                                    <div className="titleChannel">
                                                                        <p className='canal'>
                                                                          {canal.canalName}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <div >
                                                                            <div className="titleRowEmpty"></div>
                                                                            <div className="titleRowEmpty2"></div>
                                                                            {canal.productos.map((producto) => {
                                                                                        return (
                                                                                            <div
                                                                                                className="flex items-center gap-x-3 gap-y-3  mb-6 "
                                                                                                key={producto.id}>
                                                                                                <Avatar className="mb-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                                                                                                {producto.id}
                                                                                                </Avatar>
                                                                                                <FormItem className=" mb-1">
                                                                                                    <Input
                                                                                                        disabled={true}
                                                                                                        type="text"
                                                                                                        value={producto.name}
                                                                                                    />
                                                                                                </FormItem>
                                                                                                <FormItem className=" mb-0">
                                                                                                    <Tooltip
                                                                                                        placement="top-end"
                                                                                                        title="Precio Inicial"
                                                                                                    >
                                                                                                        <Input
                                                                                                            placeholder="Precio inicial"
                                                                                                            type="number"
                                                                                                            name="precioInicial"
                                                                                                            prefix="$"
                                                                                                            value={producto.precioInicial}
                                                                                                            onChange={(e) =>
                                                                                                              handleOnChangeInitialValue(
                                                                                                                pais,
                                                                                                                canal.canalName,
                                                                                                                producto.id,
                                                                                                                e.target.value
                                                                                                              )
                                                                                                            }
                                                                                                        />
                                                                                                    </Tooltip>
                                                                                                </FormItem>
                                                                                                <FormItem className=" mb-0">
                                                                                                    <Tooltip
                                                                                                        placement="top-end"
                                                                                                        title="Fecha Inicial"
                                                                                                    >
                                                                                                        {/* <DatePicker
                                                                                                            inputFormat="DD, MMM, YYYY"
                                                                                                            placeholder="Fecha Inicial"
                                                                                                        /> */}
                                                                                                         <Input
                                                                                                            type="number"
                                                                                                            name="inicioMes"
                                                                                                            placeholder="Mes inicial"
                                                                                                            value={producto.inicioMes}
                                                                                                            onChange={(e) =>
                                                                                                              handleOnChangeStartMonth(
                                                                                                                pais,
                                                                                                                canal.canalName,
                                                                                                                producto.id,
                                                                                                                e.target.value
                                                                                                              )
                                                                                                            }
                                                                                                        />
                                                                                                    </Tooltip>
                                                                                                </FormItem>
                                                                                                <FormItem className="mb-0">
                                                                                                    <Tooltip
                                                                                                        placement="left"
                                                                                                        title="Crecimiento Mensual"
                                                                                                    >
                                                                                                        <Input
                                                                                                            placeholder="Crecimiento Mensual"
                                                                                                            type="number"
                                                                                                            name="tasa"
                                                                                                            suffix="%"
                                                                                                            value={producto.tasa}
                                                                                                            onChange={(e) =>
                                                                                                                handleOnChangeTasa(
                                                                                                                    pais,
                                                                                                                    canal.canalName,
                                                                                                                    producto.id,
                                                                                                                    e.target.value
                                                                                                                )
                                                                                                            }
                                                                                                        />
                                                                                                    </Tooltip>
                                                                                                </FormItem>

                                                                                                {console.log(producto.años)}
                                                                                                { producto.años.map((año, indexYear) => (
                                                                                                        <div
                                                                                                            className="flex flex-col"
                                                                                                            key={año.año}
                                                                                                        >
                                                                                                            <div className="titleRow min-w-[62px]">
                                                                                                                <p>
                                                                                                                    {' '}
                                                                                                                    Año{' '}
                                                                                                                    {año.año}
                                                                                                                </p>
                                                                                                                <div className='iconYear' onClick={() => hideYear(indexYear)}>
                                                                                                                    {visibleItems.includes(indexYear) ? <FiMinus/> : <FiPlus/>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className='titleMonths gap-x-3 gap-y-3 mb-[18px] '>
                                                                                                                {visibleItems.includes(indexYear) &&
                                                                                                                    <div className='titleMonths gap-x-3'>
                                                                                                                        <p className='month w-[90px]'>Enero</p>
                                                                                                                        <p className='month w-[90px]'>Febrero</p>
                                                                                                                        <p className='month w-[90px]'>Marzo</p>
                                                                                                                        <p className='month w-[90px]'>Abril</p>
                                                                                                                        <p className='month w-[90px]'>Mayo</p>
                                                                                                                        <p className='month w-[90px]'>Junio</p>
                                                                                                                        <p className='month w-[90px]'>Julio</p>
                                                                                                                        <p className='month w-[90px]'>Agosto</p>
                                                                                                                        <p className='month w-[90px]'>Septiembre</p>
                                                                                                                        <p className='month w-[90px]'>Octubre</p>
                                                                                                                        <p className='month w-[90px]'>Noviembre</p>
                                                                                                                        <p className='month w-[90px]'>Diciembre</p>
                                                                                                                    </div>
                                                                                                                }
                                                                                                                

                                                                                                            </div>
                                                                                                            <div className="flex">
                                                                                                                <FormItem className="mb-0" >
                                                                                                                    <Input
                                                                                                                        className="w-[90px]"
                                                                                                                        type="number"
                                                                                                                        prefix="$"
                                                                                                                        value={año.volMeses.enero}
                                                                                                                        name="month"
                                                                                                                    />
                                                                                                                </FormItem>
                                                                                                                <FormItem className="mb-0" >
                                                                                                                    <Input
                                                                                                                        className="w-[90px]"
                                                                                                                        type="number"
                                                                                                                        prefix="$"
                                                                                                                        value={año.volMeses.febrero}
                                                                                                                        name="month"
                                                                                                                    />
                                                                                                                </FormItem>
                                                                                                                <FormItem className="mb-0" >
                                                                                                                    <Input
                                                                                                                        className="w-[90px]"
                                                                                                                        type="number"
                                                                                                                        prefix="$"
                                                                                                                        value={año.volMeses.marzo}
                                                                                                                        name="month"
                                                                                                                    />
                                                                                                                </FormItem>
                                                                                                            </div>
                                                                                                    </div>
                                                                                                )
                                                                                                )}
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                )}
                                                                        </div>
                                                                      
                                                                    </div>
                                                                </section>
                                                            )
                                                        )}
                                                    </FormContainer>
                                                </TabContent>
                                            ))}
                                                <Button
                                                    className="border mt-6b btnSubmitTable mt-[40px]"
                                                    variant="solid"
                                                    type="submit"
                                                >
                                                    Cargar datos
                                                </Button>
                                    </div>
                                </FormContainer>
                            </div>
                       
                    </Tabs>
                )}
            </div>
        </div>
    )
}

export default PrecioP
