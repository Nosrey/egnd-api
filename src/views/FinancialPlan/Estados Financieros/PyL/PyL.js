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
import { showMultiplicacionPxQ } from 'utils/calcs';
import formatNumber from 'utils/formatTotalsValues';
import { modifyDataWithInitialClients } from 'utils/hoc/clientsCalcs';
import TablePyL from '../TablePyL';

function PyL() {
  const [showLoader, setShowLoader] = useState(false);
  const currentState = useSelector((state) => state.auth.user);
 

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
              P & L
            </h4>
            <span className="cursor-default">Estados Financieros</span>
          </div>
          <div className="container-countries">
            <FormContainer className="cont-countries">
              <ContainerScrollable
                contenido={
                  <TablePyL
                    cac={[1000, 399, 3554, 34544, 4444, 32324, 343434, 343434, 334, 34344]}
                    ltv={[1000, 399, 3554, 34544, 4444, 32324, 343434, 343434, 334, 34344]}
                    ltvcac={[1000, 399, 3554, 34544, 4444, 32324, 343434, 343434, 334, 34344]}
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

export default PyL;
