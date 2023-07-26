import { ActionLink, PasswordInput } from 'components/shared';
import {
  Alert,
  Button,
  Checkbox,
  FormContainer,
  FormItem,
  Input,
} from 'components/ui';
import { Field, Form, Formik } from 'formik';
import useAuth from 'utils/hooks/useAuth';
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico invalido')
    .required('Por favor introduzca su correo electrónico'),
  password: Yup.string().required('Por favor introduzca su contraseña'),
  rememberMe: Yup.bool(),
});

function SignInForm(props) {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = '/forgot-password',
    signUpUrl = '/sign-up',
  } = props;

  SignInForm.defaultProps = {
    disableSubmit: false,
    className: '',
    forgotPasswordUrl: '/forgot-password',
    signUpUrl: '/sign-up',
  };

  SignInForm.propTypes = {
    disableSubmit: PropTypes.bool,
    className: PropTypes.string,
    forgotPasswordUrl: PropTypes.string,
    signUpUrl: PropTypes.string,
  };

  const [message, setMessage] = useTimeOutMessage();
  const { signIn } = useAuth();

  const onSignIn = async (values, setSubmitting) => {
    const { email, password } = values;
    setSubmitting(true);

    const result = await signIn({ email, password });

    if (result.error) {
      setMessage(result.message);
    }

    if (result.status === 'failed') {
      setMessage(result.message);
    }

    setSubmitting(false);
  };

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
          email: '',
          password: '',
          rememberMe: false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignIn(values, setSubmitting);
          } else {
            setSubmitting(false);
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
              <div className="flex justify-end mb-6">
                <ActionLink to={forgotPasswordUrl}>
                  Olvidaste la constraseña?
                </ActionLink>
              </div>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
              <div className="mt-4 text-center">
                <span>No tienes cuenta? </span>
                <ActionLink to={signUpUrl}>Crear cuenta</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignInForm;
