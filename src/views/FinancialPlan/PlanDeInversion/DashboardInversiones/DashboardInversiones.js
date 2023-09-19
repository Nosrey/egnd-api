import React , { useEffect, useState }from 'react';
import BarraDeProgreso from 'components/shared/dashboard/BarraDeProgreso';
import GraficoDeBarra from 'components/shared/dashboard/GraficoDeBarra';
import Total from 'components/shared/dashboard/Total';
import { Select } from 'components/ui';
import GraficoDashed from 'components/shared/dashboard/GraficoDashed';
import MySpinner from 'components/shared/loaders/MySpinner';

function DashboardInversiones() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
      // ************************************************************
    // COLOCAR ESTE SETEO DE ESTADO AL FINAL DEL .THEN EN MI PETICION GET USER INFO
    setShowLoader(false);
      // ************************************************************
    // ************************************************************
  }, [])
  return (
    <>
    {showLoader ? (
      <MySpinner />
    ) : (
      <>
        <div>
          <div className="border-b-2 mb-8 pb-1">
            <h4 className="cursor-default">Dashboard de CAPEX</h4>
            <span className="cursor-default">Inversiones</span>
          </div>
          <div className="border-solid border-2 border-#e5e7eb rounded-lg">
            <div className="px-4 py-5">
              <div className="flex justify-end gap-[20px]">
                <Select className="w-[12%]" placeholder="Año">
                  Año
                </Select>

                <Select className="w-[12%]" placeholder="Periodo">
                  Periodo
                </Select>
              </div>
              <div className="mt-[30px] mb-[30px] cursor-default">
                <Total title="CAPEX total" data={123} />
              </div>

              <div className=" mt-[40px]">
                <h5>Distribución de CAPEX por mes</h5>

                <GraficoDeBarra
                  data={{ brasil: [] }}
                  yearSelected="año 1"
                  periodoSelected="1er mes"
                />
              </div>

              <div className=" mt-[40px]">
                <h5>Evolución de CAPEX por rubro</h5>
                <GraficoDashed />
              </div>

              <div className="mt-[40px]">
                <h5>CAPEX por país</h5>
                <BarraDeProgreso
                  data={{ brasil: [] }}
                  totalVentas={12}
                  selectYear="año 1"
                  periodoSelected="1er mes"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  
  );
}

export default DashboardInversiones;
