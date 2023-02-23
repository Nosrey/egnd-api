import React from 'react'
import { Input, Button, Select, FormItem, FormContainer } from 'components/ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'

const options = [
    { value: 'foo', label: 'Foo' },
    { value: 'bar', label: 'Bar' },
]

const validationSchema = Yup.object().shape({
    nombreEmpresa: Yup.string().required('Please input user name!'),
    modeloNegorcio: Yup.string().required('Please select one!'),
    moneda: Yup.string().required('Please select one!'),
})

const AssumptionGeneral = () => {
    return (
        <div>
            <div className="border-b-2 mb-8 pb-1">
                <h4>Assumptions Generales</h4>
                <span>Supuestos Generales</span>
            </div>
            <div className="border-solid border-2 border-#e5e7eb rounded-lg">
                <div className="border-b-2 px-4 py-1">
                    <h6>Carga de datos</h6>
                </div>
                <div className="px-4 py-5">
                    <Formik
                        initialValues={{
                            nombreEmpresa: '',
                            modeloNegorcio: '',
                            moneda: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            console.log('values', values)
                            setTimeout(() => {
                                setSubmitting(false)
                                resetForm()
                            }, 400)
                        }}
                    >
                        {({ values, touched, errors, resetForm }) => (
                            <Form>
                                <FormContainer className="grid grid-cols-3 grid-rows-4 items-center gap-x-3">
                                    <FormItem
                                        className="col-span-1 row-start-1"
                                        label="Nombre de la empresa"
                                        invalid={
                                            errors.nombreEmpresa &&
                                            touched.nombreEmpresa
                                        }
                                        errorMessage={errors.nombreEmpresa}
                                    >
                                        <Field
                                            placeholder="Mi empresa SRL"
                                            type="text"
                                            name="nombreEmpresa"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <span className="col-start-2 col-end-3 row-start-1">
                                        Escribe el nombre de tu compañía.
                                    </span>

                                    <FormItem
                                        className="col-span-1 row-start-2"
                                        label="Modelo de negocio"
                                        invalid={
                                            errors.modeloNegorcio &&
                                            touched.modeloNegorcio
                                        }
                                        errorMessage={errors.modeloNegorcio}
                                    >
                                        <Field name="modeloNegorcio">
                                            {({ field, form }) => (
                                                <Select
                                                    placeholder="Selector de negocio"
                                                    field={field}
                                                    form={form}
                                                    options={options}
                                                    value={options.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.modeloNegorcio
                                                    )}
                                                    onChange={(option) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            option.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <span className="col-start-2 col-end-3 row-start-2">
                                        Determina el modelo de negocio de tu
                                        compañía, si no lo sabes puedes usar la
                                        guia donde te mostraremos varios
                                        ejemplos.{' '}
                                        <Link className="underline decoration-solid text-blue-600">
                                            Ver guia.
                                        </Link>
                                    </span>

                                    <FormItem
                                        className="col-span-1 row-start-3"
                                        label="Moneda"
                                        invalid={
                                            errors.moneda && touched.moneda
                                        }
                                        errorMessage={errors.moneda}
                                    >
                                        <Field name="moneda">
                                            {({ field, form }) => (
                                                <Select
                                                    placeholder="Selector de moneda"
                                                    field={field}
                                                    form={form}
                                                    options={options}
                                                    value={options.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.moneda
                                                    )}
                                                    onChange={(option) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            option.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <span className="col-start-2 col-end-3 row-start-3">
                                        Es la moneda para el armado del plan,
                                        luego podras convertir en otras monedas
                                        para entender mejor tu compañía.
                                    </span>

                                    <FormItem className="col-start-3 row-start-4">
                                        <div className="flex justify-center">
                                            <Button
                                                variant="solid"
                                                type="submit"
                                            >
                                                Cargar datos
                                            </Button>
                                        </div>
                                    </FormItem>
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default AssumptionGeneral
