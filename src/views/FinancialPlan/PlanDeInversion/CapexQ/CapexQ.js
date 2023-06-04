/* eslint-disable no-lonely-if */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { AÑOS2 } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createCapexQ, getUser } from 'services/Requests';
import { v4 as uuid } from 'uuid';
import TableCapexQ from './TableCapexQ';

function CapexQ() {
  const [bienes, setBienes] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentState = useSelector((state) => state.auth.user);

  const addBien = (newBien) => {
    if (bienes.length === 15) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setErrorMessage('Se llegó al límite de 15 bienes');
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
    } else {
      setBienes([...bienes, newBien]);
    }
  };
  const validateEmptyInputs = () => {
    let isEmpty = false;
    bienes.forEach((p) => {
      if (p.bien === '') {
        isEmpty = true;
      }
    });

    return isEmpty;
  };

  const submit = () => {
    const isEmpty = validateEmptyInputs();

    if (!isEmpty) {
      createCapexQ(bienes)
        .then(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showSuccessAlert(true);
          setTimeout(() => {
            showSuccessAlert(false);
          }, 5000);
        })
        .catch((error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setErrorMessage('Ha ocurrido un error');
          setShowErrorAlert(true);
          setTimeout(() => {
            setShowErrorAlert(false);
          }, 5000);
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
        if (data.capexQData[0] && data.capexQData[0]?.length !== 0) {
          setBienes(data.capexQData[0].capexQ);
        } else {
          addBien({
            id: uuid(),
            bien: '',
            descripcion: '',
            precioInicial: 0,
            tasa: 0,
            incremento: 'mensual',
            unidad: '',
            años: [...AÑOS2],
          });
        }
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
        <h4>Capex Q</h4>
        <span>Bienes</span>
      </div>

      <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
        <div className="border-b-2 px-4 py-1">
          <h6>Cantidad de Bienes</h6>
        </div>

        <Tabs>
          {bienes.length !== 0 && (
            <div className="container-countries">
              <FormContainer className="cont-countries">
                <ContainerScrollable
                  contenido={
                    <TableCapexQ
                      data={bienes}
                      addBien={addBien}
                      setBienes={setBienes}
                      submit={submit}
                      showAlertSuces={(boolean) => setShowSuccessAlert(boolean)}
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
    </div>
  );
}

export default CapexQ;
