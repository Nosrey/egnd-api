import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { AÑOS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser } from 'services/Requests';
import TableCosto from './TableCosto';

const { TabNav, TabList } = Tabs;

function Costo() {
  const [info, setInfo] = useState(null);
  const [defaultCountry, setDefaultCountry] = useState('');
  const [visibleData, setVisibleData] = useState(false);
  const [visibleVolume, setVisibleVolume] = useState(false);
  const [visiblePrecio, setVisiblePrecio] = useState(false);
  const [visibleCosto, setVisibleCosto] = useState(false);
  const [volumenData, setVolumenData] = useState();
  const [precioData, setPrecioData] = useState();
  const [products, setProducts] = useState([]);
  const [costoData, setCostoData] = useState();
  const [infoForm, setInfoForm] = useState();
  const [indexCountry, setIndexCountry] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const currency = useSelector((state) => state.auth.user.currency);
  const currentState = useSelector((state) => state.auth.user);

  useEffect(() => {
    const estructura = {};
    if (info && info[0]) {
      for (let i = 0; i < info[0]?.paises.length; i++) {
        const productos = [];
        const realProds = info[0]?.productos;
        for (let x = 0; x < realProds.length; x++) {
          const prod = {};
          prod.id = realProds[x].id;
          prod.volInicial = 0;
          prod.comision = 0;
          prod.impuesto = 0;
          prod.cargos = 0;
          prod.precioInicial = 0;
          prod.tasa = 0;
          prod.name = realProds[x].name;
          prod.type = realProds[x].type;
          prod.inicioMes = 1;
          prod.fecha = '';
          prod['años'] = [...AÑOS];
          productos.push(prod);
        }
        const canales = [];
        for (let x = 0; x < info[0]?.canales.length; x++) {
          const canal = {};
          canal.canalName = info[0]?.canales[x].name;
          canal.productos = [...productos];
          canales.push(canal);
        }
        estructura[info[0]?.paises[i].value] = [...canales];
      }
      setInfoForm(() => ({ ...estructura }));
    }
  }, [info]);

  const defineCountry = (pais, index) => {
    setDefaultCountry(pais);
    setIndexCountry(index);
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.volumenData.length !== 0) setVisibleVolume(true);
        if (data?.precioData.length !== 0) setVisiblePrecio(true);
        if (data?.costoData.length !== 0) setVisibleCosto(true);

        if (
          data?.volumenData.length !== 0 &&
          data?.precioData.length !== 0 &&
          data?.costoData.length !== 0
        ) {
          setVolumenData(data?.volumenData);
          setPrecioData(data?.precioData);
          setCostoData(data?.costoData);
          setVisibleData(true);
          const datosPrecargados = {};
          if (data?.costoData.length !== 0) {
            for (let i = 0; i < data?.costoData.length; i++) {
              datosPrecargados[data?.costoData[i].countryName] =
                data?.costoData[i].stats;
            }
            setInfoForm(() => ({ ...datosPrecargados }));
          } else {
            setInfo(data?.assumptionData);
          }
        } else {
          setInfo(data?.assumptionData);
          setVisibleData(false);
        }

        setProducts(data?.assumptionData[0].productos);
        setDefaultCountry(data?.assumptionData[0]?.paises[0]?.value);
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
        <h4>Costos Totales</h4>
        <span>Costos directos</span>
      </div>

      <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
        <div className="border-b-2 px-4 py-1">
          <h6>Carga de productos / servicios</h6>
        </div>

        {visibleData ? (
          <Tabs defaultValue={defaultCountry}>
            <TabList>
              {visibleData &&
                Object.keys(infoForm).map((pais, index) => (
                  <TabNav key={index} value={pais}>
                    <div
                      className="capitalize"
                      onClick={() => {
                        defineCountry(pais, index);
                      }}
                    >
                      {pais}
                    </div>
                  </TabNav>
                ))}
            </TabList>
            {visibleData && (
              <div className="container-countries">
                <FormContainer className="cont-countries">
                  <ContainerScrollable
                    contenido={
                      <TableCosto
                        data={infoForm}
                        productos={products}
                        country={defaultCountry}
                        indexCountry={indexCountry}
                        volumenData={volumenData}
                        precioData={precioData}
                        costoData={costoData}
                        showAlertSuces={(boolean) =>
                          setShowSuccessAlert(boolean)
                        }
                        showAlertError={(boolean) => setShowErrorAlert(boolean)}
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
            {!visibleVolume ? (
              <span className="text-center cursor-default">
                Para acceder a este formulario primero debe completar los
                formulario de{' '}
                <Link className="text-indigo-700 underline" to="/volumen">
                  Volumen.
                </Link>
              </span>
            ) : !visiblePrecio ? (
              <span className="text-center cursor-default">
                Para acceder a este formulario primero debe completar los
                formulario de{' '}
                <Link className="text-indigo-700 underline" to="/preciop">
                  Precio.
                </Link>
              </span>
            ) : (
              !visibleCosto && (
                <span className="text-center cursor-default">
                  Para acceder a este formulario primero debe completar los
                  formulario de{' '}
                  <Link className="text-indigo-700 underline" to="/costo">
                    Costo.
                  </Link>
                </span>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Costo;
