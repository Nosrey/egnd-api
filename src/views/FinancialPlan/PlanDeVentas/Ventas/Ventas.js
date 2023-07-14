/* eslint-disable no-multi-assign */
/* eslint-disable no-dupe-else-if */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser } from 'services/Requests';
import { showMultiplicacionPxQ } from 'utils/calcs';
import TableVentas from './TableVentas';

const { TabNav, TabList } = Tabs;

function Ventas() {
  const [defaultCountry, setDefaultCountry] = useState('');
  const [infoForm, setInfoForm] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [country, setCountry] = useState(defaultCountry);
  const currency = useSelector((state) => state.auth.user.currency);
  const currentState = useSelector((state) => state.auth.user);
  const [products, setProducts] = useState([]);
  const [showFaltaPrecioMssg, setShowFaltaPrecioMssg] = useState(false);
  const [showFaltaVolumenMssg, setShowFaltaVolumenMssg] = useState(false);
  const [showFaltaInfoMssg, setShowFaltaInfoMssg] = useState(false);

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.volumenData.length !== 0 && data?.precioData.length !== 0) {
          // tengo info vol y precio precargada
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
        } else if (
          data?.precioData.length === 0 &&
          data?.volumenData.length === 0
        ) {
          setShowFaltaInfoMssg(true);
        }
        setDefaultCountry(data?.assumptionData[0]?.paises[0]?.value);
        setCountry(data?.assumptionData[0]?.paises[0]?.value);
      })
      .catch((error) => console.error(error));
  }, []);

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
        <h4>Ventas Totales</h4>
        <span>Plan de ventas</span>
      </div>

      <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
        <div className="border-b-2 px-4 py-1">
          <h6>Carga de productos / servicios</h6>
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
                      <TableVentas
                        data={infoForm}
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
                <Link className="text-indigo-700 underline" to="/volumen">
                  Volumen
                </Link>{' '}
                y{' '}
                <Link className="text-indigo-700 underline" to="/precio">
                  Precio
                </Link>
                .
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ventas;
