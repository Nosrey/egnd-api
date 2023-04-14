import ContainerScrollable from 'components/shared/ContainerScrollable'
import { Alert } from 'components/ui'
import { useEffect, useState } from 'react'
import { createAssumpVenta, getUser } from 'services/Requests'
import TableAssumptionVentas from './TableAssumptionVentas'
import { useMedia } from 'utils/hooks/useMedia'

const AssumptionVentas = () => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [activeButton, setActiveButton] = useState(true)
    const [errors, setErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState('')
    const media = useMedia()
    const [productos, setProductos] = useState([])
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

    const addProduct = (newProduct) => {
        if (productos.length === 10) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setErrorMessage('Se llegó al límite de 10 productos')
            setShowErrorAlert(true)
            setTimeout(() => {
                setShowErrorAlert(false)
            }, 5000)
        } else {
            setProductos([...productos, newProduct])
            buttonSaveStatus()
        }
    }
    const addChurn = (newChurn) => {
        setChurn([...churn, newChurn])
    }
    const addChannel = (newChannel) => {
        if (channels.length === 5) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setErrorMessage('Se llegó al límite de 5 canales')
            setShowErrorAlert(true)
            setTimeout(() => {
                setShowErrorAlert(false)
            }, 5000)
        } else {
            setChannels([...channels, newChannel])
            addChurn({
                channel: newChannel.name,
                items: [],
            })
        }
    }

    useEffect(() => {
        getUser().then((d) => {
            setProductos(d.assumptionData && d.assumptionData[0].productos)
            setCountries(() => d.assumptionData && d.assumptionData[0].paises)
            setChannels(d.assumptionData && d.assumptionData[0].canales)
            setChurn(d.assumptionData && d.assumptionData[0].churns)
        })
    }, [])

    const removeProd = (id) => {
        setProductos(productos.filter((item) => id !== item.id))
        buttonSaveStatus()
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

        buttonSaveStatus()
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

    const buttonSaveStatus = () => {
        if (productos.length > 0 && channels[0].name !== '') {
            setActiveButton(false)
        } else {
            setActiveButton(true)
        }
    }

    const onSubmit = () => {
        createAssumpVenta(channels, churn, countries, productos)
            .then((data) => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setShowSuccessAlert(true)
                setTimeout(() => {
                    setShowSuccessAlert(false)
                }, 5000)
            })
            .catch((error) => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setErrorMessage('No se pudieron guardar los datos.')
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
                    {errorMessage}
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
                {
                    media === 'mobile'  ?
                    <ContainerScrollable
                    contenido={
                        <TableAssumptionVentas
                            countries={countries}
                            setCountries={setCountries}
                            productos={productos}
                            errors={errors}
                            removeProd={removeProd}
                            removeChannel={removeChannel}
                            addProduct={addProduct}
                            addChannel={addChannel}
                            channels={channels}
                            handleEditProduct={handleEditProduct}
                            handleEditChannel={handleEditChannel}
                            handleKeyPressVolumen={handleKeyPressVolumen}
                            churn={churn}
                            handleEditChurn={handleEditChurn}
                            handleKeyPressChurn={handleKeyPressChurn}
                            onSubmit={onSubmit}
                            showAlertSuces={(boolean) =>
                                setShowSuccessAlert(boolean)
                            }
                            showAlertError={(boolean) =>
                                setShowErrorAlert(boolean)
                            }
                            activeButton={activeButton}
                        />
                    }
                />

                : 
                <TableAssumptionVentas
                    countries={countries}
                    setCountries={setCountries}
                    productos={productos}
                    errors={errors}
                    removeProd={removeProd}
                    removeChannel={removeChannel}
                    addProduct={addProduct}
                    addChannel={addChannel}
                    channels={channels}
                    handleEditProduct={handleEditProduct}
                    handleEditChannel={handleEditChannel}
                    handleKeyPressVolumen={handleKeyPressVolumen}
                    churn={churn}
                    handleEditChurn={handleEditChurn}
                    handleKeyPressChurn={handleKeyPressChurn}
                    onSubmit={onSubmit}
                    showAlertSuces={(boolean) =>
                        setShowSuccessAlert(boolean)
                    }
                    showAlertError={(boolean) =>
                        setShowErrorAlert(boolean)
                    }
                    activeButton={activeButton}
                />
                }
                
            </div>
        </div>
    )
}

export default AssumptionVentas
