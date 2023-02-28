import React from 'react'
import {
    Input,
    Button,
    FormItem,
    FormContainer,
    Alert,
    Select,
} from 'components/ui'
import { PasswordInput, ActionLink } from 'components/shared'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from 'utils/hooks/useAuth'
import { createSignUp } from 'services/Requests'

const options = [
    { value: 'foo', label: 'Foo' },
    { value: 'bar', label: 'Bar' },
]

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Correo electrónico invalido')
        .required('Por favor introduzca su correo electrónico'),
    password: Yup.string().required('Por favor introduzca su contraseña'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Tus contraseñas no coinciden'
    ),
    businessName: Yup.string().required(
        'Por favor ingrese su nombre de negocio'
    ),
    modeloNegocio: Yup.string().required(
        'Por favor seleccione un modelo de negocio'
    ),
    moneda: Yup.string().required('Por favor seleccione una moneda'),
})

const SignUpForm = (props) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const { signUp } = useAuth()

    const [message, setMessage] = useTimeOutMessage()

    const onSignUp = async (values, setSubmitting) => {
        const { businessName, password, email, modeloNegocio, moneda } = values
        setSubmitting(true)
        const result = await signUp({
            businessName,
            password,
            email,
            modeloNegocio,
            moneda,
        })

        if (result.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert className="mb-4" type="danger" showIcon>
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    confirmPassword: '',
                    businessName: '',
                    modeloNegocio: '',
                    moneda: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    createSignUp(values)
                        .then(() => {
                            if (!disableSubmit) {
                                onSignUp(values, setSubmitting)
                            } else setSubmitting(false)
                        })
                        .catch((error) => {
                            console.error(
                                'Error de API:',
                                error.response.data.message
                            )
                        })
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Email"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Contraseña"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Contraseña"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <FormItem
                                label="Confirmar contraseña"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder="Confirmar contraseña"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <FormItem
                                label="Nombre de la empresa"
                                invalid={
                                    errors.businessName && touched.businessName
                                }
                                errorMessage={errors.businessName}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="businessName"
                                    placeholder="Mi empresa SRL"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Modelo de negocio"
                                invalid={
                                    errors.modeloNegocio &&
                                    touched.modeloNegocio
                                }
                                errorMessage={errors.modeloNegocio}
                            >
                                <Field name="modeloNegocio">
                                    {({ field, form }) => (
                                        <Select
                                            placeholder="Seleccionar..."
                                            field={field}
                                            form={form}
                                            options={options}
                                            value={options.filter(
                                                (option) =>
                                                    option.value ===
                                                    values.modeloNegocio
                                            )}
                                            onChange={(option) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    option.value
                                                )
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem
                                label="Moneda"
                                invalid={errors.moneda && touched.moneda}
                                errorMessage={errors.moneda}
                            >
                                <Field name="moneda">
                                    {({ field, form }) => (
                                        <Select
                                            placeholder="Seleccionar..."
                                            field={field}
                                            form={form}
                                            options={options}
                                            value={options.filter(
                                                (option) =>
                                                    option.value ===
                                                    values.moneda
                                            )}
                                            onChange={(option) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    option.value
                                                )
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? 'Creating Account...'
                                    : 'Sign Up'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Already have an account? </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm
