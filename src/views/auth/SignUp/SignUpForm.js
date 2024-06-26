import React from 'react';
import {
  Input,
  Button,
  FormItem,
  FormContainer,
  Alert,
  Select,
} from 'components/ui';
import { PasswordInput, ActionLink } from 'components/shared';
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { createSignUp } from 'services/AuthService';
import { useNavigate } from 'react-router-dom';

const businessOptions = [
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'ecommerce', label: 'Ecommerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'transaccional', label: 'Transaccional' },
  { value: 'producto', label: 'Producto' },
  { value: 'servicio', label: 'Servicio' },
  { value: 'suscripcion', label: 'Suscripcion' },
];

const currencyOptions = [
  { value: '$', label: 'ARS' },
  { value: 'US$', label: 'USD' },
  { value: '€', label: 'EUR' },
];

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico invalido')
    .required('Por favor introduzca su correo electrónico'),
  password: Yup.string().required('Por favor introduzca su contraseña'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Tus contraseñas no coinciden',
  ),
  businessName: Yup.string().required('Por favor ingrese su nombre de negocio'),
  modeloNegocio: Yup.string().required(
    'Por favor seleccione un modelo de negocio',
  ),
  moneda: Yup.string().required('Por favor seleccione una moneda'),
});

function SignUpForm(props) {
  const { className, signInUrl = '/iniciar-sesion' } = props;
  const navigate = useNavigate();

  const [message, setMessage] = useTimeOutMessage();

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
            .then((resp) => {
              localStorage.setItem('userId', resp.id);
              setSubmitting(false);
              navigate('/iniciar-sesion');
            })
            .catch((error) => {
              console.error('Error de API:', error);
              setMessage('Este correo electrónico ya fue utilizado.');
              setSubmitting(false);
            });
        }}
      >
        {({ values, touched, errors, isSubmitting }) => (
          <Form autoComplete="off">
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
                  className="bg-[#F3F4F6]"
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
                invalid={errors.confirmPassword && touched.confirmPassword}
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
                invalid={errors.businessName && touched.businessName}
                errorMessage={errors.businessName}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="businessName"
                  placeholder="Mi empresa SRL"
                  component={Input}
                  className="bg-[#F3F4F6]"
                />
              </FormItem>
              <FormItem
                label="Modelo de negocio"
                invalid={errors.modeloNegocio && touched.modeloNegocio}
                errorMessage={errors.modeloNegocio}
              >
                <Field name="modeloNegocio" >
                  {({ field, form }) => (
                    <Select
                      placeholder="Seleccionar..."
                      field={field}
                      form={form}
                      options={businessOptions}
                      value={businessOptions.filter(
                        (option) => option.value === values.modeloNegocio,
                      )}
                      onChange={(option) =>
                        form.setFieldValue(field.name, option.value)
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
                <Field name="moneda" >
                  {({ field, form }) => (
                    <Select
                    className="bg-[#F3F4F6]"
                      placeholder="Seleccionar..."
                      field={field}
                      form={form}
                      options={currencyOptions}
                      value={currencyOptions.filter(
                        (option) => option.value === values.moneda,
                      )}
                      onChange={(option) =>
                        form.setFieldValue(field.name, option.value)
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
                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
              <div className="mt-4 text-center">
                <span className="cursor-default">¿Ya tienes una cuenta? </span>
                <ActionLink to={signInUrl}>Iniciar Sesión</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUpForm;
