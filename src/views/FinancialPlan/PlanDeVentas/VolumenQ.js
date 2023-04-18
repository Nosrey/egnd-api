import React, { useEffect, useState, useRef } from 'react'
import { getUser } from 'services/Requests'
import { Tabs, Input, Tooltip, DatePicker ,
    Button,
    FormItem,
    FormContainer,
    Avatar,
} from 'components/ui'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { AÑOS, MONTHS, MESES } from 'constants/forms.constants'

const { TabNav, TabList, TabContent } = Tabs

function VolumenQ() {
  const [info, setInfo] = useState(null)
  const [defaultCountry, setDefaultCountry] = useState('')
  const [infoForm, setInfoForm] = useState()
  useEffect(() => {
    // console.log(info)
    let estructura = {}
    if (info && info[0]) {
      for (let i = 0; i < info[0]?.paises.length; i++) {
        let productos = []
        const realProds = info[0]?.productos.filter(
          (prod) => prod.type !== 'servicio'
        )
        for (let x = 0; x < realProds.length; x++) {
          let prod = {}
          prod['id'] = realProds[x].id
          prod['volInicial'] = 0
          prod['tasa'] = 0
          prod['fecha'] = ''
          prod['años'] = [...AÑOS]
          productos.push(prod)
        }
        let canales = []
        for (let x = 0; x < info[0]?.canales.length; x++) {
          let canal = {}
          canal['canalName'] = info[0]?.canales[x].name
          canal['productos'] = [...productos]
          canales.push(canal)
        }
        estructura[info[0]?.paises[i].value] = [...canales]
      }
      setInfoForm(() => ({...estructura}))
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

  const [visibleItems, setVisibleItems] = useState([])

  const hideYear = (index) => {
    setVisibleItems((prevItems) => {
            if (prevItems.includes(index)) {
              // Si el elemento ya está en la lista, lo eliminamos para ocultarlo
              return prevItems.filter((id) => id !== index);
            } 
              // Si el elemento no está en la lista, lo agregamos para mostrarlo
              return [...prevItems, index];
            
          });
  }

  // calculo de campos

  const calculateMonthValue = (index, valorInicial, percentage) => {
    const value = valorInicial * Math.pow(1 + percentage / 100, index)
    return Math.round(value)
  }

  const sumYear = (months) => {
    let sum = 0
    for (const key in months) {
      sum += months[key]
    }
    return sum
  }

  const handleEditInput = (
    e,
    indexYear,
    indexProd,
    country,
    indexChannel,
    month
  ) => {
    let copyInfoForm = { ...infoForm }
    if (e.target.name === 'inicial' && indexYear == null) {
      // actualizo esta info
      copyInfoForm[country][indexChannel].productos[indexProd].volInicial =
        e.target.value

      // actualizo todos los campos de volumen de este producto en base a este cambio por los 10 años
      let initValue = parseInt(e.target.value)
      let initPercentaje =
        copyInfoForm[country][indexChannel].productos[indexProd].tasa
      for (let i = 0; i < 10; i++) {
        const mesesActualizados = {
          enero: calculateMonthValue(0, initValue, initPercentaje),
          febrero: calculateMonthValue(1, initValue, initPercentaje),
          marzo: calculateMonthValue(2, initValue, initPercentaje),
          abril: calculateMonthValue(3, initValue, initPercentaje),
          mayo: calculateMonthValue(4, initValue, initPercentaje),
          junio: calculateMonthValue(5, initValue, initPercentaje),
          julio: calculateMonthValue(6, initValue, initPercentaje),
          agosto: calculateMonthValue(7, initValue, initPercentaje),
          septiembre: calculateMonthValue(8, initValue, initPercentaje),
          octubre: calculateMonthValue(9, initValue, initPercentaje),
          noviembre: calculateMonthValue(10, initValue, initPercentaje),
          diciembre: calculateMonthValue(11, initValue, initPercentaje),
        }
        copyInfoForm[country][indexChannel].productos[indexProd].años[
          i
        ].volMeses = { ...mesesActualizados }
        copyInfoForm[country][indexChannel].productos[indexProd].años[
          i
        ].volTotal = sumYear(mesesActualizados)
        initValue = calculateMonthValue(12, initValue, initPercentaje)
      }
    }
    if (e.target.name === 'tasa' && indexYear == null) {
      // actualizo esta info
      copyInfoForm[country][indexChannel].productos[indexProd].tasa =
        e.target.value

      // actualizo todos los campos de volumen de este producto en base a este cambio por los 10 años
      let initValue =
        copyInfoForm[country][indexChannel].productos[indexProd].volInicial
      let initPercentaje = parseInt(e.target.value)
      for (let i = 0; i < 10; i++) {
        const mesesActualizados = {
          enero: calculateMonthValue(0, initValue, initPercentaje),
          febrero: calculateMonthValue(1, initValue, initPercentaje),
          marzo: calculateMonthValue(2, initValue, initPercentaje),
          abril: calculateMonthValue(3, initValue, initPercentaje),
          mayo: calculateMonthValue(4, initValue, initPercentaje),
          junio: calculateMonthValue(5, initValue, initPercentaje),
          julio: calculateMonthValue(6, initValue, initPercentaje),
          agosto: calculateMonthValue(7, initValue, initPercentaje),
          septiembre: calculateMonthValue(8, initValue, initPercentaje),
          octubre: calculateMonthValue(9, initValue, initPercentaje),
          noviembre: calculateMonthValue(10, initValue, initPercentaje),
          diciembre: calculateMonthValue(11, initValue, initPercentaje),
        }
        copyInfoForm[country][indexChannel].productos[indexProd].años[
          i
        ].volMeses = { ...mesesActualizados }
        copyInfoForm[country][indexChannel].productos[indexProd].años[
          i
        ].volTotal = sumYear(mesesActualizados)

        initValue = calculateMonthValue(12, initValue, initPercentaje)
      }
    }
    if (e.target.name === 'month') {
      copyInfoForm[country][indexChannel].productos[indexProd].años[
        indexYear
      ].volMeses[month] = parseInt(e.target.value)
      const mesesActualizados =
        copyInfoForm[country][indexChannel].productos[indexProd].años[indexYear]
          .volMeses
      copyInfoForm[country][indexChannel].productos[indexProd].años[
        indexYear
      ].volTotal = sumYear(mesesActualizados)
    }
    setInfoForm(() => ({...copyInfoForm}))
  }

  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Volumen (Q)</h4>
        <span>Plan de ventas</span>
      </div>

      <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
        <div className="border-b-2 px-4 py-1">
          <h6>Carga de productos / servicios</h6>
        </div>
        {info && (
          <Tabs defaultValue={defaultCountry}>
            <TabList>
              {info &&
                info[0]?.paises.map((tab, index) => (
                  <TabNav key={index} value={tab.value}>
                    <div>{tab.label}</div>
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
                  {info &&
                    info[0]?.paises.map((tab) => (
                      <TabContent
                        value={tab.value}
                        className="mb-[20px]"
                        key={tab.value}
                      >
                        <FormContainer>
                          {info[0]?.canales.map((channel, indexChannel) => (
                            <section key={indexChannel} className="contenedor">
                              <div className="titleChannel">
                                <p className="canal">{channel.name}</p>
                              </div>
                              <div className="flex">
                                <div className="rowLeft">
                                  <div className="titleRowEmpty" />
                                  <div className="titleRowEmpty2" />
                                  {info[0] &&
                                    info[0]?.productos.length > 0 &&
                                    info[0]?.productos
                                      .filter(
                                        (prod) => prod.type !== 'servicio'
                                      )
                                      .map((prod, index) => (
                                                                                            <div
                                                                                                className="grid grid-cols-12 items-center gap-x-3 gap-y-3  mb-6 auto-cols-max"
                                                                                                key={index}>
                                                                                                <Avatar className="col-start-1 col-end-2  row-start-1 mb-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                                                                                                    {prod.id}
                                                                                                </Avatar>
                                                                                                <FormItem className="col-start-2 col-end-7 row-start-1 mb-1">
                                                                                                    <Input
                                                                                                        disabled={true}
                                                                                                        type="text"
                                                                                                        value={prod.name}
                                                                                                    />
                                                                                                </FormItem>
                                                                                                <FormItem className="col-start-7 col-end-10 row-start-1 mb-0">
                                                                                                    <Tooltip
                                                                                                        placement="top-end"
                                                                                                        title="Volumen Inicial"
                                                                                                    >
                                                                                                        <Input
                                                                                                            placeholder="Inicial"
                                                                                                            type="number"
                                                                                                            name="inicial"
                                                                                                            value={(infoForm &&  Object.keys(infoForm).length !== 0) ? infoForm[tab.value][indexChannel].productos[index].volInicial : 0}
                                                                                                            onChange={(e) => handleEditInput(e, null, index, tab.value,indexChannel )}
                                                                                                        />
                                                                                                    </Tooltip>
                                                                                                </FormItem>
                                                                                                <FormItem className="col-start-10 col-end-13 row-start-1 mb-0">
                                                                                                    <Tooltip
                                                                                                        placement="top-end"
                                                                                                        title="Fecha Inicial"
                                                                                                    >
                                                                                                        <DatePicker
                                                                                                            inputFormat="DD, MMM, YYYY"
                                                                                                            placeholder="Fecha Inicial"
                                                                                                        />
                                                                                                    </Tooltip>
                                                                                                </FormItem>
                                                                                                <FormItem className="col-start-7 col-end-10 row-start-2 mb-0">
                                                                                                    <Tooltip
                                                                                                        placement="left"
                                                                                                        title="Crecimiento Mensual"
                                                                                                    >
                                                                                                        <Input
                                                                                                            placeholder="Crecimiento Mensual"
                                                                                                            type="number"
                                                                                                            name="tasa"
                                                                                                            suffix="%"
                                                                                                            value={(infoForm &&  Object.keys(infoForm).length !== 0) ? infoForm[tab.value][indexChannel].productos[index].tasa : 0}
                                                                                                            onChange={(e) => handleEditInput(e, null, index, tab.value,indexChannel )}
                                                                                                        />
                                                                                                    </Tooltip>
                                                                                                </FormItem>
                                                                                            </div>
                                                                                        )
                                                                                )}
                                                  }
                                                />
                                              </Tooltip>
                                            </FormItem>
                                          </div>
                                        )
                                      })}
                                </div>
                                {AÑOS.map((year, indexYear) => (
                                  <div className="rowRight" key={indexYear}>
                                    <div className="titleRow">
                                      <p> Año {year.año}</p>
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
                                    <div className="titleMonths gap-x-3 gap-y-3 mb-[18px] ">
                                      {visibleItems.includes(indexYear) && (
                                        <div className="titleMonths gap-x-3">
                                          <p className="month w-[90px]">
                                            Enero
                                          </p>
                                          <p className="month w-[90px]">
                                            Febrero
                                          </p>
                                          <p className="month w-[90px]">
                                            Marzo
                                          </p>
                                          <p className="month w-[90px]">
                                            Abril
                                          </p>
                                          <p className="month w-[90px]">Mayo</p>
                                          <p className="month w-[90px]">
                                            Junio
                                          </p>
                                          <p className="month w-[90px]">
                                            Julio
                                          </p>
                                          <p className="month w-[90px]">
                                            Agosto
                                          </p>
                                          <p className="month w-[90px]">
                                            Septiembre
                                          </p>
                                          <p className="month w-[90px]">
                                            Octubre
                                          </p>
                                          <p className="month w-[90px]">
                                            Noviembre
                                          </p>
                                          <p className="month w-[90px]">
                                            Diciembre
                                          </p>
                                        </div>
                                      )}

                                      <p className="month w-[90px]">Total</p>
                                    </div>
                                    {info[0] &&
                                      info[0]?.productos.length > 0 &&
                                      info[0]?.productos
                                        .filter(
                                          (prod) => prod.type !== 'servicio'
                                        )
                                        .map((prod, indexProd) => {
                                          return (
                                            <div
                                              className="flex gap-x-3 gap-y-3 auto-cols-max rowInputsProd"
                                              key={indexProd}
                                            >
                                              {visibleItems.includes(
                                                indexYear
                                              ) && (
                                                <div className="flex gap-x-3 gap-y-3 auto-cols-max">
                                                  {info[0] &&
                                                    MONTHS.map(
                                                      (month, indexMonth) => (
                                                                                        <div
                                                                                        className="flex gap-x-3 gap-y-3 auto-cols-max rowInputsProd"
                                                                                            key={indexProd}
                                                                                        >

                                                                                        {visibleItems.includes(indexYear) && <div className="flex gap-x-3 gap-y-3 auto-cols-max">
                                                                                                {info[0] && MONTHS.map((month, indexMonth) => {
                                                                                                    return (
                                                                                                        <FormItem
                                                                                                            key={indexMonth}
                                                                                                            className="mb-0"
                                                                                                        >
                                                                                                            <Input
                                                                                                                className="w-[90px]"
                                                                                                                type="number"
                                                                                                                value={(infoForm &&  Object.keys(infoForm).length !== 0) ? infoForm[tab.value][indexChannel].productos[indexProd].años[indexYear].volMeses[month] : 0}
                                                                                                                onChange={(e) => handleEditInput(e, indexYear,indexProd, tab.value, indexChannel, month)}
                                                                                                                name="month"
                                                                                                            />
                                                                                                        </FormItem>
                                                                                                    )
                                                                                                }
                                                                                                )}
                                                                                            </div>}

                                                                                            
                                                                                            <FormItem
                                                                                                className="mb-0"
                                                                                            >
                                                                                                <Input
                                                                                                    className="w-[90px]"
                                                                                                    type="number"
                                                                                                    disabled={true}
                                                                                                    name="total"
                                                                                                    value={(infoForm &&  Object.keys(infoForm).length !== 0) ? infoForm[tab.value][indexChannel].productos[indexProd].años[indexYear].volTotal : 0}
                                                                                                />
                                                                                            </FormItem>
                                                                                        </div>
                                                                                    )
                                                />
                                              </FormItem>
                                            </div>
                                          )
                                        })}
                                  </div>
                                ))}
                              </div>
                            </section>
                          ))}

                          {/*  CONTENEDOR TOTALES */}

                          <div className="bg-indigo-50 px-[25px] py-[30px] w-fit rounded ">
                            <div className="flex items-center">
                              <p className=" text-[#707470] font-bold mb-3 text-left w-[40%] min-w-[505px] ">
                                Volumen total por producto
                              </p>
                              {/* <div  className='flex '>
                                                                {AÑOS.map(
                                                                (
                                                                    year,
                                                                    indexYear
                                                                ) => (
                                                                    <div
                                                                        className=" pl-[0] w-fit"
                                                                        key={
                                                                            indexYear
                                                                        }
                                                                    >
                                                                        <div className='titleMonths ml-[18px] gap-y-3 mb-[18px] '>
                                                                            {visibleItems.includes(indexYear) &&
                                                                                <div className='titleMonths gap-x-3'>
                                                                                    <p className='month w-[90px] '>Enero</p>
                                                                                    <p className='month w-[90px] '>Febrero</p>
                                                                                    <p className='month w-[90px] '>Marzo</p>
                                                                                    <p className='month w-[90px] '>Abril</p>
                                                                                    <p className='month w-[90px] '>Mayo</p>
                                                                                    <p className='month w-[90px] '>Junio</p>
                                                                                    <p className='month w-[90px] '>Julio</p>
                                                                                    <p className='month w-[90px] '>Agosto</p>
                                                                                    <p className='month w-[90px] '>Septiembre</p>
                                                                                    <p className='month w-[90px] '>Octubre</p>
                                                                                    <p className='month w-[90px] '>Noviembre</p>
                                                                                    <p className='month w-[90px] '>Diciembre</p>
                                                                                </div>
                                                                            }
                                                                            
                                                                            <p  key={ indexYear } className='month w-[90px]'>Total</p>

                                                                        </div>
                                                                </div>
                                                            )
                                                                )}
                                                            </div> */}
                            </div>

                            <div className="w-fit pt-3 border border-neutral-600 border-x-0 border-b-0">
                              {info[0] &&
                                info[0]?.productos.length > 0 &&
                                info[0]?.productos
                                  .filter((prod) => prod.type !== 'servicio')
                                  .map((prod, index) => (
                                                                        <div key={index} className='flex gap-x-3 w-fit pt-3 '>
                                                                            <p className='w-[40%] min-w-[465px] pl-[45px] capitalize'>{prod.name}</p>
                                                                            {AÑOS.map(
                                                                            (
                                                                                year,
                                                                                indexYear
                                                                            ) => (
                                                                                <div
                                                                                    className=" pl-[0] w-fit"
                                                                                    key={
                                                                                        indexYear
                                                                                    }
                                                                                >
                                                                                <div
                                                                                    className="flex  gap-y-3 auto-cols-max"
                                                                                    >

                                                                                    {visibleItems.includes(indexYear) && <div className="flex gap-x-3 gap-y-3 auto-cols-max">
                                                                                            {info[0] && MONTHS.map((month, indexMonth) => {
                                                                                                return (
                                                                                                    <p className=' w-[90px] text-center'>453</p>
                                                                                                )
                                                                                            }
                                                                                            )}
                                                                                        </div>}

                                                                                        <p className=' w-[90px] text-center ml-[9px]'>1000</p>
                                                                                    </div>
                                                                            </div>
                                                                        )
                                                                        )}
                                                                        </div>
                                                                    )
                                                            )}
                            </div>
                          </div>
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

export default VolumenQ
