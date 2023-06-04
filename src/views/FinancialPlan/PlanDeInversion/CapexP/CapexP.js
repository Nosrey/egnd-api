/* eslint-disable no-lonely-if */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { Alert, FormContainer, Tabs } from 'components/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUser } from 'services/Requests';
import TableGastosPorCC from './TableCapexP';

function CapexP() {
  const [cargaSocial, setCargaSocial] = useState(0);
  const [bienes, setBienes] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentState = useSelector((state) => state.auth.user);

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data.capexPData[0].length !== 0) {
          setBienes(data.capexPData[0].capexP);
        } else if (data.capexQData[0].length !== 0) {
          setBienes(data.capexQData[0].capexQ);
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
        <h4>Capex P</h4>
        <span>Bienes</span>
      </div>

      <div className="border-solid border-2 border-#e5e7eb rounded-lg relative">
        <div className="border-b-2 px-4 py-1">
          <h6>Precio de bienes</h6>
        </div>
        {bienes.length !== 0 ? (
          <Tabs>
            {bienes && (
              <div className="container-countries">
                <FormContainer className="cont-countries">
                  <ContainerScrollable
                    contenido={
                      <TableGastosPorCC
                        data={bienes}
                        showAlertSuces={(boolean) =>
                          setShowSuccessAlert(boolean)
                        }
                        showAlertError={(boolean) => setShowErrorAlert(boolean)}
                        errorMessage={(error) => setErrorMessage(error)}
                        cargaSocial={cargaSocial}
                      />
                    }
                  />
                </FormContainer>
              </div>
            )}
          </Tabs>
        ) : (
          <div className="py-[25px] bg-[#F6F6F5] flex justify-center rounded-lg mb-[30px]  mt-[30px] ml-[30px] mr-[30px]">
            <span>
              Para acceder a este formulario primero debe completar el
              formulario de{' '}
              <Link className="text-indigo-700 underline" to="/capexq">
                Capex Q
              </Link>{' '}
              .
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CapexP;
