import React from 'react'
import authRoute from './authRoute'

export const publicRoutes = [...authRoute]

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
        component: React.lazy(() => import('views/AssumptionGeneral')),
        authority: [],
    },
    {
        key: 'assumptionventas',
        path: '/assumptionventas',
        component: React.lazy(() => import('views/AssumptionVentas')),
        authority: [],
    },
]
