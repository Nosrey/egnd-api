import React from 'react';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import SelectOptions from 'components/shared/dashboard/SelectOptions';
import Total from 'components/shared/dashboard/Total';
import { Select } from 'components/ui';
import GraficoDeBarraDos from 'components/shared/dashboard/GraficoDeBarraDos';

function DashboardCostos() {
  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Dashboard de Costos</h4>
        <span>Costos directos</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="px-4 py-5">
          <div className="flex justify-end gap-[20px]">
            <Select
              className="w-[12%]"
              placeholder="Año"
              //   options={año}
              //   onChange={selectYear}
            >
              {/* {año.map((a) => (
                <MenuItem key={a.value} value={a.value}>
                  {a.name}
                </MenuItem>
              ))} */}
            </Select>
            <SelectOptions options={1} placehol="Periodo" />
          </div>
          <div className="mt-[30px] mb-[30px] cursor-default">
            <Total title="Costos Totales" data={12} />
          </div>
          <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
            <CardNumerica
              type="default"
              title="Costo total productos"
              cantidad={12}
            />
            <CardNumerica
              type="default"
              title="Volumen de productos"
              cantidad={12}
            />
            <CardNumerica
              type="default"
              title="Costo medio por producto"
              cantidad={44}
            />
            <CardNumerica
              type="default"
              title="Costo de servicios"
              cantidad={34}
            />
            <CardNumerica
              type="default"
              title="Volumen de servicios"
              cantidad={56}
            />
            <CardNumerica
              type="default"
              title="Costo medio por servicio"
              cantidad={56}
            />
          </div>
          <div className="flex justify-between items-center mt-[100px] pl-[20px]">
            <h5 className='cursor-default'>Representación de Costos sobre Ventas</h5>
            <div className="flex gap-[20px]">
              <Select className="w-[100%]" placeholder="Producto" />
              <Select className="w-[100%]" placeholder="Canal" />
              <Select className="w-[100%]" placeholder="País" />
            </div>
          </div>
          <div className="mt-[50px] mb-[50px]">
            <GraficoDeBarraDos />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCostos;
