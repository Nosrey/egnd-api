import React, { useEffect, useState } from 'react';
import BarraDeProgreso from 'components/shared/dashboard/BarraDeProgreso';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarra from 'components/shared/dashboard/GraficoDeBarra';
import ProgresoCircular from 'components/shared/dashboard/ProgresoCircular';
import Total from 'components/shared/dashboard/Total';
import { Select } from 'components/ui';
import GraficoDeBarraGastos from 'components/shared/dashboard/GraficoDeBarraGastos';
import MySpinner from 'components/shared/loaders/MySpinner';

function DashboardGastos() {
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
            <h4 className="cursor-default">Dashboard de Gastos de Estructura</h4>
            <span className="cursor-default">Gastos de Estructura</span>
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
                <Total title="Gastos Totales" data={123} />
              </div>
              <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
                <CardNumerica
                  type="default"
                  title="Nuevos clientes"
                  cantidad={12}
                />
              </div>

              <div className=" mt-[40px]">
                <h5>Distribución de Gasto por mes</h5>
                <div className="flex w-[100%] gap-[30px] items-center">
                  <div className="w-[50%]">
                    <GraficoDeBarra
                      data={{ brasil: [] }}
                      yearSelected="año 1"
                      periodoSelected="1er mes"
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center gap-[20px] w-[50%]">
                    <ProgresoCircular
                      ancho={100}
                      title="Gasto en MKT sobre Ventas"
                      data={12}
                    />
                    <ProgresoCircular
                      ancho={100}
                      title="Costo de Adquisición por Cliente"
                      data={12}
                    />
                  </div>
                </div>
              </div>

              <div className=" mb-[50px] flex flex-col gap-[30px] mt-[100px] ">
                <h5 className="cursor-default pl-[20px]">
                  Distribución de gasto por Centro de Costo
                </h5>
                <GraficoDeBarraGastos />
              </div>

              <div className="flex gap-[30px] mt-[40px]">
                <h5>TOP 3 Cuentas Contables con más gasto</h5>
                <div className="w-[50%] flex flex-col gap-[30px]">
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
        </div>
        </>
      )}
      </>
    
  );
}

export default DashboardGastos;
