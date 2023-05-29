import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
  NAV_ITEM_TYPE_TITLE,
} from 'constants/navigation.constant';

const navigationConfig = [
  {
    key: 'financialPlan',
    path: '',
    title: 'Financial Plan',
    translateKey: 'nav.financialPlan',
    icon: '',
    type: NAV_ITEM_TYPE_TITLE,
    authority: [],
    subMenu: [
      {
        key: 'collapseGeneral',
        path: '',
        title: 'Assumptions Generales',
        translateKey: 'nav.collapseGeneral.collapseGeneral',
        icon: '',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
          {
            key: 'nav.collapseMenu.collapseGeneral.item1',
            path: '/assumptiongeneral',
            title: 'Assumption General',
            translateKey: 'nav.collapseMenu.collapseGeneral.item1',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapseGeneral.item2',
            path: '/research',
            title: 'Research',
            translateKey:
              'nav.financialPlan.collapseMenu.collapseGeneral.item2',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
        ],
      },
      {
        key: 'collapsePlanCuentas',
        path: '/plandecuentas',
        title: 'Plan de Cuentas',
        translateKey: 'nav.collapseMenu.collapsePlanCuentas',
        icon: '',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      {
        key: 'collapsePlanVentas',
        path: '',
        title: 'Collapse Plan de Ventas',
        translateKey: 'nav.collapsePlanVentas.collapsePlanVentas',
        icon: '',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
          {
            key: 'collapsePlanVentas.item1',
            path: '/assumptionventas',
            title: 'Assumption Ventas',
            translateKey: 'nav.collapsePlanVentas.item1',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapsePlanVentas.item2',
            path: '/gmvytakerate',
            title: 'GMV y Take Rate',
            translateKey: 'nav.collapsePlanVentas.item2',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapsePlanVentas.item3',
            path: '/volumenq',
            title: 'Volumen (q)',
            translateKey: 'nav.collapsePlanVentas.item3',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapseMenu.item4',
            path: '/preciop',
            title: 'Precio (p)',
            translateKey: 'nav.collapseMenu.item4',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapsePlanVentas.item5',
            path: '/ventas',
            title: 'Ventas',
            translateKey: 'nav.collapsePlanVentas.item5',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },

          {
            key: 'collapsePlanVentas.item7',
            path: '/clientesalta',
            title: 'Clientes Alta',
            translateKey: 'nav.collapsePlanVentas.item6',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapsePlanVentas.item8',
            path: '/clienteschurn',
            title: 'Clientes Churn',
            translateKey: 'nav.collapsePlanVentas.item7',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapsePlanVentas.item9',
            path: '/clientestotaltes',
            title: 'Clientes Totales',
            translateKey: 'nav.collapsePlanVentas.item8',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapsePlanVentas.item10',
            path: '/dashboardventa',
            title: 'Dashboard Venta',
            translateKey: 'nav.collapsePlanVentas.item9',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
        ],
      },
      {
        key: 'collapseFinancialPlan',
        path: '',
        title: 'Collapse Financial Plan',
        translateKey: 'nav.collapseFinancialPlan.collapseFinancialPlan',
        icon: '',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
          {
            key: 'collapseFinancialPlan.item1',
            path: '/preciodebienes',
            title: 'Precio de Bienes',
            translateKey: 'nav.collapseFinancialPlan.item1',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapseFinancialPlan.item2',
            path: '/inversion',
            title: 'Inversión',
            translateKey: 'nav.collapseFinancialPlan.item2',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapseFinancialPlan.item3',
            path: '/assumptionfinancieras',
            title: 'Assuption Financieras',
            translateKey: 'nav.collapseFinancialPlan.item3',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
        ],
      },
      {
        key: 'collapseCostosDirectos',
        path: '',
        title: 'Collapse Costos Directos',
        translateKey: 'nav.collapseCostosDirectos.collapseCostosDirectos',
        icon: '',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
          {
            key: 'collapseCostosDirectos.item1',
            path: '/costo',
            title: 'Costo',
            translateKey: 'nav.collapseCostosDirectos.item1',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          // {
          //   key: 'collapseCostosDirectos.item2',
          //   path: '/margenbruto',
          //   title: 'Margen Bruto',
          //   translateKey: 'nav.collapseCostosDirectos.item2',
          //   icon: '',
          //   type: NAV_ITEM_TYPE_ITEM,
          //   authority: [],
          //   subMenu: [],
          // },
          {
            key: 'collapseCostosDirectos.item3',
            path: '/costopxq',
            title: 'Costo PxQ',
            translateKey: 'nav.collapseCostosDirectos.item3',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
        ],
      },
      {
        key: 'collapseGastosDeEstructura',
        path: '',
        title: 'Collapse Gastos de Estructura',
        translateKey:
          'nav.collapseGastosDeEstructura.collapseGastosDeEstructura',
        icon: '',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
          {
            key: 'collapseGastosDeEstructura.item1',
            path: '/gastos',
            title: 'Gastos',
            translateKey: 'nav.collapseGastosDeEstructura.item1',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },

          {
            key: 'collapseGastosDeEstructura.item2',
            path: '/puestosq',
            title: 'Puestos Q',
            translateKey: 'nav.collapseGastosDeEstructura.item2',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapseGastosDeEstructura.item3',
            path: '/puestospxq',
            title: 'Puestos PxQ',
            translateKey: 'nav.collapseGastosDeEstructura.item3',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapseGastosDeEstructura.item4',
            path: '/gastos-por-cc',
            title: 'Gastos por CC',
            translateKey: 'nav.collapseGastosDeEstructura.item4',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
          {
            key: 'collapseGastosDeEstructura.item5',
            path: '/puestosp',
            title: 'Puestos P',
            translateKey: 'nav.collapseGastosDeEstructura.item5',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
          },
        ],
      },
    ],
  },
];

export default navigationConfig;
