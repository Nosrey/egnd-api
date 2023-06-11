/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React from 'react';
import authRoute from './authRoute';

export const publicRoutes = [...authRoute];

export const protectedRoutes = [
  {
    key: 'home',
    path: '/home',
    component: React.lazy(() => import('views/Home')),
    authority: [],
  },
  {
    key: 'assumptiongeneral',
    path: '/supuestos-generales',
    component: React.lazy(() =>
      import('views/FinancialPlan/AssumtionsGenerales/AssumptionGeneral'),
    ),
    authority: [],
  },
  {
    key: 'assumptionventas',
    path: '/supuestos-ventas',
    component: React.lazy(() =>
      import(
        'views/FinancialPlan/PlanDeVentas/Assumption Ventas/AssumptionVentas'
      ),
    ),
    authority: [],
  },
  {
    key: 'preciop',
    path: '/precio',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeVentas/Precio P/PrecioP'),
    ),
    authority: [],
  },
  {
    key: 'volumenq',
    path: '/volumen',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeVentas/VolumenQ/VolumenQ'),
    ),
    authority: [],
  },
  {
    key: 'ventas',
    path: '/ventas',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeVentas/Ventas/Ventas'),
    ),
    authority: [],
  },
  {
    key: 'costo',
    path: '/costos-unitarios',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeVentas/Costo/Costo'),
    ),
    authority: [],
  },
  {
    key: 'costopxq',
    path: '/costopxq',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeVentas/Costo PxQ/Costo'),
    ),
    authority: [],
  },
  {
    key: 'plandecuentas',
    path: '/plandecuentas',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeCuentas/PlanDeCuentas'),
    ),
    authority: [],
  },
  {
    key: 'assumptionfinancieras',
    path: '/assumptionfinancieras',
    component: React.lazy(() =>
      import('views/FinancialPlan/FinancialPlanItem/AssumptionFinancieras.js'),
    ),
    authority: [],
  },
  {
    key: 'gastos',
    path: '/supuestos-gastos',
    component: React.lazy(() =>
      import('views/FinancialPlan/GastosDeEstructura/Gastos/Gastos'),
    ),
    authority: [],
  },
  {
    key: 'gastosporcc',
    path: '/gastos-por-cc',
    component: React.lazy(() =>
      import('views/FinancialPlan/GastosDeEstructura/GastosPorCC/GastosPorCC'),
    ),
    authority: [],
  },
  {
    key: 'resumengasto',
    path: '/resumengasto',
    component: React.lazy(() =>
      import(
        'views/FinancialPlan/GastosDeEstructura/ResumenDeGasto/ResumenDeGasto'
      ),
    ),
    authority: [],
  },
  {
    key: 'margenbruto',
    path: '/margenbruto',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeVentas/MargenBruto/MargenBruto'),
    ),
    authority: [],
  },
  {
    key: 'puestosq',
    path: '/proyeccion-nomina',
    component: React.lazy(() =>
      import('views/FinancialPlan/GastosDeEstructura/PuestosQ/PuestosQ'),
    ),
    authority: [],
  },
  {
    key: 'puestosp',
    path: '/salarios',
    component: React.lazy(() =>
      import('views/FinancialPlan/GastosDeEstructura/PuestosP/PuestosP'),
    ),
    authority: [],
  },
  {
    key: 'puestospxq',
    path: '/headcount',
    component: React.lazy(() =>
      import('views/FinancialPlan/GastosDeEstructura/PuestosPxQ/PuestosPxQ'),
    ),
    authority: [],
  },
  {
    key: 'capexq',
    path: '/volumen-inversion',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeInversion/CapexQ/CapexQ'),
    ),
    authority: [],
  },
  {
    key: 'capexp',
    path: '/costo-inversion',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeInversion/CapexP/CapexP'),
    ),
    authority: [],
  },
  {
    key: 'capexpxq',
    path: '/inversion-total',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeInversion/CapexPxQ/CapexPxQ'),
    ),
    authority: [],
  },
  {
    key: 'churn',
    path: '/clientes-altas-churn',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeVentas/Churn/Churn'),
    ),
    authority: [],
  },
];
