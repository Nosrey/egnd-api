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
    key: 'puestosq',
    path: '/puestosq',
    component: React.lazy(() =>
      import('views/FinancialPlan/GastosDeEstructura/PuestosQ/PuestosQ'),
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
