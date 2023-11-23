import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { AÑOS } from 'constants/forms.constants';
import { puestos } from 'constants/puestos.constant';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MySpinner from 'components/shared/loaders/MySpinner';
import { createPuestospxq, getUser } from 'services/Requests';
import TablePuestosPxQ from './TablePuestosPxQ';

const { TabNav, TabList } = Tabs;

function PuestosPxQ() {
  const [info, setInfo] = useState(null);
  const [puestosQ, setPuestosQ] = useState([]);
  const [visibleP, setVisibleP] = useState(false);
  const [cargaSocial, setCargaSocial] = useState(0);
  const [defaultCountry, setDefaultCountry] = useState('');
  const [infoForm, setInfoForm] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [country, setCountry] = useState(defaultCountry);
  const currentState = useSelector((state) => state.auth.user);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let estructura = {};
    if (info) {
      Object.keys(puestosQ).map((cc, index) => {
        let heads = [];
        for (let i = 0; i < puestos[0][cc]?.length; i++) {
          let head = {};
          head.id = i;
          head['años'] = [...AÑOS];
          head.name = puestos[0][cc][i];
          head.isNew = false;
          head.precioInicial = 0;
          head.cargaSocial = 0;
          head.total = 0;
          heads.push(head);
          let h = {};
          h.visible = puestosQ[cc];
          h.puestos = [...heads];

          estructura[cc] = { ...h };
        }
      });
      setInfoForm(() => ({ ...estructura }));
    }
  }, [info]);

  const postPuestosPxQData = (data) => {
    createPuestospxq(data)
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setErrorMessage('No se puedieron guardar los datos.');
        showErrorAlert(true);
        setTimeout(() => {
          showErrorAlert(false);
        }, 5000);
      });
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        let def;
        if (data?.puestosPData[0]) setVisibleP(true);
        if (data?.puestosPData[0] && data?.puestosQData[0]) {
          console.log("aca")
          setPuestosQ(data?.puestosQData[0].puestosq[0]);
          setInfoForm(data?.puestosPData[0].puestosp[0]);
          def = Object.keys(data?.puestosPData[0].puestosp[0]).find(
            (p) =>
              data?.puestosPData[0].puestosp[0][p].visible &&
              data?.puestosPData[0].puestosp[0][p],
          );
          setDefaultCountry(def);
          setCountry(def);
          setCargaSocial(data?.gastosGeneralData[0] ? data?.gastosGeneralData[0].cargasSociales : 0 );
        } else if ( data?.gastosGeneralData[0] && data?.gastosGeneralData[0].centroDeGastos.length !== 0) {
          if (data?.puestosQData[0]) {
            setPuestosQ(data?.puestosQData[0].puestosq[0]);
          } else {
            setPuestosQ(data?.gastosGeneralData[0].centroDeGastos);
          }
          setInfo(data?.gastosGeneralData[0].centroDeGastos);
          def = Object.keys(data?.gastosGeneralData[0].centroDeGastos).find(
            (p) => data?.gastosGeneralData[0].centroDeGastos[p],
          );
          setDefaultCountry(def);
          setCountry(def);
          setCargaSocial(data?.gastosGeneralData[0] ? data?.gastosGeneralData[0].cargasSociales : 0);
        }
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      {showLoader ? (
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
                  {errorMessage}
                </Alert>
              )}
              <div className="border-b-2 mb-8 pb-1">
                <h4 className="cursor-default">Headcount</h4>
                {/* <span className="cursor-default">Centros de costos</span> */}
              </div>

              <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
                <div className="border-b-2 px-4 py-1">
                  <h6 className="cursor-default">Nómina x Salario</h6>
                </div>
                {infoForm && visibleP ? (
                  <Tabs defaultValue={country}>
                    <TabList>
                      {puestosQ &&
                        Object.keys(infoForm).map(
                          (cc, index) =>
                            infoForm[cc].visible && (
                              <TabNav key={index} value={cc}>
                                <div
                                  className="capitalize"
                                  onClick={() => setCountry(cc)}
                                >
                                  {cc}
                                </div>
                              </TabNav>
                            ),
                        )}
                    </TabList>
                    {infoForm && (
                      <div className="container-countries">
                        <FormContainer className="cont-countries">
                          <ContainerScrollable
                            contenido={
                              <TablePuestosPxQ
                                data={infoForm}
                                puestosQ={puestosQ}
                                showAlertSuces={(boolean) =>
                                  setShowSuccessAlert(boolean)
                                }
                                postPuestoPxQData={postPuestosPxQData}
                                head={country}
                                cargaSocial={cargaSocial}
                              />
                            }
                          />
                        </FormContainer>
                      </div>
                    )}
                  </Tabs>
                ) : visibleP ? (
                  <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
                    <span className="text-center cursor-default">
                      Para acceder a este formulario primero debe completar el
                      formulario de{' '}
                      <Link
                        className="text-indigo-700 underline"
                        to="/supuestos-gastos"
                      >
                        Supuesto de Gasto de Estructura
                      </Link>
                      .
                    </span>
                  </div>
                ) : (
                  <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
                    <span className="text-center cursor-default">
                      Para acceder a este formulario primero debe completar el
                      formulario de{' '}
                      <Link className="text-indigo-700 underline" to="/salarios">
                        Salarios
                      </Link>
                      .
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>)}
    </>
  );
}

export default PuestosPxQ;
