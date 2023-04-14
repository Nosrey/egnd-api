import {
    Avatar,
    Button,
    FormContainer,
    FormItem,
    Input,
    Select,
} from 'components/ui'
import { useState } from 'react'
import { MdDelete } from 'react-icons/md'
import CreatableSelect from 'react-select/creatable'
import { useMedia } from 'utils/hooks/useMedia'

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

function TableAssumptionVentas({
    productos,
    errors,
    handleEditProduct,
    removeProd,
    removeChannel,
    addProduct,
    addChannel,
    channels,
    handleEditChannel,
    handleKeyPressVolumen,
    churn,
    handleEditChurn,
    handleKeyPressChurn,
    onSubmit,
    setCountries,
    countries,
    activeButton,
}) {
    const [showRemoveProd, setShowRemoveProd] = useState(false)

    const [showRemoveChannel, setShowRemoveChannel] = useState(false)
    const media = useMedia()

    const validateId = (campo, id) => {
        const existeId = campo.find((c) => c.id === id)

        if (existeId) {
            return validateId(campo, id + 1)
        } else {
            return id
        }
    }

    return (
        <div className="px-4 py-5">
            <FormContainer>
                <div className="flex flex-col gap-y-6">
                    {/*****************************************************************************************************/}
                    {/**************************      P R O D U C T O S      *********************************************/}
                    {/*****************************************************************************************************/}
                    <div
                        className={`grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max ${
                            media === 'mobile' ? 'w-[600px]' : ''
                        }`}
                    >
                        <span className=" ">ID</span>
                        <span className="col-start-2 col-end-6">
                            Producto / Servicio
                        </span>
                        <span className="col-start-6 col-end-10">
                            Revenue Model
                        </span>
                        <span className="col-start-10 col-end-13">Tipo</span>
                    </div>
                    <div>
                        {productos && productos.length > 0 ? (
                            productos.map((prod, index) => {
                                return (
                                    <div
                                        className={`grid grid-cols-12 items-center gap-x-3 mb-6 auto-cols-max ${
                                            media === 'mobile'
                                                ? 'w-[600px]'
                                                : ''
                                        }`}
                                        key={index}
                                    >
                                        <Avatar className="col-start-1 col-end-2  row-start-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                                            {prod.id}
                                        </Avatar>
                                        <FormItem className="col-start-2 col-end-6 row-start-2 mb-0">
                                            <Input
                                                placeholder="Nombre"
                                                name="name"
                                                value={prod.name}
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
                                                errors[prod.id].name && (
                                                    <p className="danger">
                                                        {errors[prod.id].name}
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
                                                        prod.model
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
                                                errors[prod.id].name && (
                                                    <p className="danger">
                                                        {errors[prod.id].name}
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
                                                        prod.type
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
                                                errors[prod.id].name && (
                                                    <p className="danger">
                                                        {errors[prod.id].name}
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
                                    No hay productos creados. Créalos con el
                                    botón de Agregar.
                                </span>
                            </div>
                        )}
                        <div>
                            <div
                                className={`grid grid-cols-12 items-center gap-x-3 gap-y-4  auto-cols-max
                               ${media === 'mobile' ? 'w-[600px]' : ''}
                            `}
                            >
                                <FormItem
                                    className={`mb-0 ${
                                        media === 'mobile'
                                            ? 'col-start-5 col-end-12'
                                            : media === 'tablet'
                                            ? 'col-start-9 col-end-13'
                                            : media === 'desktop'
                                            ? 'col-start-8 col-end-13'
                                            : 'col-start-10 col-end-13'
                                    }`}
                                >
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
                                                    id: validateId(
                                                        productos,
                                                        productos.length + 1
                                                    ),
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
                        <span
                            className={`font-bold ${
                                media === 'mobile'
                                    ? 'col-start-1 col-end-13'
                                    : 'col-start-1 col-end-6'
                            }`}
                        >
                            Pais
                        </span>
                    </div>

                    <div
                        className={`grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max mb-[30px] ${
                            media === 'mobile' ? 'w-[600px]' : ''
                        }`}
                    >
                        <FormItem
                            className={`row-start-1 mb-0 ${
                                media === 'mobile'
                                    ? 'col-start-1 col-end-7'
                                    : 'col-start-1 col-end-6'
                            }`}
                        >
                            <Select
                                placeholder="País"
                                name="countries"
                                componentAs={CreatableSelect}
                                isMulti
                                options={optionsCountry}
                                value={countries}
                                onChange={(option) => {
                                    setCountries(() => [...option])
                                }}
                            />
                        </FormItem>
                    </div>

                    {/*****************************************************************************************************/}
                    {/**************************        C A N A L E S       ***********************************************/}
                    {/*****************************************************************************************************/}

                    <div
                        className={`grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max ${
                            media === 'mobile' ? 'w-[600px]' : ''
                        }`}
                    >
                        <span
                            className={`font-bold ${
                                media === 'mobile'
                                    ? 'col-start-1 col-end-3'
                                    : 'col-start-1 col-end-6'
                            }`}
                        >
                            Canal
                        </span>
                        {channels.length !== 0 && (
                            <>
                                <span
                                    className={` ${
                                        media === 'mobile'
                                            ? 'col-start-3 col-end-7'
                                            : media === 'tablet'
                                            ? 'col-start-6 col-end-9'
                                            : media === 'desktop'
                                            ? 'col-start-6 col-end-9'
                                            : 'col-start-6 col-end-8'
                                    }`}
                                >
                                    Volumen por cliente
                                </span>
                                <span
                                    className={` ${
                                        media === 'mobile'
                                            ? 'col-start-7 col-end-12 text-center'
                                            : media === 'tablet'
                                            ? 'col-start-9 col-end-13 text-center'
                                            : media === 'desktop'
                                            ? 'col-start-9 col-end-13 text-center'
                                            : 'col-start-9 col-end-13'
                                    }`}
                                >
                                    ¿Son las ventas de productos a un mismo
                                    cliente?
                                </span>
                            </>
                        )}
                    </div>

                    <div>
                        {channels && channels.length > 0
                            ? channels.map((channel, index) => {
                                  return (
                                      <div
                                          className={`grid grid-cols-12 items-center gap-x-3 gap-y-4 mb-6 auto-cols-max ${
                                              media === 'mobile'
                                                  ? 'w-[600px]'
                                                  : ''
                                          }`}
                                          key={index}
                                      >
                                          <FormItem
                                              className={`row-start-1 mb-0 ${
                                                  media === 'mobile'
                                                      ? 'col-start-1 col-end-7'
                                                      : media === 'tablet'
                                                      ? 'col-start-1 col-end-9'
                                                      : media === 'desktop'
                                                      ? 'col-start-1 col-end-9'
                                                      : 'col-start-1 col-end-8'
                                              }`}
                                              invalid={false}
                                              errorMessage={'prueba'}
                                          >
                                              <Input
                                                  invalid={false}
                                                  placeholder="Nombre canal"
                                                  value={channels[index].name}
                                                  type="text"
                                                  name="name"
                                                  onChange={(e) =>
                                                      handleEditChannel(
                                                          channel.name,
                                                          e.target.name,
                                                          e.target.value,
                                                          null
                                                      )
                                                  }
                                              />
                                          </FormItem>
                                          <FormItem
                                              className={` row-start-1 mb-0 ${
                                                  media === 'mobile'
                                                      ? 'col-start-7 col-end-12'
                                                      : media === 'tablet'
                                                      ? 'col-start-9 col-end-13'
                                                      : media === 'desktop'
                                                      ? 'col-start-9 col-end-13'
                                                      : 'col-start-9 col-end-11'
                                              }`}
                                              invalid={false}
                                              errorMessage={'prueba'}
                                          >
                                              <Select
                                                  name={`channels[${index}].sameClient`}
                                                  options={optionsClients}
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
                                          {productos && productos.length > 0
                                              ? productos.map((prod, index) => {
                                                    return (
                                                        <div
                                                            className={`grid grid-cols-12 col-start-1 col-end-13 items-center gap-x-3 mb-6 auto-cols-max`}
                                                            key={index}
                                                        >
                                                            <FormItem
                                                                className={`mb-0 ${
                                                                    media ===
                                                                    'mobile'
                                                                        ? 'col-start-1 col-end-5'
                                                                        : 'col-start-1 col-end-6'
                                                                }`}
                                                            >
                                                                <Input
                                                                    disabled
                                                                    value={
                                                                        prod.name
                                                                    }
                                                                    type="text"
                                                                />
                                                            </FormItem>
                                                            <FormItem
                                                                className={`mb-0 ${
                                                                    media ===
                                                                    'mobile'
                                                                        ? 'col-start-5 col-end-9'
                                                                        : media ===
                                                                          'tablet'
                                                                        ? 'col-start-6 col-end-9'
                                                                        : media ===
                                                                          'desktop'
                                                                        ? 'col-start-6 col-end-9'
                                                                        : 'col-start-6 col-end-8'
                                                                }`}
                                                                invalid={false}
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
                                                                        ].items[
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
                                                })
                                              : null}
                                      </div>
                                  )
                              })
                            : null}
                        {channels.length === 0 && (
                            <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]">
                                <span>
                                    No hay canales creados. Créalos con el botón
                                    de Agregar.
                                </span>
                            </div>
                        )}

                        <div>
                            <div
                                className={`grid grid-cols-12 items-center gap-x-3 gap-y-4  auto-cols-max
                               ${media === 'mobile' ? 'w-[600px]' : ''}
                            `}
                            >
                                <FormItem
                                    className={`mb-0 ${
                                        media === 'mobile'
                                            ? 'col-start-5 col-end-12'
                                            : media === 'tablet'
                                            ? 'col-start-9 col-end-13'
                                            : media === 'desktop'
                                            ? 'col-start-8 col-end-13'
                                            : 'col-start-10 col-end-13'
                                    }`}
                                >
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
                                                {showRemoveChannel === true
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
                                            onClick={() =>
                                                addChannel({
                                                    name: '',
                                                    sameClient: '',
                                                    items: [],
                                                })
                                            }
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
                    <div
                        className={`grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max ${
                            media === 'mobile' ? 'w-[600px]' : ''
                        }`}
                    >
                        <span
                            className={`font-bold ${
                                media === 'mobile'
                                    ? 'col-start-1 col-end-5'
                                    : 'col-start-1 col-end-6'
                            }`}
                        >
                            Churns
                        </span>
                        {channels.length !== 0 && (
                            <span
                                className={` ${
                                    media === 'mobile'
                                        ? 'col-start-5 col-end-9'
                                        : media === 'tablet'
                                        ? 'col-start-6 col-end-9'
                                        : media === 'desktop'
                                        ? 'col-start-6 col-end-9'
                                        : 'col-start-6  col-end-8'
                                }`}
                            >
                                % Churn mensual
                            </span>
                        )}
                    </div>
                    <div>
                        {channels && channels.length > 0
                            ? channels.map((channel, index) => {
                                  return (
                                      <div
                                          className={`grid grid-cols-12 items-center gap-x-3 gap-y-4 mb-6 auto-cols-max ${
                                              media === 'mobile'
                                                  ? 'w-[600px]'
                                                  : ''
                                          }`}
                                          key={index}
                                      >
                                          <FormItem
                                              className={`row-start-1 mb-0 ${
                                                  media === 'mobile'
                                                      ? 'col-start-1 col-end-7'
                                                      : media === 'tablet'
                                                      ? 'col-start-1 col-end-9'
                                                      : media === 'desktop'
                                                      ? 'col-start-1 col-end-9'
                                                      : 'col-start-1 col-end-8'
                                              }`}
                                              invalid={false}
                                              errorMessage={'prueba'}
                                          >
                                              <Input
                                                  disabled
                                                  invalid={false}
                                                  placeholder="Nombre canal"
                                                  value={channels[index].name}
                                                  type="text"
                                                  name="name"
                                              />
                                          </FormItem>
                                          {productos && productos.length > 0
                                              ? productos.map((prod, index) => {
                                                    return (
                                                        <div
                                                            className="grid grid-cols-12 col-start-1 col-end-13 items-center gap-x-3 mb-6 auto-cols-max"
                                                            key={index}
                                                        >
                                                            <FormItem
                                                                className={`mb-0 ${
                                                                    media ===
                                                                    'mobile'
                                                                        ? 'col-start-1 col-end-3'
                                                                        : 'col-start-1 col-end-6'
                                                                }`}
                                                            >
                                                                <Input
                                                                    disabled
                                                                    value={
                                                                        prod.name
                                                                    }
                                                                    type="text"
                                                                />
                                                            </FormItem>
                                                            <FormItem
                                                                className={`mb-0 ${
                                                                    media ===
                                                                    'mobile'
                                                                        ? 'col-start-3 col-end-7'
                                                                        : media ===
                                                                          'tablet'
                                                                        ? 'col-start-6 col-end-9'
                                                                        : media ===
                                                                          'desktop'
                                                                        ? 'col-start-6 col-end-9'
                                                                        : 'col-start-6  col-end-8'
                                                                }`}
                                                                invalid={false}
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
                                                                        ].items[
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
                                                })
                                              : null}
                                      </div>
                                  )
                              })
                            : null}
                        {channels.length === 0 && (
                            <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]">
                                <span>
                                    No hay canales creados. Créalos con el botón
                                    de Agregar en la sección superior.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end ">
                    <Button
                        className="mr-2 mb-2  "
                        variant="solid"
                        size="lg"
                        color="blue-600"
                        disabled={activeButton}
                        onClick={onSubmit}
                    >
                        Guardar
                    </Button>
                </div>
            </FormContainer>
        </div>
    )
}

export default TableAssumptionVentas
