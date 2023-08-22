import React from 'react';

const authRoute = [
  {
    key: 'signIn',
    path: `/iniciar-sesion`,
    component: React.lazy(() => import('views/auth/SignIn')),
    authority: [],
  },
  {
    key: 'signUp',
    path: `/crear-cuenta`,
    component: React.lazy(() => import('views/auth/SignUp')),
    authority: [],
  },
  {
    key: 'forgotPassword',
    path: `/olvidaste-tu-contraseña`,
    component: React.lazy(() => import('views/auth/ForgotPassword')),
    authority: [],
  },
  {
    key: 'resetPassword',
    path: `/reset-password`,
    component: React.lazy(() => import('views/auth/ResetPassword')),
    authority: [],
  },
  {
    key: 'construccion',
    path: `/construccion`,
    component: React.lazy(() => import('views/auth/Construccion')),
    authority: [],
  },
]

export default authRoute;
