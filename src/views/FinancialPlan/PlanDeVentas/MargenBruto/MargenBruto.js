/* eslint-disable no-multi-assign */
/* eslint-disable no-dupe-else-if */
import React, { useEffect, useState } from 'react'
import { getUser } from 'services/Requests'
import {
    FormContainer,
    Tabs,
    Alert,
} from 'components/ui'
import {MONTHS } from 'constants/forms.constants'
import ContainerScrollable from 'components/shared/ContainerScrollable'
import { useSelector } from 'react-redux'
import TableMargen from './TableMargen'

const { TabNav, TabList } = Tabs

function MargenBruto() {
    const [defaultCountry, setDefaultCountry] = useState('');
    const [infoForm, setInfoForm] = useState();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [country , setCountry]= useState(defaultCountry)
    const currency = useSelector((state) => state.auth.user.currency);
    const currentState = useSelector((state) => state.auth.user);
    const [products , setProducts]= useState([])
    const [showFaltaPrecioMssg, setShowFaltaPrecioMssg] = useState(false);
    const [showFaltaVolumenMssg, setShowFaltaVolumenMssg] = useState(false);
    const [showFaltaInfoMssg, setShowFaltaInfoMssg] = useState(false);

    const showMultiplicacionPxQ = (dataVolumen, dataPrecio) => {
        for (let i = 0; i < dataVolumen.length; i++) {  // entro a cada pais
            for (let x = 0; x < dataVolumen[i].stats.length; x++) { // a cada canal
                for (let j = 0; j < dataVolumen[i].stats[x].productos.length; j++) { // cada producto
                    for (let t = 0; t < dataVolumen[i].stats[x].productos[j].años.length; t++) { // año
                        const totalesAnio = []
                        MONTHS.forEach((month) =>  { // OBTENGO EL VALOR DE CADA OUTPUT QUE ES PRECIO X VOLUMEN 
                            const volMes = dataVolumen[i].stats[x].productos[j].años[t].volMeses[month]
                            const precioMes = dataPrecio[i].stats[x].productos[j].años[t].volMeses[month]
                            const ventaMes = dataVolumen[i].stats[x].productos[j].años[t].volMeses[month] = parseInt(volMes, 10) * parseInt(precioMes, 10)
                            totalesAnio.push(ventaMes);
                            return ventaMes
                        })
                        const totalVentasAnual = totalesAnio.reduce((a, b) => a + b, 0); // CALCULO EL TOTAL POR Anio
                        dataVolumen[i].stats[x].productos[j].años[t].ventasTotal = totalVentasAnual
                    }
                    
                }
            }
            
        }
       return dataVolumen
    }

    useEffect(() => {
        getUser(currentState.id)
            .then((data) => {
                if (data?.volumenData.length !== 0  && data?.precioData.length !== 0) { // tengo info vol y precio precargada
                    const datosPrecargados = {};
                    let dataVentas = showMultiplicacionPxQ(data?.volumenData.sort((a, b) => a.countryName.localeCompare(b.countryName)), data?.precioData.sort((a, b) => a.countryName.localeCompare(b.countryName)))
                    for (let i = 0; i < dataVentas.length; i++) {
                    datosPrecargados[dataVentas[i].countryName] = dataVentas[i].stats;
                    }
                    setInfoForm(() => ({ ...datosPrecargados}))
                    setProducts(data?.assumptionData[0].productos)
                } else if (data?.volumenData.length === 0) {
                    setShowFaltaVolumenMssg(true)
                } else if (data?.precioData.length === 0) {
                    setShowFaltaPrecioMssg(true)
                } else if(data?.precioData.length === 0  &&  data?.volumenData.length === 0) {
                    setShowFaltaInfoMssg(true)
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
                <h4>Margen Bruto</h4>
                <span>Plan de ventas</span>
            </div>

              <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
                <div className="border-b-2 px-4 py-1">
                     <h6>Visualizacion de margen bruto</h6>
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
                                 <TableMargen
                                  data ={infoForm}
                                  productos={products}
                                  showAlertSuces={(boolean) => setShowSuccessAlert(boolean)}
                                  showAlertError={(boolean) => setShowErrorAlert(boolean)}
                                  country={country}
                                  currency={currency}
                                  />}  
                                />
                             </FormContainer>
                         </div>
                         )}                                               
                     </Tabs>
                     : 
                     <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
                        {showFaltaPrecioMssg &&  <span>Para ver esta información debe completar el formulario de Precio.</span>}
                        {showFaltaVolumenMssg &&  <span>Para ver esta información debe completar el formulario de Volumen.</span>}
                        {showFaltaInfoMssg &&  <span>Para ver esta información debe completar los formularios de Precio y Volumen.</span>}
                     </div>
                 }
             </div> 
        </div>
    )
}

export default MargenBruto