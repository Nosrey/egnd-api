import BarraDeProgreso from 'components/shared/dashboard/BarraDeProgreso';
import CardNumerica from 'components/shared/dashboard/CardNumerica';
import GraficoDeBarra from 'components/shared/dashboard/GraficoDeBarra';
import ProgresoCircular from 'components/shared/dashboard/ProgresoCircular';
import ProgresoCircularScroll from 'components/shared/dashboard/ProgresoCircularScroll';
import Total from 'components/shared/dashboard/Total';
import React from 'react';
import SelectOptions from 'components/shared/dashboard/SelectOptions';

const año = [
  { value: 'año 1', label: 'Año 1' },
  { value: 'año 2', label: 'Año 2' },
  { value: 'año 3', label: 'Año 3' },
  { value: 'año 4', label: 'Año 4' },
  { value: 'año 5', label: 'Año 5' },
  { value: 'año 6', label: 'Año 6' },
  { value: 'año 7', label: 'Año 7' },
  { value: 'año 8', label: 'Año 8' },
  { value: 'año 9', label: 'Año 9' },
  { value: 'año 10', label: 'Año 10' },
  { value: 'todo', label: 'Todo' },
];

const periodo = [
  { value: '1er mes', label: '1er mes' },
  { value: '1er trimestre', label: '1er trimestre' },
  { value: '1er semestre', label: '1er semestre' },
  { value: '2do semestre', label: '2do semestre' },
  { value: 'todo el año', label: 'Todo el año' },
];

function DashboardVentas() {
  const data = [
    {
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380, 320],
    },
  ];

  const churnProducto = [
    { nombre: 'Producto A', numero: 1 },
    { nombre: 'Producto B', numero: 2 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },
    { nombre: 'Producto C', numero: 3 },

    // ...
  ];

  const paisesData = [
    { name: 'Country A', sales: 100 },
    { name: 'Country B', sales: 200 },
    { name: 'Country C', sales: 300 },
    // ...
  ];
  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Dashboard de Ventas</h4>
        <span>Plan de Ventas</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="px-4 py-5">
          <div className="flex justify-end gap-[20px]">
            <SelectOptions options={año} placehol="Año" />
            <SelectOptions options={periodo} placehol="Periodo" />
          </div>
          <div className="mt-[30px] mb-[30px]">
            <Total title="Total de Ventas" data="€145k" />
          </div>
          <div className="grid grid-cols-3 gap-[20px] mt-[20px]">
            <CardNumerica title="Venta de Productos" cantidad={763} />
            <CardNumerica title="Venta de Productos" cantidad={763} />
            <CardNumerica title="Venta de Productos" cantidad={763} />
            <CardNumerica title="Venta de Productos" cantidad={763} />
            <CardNumerica title="Venta de Productos" cantidad={763} />
            <CardNumerica title="Venta de Productos" cantidad={763} />
          </div>
          <div className="flex justify-center gap-[50px] mt-[50px] mb-[40px]">
            <div className="w-[50%]">
              <h5 className="mb-[30px]">Distribución de Ventas por Mes</h5>
              <GraficoDeBarra data={data} />
            </div>
            <div className="w-[50%]">
              <h5 className="mb-[30px]">Distribución de Ventas por País</h5>
              <BarraDeProgreso paises={paisesData} />
            </div>
          </div>
          <div className="flex justify-center gap-[50px] mb-[40px]">
            <ProgresoCircularScroll
              title="Churn Promedio"
              churnProducto={churnProducto}
            />
            <ProgresoCircular title="CAGR" data={78} />
          </div>
          <h5 className="mb-[20px]">Clientes</h5>
          <div className="grid grid-cols-3 gap-[20px] mb-[40px]">
            <CardNumerica title="Venta de Productos" cantidad={763} />
            <CardNumerica title="Venta de Productos" cantidad={763} />
            <CardNumerica title="Venta de Productos" cantidad={763} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardVentas;
