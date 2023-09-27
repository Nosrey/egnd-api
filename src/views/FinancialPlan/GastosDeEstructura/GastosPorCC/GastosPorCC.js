/* eslint-disable no-lonely-if */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import MySpinner from 'components/shared/loaders/MySpinner';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { Cuentas } from 'constants/cuentas.constant';
import { AÑOS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser } from 'services/Requests';
import TableGastosPorCC from './TableGastosPorCC';

const { TabNav, TabList } = Tabs;

function GastosPorCC() {
  const [info, setInfo] = useState(null);
  const [puestosQ, setPuestosQ] = useState([]);
  const [puestosP, setPuestosP] = useState([]);
  const [viewP, setViewP] = useState(false);
  const [cargaSocial, setCargaSocial] = useState(0);
  const [defaultCountry, setDefaultCountry] = useState('');
  const [infoForm, setInfoForm] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [country, setCountry] = useState(defaultCountry);
  const [showLoader, setShowLoader] = useState(true);

  const currentState = useSelector((state) => state.auth.user);

  useEffect(() => {
    let estructura = {};
    if (info) {
      Object.keys(puestosQ).map((cc, index) => {
        let heads = [];
        for (let i = 0; i < Cuentas.length; i++) {
          let head = {};
          head.id = i;
          head['años'] = JSON.parse(JSON.stringify(AÑOS));
          head.name = Cuentas[i];
          head.precioInicial = 0;
          head.tasa = 0;
          head.incremento = 'mensual';
          heads.push(head);
          let h = {};
          h.visible = puestosQ[cc];
          h.cuentas = JSON.parse(JSON.stringify(heads));

          estructura[cc] = JSON.parse(JSON.stringify(h));
        }
      });
      setInfoForm(() => ({ ...estructura }));
    }
  }, [info]);

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.gastosGeneralData.length !== 0) {
          // carge info en assumption gastos
          if (data.gastosPorCCData.length !== 0) {
            // tengo data precargada en este form
            setInfoForm(() => ({
              ...data?.gastosPorCCData[0].centroDeCostos[0],
            }));
          } else {
            // uso la data de assumptions para construir
            if (data?.gastosGeneralData[0].centroDeGastos.length !== 0)
              setInfo(data?.gastosGeneralData[0].centroDeGastos);
          }
          setPuestosQ(data?.gastosGeneralData[0].centroDeGastos);
          let def;
          def = Object.keys(data?.gastosGeneralData[0].centroDeGastos).find(
            (p) => data?.gastosGeneralData[0].centroDeGastos[p],
          );
          if (data?.puestosPData[0]) {
            setPuestosP(data?.puestosPData[0].puestosp[0]);
            setViewP(true);
          }
          setDefaultCountry(def);
          setCountry(def);
          setCargaSocial(data?.gastosGeneralData[0].cargasSociales);
        }
        setShowLoader(false);
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
          {errorMessage}
        </Alert>
      )}
      {showLoader ? (
        <MySpinner />
      ) : (
        <>
          <div className="border-b-2 mb-8 pb-1">
            <h4 className="cursor-default">
              Proyección de Gastos por Centro de Costo
            </h4>
            <span className="cursor-default">Gastos de Estructura</span>
          </div>

          <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
            <div className="border-b-2 px-4 py-1">
              <h6 className="cursor-default">Centros de costo</h6>
            </div>
            {infoForm && viewP ? (
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
                          <TableGastosPorCC
                            data={infoForm}
                            puestosP={puestosP}
                            showAlertSuces={(boolean) =>
                              setShowSuccessAlert(boolean)
                            }
                            showAlertError={(boolean) =>
                              setShowErrorAlert(boolean)
                            }
                            errorMessage={(error) => setErrorMessage(error)}
                            head={country}
                            cargaSocial={cargaSocial}
                          />
                        }
                      />
                    </FormContainer>
                  </div>
                )}
              </Tabs>
            ) : !viewP ? (
              <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
                <span className="cursor-default">
                  Para acceder a este formulario primero debe completar el
                  formulario{' '}
                  <Link className="text-indigo-700 underline" to="/salarios">
                    Salarios
                  </Link>{' '}
                  .
                </span>
              </div>
            ) : (
              <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
                <span className="cursor-default">
                  Para acceder a este formulario primero debe completar el
                  formulario{' '}
                  <Link
                    className="text-indigo-700 underline"
                    to="/supuestos-gastos"
                  >
                    Supuesto de Gasto de Estructura
                  </Link>{' '}
                  .
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default GastosPorCC;
