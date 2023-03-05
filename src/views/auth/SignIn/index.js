import React from 'react'
import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Iniciar Sesión</h3>
                <p>Por favor ingrese sus credenciales</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
