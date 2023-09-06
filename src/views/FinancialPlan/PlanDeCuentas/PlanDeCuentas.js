/* eslint-disable no-return-assign */
import ContainerScrollable from 'components/shared/ContainerScrollable';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMedia } from 'utils/hooks/useMedia';
import { PlanCuentasInfo } from 'constants/cuentas.constant';
import TablePlanDeCuentas from './TablePlanDeCuentas';

function PlanDeCuentas() {
  const [cuentas, setCuentas] = useState(PlanCuentasInfo);
  const media = useMedia();

  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4 className="cursor-default">Plan de Cuentas</h4>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="border-b-2 px-4 py-1">
          <h6 className="cursor-default">Cuentas</h6>
        </div>
        {media === 'mobile' && cuentas.length !==0  ? (
          <ContainerScrollable
            contenido={
              <TablePlanDeCuentas
                cuentas={cuentas}
              />
            }
          />
        ) : (
          <TablePlanDeCuentas
           
            cuentas={cuentas}
            
          />
        )}
      </div>
    </div>
  );
}

export default PlanDeCuentas;
