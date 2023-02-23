import React from 'react'
import { Field, FieldArray, Form, Formik, getIn } from 'formik'
import {
    Input,
    Button,
    FormItem,
    FormContainer,
    Select,
    Avatar,
} from 'components/ui'
import { HiMinus } from 'react-icons/hi'
import * as Yup from 'yup'
import CreatableSelect from 'react-select/creatable'

const validationSchema = Yup.object({
    productos: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Name required'),
            model: Yup.string().required('Name required'),
            type: Yup.string().required('Name required'),
            country: Yup.array().min(1, 'At least one is selected!'),
            nameChannel: Yup.string().required('Name required'),
        })
    ),
})

const optionsModel = [
    { value: 'oneShot', label: 'One Shot' },
    { value: 'mensual', label: 'Suscripción Mensual' },
    { value: '% transacción', label: '% Transacción' },
    {
        value: 'tix price por transacción',
        label: 'Fix price por transacción',
    },
]

const optionsType = [
    { value: 'producto', label: 'Producto' },
    { value: 'servicio', label: 'Servicio' },
]

const optionsCountry = [
    { value: 'argentina', label: 'Argentina' },
    { value: 'brasil', label: 'Brasil' },
    { value: 'chile', label: 'Chile' },
    { value: 'uruguay', label: 'Uruguay' },
]

const fieldFeedback = (form, name) => {
    const error = getIn(form.errors, name)
    const touch = getIn(form.touched, name)
    return {
        errorMessage: error || '',
        invalid: typeof touch === 'undefined' ? false : error && touch,
    }
}

