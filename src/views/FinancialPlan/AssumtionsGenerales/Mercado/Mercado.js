import React from 'react';
import { Input, Button, FormItem, FormContainer } from 'components/ui';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  mercado: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  definicion: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});
function Mercado() {
  return (
    <div>
      <div className="border-b-2 mb-8 pb-1">
        <h4>Mercado</h4>
        <span>Research</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="border-b-2 px-4 py-1">
          <h6>Carga de datos</h6>
        </div>
        <div className="px-4 py-5">
          <Formik
            initialValues={{
              mercado: '',
              definicion: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
                resetForm();
              }, 400);
            }}
          >
            {({ touched, errors, resetForm }) => (
              <Form>
                <FormContainer>
                  <FormItem
                    className="max-w-sm"
                    label="Mercado"
                    invalid={errors.mercado && touched.mercado}
                    errorMessage={errors.mercado}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="mercado"
                      placeholder="Mercado"
                      component={Input}
                    />
                  </FormItem>

                  <FormItem
                    className="max-w-sm"
                    label="Definicion de Mercado Target"
                    invalid={errors.definicion && touched.definicion}
                    errorMessage={errors.definicion}
                  >
                    <Field
                      className="mb-2"
                      type="text"
                      autoComplete="off"
                      name="definicion"
                      placeholder="Definicion"
                      component={Input}
                    />
                    <span>
                      * Lorem Ipsum ha sido el texto de relleno estándar de las
                      industrias desde el año 1500, cuando un impresor (N. del
                      T. persona que se dedica a la imprenta).
                    </span>
                  </FormItem>

                  <FormItem>
                    <Button variant="solid" type="submit">
                      Submit
                    </Button>
                  </FormItem>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Mercado;
