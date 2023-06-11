/* eslint-disable no-lonely-if */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser } from 'services/Requests';
import TableCapexPxQ from './TableCapexPxQ';

function CapexPxQ() {
  const [capexP, setCapexP] = useState([]);
  const [capexQ, setCapexQ] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentState = useSelector((state) => state.auth.user);

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data.capexPData[0].length !== 0) {
          setCapexP(data.capexPData[0].capexP);
        }
        if (data.capexQData[0].length !== 0) {
          setCapexQ(data.capexQData[0].capexQ);
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
        <h4>Visualización de Inversiones</h4>
        <span>Inversiones</span>
      </div>

      <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
        <div className="border-b-2 px-4 py-1">
          <h6>Bienes</h6>
        </div>
        {capexP.length !== 0 ? (
          <Tabs>
            {capexP && (
              <div className="container-countries">
                <FormContainer className="cont-countries">
                  <ContainerScrollable
                    contenido={
                      <TableCapexPxQ
                        capexP={capexP}
                        capexQ={capexQ}
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
        ) : capexP.length === 0 ? (
          <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
            <span>
              Para acceder a este formulario primero debe completar el
              formulario de{' '}
              <Link className="text-indigo-700 underline" to="/capexp">
                Capex P
              </Link>{' '}
              .
            </span>
          </div>
        ) : (
          <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
            <span>
              Para acceder a este formulario primero debe completar el
              formulario de{' '}
              <Link className="text-indigo-700 underline" to="/volumen-inversion">
                Volumen de Inversiones
              </Link>{' '}
              .
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CapexPxQ;
