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
    path: '/assumptiongeneral',
    component: React.lazy(() =>
      import('views/FinancialPlan/AssumtionsGenerales/AssumptionGeneral'),
    ),
    authority: [],
  },
  {
    key: 'assumptionventas',
    path: '/assumptionventas',
    component: React.lazy(() =>
      import(
        'views/FinancialPlan/PlanDeVentas/Assumption Ventas/AssumptionVentas'
      ),
    ),
    authority: [],
  },
  {
    key: 'preciop',
    path: '/preciop',
    component: React.lazy(() =>
      import('views/FinancialPlan/PlanDeVentas/Precio P/PrecioP'),
    ),
    authority: [],
  },
  {
    key: 'volumenq',
    path: '/volumenq',
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
    path: '/costo',
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
    key: 'assumptionfinancieras',
    path: '/assumptionfinancieras',
    component: React.lazy(() =>
      import('views/FinancialPlan/FinancialPlanItem/AssumptionFinancieras.js'),
    ),
    authority: [],
  },
  {
    key: 'gastos',
    path: '/gastos',
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
      import('views/FinancialPlan/GastosDeEstructura/ResumenDeGasto/ResumenDeGasto'),
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
    path: '/puestosq',
    component: React.lazy(() =>
      import('views/FinancialPlan/GastosDeEstructura/PuestosQ/PuestosQ'),
    ),
    authority: [],
  },
  {
    key: 'puestosp',
    path: '/puestosp',
    component: React.lazy(() =>
      import('views/FinancialPlan/GastosDeEstructura/PuestosP/PuestosP'),
    ),
    authority: [],
  },
  {
    key: 'puestospxq',
    path: '/puestospxq',
    component: React.lazy(() =>
      import('views/FinancialPlan/GastosDeEstructura/PuestosPxQ/PuestosPxQ'),
    ),
    authority: [],
  },
];
