import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, FormItem, FormContainer, Alert } from 'components/ui';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { createMercado, getUser } from 'services/Requests';
import { useMedia } from 'utils/hooks/useMedia';
import ShortNumberNotation from 'components/shared/shortNumberNotation/ShortNumberNotation';
import { formatearNumero } from 'utils/formatTotalsValues';
import ImageMercado from '../../../../assets/image/Mercado.png';

const validationSchema = Yup.object().shape({
  mercado: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(100, '¡Demasiado largo!')
    .required('Requerido'),
  definicion: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(100, '¡Demasiado largo!')
    .required('Requerido'),
  valorTam: Yup.string().required('Requerido'),
  tam: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(100, '¡Demasiado largo!')
    .required('Requerido'),
  valorSam: Yup.string().required('Requerido'),
  sam: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(100, '¡Demasiado largo!')
    .required('Requerido'),
  valorSom: Yup.string().required('Requerido'),
  som: Yup.string()
    .min(3, '¡Demasiado corto!')
    .max(100, '¡Demasiado largo!')
    .required('Requerido'),
});

function Mercado() {
  const media = useMedia();

  const currency = useSelector((state) => state.auth.user.currency);
  const currentState = useSelector((state) => state.auth.user.id);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [valueForm, setValueForm] = useState({});
  const [isInitialValuesSet, setIsInitialValuesSet] = useState(false);

  useEffect(() => {
    getUser(currentState)
      .then((data) => {
        if (data.mercadoData.length !== 0) {
          setValueForm(data.mercadoData[0]);
          setIsInitialValuesSet(true);
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }, []);

  const removePunctuation = (value) => value?.replace(/[.,]/g, '');

  return (
    <div>
      {showSuccessAlert && (
        <Alert className="mb-4" type="success" showIcon>
          Los datos se guardaron satisfactoriamente.
        </Alert>
      )}
      {showErrorAlert && (
        <Alert className="mb-4" type="danger" showIcon>
          No se pudieron guardar los datos.
        </Alert>
      )}
      <div className="border-b-2 mb-8 pb-1">
        <h4 className="cursor-default">Mercado</h4>
        <span className="cursor-default">Supuestos del Modelo</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="border-b-2 px-4 py-1">
          <h6 className="cursor-default">Carga de datos</h6>
        </div>
        <div className="px-4 py-5">
          <Formik
            enableReinitialize
            initialValues={
              isInitialValuesSet
                ? {
                    mercado: valueForm?.mercado || '',
                    definicion: valueForm?.definicion || '',
                    valorTam: valueForm?.valorTam || '',
                    tam: valueForm?.tam || '',
                    valorSam: valueForm?.valorSam || '',
                    sam: valueForm?.sam || '',
                    valorSom: valueForm?.valorSom || '',
                    som: valueForm?.som || '',
                  }
                : {
                    valorTam: '0',
                    valorSam: '0',
                    valorSom: '0',
                  }
            }
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              const newValorTam = removePunctuation(values.valorTam);
              const newValorSam = removePunctuation(values.valorSam);
              const newValorSom = removePunctuation(values.valorSom);
              createMercado(
                values.mercado,
                values.definicion,
                newValorTam,
                values.tam,
                newValorSam,
                values.sam,
                newValorSom,
                values.som,
                currentState,
              )
                .then((data) => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                  setShowSuccessAlert(true);
                  setTimeout(() => {
                    setShowSuccessAlert(false);
                  }, 5000);
                  window.location.reload();
                })
                .catch((error) => {
                  console.error('Error de API:', error.response.data.message);
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                  setShowErrorAlert(true);
                  setTimeout(() => {
                    setShowErrorAlert(false);
                  }, 5000);
                });
            }}
          >
            {({ touched, errors, resetForm, values }) => (
              <Form>
                <FormContainer>
                  <div className={`flex ${media === "mobile" ?  "flex-col" : ""} gap-[16px]`}>
                    <FormItem
                      className={`${media === "mobile" ?  "w-[100%]" : "w-[40%]"}   max-w-[480px] `}
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
                      className={`${media === "mobile" ?  "w-[100%]" : "w-[40%]"}   max-w-[480px] `}
                      label="Definición de Mercado Target"
                      invalid={errors.definicion && touched.definicion}
                      errorMessage={errors.definicion}
                    >
                      <Field
                        className="mb-2"
                        type="text"
                        autoComplete="off"
                        name="definicion"
                        placeholder="Definición"
                        component={Input}
                      />
                      <span className="cursor-default">
                        * Defina el mercado al cual la compañía ve una
                        oportunidad de ofrecer su producto o servicio.
                      </span>
                    </FormItem>
                  </div>

                  <h4 className="mt-[20px]">Tamaño de Mercado</h4>

                  <div className={`flex ${media === "mobile" ?  "flex-col-reverse" : ""}   gap-[50px] items-center mt-[20px]`}>
                    <div className={`${media === "mobile" ?  "w-[100%]" : "w-[50%]"}`}>
                      <div>
                        <span className="cursor-default">TAM</span>
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
                        <span className="cursor-default">SAM</span>
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
                        <span className="cursor-default">SOM</span>
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
                    <div className={`${media === "mobile" ?  "w-[100%] mt-[30px]" : "w-[50%]"} relative`}>
                      <img
                        className="w-[100%] max-w-[860px] "
                        src={ImageMercado}
                        alt=""
                      />
                      <span className="absolute right-[5%] top-[10%] text-[22px] text-[#181851]">
                        {currency}
                        <ShortNumberNotation
                          numero={
                            values?.valorTam && values.valorTam.length > 0
                              ? values.valorTam
                              : '0'
                          }
                        />
                      </span>
                      <span className="absolute right-[5%] top-[47%] text-[22px] text-[#181851]">
                        {currency}

                        <ShortNumberNotation
                          numero={
                            values?.valorSam && values.valorSam.length > 0
                              ? values.valorSam
                              : '0'
                          }
                        />
                      </span>
                      <span className="absolute right-[5%] top-[86%] text-[22px] text-[#181851]">
                        {currency}

                        <ShortNumberNotation
                          numero={
                            values?.valorSom && values.valorSom.length > 0
                              ? values.valorSom
                              : '0'
                          }
                        />
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
