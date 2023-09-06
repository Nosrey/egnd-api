import React from 'react'
import SignUpForm from './SignUpForm'

function SignUp() {
  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1 text-[#292929] text-[25px] text-center font-bold">Crear Cuenta</h3>
        <p className="text-[#292929] text-[16px] text-center font-normal">Ingrese los datos para crear una cuenta</p>
      </div>
      <SignUpForm disableSubmit={false} />
    </>
  )
}

export default SignUp
