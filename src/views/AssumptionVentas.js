import React, { useState, useEffect } from 'react'
import {
    Alert,
    Input,
    Button,
    FormItem,
    FormContainer,
    Select,
    Avatar,
} from 'components/ui'
import { MdDelete } from 'react-icons/md'
import * as Yup from 'yup'
import CreatableSelect from 'react-select/creatable'
import { createAssumpVenta } from 'services/Requests'

const optionsModel = [
    { value: 'oneShot', label: 'One Shot' },
    { value: 'mensual', label: 'Suscripción Mensual' },
    { value: 'transacción', label: '% Transacción' },
    {
        value: 'FixPrice',
        label: 'Fix price por transacción',
    },
]

const optionsType = [
    { value: 'producto', label: 'Producto' },
    { value: 'servicio', label: 'Servicio' },
]

const optionsCountry = [
    { value: 'argentina', label: 'Argentina' },
    { value: 'brasil', label: 'Brasil' },
    { value: 'chile', label: 'Chile' },
    { value: 'uruguay', label: 'Uruguay' },
]

const optionsClients = [
    { value: 'si', label: 'SI' },
    { value: 'no', label: 'NO' },
]

const AssumptionVentas = () => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [errors, setErrors] = useState({})

    const validate = (inputValue) => {
        let errors = {}
        if (!inputValue.name) errors.name = 'Este campo no puede estar vacío'
        if (!inputValue.model) errors.model = 'Este campo no puede estar vacío'
        if (!inputValue.type) errors.texto = 'Este campo no puede estar vacío'
        return errors
    }

    const [productos, setProductos] = useState([
        {
            id: 1,
            name: '',
            model: '',
            type: '',
        },
    ])
    const [countries, setCountries] = useState([])
    const [channels, setChannels] = useState([
        {
            name: '',
            sameClient: '',
            items: [],
        },
    ])
    const [churn, setChurn] = useState([
        {
            channel: channels[0].name,
            items: [],
        },
    ])
    const [showRemoveProd, setShowRemoveProd] = useState(false)
    const [showRemoveChannel, setShowRemoveChannel] = useState(false)

    const addProduct = (newProduct) => {
        setProductos([...productos, newProduct])
    }
    const addChurn = (newChurn) => {
        setChurn([...churn, newChurn])
    }
    const addChannel = (newChannel) => {
        setChannels([...channels, newChannel])
        addChurn({
            channel: '',
            items: [],
        })
    }

    const removeProd = (id) => {
        setProductos([...productos.filter((item) => id !== item.id)])
    }
    const removeChannel = (channelName) => {
        setChannels([...channels.filter((item) => channelName !== item.name)])
    }

    const handleEditProduct = (idProd, campo, value) => {
        const position = productos.findIndex((prod) => prod.id === idProd)
        const copyProd = [...productos]
        copyProd[position][campo] = value
        setProductos(() => [...copyProd])
    }

    const handleEditChannel = (nameChannel, campo, value, prodId) => {
        const position = channels.findIndex((c) => c.name === nameChannel)
        const copyChannels = [...channels]
        const copyChurn = [...churn]

        if (prodId) {
            const item = {
                prodId: prodId,
                volumen: value,
            }
            if (copyChannels[position].items.some((i) => i.prodId === prodId)) {
                //modifico
                const positionI = copyChannels[position].items.findIndex(
                    (c) => c.prodId === prodId
                )
                copyChannels[position].items[positionI].volumen = value
            } else {
                //agrego nuevo
                copyChannels[position].items.push(item)
            }
        } else {
            copyChannels[position][campo] = value
            if (campo === 'name') {
                copyChurn[position]['channel'] = value
                setChurn(() => [...copyChurn])
            }
        }
        setChannels(() => [...copyChannels])
    }
    const handleEditChurn = (nameChannel, value, prodId) => {
        const position = churn.findIndex((c) => c.channel === nameChannel)
        const copyChurn = [...churn]
        const item = {
            prodId: prodId,
            porcentajeChurn: value,
        }
        if (copyChurn[position].items.some((i) => i.prodId === prodId)) {
            //modifico
            const positionI = copyChurn[position].items.findIndex(
                (c) => c.prodId === prodId
            )
            copyChurn[position].items[positionI].porcentajeChurn = value
        } else {
            //agrego nuevo
            copyChurn[position].items.push(item)
        }

        setChurn(() => [...copyChurn])
    }

    const handleKeyPressVolumen = (e) => {
        if (e.key === '-') {
            e.preventDefault()
        }
    }
    const handleKeyPressChurn = (e) => {
        if (e.key === '-') {
            e.preventDefault()
        }
        const value = e.target.value + e.key
        if (value > 100) {
            e.preventDefault()
        }
    }

    const onSubmit = () => {
        createAssumpVenta(channels, churn, countries, productos)
            .then((data) => {
                console.log(data)
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setShowSuccessAlert(true)
                setTimeout(() => {
                    setShowSuccessAlert(false)
                }, 5000)
            })
            .catch((error) => {
                console.error(error)
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setShowErrorAlert(true)
                setTimeout(() => {
                    setShowErrorAlert(false)
                }, 5000)
            })
    }
    return (
        <div>
            {showSuccessAlert && (
                <Alert className="mb-4" type="success" showIcon>
                    Los datos se guardaron satisfactoriamente.
                </Alert>
            )}
            {showErrorAlert && (
                <Alert className="mb-4" type="danger" showIcon>
                    No se pudieron guardar los datos.
                </Alert>
            )}
            <div className="border-b-2 mb-8 pb-1">
                <h4>Assumptions ventas</h4>
                <span>Plan de ventas</span>
            </div>
            <div className="border-solid border-2 border-#e5e7eb rounded-lg">
                <div className="border-b-2 px-4 py-1">
                    <h6>Carga de productos / servicios</h6>
                </div>

                <div className="px-4 py-5">
                    <FormContainer>
                        <div className="flex flex-col gap-y-6">
                            {/*****************************************************************************************************/}
                            {/**************************      P R O D U C T O S      *********************************************/}
                            {/*****************************************************************************************************/}
                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                <span className=" ">ID</span>
                                <span className="col-start-2 col-end-6">
                                    Producto / Servicio
                                </span>
                                <span className="col-start-6 col-end-10">
                                    Revenue Model
                                </span>
                                <span className="col-start-10 col-end-13">
                                    Tipo
                                </span>
                            </div>
                            <div>
                                {productos && productos.length > 0 ? (
                                    productos.map((prod, index) => {
                                        return (
                                            <div
                                                className="grid grid-cols-12 items-center gap-x-3 mb-6 auto-cols-max"
                                                key={index}
                                            >
                                                <Avatar className="col-start-1 col-end-2  row-start-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                                                    {prod.id}
                                                </Avatar>
                                                <FormItem className="col-start-2 col-end-6 row-start-2 mb-0">
                                                    <Input
                                                        placeholder="Nombre"
                                                        name="name"
                                                        type="text"
                                                        onChange={(e) =>
                                                            handleEditProduct(
                                                                prod.id,
                                                                e.target.name,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {errors[prod.id] &&
                                                        errors[prod.id]
                                                            .name && (
                                                            <p className="danger">
                                                                {
                                                                    errors[
                                                                        prod.id
                                                                    ].name
                                                                }
                                                            </p>
                                                        )}
                                                </FormItem>

                                                <FormItem className="col-start-6 col-end-9 row-start-2 mb-0">
                                                    <Select
                                                        name="model"
                                                        options={optionsModel}
                                                        value={optionsModel.filter(
                                                            (option) =>
                                                                option.value ===
                                                                productos[
                                                                    productos.findIndex(
                                                                        (p) =>
                                                                            p.id ===
                                                                            prod.id
                                                                    )
                                                                ].model
                                                        )}
                                                        onChange={(e) =>
                                                            handleEditProduct(
                                                                prod.id,
                                                                'model',
                                                                e.value
                                                            )
                                                        }
                                                    />
                                                    {errors[prod.id] &&
                                                        errors[prod.id]
                                                            .name && (
                                                            <p className="danger">
                                                                {
                                                                    errors[
                                                                        prod.id
                                                                    ].name
                                                                }
                                                            </p>
                                                        )}
                                                </FormItem>

                                                <FormItem className="col-start-9 col-end-12 row-start-2 mb-0">
                                                    <Select
                                                        name="type"
                                                        options={optionsType}
                                                        value={optionsType.filter(
                                                            (option) =>
                                                                option.value ===
                                                                productos[
                                                                    productos.findIndex(
                                                                        (p) =>
                                                                            p.id ===
                                                                            prod.id
                                                                    )
                                                                ].type
                                                        )}
                                                        onChange={(e) =>
                                                            handleEditProduct(
                                                                prod.id,
                                                                'type',
                                                                e.value
                                                            )
                                                        }
                                                    />
                                                    {errors[prod.id] &&
                                                        errors[prod.id]
                                                            .name && (
                                                            <p className="danger">
                                                                {
                                                                    errors[
                                                                        prod.id
                                                                    ].name
                                                                }
                                                            </p>
                                                        )}
                                                </FormItem>
                                                {showRemoveProd && (
                                                    <Button
                                                        shape="circle"
                                                        size="sm"
                                                        variant="twoTone"
                                                        color="red-600"
                                                        className="col-start-12 col-end-13 row-start-2 mb-0"
                                                        icon={<MdDelete />}
                                                        onClick={() =>
                                                            removeProd(prod.id)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]">
                                        <span>
                                            No hay productos creados. Créalos
                                            con el botón de Agregar.
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                        <FormItem className=" col-start-10 col-end-13 mb-0">
                                            <div className="flex justify-between gap-x-2">
                                                {productos.length > 0 ? (
                                                    <Button
                                                        style={{
                                                            width: '47%',
                                                        }}
                                                        className=" flex justify-center items-center"
                                                        // variant="solid"
                                                        variant="twoTone"
                                                        // color="blue-600"
                                                        color="red-600"
                                                        onClick={() => {
                                                            setShowRemoveProd(
                                                                !showRemoveProd
                                                            )
                                                        }}
                                                    >
                                                        {showRemoveProd === true
                                                            ? 'Anular'
                                                            : 'Eliminar item'}
                                                    </Button>
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '47%',
                                                        }}
                                                        className=" flex justify-center items-center"
                                                    ></div>
                                                )}

                                                <Button
                                                    style={{
                                                        width: '47%',
                                                    }}
                                                    className=" flex justify-center items-center"
                                                    // variant="solid"
                                                    variant="twoTone"
                                                    type="button"
                                                    onClick={() => {
                                                        addProduct({
                                                            id:
                                                                productos.length +
                                                                1,
                                                            name: '',
                                                            model: '',
                                                            type: '',
                                                        })
                                                    }}
                                                >
                                                    Agregar item
                                                </Button>
                                            </div>
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            {/*****************************************************************************************************/}
                            {/**************************        P A I S E S       ***********************************************/}
                            {/*****************************************************************************************************/}
                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                <span className="col-start-1 col-end-6 font-bold">
                                    Pais
                                </span>
                            </div>

                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max mb-[30px]">
                                <FormItem className="col-start-1 col-end-5 row-start-1 mb-0">
                                    <Select
                                        placeholder="País"
                                        componentAs={CreatableSelect}
                                        isMulti
                                        options={optionsCountry}
                                        values={countries}
                                        onChange={(option) => {
                                            setCountries(() => [...option])
                                        }}
                                    />
                                </FormItem>
                            </div>

                            {/*****************************************************************************************************/}
                            {/**************************        C A N A L E S       ***********************************************/}
                            {/*****************************************************************************************************/}

                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max  ">
                                <span className=" col-start-1  col-end-6 font-bold">
                                    Canal
                                </span>
                                {channels.length !== 0 && (
                                    <>
                                        <span className=" col-start-6  col-end-8">
                                            Volumen por cliente
                                        </span>
                                        <span className=" col-start-9  col-end-13">
                                            ¿Son las ventas de productos a un
                                            mismo cliente?
                                        </span>
                                    </>
                                )}
                            </div>

                            <div>
                                {channels && channels.length > 0
                                    ? channels.map((channel, index) => {
                                          return (
                                              <div
                                                  className="grid grid-cols-12 items-center gap-x-3 gap-y-4 mb-6 auto-cols-max"
                                                  key={index}
                                              >
                                                  <FormItem
                                                      className="col-start-1 col-end-8 row-start-1 mb-0"
                                                      invalid={false}
                                                      errorMessage={'prueba'}
                                                  >
                                                      <Input
                                                          invalid={false}
                                                          placeholder="Nombre canal"
                                                          value={
                                                              channels[index]
                                                                  .name
                                                          }
                                                          type="text"
                                                          name="name"
                                                          onChange={(e) =>
                                                              handleEditChannel(
                                                                  channel.name,
                                                                  e.target.name,
                                                                  e.target
                                                                      .value,
                                                                  null
                                                              )
                                                          }
                                                      />
                                                  </FormItem>
                                                  <FormItem
                                                      className="col-start-9 col-end-11 row-start-1 mb-0"
                                                      invalid={false}
                                                      errorMessage={'prueba'}
                                                  >
                                                      <Select
                                                          name={`channels[${index}].sameClient`}
                                                          options={
                                                              optionsClients
                                                          }
                                                          value={optionsClients.filter(
                                                              (option) =>
                                                                  option.value ===
                                                                  channels[
                                                                      channels.findIndex(
                                                                          (c) =>
                                                                              c.name ===
                                                                              channel.name
                                                                      )
                                                                  ].sameClient
                                                          )}
                                                          onChange={(e) =>
                                                              handleEditChannel(
                                                                  channel.name,
                                                                  'sameClient',
                                                                  e.value,
                                                                  null
                                                              )
                                                          }
                                                      />
                                                  </FormItem>
                                                  {showRemoveChannel && (
                                                      <Button
                                                          shape="circle"
                                                          size="sm"
                                                          variant="twoTone"
                                                          color="red-600"
                                                          className="col-start-12 col-end-13 row-start-1 mb-0"
                                                          icon={<MdDelete />}
                                                          onClick={() =>
                                                              removeChannel(
                                                                  channel.name
                                                              )
                                                          }
                                                      />
                                                  )}
                                                  {productos &&
                                                  productos.length > 0
                                                      ? productos.map(
                                                            (prod, index) => {
                                                                return (
                                                                    <div
                                                                        className="grid grid-cols-12 col-start-1 col-end-13 items-center gap-x-3 mb-6 auto-cols-max"
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <FormItem className="col-start-1  col-end-6  mb-0">
                                                                            <Input
                                                                                disabled
                                                                                value={
                                                                                    prod.name
                                                                                }
                                                                                type="text"
                                                                            />
                                                                        </FormItem>
                                                                        <FormItem
                                                                            className="col-start-6 col-end-8   mb-0"
                                                                            invalid={
                                                                                false
                                                                            }
                                                                            errorMessage={
                                                                                'prueba'
                                                                            }
                                                                        >
                                                                            <Input
                                                                                invalid={
                                                                                    false
                                                                                }
                                                                                placeholder="Volumen por venta"
                                                                                name="volumen"
                                                                                value={
                                                                                    channels[
                                                                                        channels.findIndex(
                                                                                            (
                                                                                                c
                                                                                            ) =>
                                                                                                c.name ===
                                                                                                channel.name
                                                                                        )
                                                                                    ]
                                                                                        .items[
                                                                                        channels[
                                                                                            channels.findIndex(
                                                                                                (
                                                                                                    c
                                                                                                ) =>
                                                                                                    c.name ===
                                                                                                    channel.name
                                                                                            )
                                                                                        ].items.findIndex(
                                                                                            (
                                                                                                c
                                                                                            ) =>
                                                                                                c.prodId ===
                                                                                                prod.id
                                                                                        )
                                                                                    ]
                                                                                        ?.volumen
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleEditChannel(
                                                                                        channel.name,
                                                                                        'volumen',
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        prod.id
                                                                                    )
                                                                                }
                                                                                type="number"
                                                                                min="1"
                                                                                onKeyPress={
                                                                                    handleKeyPressVolumen
                                                                                }
                                                                            />
                                                                        </FormItem>
                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                      : null}
                                              </div>
                                          )
                                      })
                                    : null}
                                {channels.length === 0 && (
                                    <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]">
                                        <span>
                                            No hay canales creados. Créalos con
                                            el botón de Agregar.
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                        <FormItem className=" col-start-10 col-end-13 mb-0">
                                            <div className="flex justify-between gap-x-2">
                                                {channels.length > 0 ? (
                                                    <Button
                                                        style={{
                                                            width: '47%',
                                                        }}
                                                        className=" flex justify-center items-center"
                                                        variant="twoTone"
                                                        color="red-600"
                                                        onClick={() => {
                                                            setShowRemoveChannel(
                                                                !showRemoveChannel
                                                            )
                                                        }}
                                                    >
                                                        {showRemoveChannel ===
                                                        true
                                                            ? 'Anular'
                                                            : 'Eliminar Canal'}
                                                    </Button>
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '47%',
                                                        }}
                                                        className=" flex justify-center items-center"
                                                    ></div>
                                                )}

                                                <Button
                                                    style={{
                                                        width: '47%',
                                                    }}
                                                    className=" flex justify-center items-center"
                                                    variant="twoTone"
                                                    type="button"
                                                    onClick={() => {
                                                        addChannel({
                                                            name: '',
                                                            sameClient: '',
                                                            items: [],
                                                        })
                                                    }}
                                                >
                                                    Agregar Canal
                                                </Button>
                                            </div>
                                        </FormItem>
                                    </div>
                                </div>
                            </div>

                            {/*****************************************************************************************************/}
                            {/**************************          C H U R N         ***********************************************/}
                            {/*****************************************************************************************************/}
                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max  ">
                                <span className=" col-start-1  col-end-6 font-bold">
                                    Churns
                                </span>
                                {channels.length !== 0 && (
                                    <span className=" col-start-6  col-end-8">
                                        % Churn mensual
                                    </span>
                                )}
                            </div>
                            <div>
                                {channels && channels.length > 0
                                    ? channels.map((channel, index) => {
                                          return (
                                              <div
                                                  className="grid grid-cols-12 items-center gap-x-3 gap-y-4 mb-6 auto-cols-max"
                                                  key={index}
                                              >
                                                  <FormItem
                                                      className="col-start-1 col-end-8 row-start-1 mb-0"
                                                      invalid={false}
                                                      errorMessage={'prueba'}
                                                  >
                                                      <Input
                                                          disabled
                                                          invalid={false}
                                                          placeholder="Nombre canal"
                                                          value={
                                                              channels[index]
                                                                  .name
                                                          }
                                                          type="text"
                                                          name="name"
                                                      />
                                                  </FormItem>
                                                  {productos &&
                                                  productos.length > 0
                                                      ? productos.map(
                                                            (prod, index) => {
                                                                return (
                                                                    <div
                                                                        className="grid grid-cols-12 col-start-1 col-end-13 items-center gap-x-3 mb-6 auto-cols-max"
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <FormItem className="col-start-1  col-end-6  mb-0">
                                                                            <Input
                                                                                disabled
                                                                                value={
                                                                                    prod.name
                                                                                }
                                                                                type="text"
                                                                            />
                                                                        </FormItem>
                                                                        <FormItem
                                                                            className="col-start-6 col-end-8   mb-0"
                                                                            invalid={
                                                                                false
                                                                            }
                                                                            errorMessage={
                                                                                'prueba'
                                                                            }
                                                                        >
                                                                            <Input
                                                                                invalid={
                                                                                    false
                                                                                }
                                                                                placeholder="Churn Mensual"
                                                                                name="churn"
                                                                                suffix="%"
                                                                                value={
                                                                                    churn[
                                                                                        churn.findIndex(
                                                                                            (
                                                                                                c
                                                                                            ) =>
                                                                                                c.channel ===
                                                                                                channel.name
                                                                                        )
                                                                                    ]
                                                                                        .items[
                                                                                        churn[
                                                                                            churn.findIndex(
                                                                                                (
                                                                                                    c
                                                                                                ) =>
                                                                                                    c.channel ===
                                                                                                    channel.name
                                                                                            )
                                                                                        ].items.findIndex(
                                                                                            (
                                                                                                c
                                                                                            ) =>
                                                                                                c.prodId ===
                                                                                                prod.id
                                                                                        )
                                                                                    ]
                                                                                        ?.porcentajeChurn
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleEditChurn(
                                                                                        channel.name,
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                        prod.id
                                                                                    )
                                                                                }
                                                                                type="number"
                                                                                min="1"
                                                                                max="100"
                                                                                onKeyPress={
                                                                                    handleKeyPressChurn
                                                                                }
                                                                            />
                                                                        </FormItem>
                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                      : null}
                                              </div>
                                          )
                                      })
                                    : null}
                                {channels.length === 0 && (
                                    <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]">
                                        <span>
                                            No hay canales creados. Créalos con
                                            el botón de Agregar en la sección
                                            superior.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                className="mr-2 mb-2  "
                                variant="solid"
                                size="lg"
                                color="blue-600"
                                onClick={onSubmit}
                            >
                                Guardar
                            </Button>
                        </div>
                    </FormContainer>
                </div>
            </div>
        </div>
    )
}

export default AssumptionVentas
