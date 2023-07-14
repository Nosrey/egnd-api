/* eslint-disable no-unused-expressions */
/* eslint-disable no-lonely-if */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { AÑOS2, AÑOS3 } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createCapexP, createCapexQ, getUser } from 'services/Requests';
import { v4 as uuid } from 'uuid';
import TableCapexQ from './TableCapexQ';

function CapexQ() {
  const [bienes, setBienes] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [capexP, setCapexP] = useState([]);
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

  const validateData = (info) => {
    let data = JSON.parse(JSON.stringify(info));
    data = [data];

    Object.values(data[0]).map((d) => {
      const find = capexP.capexP.find((c) => c.id === d.id);
      if (find) {
        d.precioInicial = find.precioInicial;
        d.tasa = find.tasa;
        d.incremento = find.incremento;
        d.años = find.años;
      } else {
        d.precioInicial = 0;
        d.tasa = 0;
        d.incremento = 'mensual';
        d.años = [...AÑOS3];
      }
    });

    const f = [];

    Object.values(data[0]).map((d) => {
      f.push(d);
    });

    let idUser = localStorage.getItem('userId');
    const inf = { info: f, idUser };

    createCapexP(inf);
  };

  const submit = () => {
    const isEmpty = validateEmptyInputs();

    if (!isEmpty) {
      let idUser = localStorage.getItem('userId');
      const info = { info: bienes, idUser };

      createCapexQ(info)
        .then(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 5000);
          validateData(info.info);
        })
        .catch((error) => {
          console.log('err', error);
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
        if (data.capexPData[0]) {
          setCapexP(data.capexPData[0]);
        }
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
        <h4>Estimación de volumen de Inversiones</h4>
        <span>Inversiones</span>
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
