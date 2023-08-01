import React from 'react';
import { MenuItem, Select } from 'components/ui';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarraDos from 'components/shared/dashboard/GraficoDeBarraDos';

import Total from 'components/shared/dashboard/Total';
import GraficoDeBarraTres from 'components/shared/dashboard/GraficoDeBarraTres';
import GraficoDeBarra from 'components/shared/dashboard/GraficoDeBarra';
import BarraDeProgreso from 'components/shared/dashboard/BarraDeProgreso';
import ProgresoCircular from 'components/shared/dashboard/ProgresoCircular';

function DashboardMargenBruto() {
  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Dashboard de Margen Bruto</h4>
        <span>Costos directos</span>
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
            <Total title="Margen Bruto Nominal" data={123} />
          </div>
          <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
            <CardNumerica
              type="default"
              title="Margen Bruto por Cliente"
              cantidad={12}
            />
          </div>

          <div className=" mt-[40px]">
            <h5>Proyección Margen Bruto Nominal</h5>
            <div className="flex w-[100%] gap-[30px] ">
              <div className="w-[50%]">
                <GraficoDeBarra
                  data={{ brasil: [] }}
                  yearSelected="año 1"
                  periodoSelected="1er mes"
                />
              </div>
              <ProgresoCircular
                className="h-[70%]"
                title="Margen Bruto Porcentual"
                data={12}
              />
            </div>
          </div>

          <div className="flex gap-[30px] mt-[40px]">
            <div className="w-[50%] flex flex-col gap-[30px]">
              <h5>Margen Bruto por País</h5>
              <BarraDeProgreso
                data={{ brasil: [] }}
                totalVentas={12}
                selectYear="año 1"
                periodoSelected="1er mes"
              />
            </div>
            <div className="w-[50%] flex flex-col gap-[30px]">
              <h5>Margen Bruto por Canal</h5>
              <BarraDeProgreso
                data={{ brasil: [] }}
                totalVentas={12}
                selectYear="año 1"
                periodoSelected="1er mes"
              />
            </div>
          </div>

          <div className="flex gap-[30px] mt-[40px]">
            <div className="w-[50%] flex flex-col gap-[30px]">
              <h5>Margen Bruto por Producto</h5>
              <BarraDeProgreso
                data={{ brasil: [] }}
                totalVentas={12}
                selectYear="año 1"
                periodoSelected="1er mes"
              />
            </div>
            <div className="w-[50%] flex flex-col gap-[30px]">
              <h5>Margen Bruto por Servicio</h5>
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
