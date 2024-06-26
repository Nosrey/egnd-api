/* eslint-disable no-multi-assign */
/* eslint-disable no-dupe-else-if */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import MySpinner from 'components/shared/loaders/MySpinner';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser } from 'services/Requests';
import TableMargen from './TableMargen';

const { TabNav, TabList } = Tabs;

function MargenBruto() {
  const [defaultCountry, setDefaultCountry] = useState('');
  const [infoForm, setInfoForm] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [costoData, setCostoData] = useState([]);
  const [volumenData, setVolumenData] = useState([]);
  const [precioData, setPrecioData] = useState([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [country, setCountry] = useState(defaultCountry);
  const currency = useSelector((state) => state.auth.user.currency);
  const currentState = useSelector((state) => state.auth.user);
  const [products, setProducts] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [showFaltaPrecioMssg, setShowFaltaPrecioMssg] = useState(false);
  const [showFaltaVolumenMssg, setShowFaltaVolumenMssg] = useState(false);
  
  const [showFaltaInfoMssg, setShowFaltaInfoMssg] = useState(false);

  const showMultiplicacionPxQ = (dataVolumen, dataPrecio) => {
    for (let i = 0; i < dataVolumen.length; i++) {
      // entro a cada pais
      for (let x = 0; x < dataVolumen[i].stats.length; x++) {
        // a cada canal
        for (let j = 0; j < dataVolumen[i].stats[x].productos.length; j++) {
          // cada producto
          for (
            let t = 0;
            t < dataVolumen[i].stats[x].productos[j].años.length;
            t++
          ) {
            // año
            const totalesAnio = [];
            MONTHS.forEach((month) => {
              // OBTENGO EL VALOR DE CADA OUTPUT QUE ES PRECIO X VOLUMEN
              const volMes =
                dataVolumen[i].stats[x].productos[j].años[t].volMeses[month];
              const precioMes =
                dataPrecio[i].stats[x].productos[j].años[t].volMeses[month];
              const ventaMes = (dataVolumen[i].stats[x].productos[j].años[
                t
              ].volMeses[month] =
                parseInt(volMes, 10) * parseInt(precioMes, 10));
              totalesAnio.push(ventaMes);
              return ventaMes;
            });
            const totalVentasAnual = totalesAnio.reduce((a, b) => a + b, 0); // CALCULO EL TOTAL POR Anio
            dataVolumen[i].stats[x].productos[j].años[t].ventasTotal =
              totalVentasAnual;
          }
        }
      }
    }
    return dataVolumen;
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (
          data?.volumenData.length !== 0 &&
          data?.precioData.length !== 0 &&
          data?.costoData.length !== 0
        ) {
          // Para que no haya cruce de datos entre pais, ordeno alfabeticamente data de volumen antes de guardarla
          const ordererCostoData = data?.costoData.sort((a, b) =>
            a.countryName.localeCompare(b.countryName),
          );
          setCostoData(ordererCostoData);

          const vol = JSON.parse(localStorage.getItem("volumenData"))
          const ordererVolData = vol.sort((a, b) =>
          a.countryName.localeCompare(b.countryName),
          );
          setVolumenData(ordererVolData);

          const ordererPcioData = data?.precioData.sort((a, b) =>
          a.countryName.localeCompare(b.countryName),
          );
          setPrecioData(ordererPcioData);
          
          const datosPrecargados = {};
          let dataVentas = showMultiplicacionPxQ(
            data?.volumenData.sort((a, b) =>
              a.countryName.localeCompare(b.countryName),
            ),
            data?.precioData.sort((a, b) =>
              a.countryName.localeCompare(b.countryName),
            ),
          );
          for (let i = 0; i < dataVentas.length; i++) {
            datosPrecargados[dataVentas[i].countryName] = dataVentas[i].stats;
          }
          setInfoForm(() => ({ ...datosPrecargados }));
          setProducts(data?.assumptionData[0].productos);
        } else if (data?.volumenData.length === 0) {
          setShowFaltaVolumenMssg(true);
        } else if (data?.precioData.length === 0) {
          setShowFaltaPrecioMssg(true);
        } else if (data?.costoData.length === 0) {
          setShowFaltaInfoMssg(true);
        }
        setDefaultCountry(data?.assumptionData[0]?.paises[0]?.value);
        setCountry(data?.assumptionData[0]?.paises[0]?.value);
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      {
      showLoader ? (
        <MySpinner />
      ) : (
        <>
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
              <h4 className='cursor-default'>Margen Bruto</h4>
              <span className='cursor-default'>Costos directos y Margen Bruto</span>
            </div>

            <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
              <div className="border-b-2 px-4 py-1">
                <h6 className="cursor-default">Listado de productos / servicios</h6>
              </div>
              <div  className=" px-4 py-1">
                <span className="text-xs cursor-default">*Recuerde que si ve valores en 0 es posible que pare ese item le esté faltando cargar información de Precio, Cantidad y Volumen o Costos Unitarios para poder realizar los cálculos. 
      </span>
              </div>
              {infoForm ? (
                <Tabs defaultValue={defaultCountry}>
                  <TabList>
                    {infoForm &&
                      Object.keys(infoForm).map((pais, index) => (
                        <TabNav key={index} value={pais}>
                          <div
                            className="capitalize"
                            onClick={() => setCountry(pais)}
                          >
                            {pais}
                          </div>
                        </TabNav>
                      ))}
                  </TabList>
                  {infoForm && (
                    <div className="container-countries">
                      <FormContainer className="cont-countries">
                        <ContainerScrollable
                          contenido={
                            <TableMargen
                              data={infoForm}
                              costoData={costoData}
                              volumenData={volumenData}
                              precioData={precioData}
                              productos={products}
                              showAlertSuces={(boolean) =>
                                setShowSuccessAlert(boolean)
                              }
                              showAlertError={(boolean) => setShowErrorAlert(boolean)}
                              country={country}
                              currency={currency}
                            />
                          }
                        />
                      </FormContainer>
                    </div>
                  )}
                </Tabs>
              ) : (
                <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
                  {showFaltaPrecioMssg && (
                    <span className="text-center cursor-default">
                      Para ver esta información debe completar el formulario de{' '}
                      <Link className="text-indigo-700 underline" to="/precio">
                        Precio
                      </Link>
                      .
                    </span>
                  )}
                  {showFaltaVolumenMssg && (
                    <span className="text-center cursor-default">
                      Para ver esta información debe completar el formulario de{' '}
                      <Link className="text-indigo-700 underline" to="/volumen">
                        Volumen
                      </Link>
                      .
                    </span>
                  )}
                  {showFaltaInfoMssg && (
                    <span className="text-center cursor-default">
                      Para acceder a este formulario primero debe completar los
                      formularios de{' '}
                      <Link className="text-indigo-700 underline" to="/costo">
                        Costo
                      </Link>
                      .
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </>)}
    </>
  );
}

export default MargenBruto;
