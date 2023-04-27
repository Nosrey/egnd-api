import React, { useEffect, useState } from 'react'
import { getUser } from 'services/Requests'
import {
    FormContainer,
    Tabs,
    Alert,
} from 'components/ui'
import {AÑOS } from 'constants/forms.constants'
import ContainerScrollable from 'components/shared/ContainerScrollable'
import { useSelector } from 'react-redux'
import TableVolumen from './TableVolumen'

const { TabNav, TabList } = Tabs

function VolumenQ() {
    const [info, setInfo] = useState(null);
    const [defaultCountry, setDefaultCountry] = useState('');
    const [infoForm, setInfoForm] = useState();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [country , setCountry]= useState(defaultCountry)
    const currentState = useSelector((state) => state.auth.user);
    const [products , setProducts]= useState([])
    
    useEffect(() => {
        let estructura = {}
        if(info && info[0]) {
            setProducts(info[0].productos)
            for (let i = 0; i < info[0]?.paises.length; i++) {
                let productos =[]
                const realProds = info[0]?.productos
                for (let x = 0; x < realProds.length; x++) {
                    let prod = {}
                    prod.id = realProds[x].id
                    prod.volInicial = 0
                    prod.tasa = 0
                    prod.name = realProds[x].name
                    prod.inicioMes = 1
                    prod.fecha = ""
                    prod["años"]=[...AÑOS]
                    productos.push(prod)
                }
                let canales =[]
                for (let x = 0; x < info[0]?.canales.length; x++) {
                    let canal = {}
                    canal.canalName = info[0]?.canales[x].name
                    canal.productos = [...productos]
                    canales.push(canal)
                }
                estructura[info[0]?.paises[i].value] = [...canales]
               
            }
            setInfoForm( () => ({...estructura}))
        }
       
    }, [info])


    useEffect(() => {
        getUser(currentState.id)
            .then((data) => {
                if (data?.volumenData.length !== 0) { // tengo info precargada
                    const datosPrecargados = {};
                    for (let i = 0; i < data?.volumenData.length; i++) {
                    datosPrecargados[data?.volumenData[i].countryName] = data?.volumenData[i].stats;
                    }
                    setInfoForm(() => ({ ...datosPrecargados}))
                    setProducts(data?.assumptionData[0].productos)
                } else {  // no tengo info precargada
                    setInfo(data?.assumptionData)
                }
                setDefaultCountry(data?.assumptionData[0]?.paises[0]?.value)
                setCountry(data?.assumptionData[0]?.paises[0]?.value)
            })
            .catch((error) => console.error(error))
    }, [])

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
                <h4>Volumen (Q)</h4>
                <span>Plan de ventas</span>
            </div>

            <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
                <div className="border-b-2 px-4 py-1">
                    <h6>Carga de productos / servicios</h6>
                </div>
                {infoForm ?
                    <Tabs defaultValue={defaultCountry}>
                        <TabList>
                            {infoForm && Object.keys(infoForm).map((pais, index)=> (
                                    <TabNav key={index} value={pais} >
                                        <div className='capitalize' onClick={()=> setCountry(pais)}>{pais}</div>
                                    </TabNav>
                                ))}
                        </TabList>
                        {infoForm &&  (
                            <div className="container-countries">
                            <FormContainer className="cont-countries">
                            <ContainerScrollable contenido={
                                <TableVolumen
                                 data ={infoForm}
                                 productos={products}
                                 showAlertSuces={(boolean) => setShowSuccessAlert(boolean)}
                                 showAlertError={(boolean) => setShowErrorAlert(boolean)}
                                 country={country}
                                 />}  />
                            </FormContainer>
                        </div>
                        )}                                               
                    </Tabs>
                    :    
                    <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
                        <span>
                            Para acceder a este formulario primero debe completar el formulario de Assumptions Ventas.
                        </span>
                    </div>
                }
            </div>
        </div>
    )
}

export default VolumenQ