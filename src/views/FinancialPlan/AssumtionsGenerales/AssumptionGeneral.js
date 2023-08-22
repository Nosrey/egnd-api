import {
  Alert,
  Button,
  FormContainer,
  FormItem,
  Input,
  Select,
  Upload,
} from 'components/ui';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editBusinessInfo, getUser } from 'services/Requests';
import { setUser } from 'store/auth/userSlice';

import { useMedia } from 'utils/hooks/useMedia';
import * as Yup from 'yup';

const optionsBusiness = [
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'ecommerce', label: 'Ecommerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'transaccional', label: 'Transaccional' },
  { value: 'producto', label: 'Producto' },
  { value: 'suscripcion', label: 'Suscripcion' },
];

const optionsMoney = [
  { value: '$', label: 'ARS' },
  { value: 'US$', label: 'USD' },
  { value: '€', label: 'EUR' },
];

const MIN_UPLOAD = 1;
const MAX_UPLOAD = 1;

const validationSchema = Yup.object().shape({
  nombreEmpresa: Yup.string().required(
    'Por favor ingrese su nombre de negocio',
  ),
  modeloNegorcio: Yup.string().required(
    'Por favor seleccione un modelo de negocio',
  ),
  moneda: Yup.string().required('Por favor seleccione una moneda'),
});

function AssumptionGeneral() {
  const media = useMedia();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [info, setInfo] = useState();

  const dispatch = useDispatch();
  const currentState = useSelector((state) => state.auth.user);

  const onChangeCurrency = (option) => {
    const newState = {
      ...currentState,
      currency: option,
    };
    dispatch(setUser(newState));
  };

  const getInfo = () => {
    getUser(currentState.id)
    .then((data) => {
      setInfo(data);
    })
    .catch((error) => console.error(error));
  }
  useEffect(() => {
   getInfo();
  }, []);

  const onSetFormFile = (form, field, files) => {
    form.setFieldValue(field.name, files);
  };

  const beforeUpload = (file, fileList) => {
    let valid = true;

    const allowedFileType = ['image/jpeg', 'image/png'];
    const MAX_FILE_SIZE = 500000;

    if (fileList.length >= MAX_UPLOAD) {
      return `Solo puede cargar ${MAX_UPLOAD} file(s)`;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const f of file) {
      if (!allowedFileType.includes(f.type)) {
        valid = '¡Cargue un archivo .jpeg o .png!';
      }

      if (f.size >= MAX_FILE_SIZE) {
        valid = '¡La imagen no puede superar los 500kb!';
      }
    }

    return valid;
  };

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
        <h4>Supuestos Generales del Modelo</h4>
        <span>Supuestos Generales</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="border-b-2 px-4 py-1">
          <h6>Carga de datos</h6>
        </div>
        <div className="px-4 py-5">
          {info && (
            <Formik
              initialValues={{
                nombreEmpresa: info?.businessName || '',
                modeloNegorcio:
                  info?.businessInfo[0]?.businessModel.toLowerCase() || '',
                moneda: info?.businessInfo[0]?.currency || '',
                upload: [],
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm, setSubmitting }) => {
                editBusinessInfo(
                  values?.nombreEmpresa,
                  values?.modeloNegorcio,
                  values?.moneda,
                  values?.upload[0],
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
                    onChangeCurrency(values?.moneda);
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
              {({ values, touched, errors, resetForm }) => (
                <Form>
                  <FormContainer
                    className={`grid grid-cols-3 grid-rows-5 items-center gap-x-3 ${
                      media === 'mobile' ? 'grid-cols-1' : ''
                    } `}
                  >
                    <FormItem
                      className="col-span-1 row-start-1"
                      label="Nombre de la empresa"
                      invalid={errors.nombreEmpresa && touched.nombreEmpresa}
                      errorMessage={errors.nombreEmpresa}
                    >
                      <Field
                        placeholder="Mi empresa SRL"
                        type="text"
                        name="nombreEmpresa"
                        component={Input}
                      />
                    </FormItem>

                    <span
                      className={`col-start-2 col-end-3 row-start-1 ${
                        media === 'mobile' ? 'hidden' : ''
                      }`}
                    >
                      Escribe el nombre de tu compañía.
                    </span>

                    <FormItem
                      className="col-span-1 row-start-2"
                      label="Modelo de negocio"
                      invalid={errors.modeloNegorcio && touched.modeloNegorcio}
                      errorMessage={errors.modeloNegorcio}
                    >
                      <Field name="modeloNegorcio">
                        {({ field, form }) => (
                          <Select
                            placeholder="Selector de negocio"
                            field={field}
                            form={form}
                            options={optionsBusiness}
                            value={optionsBusiness.filter(
                              (option) =>
                                option.value === values.modeloNegorcio,
                            )}
                            onChange={(option) =>
                              form.setFieldValue(field.name, option.value)
                            }
                          />
                        )}
                      </Field>
                    </FormItem>

                    <span
                      className={`col-start-2 col-end-3 row-start-2 ${
                        media === 'mobile' ? 'hidden' : ''
                      }`}
                    >
                      Determina el modelo de negocio de tu compañía, si no lo
                      sabes puedes usar la guía donde te mostraremos varios
                      ejemplos.{' '}
                      {/* <Link className="underline decoration-solid text-blue-600">
                        Ver guia.
                      </Link> */}
                      Ver guía.
                    </span>

                    <FormItem
                      className="col-span-1 row-start-3"
                      label="Moneda"
                      invalid={errors.moneda && touched.moneda}
                      errorMessage={errors.moneda}
                    >
                      <Field name="moneda">
                        {({ field, form }) => (
                          <Select
                            placeholder="Selector de moneda"
                            field={field}
                            form={form}
                            options={optionsMoney}
                            value={optionsMoney.filter(
                              (option) => option.value === values.moneda,
                            )}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option.value);
                            }}
                          />
                        )}
                      </Field>
                    </FormItem>

                    <span
                      className={`col-start-2 col-end-3 row-start-3 col-start-2 col-end-3 row-start-2 ${
                        media === 'mobile' ? 'hidden' : ''
                      }`}
                    >
                      Es la moneda para el armado del plan, luego podrás
                      convertir en otras monedas para entender mejor tu
                      compañía.
                    </span>

                    <FormItem
                      className="col-span-1 row-start-4"
                      label="Sube tu logo"
                      invalid={Boolean(errors.upload && touched.upload)}
                      errorMessage={errors.upload}
                    >
                      <Field name="upload">
                        {({ field, form }) => (
                          <Upload
                            onChange={(files) =>
                              onSetFormFile(form, field, files)
                            }
                            onFileRemove={(files) =>
                              onSetFormFile(form, field, files)
                            }
                            beforeUpload={beforeUpload}
                            fileList={values.upload}
                          />
                        )}
                      </Field>
                    </FormItem>

                    <FormItem
                      className={`col-start-3 col-end-4 row-start-5 ${
                        media === 'mobile' ? 'col-start-0 col-end-1' : ''
                      }`}
                    >
                      <div
                        className={`flex  ${
                          media === 'mobile' ? 'justify-end' : 'justify-center'
                        }`}
                      >
                        <Button variant="solid" type="submit">
                          Cargar datos
                        </Button>
                      </div>
                    </FormItem>
                  </FormContainer>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssumptionGeneral;
