import React, { useEffect, useState, useRef } from 'react'
import { getUser } from 'services/Requests'
import { Field, Form, Formik } from 'formik'
import { Tabs, Input, Tooltip, DatePicker } from 'components/ui'
import {
    Alert,
    Button,
    FormItem,
    FormContainer,
    Select,
    Avatar,
} from 'components/ui'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

const { TabNav, TabList, TabContent } = Tabs
const meses = {
    enero: null,
    febrero: null,
    marzo: null,
    abril: null,
    mayo: null,
    junio: null,
    julio: null,
    agosto: null,
    septiembre: null,
    octubre: null,
    noviembre: null,
    diciembre: null,
}
const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
]
// const años = [
//     {
//         año: 1,
//         volMeses: meses,
//         volTotal: null,
//     },
//     {
//         año: 2,
//         volMeses: meses,
//         volTotal: null,
//     },
//     {
//         año: 3,
//         volMeses: meses,
//         volTotal: null,
//     },
//     {
//         año: 4,
//         volMeses: meses,
//         volTotal: null,
//     },
//     {
//         año: 5,
//         volMeses: meses,
//         volTotal: null,
//     },
//     {
//         año: 6,
//         volMeses: meses,
//         volTotal: null,
//     },
//     {
//         año: 7,
//         volMeses: meses,
//         volTotal: null,
//     },
//     {
//         año: 8,
//         volMeses: meses,
//         volTotal: null,
//     },
//     {
//         año: 9,
//         volMeses: meses,
//         volTotal: null,
//     },
//     {
//         año: 10,
//         volMeses: meses,
//         volTotal: null,
//     },
// ]
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

    // console.log(info)

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

    return (
        <div>
            <div className="border-b-2 mb-8 pb-1">
                <h4>Volumen (Q)</h4>
                <span>Plan de ventas</span>
            </div>

            {/* este */}
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
                                        1: {
                                            volInicial: 888,
                                            fechaInicial: null,
                                            tasaCrecimiento: null,
                                            anio1: meses,
                                        },
                                    },
                                },
                            }}
                            onSubmit={(
                                values,
                                { resetForm, setSubmitting }
                            ) => {
                                console.log('values', values)
                            }}
                        >
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
                                                className="text-8xl absolute left-0 cursor-pointer"
                                                ref={btnLeftRef}
                                            />
                                            <MdKeyboardArrowRight
                                                onClick={handleRightClick}
                                                className="text-8xl absolute right-0 cursor-pointer"
                                                ref={btnRightRef}
                                            />
                                            {info &&
                                                info[0]?.paises.map((tab) => (
                                                    <TabContent
                                                        value={tab.value}
                                                        key={tab.value}
                                                    >
                                                        <FormContainer>
                                                            {info[0]?.canales.map(
                                                                (
                                                                    channel,
                                                                    index
                                                                ) => (
                                                                    <section
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <div className="titleChannel">
                                                                            <p>
                                                                                {
                                                                                    channel.name
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex">
                                                                            <div className="rowLeft">
                                                                                <div className="titleRowEmpty"></div>
                                                                                {info[0] &&
                                                                                    info[0]
                                                                                        ?.productos
                                                                                        .length >
                                                                                        0 &&
                                                                                    info[0]?.productos.map(
                                                                                        (
                                                                                            prod,
                                                                                            index
                                                                                        ) => {
                                                                                            return (
                                                                                                <div
                                                                                                    className="grid grid-cols-12 items-center gap-x-3 gap-y-3  mb-6 auto-cols-max"
                                                                                                    key={
                                                                                                        index
                                                                                                    }
                                                                                                >
                                                                                                    <Avatar className="col-start-1 col-end-2  row-start-1 mb-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                                                                                                        {
                                                                                                            prod.id
                                                                                                        }
                                                                                                    </Avatar>
                                                                                                    <FormItem className="col-start-2 col-end-7 row-start-1 mb-1">
                                                                                                        <Input
                                                                                                            placeholder="Producto"
                                                                                                            disabled={
                                                                                                                true
                                                                                                            }
                                                                                                            type="text"
                                                                                                            value={
                                                                                                                prod.name
                                                                                                            }
                                                                                                        />
                                                                                                    </FormItem>
                                                                                                    <FormItem className="col-start-7 col-end-10 row-start-1 mb-0">
                                                                                                        <Tooltip
                                                                                                            placement="top-end"
                                                                                                            title="Volumen Inicial"
                                                                                                        >
                                                                                                            <Field
                                                                                                                placeholder="Inicial"
                                                                                                                name={`${
                                                                                                                    tab.value
                                                                                                                }[${
                                                                                                                    channel.name
                                                                                                                }][${prod.name.trim()}].volInicial`}
                                                                                                                type="number"
                                                                                                                component={
                                                                                                                    Input
                                                                                                                }
                                                                                                            />
                                                                                                        </Tooltip>
                                                                                                    </FormItem>
                                                                                                    <FormItem className="col-start-10 col-end-13 row-start-1 mb-0">
                                                                                                        <Tooltip
                                                                                                            placement="top-end"
                                                                                                            title="Fecha Inicial"
                                                                                                        >
                                                                                                            <Field
                                                                                                                name={`${
                                                                                                                    tab.value
                                                                                                                }[${
                                                                                                                    channel.name
                                                                                                                }][${prod.name.trim()}].fechaInicial`}
                                                                                                                inputFormat="DD, MMM, YYYY"
                                                                                                                placeholder="Fecha Inicial"
                                                                                                                component={
                                                                                                                    DatePicker
                                                                                                                }
                                                                                                            />
                                                                                                            {/* <DatePicker inputFormat="DD, MMM, YYYY" placeholder="Fecha Inicial" /> */}
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
                                                                                                                name={`${
                                                                                                                    tab.value
                                                                                                                }[${
                                                                                                                    channel.name
                                                                                                                }][${prod.name.trim()}].tasaCrecimiento`}
                                                                                                                component={
                                                                                                                    Input
                                                                                                                }
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
                                                                                    index
                                                                                ) => (
                                                                                    <div
                                                                                        className="rowRight"
                                                                                        key={
                                                                                            index
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
                                                                                        </div>
                                                                                        {info[0] &&
                                                                                            info[0]
                                                                                                ?.productos
                                                                                                .length >
                                                                                                0 &&
                                                                                            info[0]?.productos.map(
                                                                                                (
                                                                                                    prod,
                                                                                                    index
                                                                                                ) => {
                                                                                                    return (
                                                                                                        <div
                                                                                                            className="flex gap-x-3 gap-y-3  mb-6 auto-cols-max"
                                                                                                            key={
                                                                                                                index
                                                                                                            }
                                                                                                        >
                                                                                                            {info[0] &&
                                                                                                                months.map(
                                                                                                                    (
                                                                                                                        month,
                                                                                                                        index
                                                                                                                    ) => {
                                                                                                                        return (
                                                                                                                            <FormItem
                                                                                                                                key={
                                                                                                                                    index
                                                                                                                                }
                                                                                                                                className=" mb-0"
                                                                                                                            >
                                                                                                                                <Field
                                                                                                                                    placeholder="Mes"
                                                                                                                                    name={`${
                                                                                                                                        tab.value
                                                                                                                                    }[${
                                                                                                                                        channel.name
                                                                                                                                    }][${prod.name.trim()}][${
                                                                                                                                        year.name
                                                                                                                                    }].${month}`}
                                                                                                                                    type="number"
                                                                                                                                    component={
                                                                                                                                        Input
                                                                                                                                    }
                                                                                                                                />
                                                                                                                            </FormItem>
                                                                                                                        )
                                                                                                                    }
                                                                                                                )}
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