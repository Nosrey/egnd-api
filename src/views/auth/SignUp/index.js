import React from 'react'
import SignUpForm from './SignUpForm'

const SignUp = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Crear Cuenta</h3>
                <p>Complete su información de perfil</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp
