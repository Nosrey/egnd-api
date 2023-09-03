import React from 'react';
import BarraDeProgreso from 'components/shared/dashboard/BarraDeProgreso';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarra from 'components/shared/dashboard/GraficoDeBarra';
import ProgresoCircular from 'components/shared/dashboard/ProgresoCircular';
import Total from 'components/shared/dashboard/Total';
import { Select } from 'components/ui';
import { useMedia } from 'utils/hooks/useMedia';

function DashboardMargenBruto() {
  const media = useMedia();

  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Dashboard de Margen Bruto</h4>
        <span>Costos directos</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="px-4 py-5 pb-[60px]">
          <div className="flex justify-end gap-[20px]">
            <Select className="w-[12%] min-w-[115px]" placeholder="Año">
              Año
            </Select>

            <Select className="w-[12%] min-w-[115px]" placeholder="Periodo">
              Periodo
            </Select>
          </div>
          <div className="mt-[30px] mb-[30px] cursor-default">
            <Total title="Margen Bruto Nominal" data={123} />
          </div>
          <div className={`${media === "mobile" ? "": "grid grid-cols-3 "}  gap-[20px] mt-[20px]`}>
            <CardNumerica
              type="default"
              title="Margen Bruto por Cliente"
              hasCurrency
              cantidad={12}
            />
          </div>

          <div className=" mt-[40px]">
            <h5 className='cursor-default'>Proyección Margen Bruto Nominal</h5>
            <div className={`flex ${media === "mobile" ? "flex-col": ""} w-[100%] gap-[30px]  justify-between`}>
              <div className={`${media === "mobile" ? "w-[100%]": "w-[60%]"} `}>
                <GraficoDeBarra
                  data={{ brasil: [] }}
                  yearSelected="año 1"
                  periodoSelected="1er mes"
                />
              </div>
              <ProgresoCircular
                className={`${media === "mobile" ? "h-[70%]": "h-[60%]"} `}
                ancho={`${media === "mobile" ? "w-[100%]": ""} `}
                title="Margen Bruto Porcentual"
                data={12}
              />
            </div>
          </div>

          <div className={`flex gap-[30px] mt-[50px] ${media === "mobile" ? "flex-col": ""} `}>
            <div className={` ${media === "mobile" ? "w-[100%]": "w-[50%]"} flex flex-col gap-[30px]`}>
              <h5 className='cursor-default'>Margen Bruto por País</h5>
              <BarraDeProgreso
                data={{ brasil: [] }}
                totalVentas={12}
                selectYear="año 1"
                periodoSelected="1er mes"
              />
            </div>
            <div className={` ${media === "mobile" ? "w-[100%]": "w-[50%]"} flex flex-col gap-[30px]`}>
              <h5 className='cursor-default'>Margen Bruto por Canal</h5>
              <BarraDeProgreso
                data={{ brasil: [] }}
                totalVentas={12}
                selectYear="año 1"
                periodoSelected="1er mes"
              />
            </div>
          </div>

          <div className={`flex gap-[30px] mt-[40px] ${media === "mobile" ? "flex-col": ""} `}>
          <div className={` ${media === "mobile" ? "w-[100%]": "w-[50%]"} flex flex-col gap-[30px]`}>
              <h5 className='cursor-default'>Margen Bruto por Producto</h5>
              <BarraDeProgreso
                data={{ brasil: [] }}
                totalVentas={12}
                selectYear="año 1"
                periodoSelected="1er mes"
              />
            </div>
            <div className={` ${media === "mobile" ? "w-[100%]": "w-[50%]"} flex flex-col gap-[30px]`}>
              <h5 className='cursor-default'>Margen Bruto por Servicio</h5>
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
  );
}

export default DashboardMargenBruto;