const DynamicForm = () => {
    return (
        <div>
            <div className="border-b-2 mb-8 pb-1">
                <h4>Assumptions ventas</h4>
                <span>Plan de ventas</span>
            </div>
            <div className="border-solid border-2 border-#e5e7eb rounded-lg">
                <div className="border-b-2 px-4 py-1">
                    <h6>Carga de productos / servicios</h6>
                </div>

                <div className="px-4 py-5">
                    <Formik
                        onSubmit={(values) =>
                            alert(JSON.stringify(values, null, 2))
                        }
                        validationSchema={validationSchema}
                        initialValues={{
                            productos: [
                                {
                                    name: '',
                                    model: '',
                                    type: '',
                                },
                            ],
                            country: [],
                            channels: [{ nameChannel: '', volumeCustomer: '' }],
                        }}
                    >
                        {({ touched, errors, values }) => {
                            const productos = values.productos
                            const channels = values.channels
                            return (
                                <Form>
                                    <FormContainer>
                                        <div className="flex flex-col gap-y-6">
                                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                                <span className=" ">ID</span>
                                                <span className="col-start-2 col-end-6">
                                                    Producto / Servicio
                                                </span>
                                                <span className="col-start-6 col-end-10">
                                                    Revenue Model
                                                </span>
                                                <span className="col-start-10 col-end-13">
                                                    Tipo
                                                </span>
                                            </div>
                                            <FieldArray name="productos">
                                                {({ form, remove, push }) => (
                                                    <div>
                                                        {productos &&
                                                        productos.length > 0
                                                            ? productos.map(
                                                                  (
                                                                      _,
                                                                      index
                                                                  ) => {
                                                                      const nameFeedBack =
                                                                          fieldFeedback(
                                                                              form,
                                                                              `productos[${index}].name`
                                                                          )
                                                                      const modelFeedBack =
                                                                          fieldFeedback(
                                                                              form,
                                                                              `productos[${index}].model`
                                                                          )
                                                                      const typeFeedback =
                                                                          fieldFeedback(
                                                                              form,
                                                                              `productos[${index}].type`
                                                                          )

                                                                      return (
                                                                          <div
                                                                              className="grid grid-cols-12 items-center gap-x-3 mb-6 auto-cols-max"
                                                                              key={
                                                                                  index
                                                                              }
                                                                          >
                                                                              <Avatar className="col-start-1 row-start-2 mr-4 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                                                                                  {index +
                                                                                      1}
                                                                              </Avatar>
                                                                              <FormItem
                                                                                  className="col-start-2 col-end-6 row-start-2 mb-0"
                                                                                  invalid={
                                                                                      nameFeedBack.invalid
                                                                                  }
                                                                                  errorMessage={
                                                                                      nameFeedBack.errorMessage
                                                                                  }
                                                                              >
                                                                                  <Field
                                                                                      invalid={
                                                                                          nameFeedBack.invalid
                                                                                      }
                                                                                      placeholder="Nombre"
                                                                                      name={`productos[${index}].name`}
                                                                                      type="text"
                                                                                      component={
                                                                                          Input
                                                                                      }
                                                                                  />
                                                                              </FormItem>

                                                                              <FormItem
                                                                                  className="col-start-6 col-end-10 row-start-2 mb-0"
                                                                                  invalid={
                                                                                      modelFeedBack.invalid
                                                                                  }
                                                                                  errorMessage={
                                                                                      modelFeedBack.errorMessage
                                                                                  }
                                                                              >
                                                                                  <Field
                                                                                      name={`productos[${index}].model`}
                                                                                  >
                                                                                      {({
                                                                                          field,
                                                                                          form,
                                                                                      }) => (
                                                                                          <Select
                                                                                              field={
                                                                                                  field
                                                                                              }
                                                                                              form={
                                                                                                  form
                                                                                              }
                                                                                              options={
                                                                                                  optionsModel
                                                                                              }
                                                                                              value={optionsModel.filter(
                                                                                                  (
                                                                                                      option
                                                                                                  ) =>
                                                                                                      option.value ===
                                                                                                      values.select
                                                                                              )}
                                                                                              onChange={(
                                                                                                  option
                                                                                              ) =>
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
                                                                                  className="col-start-10 col-end-13 row-start-2 mb-0"
                                                                                  invalid={
                                                                                      typeFeedback.invalid
                                                                                  }
                                                                                  errorMessage={
                                                                                      typeFeedback.errorMessage
                                                                                  }
                                                                              >
                                                                                  <Field
                                                                                      name={`productos[${index}].type`}
                                                                                  >
                                                                                      {({
                                                                                          field,
                                                                                          form,
                                                                                      }) => (
                                                                                          <Select
                                                                                              field={
                                                                                                  field
                                                                                              }
                                                                                              form={
                                                                                                  form
                                                                                              }
                                                                                              options={
                                                                                                  optionsType
                                                                                              }
                                                                                              value={optionsType.filter(
                                                                                                  (
                                                                                                      option
                                                                                                  ) =>
                                                                                                      option.value ===
                                                                                                      values.select
                                                                                              )}
                                                                                              onChange={(
                                                                                                  option
                                                                                              ) =>
                                                                                                  form.setFieldValue(
                                                                                                      field.name,
                                                                                                      option.value
                                                                                                  )
                                                                                              }
                                                                                          />
                                                                                      )}
                                                                                  </Field>
                                                                              </FormItem>

                                                                              {/* <Button
                                                                                  shape="circle"
                                                                                  size="sm"
                                                                                  icon={
                                                                                      <HiMinus />
                                                                                  }
                                                                                  onClick={() =>
                                                                                      remove(
                                                                                          index
                                                                                      )
                                                                                  }
                                                                              /> */}
                                                                          </div>
                                                                      )
                                                                  }
                                                              )
                                                            : null}
                                                        <div>
                                                            {/* <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                                                <FormItem className=" col-start-10 col-end-13 mb-0">
                                                                    <div className="flex justify-between gap-x-2">
                                                                        <Button
                                                                            style={{
                                                                                width: '47%',
                                                                            }}
                                                                            className=" flex justify-center items-center"
                                                                            variant="solid"
                                                                            color="red-600"
                                                                        >
                                                                            Eliminar
                                                                            item
                                                                        </Button>
                                                                        <Button
                                                                            style={{
                                                                                width: '47%',
                                                                            }}
                                                                            className=" flex justify-center items-center"
                                                                            variant="solid"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                push(
                                                                                    {
                                                                                        name: '',
                                                                                        model: '',
                                                                                        type: '',
                                                                                    }
                                                                                )
                                                                            }}
                                                                        >
                                                                            Agregar
                                                                            item
                                                                        </Button>
                                                                    </div>
                                                                </FormItem>
                                                            </div> */}

                                                            <Button
                                                                type="button"
                                                                className="ltr:mr-2 rtl:ml-2"
                                                                onClick={() => {
                                                                    push({
                                                                        name: '',
                                                                        model: '',
                                                                        type: '',
                                                                    })
                                                                }}
                                                            >
                                                                Add a User
                                                            </Button>
                                                            <Button
                                                                // type="submit"
                                                                variant="solid"
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                                <span className="col-start-1 col-end-6">
                                                    Pais
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                                <FormItem
                                                    className="col-start-1 col-end-6 mb-0"
                                                    invalid={Boolean(
                                                        errors.country &&
                                                            touched.country
                                                    )}
                                                    errorMessage={
                                                        errors.country
                                                    }
                                                >
                                                    <Field name="country">
                                                        {({ field, form }) => (
                                                            <Select
                                                                placeholder="País"
                                                                componentAs={
                                                                    CreatableSelect
                                                                }
                                                                isMulti
                                                                field={field}
                                                                form={form}
                                                                options={
                                                                    optionsCountry
                                                                }
                                                                value={
                                                                    values.pais
                                                                }
                                                                onChange={(
                                                                    option
                                                                ) => {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        option
                                                                    )
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>
                                            </div>

                                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                                <span className=" col-start-1  col-end-6">
                                                    Canal
                                                </span>
                                                <span className=" col-start-6  col-end-8">
                                                    Volumen por cliente
                                                </span>
                                                <span className=" col-start-8  col-end-13">
                                                    ¿Son las ventas de productos
                                                    a un mismo cliente?
                                                </span>
                                            </div>

                                            <FieldArray name="channels">
                                                {({ form, remove, push }) => (
                                                    <div>
                                                        {channels &&
                                                        channels.length > 0
                                                            ? channels.map(
                                                                  (
                                                                      _,
                                                                      index
                                                                  ) => {
                                                                      const nameFeedBack =
                                                                          fieldFeedback(
                                                                              form,
                                                                              `productos[${index}].name`
                                                                          )
                                                                      const nameChannelFeedBack =
                                                                          fieldFeedback(
                                                                              form,
                                                                              `productos[${index}].name`
                                                                          )
                                                                      const volumeCustomerFeedBack =
                                                                          fieldFeedback(
                                                                              form,
                                                                              `productos[${index}].model`
                                                                          )

                                                                      return (
                                                                          <div
                                                                              className="grid grid-cols-12 items-center gap-x-3 gap-y-4 mb-6 auto-cols-max"
                                                                              key={
                                                                                  index
                                                                              }
                                                                          >
                                                                              <FormItem
                                                                                  className="col-start-1 col-end-8 row-start-1 mb-0"
                                                                                  invalid={
                                                                                      nameChannelFeedBack.invalid
                                                                                  }
                                                                                  errorMessage={
                                                                                      nameChannelFeedBack.errorMessage
                                                                                  }
                                                                              >
                                                                                  <Field
                                                                                      invalid={
                                                                                          nameChannelFeedBack.invalid
                                                                                      }
                                                                                      placeholder="Nombre canal"
                                                                                      name={`productos[${index}].nameChannel`}
                                                                                      type="text"
                                                                                      component={
                                                                                          Input
                                                                                      }
                                                                                  />
                                                                              </FormItem>

                                                                              {/* <FormItem
                                                                                  className="col-start-8 col-end-11 row-start-1 mb-0"
                                                                                  invalid={
                                                                                      modelFeedBack.invalid
                                                                                  }
                                                                                  errorMessage={
                                                                                      modelFeedBack.errorMessage
                                                                                  }
                                                                              >
                                                                                  <Field
                                                                                      name={`productos[${index}].model`}
                                                                                  >
                                                                                      {({
                                                                                          field,
                                                                                          form,
                                                                                      }) => (
                                                                                          <Select
                                                                                              field={
                                                                                                  field
                                                                                              }
                                                                                              form={
                                                                                                  form
                                                                                              }
                                                                                              options={
                                                                                                  optionsModel
                                                                                              }
                                                                                              value={optionsModel.filter(
                                                                                                  (
                                                                                                      option
                                                                                                  ) =>
                                                                                                      option.value ===
                                                                                                      values.select
                                                                                              )}
                                                                                              onChange={(
                                                                                                  option
                                                                                              ) =>
                                                                                                  form.setFieldValue(
                                                                                                      field.name,
                                                                                                      option.value
                                                                                                  )
                                                                                              }
                                                                                          />
                                                                                      )}
                                                                                  </Field>
                                                                              </FormItem> */}

                                                                              <FormItem
                                                                                  className="col-start-1 col-end-6 row-start-2 mb-0"
                                                                                  invalid={
                                                                                      nameFeedBack.invalid
                                                                                  }
                                                                                  errorMessage={
                                                                                      nameFeedBack.errorMessage
                                                                                  }
                                                                              >
                                                                                  <Field
                                                                                      disabled
                                                                                      invalid={
                                                                                          nameFeedBack.invalid
                                                                                      }
                                                                                      placeholder="Nombre"
                                                                                      name={`productos[${index}].name`}
                                                                                      type="text"
                                                                                      component={
                                                                                          Input
                                                                                      }
                                                                                  />
                                                                              </FormItem>

                                                                              <FormItem
                                                                                  className="col-start-6 col-end-8 row-start-2 mb-0"
                                                                                  invalid={
                                                                                      volumeCustomerFeedBack.invalid
                                                                                  }
                                                                                  errorMessage={
                                                                                      volumeCustomerFeedBack.errorMessage
                                                                                  }
                                                                              >
                                                                                  <Field
                                                                                      invalid={
                                                                                          volumeCustomerFeedBack.invalid
                                                                                      }
                                                                                      placeholder="Volumen por venta"
                                                                                      name={`productos[${index}].volumeCustomer`}
                                                                                      type="number"
                                                                                      component={
                                                                                          Input
                                                                                      }
                                                                                  />
                                                                              </FormItem>

                                                                              {/* <Button
                                                                                  shape="circle"
                                                                                  size="sm"
                                                                                  icon={
                                                                                      <HiMinus />
                                                                                  }
                                                                                  onClick={() =>
                                                                                      remove(
                                                                                          index
                                                                                      )
                                                                                  }
                                                                              /> */}
                                                                          </div>
                                                                      )
                                                                  }
                                                              )
                                                            : null}
                                                        <div>
                                                            <Button
                                                                type="button"
                                                                className="ltr:mr-2 rtl:ml-2"
                                                                onClick={() => {
                                                                    push({
                                                                        nameChannel:
                                                                            '',
                                                                        volumeCustomer:
                                                                            '',
                                                                    })
                                                                }}
                                                            >
                                                                Add a User
                                                            </Button>
                                                            <Button
                                                                // type="submit"
                                                                variant="solid"
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            <div className="grid grid-cols-12 items-center gap-x-3 gap-y-4 auto-cols-max">
                                                <FormItem className="col-start-10 col-end-13 mb-0">
                                                    <div className="flex justify-end">
                                                        <Button
                                                            variant="solid"
                                                            type="submit"
                                                        >
                                                            Cargar datos
                                                        </Button>
                                                    </div>
                                                </FormItem>
                                            </div>
                                        </div>
                                    </FormContainer>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default DynamicForm
