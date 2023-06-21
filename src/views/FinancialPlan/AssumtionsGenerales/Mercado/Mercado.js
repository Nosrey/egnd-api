import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, FormItem, FormContainer } from 'components/ui';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ImageMercado from '../../../../assets/image/Mercado.png';

const validationSchema = Yup.object().shape({
  mercado: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(50, '¡Demasiado largo!')
    .required('Requerido'),
  definicion: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(50, '¡Demasiado largo!')
    .required('Requerido'),
  valorTam: Yup.string().required('Requerido'),
  tam: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(50, '¡Demasiado largo!')
    .required('Requerido'),
  valorSam: Yup.string().required('Requerido'),
  sam: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(50, '¡Demasiado largo!')
    .required('Requerido'),
  valorSom: Yup.string().required('Requerido'),
  som: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(50, '¡Demasiado largo!')
    .required('Requerido'),
});
function Mercado() {
  const currency = useSelector((state) => state.auth.user.currency);

  const formatearNumero = (numero) => {
    const inputNumero = Number(numero.replace(/\D/g, ''));
    const nuevoNum = inputNumero.toLocaleString('es-AR');
    return nuevoNum;
  };

  const removePunctuation = (value) => value.replace(/[.,]/g, '');

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
              valorTam: '',
              tam: '',
              valorSam: '',
              sam: '',
              valorSom: '',
              som: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              console.log(removePunctuation(values.valorTam));
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
                resetForm();
              }, 400);
            }}
          >
            {({ touched, errors, resetForm, values }) => (
              <Form>
                <FormContainer>
                  <div className="flex gap-[16px]">
                    <FormItem
                      className="w-[40%] max-w-[480px]"
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
                      className="w-[40%] max-w-[480px]"
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
                        * Lorem Ipsum ha sido el texto de relleno estándar de
                        las industrias desde el año 1500, cuando un impresor (N.
                        del T. persona que se dedica a la imprenta).
                      </span>
                    </FormItem>
                  </div>

                  <h4 className="mt-[20px]">Tamaño de Mercado</h4>

                  <div className="flex gap-[50px] items-center mt-[20px]">
                    <div className="w-[50%]">
                      <div>
                        <span>TAM</span>
                        <div className="flex gap-[16px] mt-2.5 w-[100%]">
                          <FormItem
                            // className="max-w-[100px]"
                            className="w-[30%]"
                            invalid={errors.valorTam && touched.valorTam}
                            errorMessage={errors.valorTam}
                          >
                            <Field
                              type="text"
                              autoComplete="off"
                              name="valorTam"
                              placeholder="Valor"
                              component={Input}
                              prefix={currency}
                              value={formatearNumero(values?.valorTam)}
                            />
                          </FormItem>
                          <FormItem
                            // className="max-w-sm"
                            className="w-[80%]"
                            invalid={errors.tam && touched.tam}
                            errorMessage={errors.tam}
                          >
                            <Field
                              type="text"
                              autoComplete="off"
                              name="tam"
                              placeholder="Descripción"
                              component={Input}
                            />
                          </FormItem>
                        </div>
                      </div>
                      <div>
                        <span>SAM</span>
                        <div className="flex gap-[16px] mt-2.5 w-[100%]">
                          <FormItem
                            className="w-[30%]"
                            invalid={errors.valorSam && touched.valorSam}
                            errorMessage={errors.valorSam}
                          >
                            <Field
                              type="text"
                              autoComplete="off"
                              name="valorSam"
                              placeholder="Valor"
                              component={Input}
                              prefix={currency}
                              value={formatearNumero(values?.valorSam)}
                            />
                          </FormItem>
                          <FormItem
                            className="w-[80%]"
                            invalid={errors.sam && touched.sam}
                            errorMessage={errors.sam}
                          >
                            <Field
                              type="text"
                              autoComplete="off"
                              name="sam"
                              placeholder="Descripción"
                              component={Input}
                            />
                          </FormItem>
                        </div>
                      </div>
                      <div>
                        <span>SOM</span>
                        <div className="flex gap-[16px] mt-2.5 w-[100%]">
                          <FormItem
                            className="w-[30%]"
                            invalid={errors.valorSom && touched.valorSom}
                            errorMessage={errors.valorSom}
                          >
                            <Field
                              type="text"
                              autoComplete="off"
                              name="valorSom"
                              placeholder="Valor"
                              component={Input}
                              prefix={currency}
                              value={formatearNumero(values?.valorSom)}
                            />
                          </FormItem>
                          <FormItem
                            className="w-[80%]"
                            invalid={errors.som && touched.som}
                            errorMessage={errors.som}
                          >
                            <Field
                              type="text"
                              autoComplete="off"
                              name="som"
                              placeholder="Descripción"
                              component={Input}
                            />
                          </FormItem>
                        </div>
                      </div>
                    </div>
                    <div className=" w-[50%] relative">
                      <img
                        className="w-[100%] max-w-[860px] "
                        src={ImageMercado}
                        alt=""
                      />
                      <span className="absolute right-[5%] top-[10%] text-[22px] text-[#181851]">
                        {currency}
                        {formatearNumero(values?.valorTam)}
                      </span>
                      <span className="absolute right-[5%] top-[47%] text-[22px] text-[#181851]">
                        {currency}
                        {formatearNumero(values?.valorSam)}
                      </span>
                      <span className="absolute right-[5%] top-[86%] text-[22px] text-[#181851]">
                        {currency}
                        {formatearNumero(values?.valorSom)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end mt-[40px]">
                    <FormItem>
                      <Button variant="solid" type="submit">
                        Guardar
                      </Button>
                    </FormItem>
                  </div>
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
