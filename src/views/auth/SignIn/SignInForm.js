import { ActionLink, PasswordInput } from 'components/shared'
import {
    Alert,
    Button,
    Checkbox,
    FormContainer,
    FormItem,
    Input,
} from 'components/ui'
import { Field, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { signIn } from 'services/Requests'
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Correo electrónico invalido')
        .required('Por favor introduzca su correo electrónico'),
    password: Yup.string().required('Por favor introduzca su contraseña'),
    rememberMe: Yup.bool(),
})

const SignInForm = (props) => {
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up',
    } = props

    const [message, setMessage] = useTimeOutMessage()
    const navigate = useNavigate()

    const onSignIn = async (values, setSubmitting) => {
        const { email, password } = values

        setSubmitting(true)

        signIn({ email, password })
            .then((resp) => {
                if (resp.success) {
                    console.log(resp)
                    localStorage.setItem('userId', resp.id)
                    navigate('/home')
                    setSubmitting(false)
                } else {
                    setMessage(resp)
                    setSubmitting(false)
                }
            })
            .catch((error) => console.log('[ERROR]', error))
    }

    return (
        <div className={className}>
            {message && (
                <Alert className="mb-4" type="danger" showIcon>
                    {message}
                </Alert>
            )}
            <Formik
                // Remove this initial value
                initialValues={{
                    email: 'admin',
                    password: '123Qwe',
                    rememberMe: true,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignIn(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Correo electronico"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Correo electronico"
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
                            <div className="flex justify-between mb-6">
                                <Field
                                    className="mb-0"
                                    name="rememberMe"
                                    component={Checkbox}
                                    children="Remember Me"
                                />
                                <ActionLink to={forgotPasswordUrl}>
                                    Forgot Password?
                                </ActionLink>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Don't have an account yet? </span>
                                <ActionLink to={signUpUrl}>Sign up</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignInForm
