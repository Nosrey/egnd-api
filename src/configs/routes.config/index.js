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
    {
<<<<<<< HEAD
        key: 'volumenq',
        path: '/volumenq',
        component: React.lazy(() => import('views/VolumenQ')),
=======
        key: 'assumptionfinancieras',
        path: '/assumptionfinancieras',
        component: React.lazy(() => import('views/AssumptionFinancieras.js')),
>>>>>>> f3ef578b26ca8e660a5f088a282896f870bc923f
        authority: [],
    },
]
