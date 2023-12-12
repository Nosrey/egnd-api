/* eslint-disable no-restricted-globals */
/* eslint-disable no-loop-func */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unsafe-optional-chaining */


import ContainerScrollable from 'components/shared/ContainerScrollable';
import MySpinner from 'components/shared/loaders/MySpinner'; 
import { FormContainer } from 'components/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import TableWorkingCapital from './TableWorkingCapital';

function WorkingCapital() {
  const [showLoader, setShowLoader] = useState(false);
  const currentState = useSelector((state) => state.auth.user);

  // INFO A MOSTRAR EN LA TABLA 
//   const [ventasTot, setVentasTot] = useState();

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
       
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
        { 
        // valoresCAC.length !== 0 && valoresLTV.length !== 0 &&  valoresLTVCAC.length !== 0 &&
          <div>
          <div className="border-b-2 mb-8 pb-1">
            <h4 className="cursor-default">
              Working Capital
            </h4>
            <span className="cursor-default">Estados Financieros</span>
          </div>
          <div className="container-countries">
            <FormContainer className="cont-countries">
              <ContainerScrollable
                contenido={
                  <TableWorkingCapital
                    creditosVentas={[100, 340, 444, 230, 140, 30, 499, 670, 190, 300]}
                    bienesDeCambio={[100, 340, 444, 230, 140, 30, 499, 670, 190, 300]}
                    deudasComerciales={[10, 34, 44, 23, 14, 3, 49, 67, 19, 30]}

                    />
                }
              />
            </FormContainer>
          </div>

        </div>
        }
          
        </>
      )}
    </>
  );
}

export default WorkingCapital;
