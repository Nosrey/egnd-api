/* eslint-disable no-unused-expressions */
/* eslint-disable no-lonely-if */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import MySpinner from 'components/shared/loaders/MySpinner';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createPrestamo, getUser, putPrestamo } from 'services/Requests';
import TableCapexQ from './TablePrestamos';

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [prestamosInit, setPrestamosInit] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [capexP, setCapexP] = useState([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentState = useSelector((state) => state.auth.user);
  const [showLoader, setShowLoader] = useState(true);

  const addPrestamo = (newPrestamo) => {
    if (prestamos.length === 5) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('Se llegó al límite de 5 préstamos');
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    } else {
      setPrestamos([...prestamos, newPrestamo]);
    }
  };

  const validateEmptyInputs = () => {
    let isEmpty = false;
    prestamos.forEach((p) => {
      if (p.titulo === '') {
        isEmpty = true;
      }
    });

    return isEmpty;
  };

  const submit = () => {
    const isEmpty = validateEmptyInputs();
    let idUser = localStorage.getItem('userId');

    if (!isEmpty) {
      prestamos.forEach((p) => {
        if (p._id) {
          putPrestamo(p._id, p).then((resp) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (resp.message === 'Prestamo updated successfully') {
              setShowSuccessAlert(true);
              setTimeout(() => {
                setShowSuccessAlert(false);
              }, 5000);
            } else {
              setErrorMessage('Ha ocurrido un error');
              setShowErrorAlert(true);
              setTimeout(() => {
                setShowErrorAlert(false);
              }, 5000);
            }
          });
        } else {
          createPrestamo(p).then((resp) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (resp.message === 'Prestamo created successfully') {
              setShowSuccessAlert(true);
              setTimeout(() => {
                setShowSuccessAlert(false);
              }, 5000);
            } else {
              setErrorMessage('Ha ocurrido un error');
              setShowErrorAlert(true);
              setTimeout(() => {
                setShowErrorAlert(false);
              }, 5000);
            }
          });
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('Completa los campos vacios');
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    }
  };

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data.prestamos[0]) {
          setPrestamosInit(data.prestamos);
          setPrestamos(data.prestamos);
        } else {
          addPrestamo({
            idUser: localStorage.getItem('userId'),
            titulo: '',
            monto: 0,
            plazo: 0,
            tasaAnual: 0,
            mesInicio: '',
          });
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
      <div className="border-b-2 mb-8 pb-1">
        <h4 className="cursor-default">Préstamos</h4>
        <span className="cursor-default">Gastos Financieros</span>
      </div>

      {showLoader ? (
        <MySpinner />
      ) : (
        <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
          <div className="border-b-2 px-4 py-1">
            <h6 className="cursor-default">Listado de préstamos</h6>
          </div>

          <Tabs>
            {prestamos.length !== 0 && (
              <div className="container-countries">
                <FormContainer className="cont-countries">
                  <ContainerScrollable
                    contenido={
                      <TableCapexQ
                        data={prestamos}
                        addPrestamo={addPrestamo}
                        setPrestamos={setPrestamos}
                        submit={submit}
                        showAlertSuces={(boolean) =>
                          setShowSuccessAlert(boolean)
                        }
                        showAlertError={(boolean) => setShowErrorAlert(boolean)}
                        errorMessage={(error) => setErrorMessage(error)}
                      />
                    }
                  />
                </FormContainer>
              </div>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
}
