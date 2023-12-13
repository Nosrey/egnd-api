import {
  Button,
  Card,
  FormContainer,
  FormItem,
  Input,
  Select,
  Table,
} from 'components/ui';
import { optionsDiasStock } from 'constants/forms.constants';
import { Field, Form, Formik } from 'formik';
import { createAssumpFinanciera } from 'services/Requests';

function TableFinancieras({
  setFormValues,
  media,
  dataFinanciera,
  setShowErrorAlert,
  setShowSuccessAlert,
  tiempos,
}) {
  const { Tr, Td, TBody } = Table;

  const submit = (values) => {
    const { impGanancias,cobranzas, inversion, pagoProducto, pagoServicio, stock } = values;

    createAssumpFinanciera(
      impGanancias,
      cobranzas,
      pagoProducto,
      pagoServicio,
      stock,
      inversion,
    )
      .then((data) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (data.error) {
          setShowErrorAlert(true);
          setTimeout(() => {
            setShowErrorAlert(false);
          }, 5000);
        } else {
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 5000);
        }
      })
      .catch((error) => {
        console.error(error, '[ERROR]');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const timeNames = {
    IVA: 'IVA DF (venta)',
    imponible: 'Imponible sobre venta',
  };
  const timeNamesCosto = {
    IVA: 'IVA CF (costo)',
    imponible: 'Imponible sobre costo',
  };
  const handleKeyPress = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
    const value = e.target.value + e.key;
    if (value > 100) {
      e.preventDefault();
    }
  };

  return (
    <div className="px-4 py-5">
      <Formik
        initialValues={{
          impGanancias: dataFinanciera.imp,
          cobranzas: dataFinanciera.cobranzas,
          pagoProducto: dataFinanciera.pagoProducto,
          pagoServicio: dataFinanciera.pagoServicio,
          stock: dataFinanciera.stock,
          inversion: dataFinanciera.inversion,
        }}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          submit(dataFinanciera);
        }}
      >
        {({ values, touched, errors, resetForm }) => (
          <Form>
            <FormContainer>
                  <h5 className="mb-[18px]">Tasa de impuesto a las ganancias</h5>
                  <FormItem
                      className={`${
                        media === 'mobile' ? 'w-[40%]' : 'w-[30%]'
                      } `}
                    >
                      <Field
                        placeholder="0"
                        name='impGanancias'
                        value={dataFinanciera.impGanancias}
                        type="number"
                        size="sm"
                        suffix="%"
                        component={Input}
                         onChange={(e) =>
                          setFormValues('impGanancias', 'pagoProducto', e.target.value)
                         }
                        onKeyPress={handleKeyPress}
                      />
                   </FormItem>
              <div className="w-[1900px]">
                <div className="w-[1900px] grid grid-cols-10  gap-x-3 ">
                  <Card className="col-start-1 col-end-3 row-start-1">
                    <h5 className="mb-[18px]">Plazo de cobranzas</h5>
                    <div className="flex justify-end mb-3">
                      <p className="w-[60%] ">% Sobre Total</p>
                    </div>
                    <div>
                      {tiempos.map((time, index) => (
                        <div
                          key={index}
                          className={`${
                            media === 'mobile'
                              ? 'flex items-center mb-1'
                              : 'flex justify-between items-center mb-1 '
                          }${
                            time.name === 'IVA' &&
                            'border border-transparent border-t-gray-300 pt-2'
                          }`}
                        >
                          <p
                            className={`${
                              media === 'mobile'
                                ? 'mt-[-30px] w-[30%]'
                                : 'mt-[-30px] w-[40%]'
                            }`}
                          >
                            {timeNames[time.name] || time.label}
                          </p>
                          <FormItem
                            className={`${
                              media === 'mobile' ? 'w-[50%]' : 'w-[60%]'
                            } `}
                          >
                            <Field
                              placeholder="0"
                              name={`cobranzas.${time.name}`}
                              value={dataFinanciera.cobranzas[time.name]}
                              type="number"
                              size="sm"
                              suffix="%"
                              component={Input}
                              onChange={(e) =>
                                setFormValues(
                                  index,
                                  'cobranzas',
                                  e.target.value,
                                )
                              }
                              onKeyPress={handleKeyPress}
                            />
                          </FormItem>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="col-start-3 col-end-5 row-start-1">
                    <h5 className="mb-[18px]">Plazo de pago - Productos</h5>
                    <div className="flex justify-end mb-3">
                      <p className="w-[60%] ">% Sobre Total</p>
                    </div>
                    <div>
                      {tiempos.map((time, index) => (
                        <div
                          key={index}
                          className={`${
                            media === 'mobile'
                              ? 'flex items-center mb-1'
                              : 'flex justify-between items-center mb-1 '
                          }${
                            time.name === 'IVA' &&
                            'border border-transparent border-t-gray-300 pt-2'
                          }`}
                        >
                          <p
                            className={`${
                              media === 'mobile'
                                ? 'mt-[-30px] w-[30%]'
                                : 'mt-[-30px] w-[40%]'
                            }`}
                          >
                            {timeNamesCosto[time.name] || time.label}
                          </p>
                          <FormItem
                            className={`${
                              media === 'mobile' ? 'w-[60%]' : 'w-[60%]'
                            } `}
                          >
                            <Field
                              placeholder="0.0"
                              value={dataFinanciera.pagoProducto[time.name]}
                              type="number"
                              size="sm"
                              suffix="%"
                              component={Input}
                              onChange={(e) =>
                                setFormValues(
                                  index,
                                  'pagoProducto',
                                  e.target.value,
                                )
                              }
                              onKeyPress={handleKeyPress}
                            />
                          </FormItem>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="col-start-5 col-end-7 row-start-1">
                    <h5 className="mb-[18px]">
                      Plazo de pago - Servicios/Gasto
                    </h5>
                    <div className="flex justify-end mb-3">
                      <p className="w-[60%] ">% Sobre Total</p>
                    </div>
                    <div>
                      {tiempos.map((time, index) => (
                        <div
                          key={index}
                          className={`${
                            media === 'mobile'
                              ? 'flex items-center mb-1'
                              : 'flex justify-between items-center mb-1 '
                          }${
                            time.name === 'IVA' &&
                            'border border-transparent border-t-gray-300 pt-2'
                          }`}
                        >
                          <p
                            className={`${
                              media === 'mobile'
                                ? 'mt-[-30px] w-[30%]'
                                : 'mt-[-30px] w-[40%]'
                            }`}
                          >
                            {timeNamesCosto[time.name] || time.label}
                          </p>
                          <FormItem
                            className={`${
                              media === 'mobile' ? 'w-[60%]' : 'w-[60%]'
                            } `}
                          >
                            <Field
                              placeholder="0.0"
                              value={dataFinanciera.pagoServicio[time.name]}
                              type="number"
                              size="sm"
                              suffix="%"
                              component={Input}
                              onChange={(e) =>
                                setFormValues(
                                  index,
                                  'pagoServicio',
                                  e.target.value,
                                )
                              }
                              onKeyPress={handleKeyPress}
                            />
                          </FormItem>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="col-start-7 col-end-9 row-start-1">
                    <h5 className="mb-[18px]">Días de Stock</h5>
                    <div>
                      <FormItem
                        className={`${
                          media === 'mobile' ? 'w-[60%]' : 'w-[60%]'
                        } `}
                      >
                        <Select
                          name="incremento"
                          placeholder="Seleccione"
                          options={optionsDiasStock}
                          // value={optionsIncremento.filter(
                          //   (option) =>
                          //     option.value ===
                          //     infoForm[cc].cuentas[head].incremento,
                          // )}
                          onChange={(e) =>
                            setFormValues('stock', 'pagoProducto', e.value)
                          }
                        />
                      </FormItem>
                    </div>
                  </Card>
                  <Card className="col-start-9 col-end-11 row-start-1">
                    <h5 className="mb-[18px]">Inversión</h5>
                    <div className="flex justify-end mb-3">
                      <p className="w-[60%] ">% Sobre Total</p>
                    </div>
                    <div>
                      {tiempos.map((time, index) => (
                        <div
                          key={index}
                          className={`${
                            media === 'mobile'
                              ? 'flex items-center mb-1'
                              : 'flex justify-between items-center mb-1 '
                          } ${
                            time.name === 'IVA' &&
                            'border border-transparent border-t-gray-300 pt-2'
                          }`}
                        >
                          <p
                            className={`${
                              media === 'mobile'
                                ? 'mt-[-30px] w-[30%]'
                                : 'mt-[-30px] w-[40%]'
                            }`}
                          >
                            {timeNamesCosto[time.name] || time.label}
                          </p>
                          <FormItem
                            className={`${
                              media === 'mobile' ? 'w-[60%]' : 'w-[60%]'
                            } `}
                          >
                            <Field
                              placeholder="0.0"
                              value={dataFinanciera.inversion[time.name]}
                              type="number"
                              size="sm"
                              suffix="%"
                              component={Input}
                              onChange={(e) =>
                                setFormValues(
                                  index,
                                  'inversion',
                                  e.target.value,
                                )
                              }
                              onKeyPress={handleKeyPress}
                            />
                          </FormItem>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="flex justify-end mt-6"
                  variant="solid"
                  type="submit"
                >
                  Cargar datos
                </Button>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default TableFinancieras;
