import React from 'react';
import { MenuItem, Select } from 'components/ui';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarraDos from 'components/shared/dashboard/GraficoDeBarraDos';
import Total from 'components/shared/dashboard/Total';
import GraficoDeBarraTres from 'components/shared/dashboard/GraficoDeBarraTres';
import GraficoDeBarra from 'components/shared/dashboard/GraficoDeBarra';
import BarraDeProgreso from 'components/shared/dashboard/BarraDeProgreso';

import ProgresoCircular from 'components/shared/dashboard/ProgresoCircular';

function DashboardHeadcount() {
  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Dashboard de Headcount</h4>
        <span>Headcount</span>
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
            <Total title="Monto Totales" data={123} />
          </div>
          <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
            <CardNumerica
              type="default"
              title="Cantidad de Personal"
              cantidad={12}
            />
            <CardNumerica
              type="default"
              title="Costo medio por Recurso"
              cantidad={12}
            />
          </div>

          <div className=" mb-[50px] flex flex-col gap-[30px] mt-[100px] ">
            <h5 className="cursor-default pl-[20px]">
              Distribución de Headcount Q por Centro de Costo
            </h5>
            <GraficoDeBarraDos />
          </div>
          <div className="mt-[80px] mb-[50px] flex flex-col gap-[30px]">
            <h5 className="cursor-default pl-[20px]">
            Distribución del gasto en salario por Centro de Costo
            </h5>
            <GraficoDeBarraDos />
          </div>

          <div className="flex gap-[30px] mt-[100px]">
            <div className="w-[30%] flex flex-col gap-[30px]">
              <h5  className="cursor-default pl-[20px]">FTE</h5>
              <CardNumerica
                type="default"
                title="FTE"
                cantidad={12}
              />
            </div>
            <div className="w-[70%] flex flex-col gap-[30px] mt-[50px]">
              <h5  className="cursor-default">Evolución de Headcount</h5>
              <GraficoDeBarraTres
              //   data={}
              />
            </div>
          </div>

          <div className="flex flex-col gap-[30px] mt-[60px]">
            <h5  className="cursor-default pl-[20px]">Evolución FTE por mes</h5>
            <GraficoDeBarra
              data={{ brasil: [] }}
              yearSelected="año 1"
              periodoSelected="1er mes"
            />
          </div>

          <div className="flex gap-[30px] mt-[100px] mb-[50px]">
            <div className="w-[50%] flex flex-col gap-[30px]">
              <h5>Gasto en personal por Centro de Costo</h5>
              <BarraDeProgreso
                data={{ brasil: [] }}
                totalVentas={12}
                selectYear="año 1"
                periodoSelected="1er mes"
              />
            </div>
            <div className="w-[50%] flex flex-col gap-[30px]">
              <h5>Gasto en personal por país</h5>
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

export default DashboardHeadcount;
