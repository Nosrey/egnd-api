import React, { useState } from 'react';
import { Input, Button, FormItem, FormContainer, Alert } from 'components/ui';
import { ActionLink } from 'components/shared';
import { apiForgotPassword } from 'services/AuthService';
import useTimeOutMessage from 'utils/hooks/useTimeOutMessage';
import {AiOutlineCheckCircle} from "react-icons/ai";
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import checkImg from '../../../assets/image/check.png';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Please enter your email'),
});

function ForgotPasswordForm(props) {
  const {
    disableSubmit = false,
    className,
    signInUrl = '/iniciar-sesion',
  } = props;

  const [emailSent, setEmailSent] = useState(false);

  const [message, setMessage] = useTimeOutMessage();

  const onSendMail = async (values, setSubmitting) => {
    setSubmitting(true);
    try {
      const resp = await apiForgotPassword(values);
      if (resp.data) {
        setSubmitting(false);
        setEmailSent(true);
      }
    } catch (errors) {
      setMessage(errors?.response?.data?.message || errors.toString());
      setSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        {emailSent ? (
          <>
            <img  src={checkImg} className='mb-[13px] ml-[auto] mr-[auto]' alt="done"/>
            <h3 className="mb-1 text-[#292929] text-[25px] text-center font-bold">Recuperar contraseña</h3>
            <p className="text-[#292929] text-[16px] text-center font-normal">
            Te hemos enviado un correo para restablecer la contraseña 
            </p>
          </>
        ) : (
          <>
            <h3 className="mb-1 text-[#292929] text-[25px] text-center font-bold">Recuperar contraseña</h3>
            <p className="text-[#292929] text-[16px] text-center font-normal">
            Ingrese su correo para restablecer la contraseña
            </p>
          </>
        )}
      </div>
      {message && (
        <Alert className="mb-4" type="danger" showIcon>
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          email: 'admin@mail.com',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSendMail(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <div className={emailSent ? 'hidden' : ''}>
                <FormItem
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                  label="Correo electronico"
                    labelClass="text-[#292929] text-[14px] font-bold cursor-default"
                >
                  <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                    
                  />
                </FormItem>
              </div>
              <Button
              className="mb-8 "
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {emailSent ? 'Iniciar sesión' : 'Restablecer'}
              </Button>
              {!emailSent &&
                <div className="  mb-4 text-center">
                  <span className="cursor-default">Volver a </span>
                  <ActionLink to={signInUrl}>Inicio de sesión</ActionLink>
                </div>
              }
              
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ForgotPasswordForm;
