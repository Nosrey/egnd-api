import React, { useEffect, useState, useRef } from 'react'
import { getUser } from 'services/Requests'
import { Field, Form, Formik } from 'formik'
import { Tabs, Input, Tooltip, DatePicker } from 'components/ui'
import {
    Button,
    FormItem,
    FormContainer,
    Avatar,
} from 'components/ui'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { FiMinus, FiPlus } from 'react-icons/fi'
const { TabNav, TabList, TabContent } = Tabs
const meses = {
    enero: null, febrero: null, marzo: null, abril: null, mayo: null, junio: null, julio: null, agosto: null, septiembre: null, octubre: null, noviembre: null, diciembre: null,
}
const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]


const años = [
    {
        año: 1,
        name: 'anio1',
        volMeses: meses,
        volTotal: null,
    },
    {
        año: 2,
        name: 'anio2',
        volMeses: meses,
        volTotal: null,
    },
]

function VolumenQ() {
    const [info, setInfo] = useState(null)
    const [defaultCountry, setDefaultCountry] = useState('')
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
        console.log("funciona");
        // console.log(`.input${index + 1}`);
        // const key = `.input${index + 1}`;
        // const inputs = document.querySelectorAll(key);
        // console.log(inputs);
        // for (let i = 0; i < inputs.length; i++) {
        //     inputs[i].style.display = "none"
            
        // }
    }

    // calculo de campos
    const [valorInicial, setValorInicial] = useState(1000);
    const [percentage, setPercentage] = useState(10);

    const calculateMonthValue = (index) => {
        const value = valorInicial * Math.pow(1 + percentage / 100, index);
        return value.toFixed(2); // hacer numero redondo hacia abajo
    };

    // console.log(calculateMonthValue(3))

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
                        <Formik
                            initialValues={{
                                argentina: {
                                    B2B: {
                                        celular: {
                                            volInicial: null,
                                            fechaInicial: null,
                                            tasaCrecimiento: null,
                                            anio1: meses,
                                        },
                                    },
                                },
                            }}
                            onSubmit={(values, { resetForm, setSubmitting }) => {
                                console.log('values', values)
                            }}>
                            {({ values, touched, errors, resetForm }) => (
                                <Form className="container-countries">
                                    <FormContainer className="cont-countries">
                                        <div
                                            className="wrapper p-4 overflow-x-auto scroll-smooth"
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
                                                        key={tab.value}>
                                                        <FormContainer>
                                                            {info[0]?.canales.map(
                                                                (channel, index) => (
                                                                    <section key={index} className="contenedor">
                                                                        <div className="titleChannel">
                                                                            <p className='canal'>
                                                                                {channel.name}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex">
                                                                            <div className="rowLeft">
                                                                                <div className="titleRowEmpty"></div>
                                                                                <div className="titleRowEmpty2"></div>
                                                                                {info[0] &&
                                                                                    info[0]
                                                                                        ?.productos
                                                                                        .length >
                                                                                        0 &&
                                                                                    info[0]?.productos.filter((prod)=> prod.type !== "servicio").map(
                                                                                        (
                                                                                            prod,
                                                                                            index
                                                                                        ) => {
                                                                                            return (
                                                                                                <div
                                                                                                    className="grid grid-cols-12 items-center gap-x-3 gap-y-3  mb-6 auto-cols-max"
                                                                                                    key={index}>
                                                                                                    <Avatar className="col-start-1 col-end-2  row-start-1 mb-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                                                                                                        {prod.id}
                                                                                                    </Avatar>
                                                                                                    <FormItem className="col-start-2 col-end-7 row-start-1 mb-1">
                                                                                                        <Input
                                                                                                            placeholder="Producto"
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
                                                                                                            <Field
                                                                                                                placeholder="Inicial"
                                                                                                                name={`${tab.value
                                                                                                                    }[${channel.name
                                                                                                                    }][${prod.name.trim()}].volInicial`}
                                                                                                                type="number"
                                                                                                                component={Input}
                                                                                                            />
                                                                                                        </Tooltip>
                                                                                                    </FormItem>
                                                                                                    <FormItem className="col-start-10 col-end-13 row-start-1 mb-0">
                                                                                                        <Tooltip
                                                                                                            placement="top-end"
                                                                                                            title="Fecha Inicial"
                                                                                                        >
                                                                                                            <Field
                                                                                                                name={`${tab.value
                                                                                                                    }[${channel.name
                                                                                                                    }][${prod.name.trim()}].fechaInicial`}
                                                                                                                inputFormat="DD, MMM, YYYY"
                                                                                                                placeholder="Fecha Inicial"
                                                                                                                component={DatePicker}
                                                                                                            />
                                                                                                        </Tooltip>
                                                                                                    </FormItem>
                                                                                                    <FormItem className="col-start-7 col-end-10 row-start-2 mb-0">
                                                                                                        <Tooltip
                                                                                                            placement="left"
                                                                                                            title="Crecimiento Mensual"
                                                                                                        >
                                                                                                            <Field
                                                                                                                placeholder="Crecimiento Mensual"
                                                                                                                type="number"
                                                                                                                suffix="%"
                                                                                                                name={`${tab.value
                                                                                                                    }[${channel.name
                                                                                                                    }][${prod.name.trim()}].tasaCrecimiento`}
                                                                                                                component={Input}
                                                                                                            />
                                                                                                        </Tooltip>
                                                                                                    </FormItem>
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    )}
                                                                            </div>
                                                                            {años.map(
                                                                                (
                                                                                    year,
                                                                                    indexYear
                                                                                ) => (
                                                                                    <div
                                                                                        className="rowRight"
                                                                                        key={
                                                                                            indexYear
                                                                                        }
                                                                                    >
                                                                                        <div className="titleRow">
                                                                                            <p>
                                                                                                {' '}
                                                                                                Año{' '}
                                                                                                {
                                                                                                    year.año
                                                                                                }
                                                                                            </p>
                                                                                            <div className='iconYear' onClick={() => hideYear(indexYear)}>
                                                                                                {visibleItems.includes(indexYear) ? <FiMinus/> : <FiPlus/>}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='titleMonths gap-x-3 gap-y-3 mb-3 '>
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
                                                                                            
                                                                                            <p className='month w-[90px]'>Total</p>

                                                                                        </div>
                                                                                    {info[0] && info[0]?.productos.length > 0 && info[0]?.productos.map((prod, index) => {
                                                                                        return (
                                                                                            <div
                                                                                            className="flex gap-x-3 gap-y-3 auto-cols-max rowInputsProd"
                                                                                                key={index}
                                                                                            >

                                                                                            {visibleItems.includes(indexYear) && <div className="flex gap-x-3 gap-y-3 auto-cols-max rowInputsProd">
                                                                                                    {info[0] && months.map((month, index) => {
                                                                                                        return (
                                                                                                            <FormItem
                                                                                                                key={index}
                                                                                                                className="mb-0"
                                                                                                            >
                                                                                                                <Field
                                                                                                                    className="w-[90px]"
                                                                                                                    name={`${tab.value
                                                                                                                        }[${channel.name
                                                                                                                        }][${prod.name.trim()}][${year.name
                                                                                                                        }].${month}`}
                                                                                                                    type="number"
                                                                                                                    component={Input}
                                                                                                                    value={calculateMonthValue(index)}
                                                                                                                />
                                                                                                            </FormItem>
                                                                                                        )
                                                                                                    }
                                                                                                    )}
                                                                                                </div>}

                                                                                                
                                                                                                <FormItem
                                                                                                    key={index}
                                                                                                    className="mb-0"
                                                                                                >
                                                                                                    <Field
                                                                                                        className="w-[90px]"
                                                                                                        name={`${tab.value
                                                                                                            }[${channel.name
                                                                                                            }][${prod.name.trim()}][${year.name
                                                                                                            }].total`}
                                                                                                        type="number"
                                                                                                        component={Input}
                                                                                                    />
                                                                                                </FormItem>
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                            )}
                                                                        </div>
                                                                    </section>
                                                                )
                                                            )}

                                                            <div className="flex justify-end">
                                                                <Button
                                                                    className="flex justify-end mt-6"
                                                                    variant="solid"
                                                                    type="submit"
                                                                >
                                                                    Cargar datos
                                                                </Button>
                                                            </div>
                                                        </FormContainer>
                                                    </TabContent>
                                                ))}
                                        </div>
                                    </FormContainer>
                                </Form>
                            )}
                        </Formik>
                    </Tabs>
                )}
            </div>
        </div>
    )
}

export default VolumenQ
