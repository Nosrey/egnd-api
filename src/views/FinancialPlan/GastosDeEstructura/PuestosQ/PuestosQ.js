import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { AÑOS } from 'constants/forms.constants';
import { puestos } from 'constants/puestos.constant';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MySpinner from 'components/shared/loaders/MySpinner';
import { createPuestosp, createPuestosq, getUser } from 'services/Requests';
import TablePuestosQ from './TablePuestosQ';

const { TabNav, TabList } = Tabs;

function PuestosQ() {
  const [info, setInfo] = useState(null);
  const [puestosQ, setPuestosQ] = useState([]);
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
      let puestosCopy = [...puestos];
      Object.keys(puestosQ).map((cc, index) => {
        if (puestos[0][cc] === undefined) {
          puestosCopy[0] = { ...puestosCopy[0], [cc]: [] };
        }
        let heads = [];
        for (let i = 0; i < puestosCopy[0][cc]?.length; i++) {
          let head = {};
          head.id = i;
          head['años'] = [...AÑOS];
          head.name = puestosCopy[0][cc][i];
          head.precioInicial = 0;
          head.incremento = 0;
          head.cargaSocial = 0;
          head.isNew = false;
          heads.push(head);
          let h = {};
          h.visible = puestosQ[cc];
          h.puestos = [...heads];

          estructura[cc] = { ...h };
        }
        if (puestosCopy[0][cc]?.length === 0) {
          estructura[cc] = {
            puestos: [],
            visible: puestosQ[cc],
          };
        }
      });
      setInfoForm(() => ({ ...estructura }));
    }
  }, [info]);

  const addPuesto = (newPuesto) => {
    const news = infoForm[country].puestos.filter((p) => p.isNew);
    if (news.length < 3) {
      infoForm[country].puestos.push(newPuesto);
      setInfoForm({ ...infoForm });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('Solo se pueden agregar 3 puestos');
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    }
  };

  const postPuestoQData = (data) => {
    let idUser = localStorage.getItem('userId');
    const info = { info: data, idUser };

    createPuestosq(info)
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
        compareData(info, idUser);
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

  const handleEditPuesto = (index, value, campo) => {
    index[campo] = value;
    setInfoForm({ ...infoForm });
  };

  const removePuesto = (campo, id, puesto) => {
    const newP = campo.filter((item) => id !== item.id);
    infoForm[puesto].puestos = newP;
    setInfoForm({ ...infoForm });
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        let def;
        if (data?.puestosQData[0]) {
          setPuestosQ(data?.puestosQData[0].puestosq[0]);
          setInfoForm(data?.puestosQData[0].puestosq[0]);
          def = Object.keys(data?.puestosQData[0].puestosq[0]).find(
            (p) =>
              data?.puestosQData[0].puestosq[0][p].visible &&
              data?.puestosQData[0].puestosq[0][p],
          );
        }      
        else if (data?.gastosGeneralData[0] && data?.gastosGeneralData[0]?.centroDeGastos.length !== 0) {
          setPuestosQ(data?.gastosGeneralData[0].centroDeGastos);
          setInfo(data?.gastosGeneralData[0].centroDeGastos);
          def = Object.keys(data?.gastosGeneralData[0].centroDeGastos).find(
            (p) => data?.gastosGeneralData[0].centroDeGastos[p],
          );
        }

        setDefaultCountry(def);
        setCountry(def);
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const compareData = (data, idUser) => {
    const pp = JSON.parse(localStorage.getItem('puestoPData'));
    let updatedData = { ...data.info[0] };

    Object.keys(updatedData).map((u) => {
      Object.values(updatedData[u].puestos).map((p, index) => {
        if (pp[0].puestosp[0][u].puestos[index]) {
          if (p.name === pp[0].puestosp[0][u].puestos[index].name) {
            p.cargaSocial = pp[0].puestosp[0][u].puestos[index].cargaSocial;
            p.incremento = pp[0].puestosp[0][u].puestos[index].incremento;
            p.precioInicial = pp[0].puestosp[0][u].puestos[index].precioInicial;
            p.total = pp[0].puestosp[0][u].puestos[index].total;
          } else if (p.name === pp[0].puestosp[0][u].puestos[index + 1].name) {
            p.cargaSocial = pp[0].puestosp[0][u].puestos[index + 1].cargaSocial;
            p.incremento = pp[0].puestosp[0][u].puestos[index + 1].incremento;
            p.precioInicial =
              pp[0].puestosp[0][u].puestos[index + 1].precioInicial;
            p.total = pp[0].puestosp[0][u].puestos[index + 1].total;
          }
        }
      });
    });

    const info = { info: updatedData, idUser };

    createPuestosp(info);
  };

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
            <h4 className="cursor-default">Proyección nomina</h4>
            <span className="cursor-default">Headcount</span>
          </div>

          <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
            <div className="border-b-2 px-4 py-1">
              <h6 className="cursor-default">Cantidad por puesto</h6>
            </div>
            {infoForm ? (
              <Tabs defaultValue={country}>
                <TabList>
                  {puestosQ &&
                    Object.keys(puestosQ).map(
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
                          <TablePuestosQ
                            data={infoForm}
                            puestosQ={puestosQ}
                            showAlertSuces={(boolean) =>
                              setShowSuccessAlert(boolean)
                            }
                            postPuestoQData={postPuestoQData}
                            addPuesto={addPuesto}
                            removePuesto={removePuesto}
                            showAlertError={(boolean) => setShowErrorAlert(boolean)}
                            errorMessage={(error) => setErrorMessage(error)}
                            head={country}
                            handleEditPuesto={handleEditPuesto}
                          />
                        }
                      />
                    </FormContainer>
                  </div>
                )}
              </Tabs>
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

export default PuestosQ;
