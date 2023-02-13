import React from 'react'
import { FormContainer, FormItem, Input, Select, Button } from 'components/ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Avatar } from 'components/ui'
import CreatableSelect from 'react-select/creatable'

function AssumptionVentas() {
    const options = [
        { value: 'foo', label: 'Foo' },
        { value: 'bar', label: 'Bar' },
    ]

    const validationSchema = Yup.object().shape({
        celular: Yup.string().required('Please input user name!'),
        oneShot: Yup.string().required('Please input user name!'),
        producto: Yup.string().required('Please input user name!'),
        suscripcionNube: Yup.string().required('Please input user name!'),
        suscripcionMensual: Yup.string().required('Please input user name!'),
        servicio: Yup.string().required('Please input user name!'),
        pais: Yup.array().min(1, 'At least one is selected!'),
        canal: Yup.string().required('Please input user name!'),
        mismoCliente: Yup.string().required('Please input user name!'),
        celularCanal: Yup.string().required('Please input user name!'),
        volumenCliente: Yup.string().required('Please input user name!'),
        suscripcionNubeCanal: Yup.string().required('Please input user name!'),
        volumenClienteDos: Yup.string().required('Please input user name!'),
        canalDos: Yup.string().required('Please input user name!'),
        mismoClienteDos: Yup.string().required('Please input user name!'),
        celularCanalDos: Yup.string().required('Please input user name!'),
        volumenClienteTres: Yup.string().required('Please input user name!'),
        suscripcionNubeCanalDos: Yup.string().required(
            'Please input user name!'
        ),
        volumenClienteCuatro: Yup.string().required('Please input user name!'),
    })

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
                        initialValues={{
                            celular: '',
                            oneShot: '',
                            producto: '',
                            suscripcionNube: '',
                            suscripcionMensual: '',
                            servicio: '',
                            pais: [],
                            canal: '',
                            mismoCliente: '',
                            celularCanal: '',
                            volumenCliente: '',
                            suscripcionNubeCanal: '',
                            volumenClienteDos: '',
                            canalDos: '',
                            mismoClienteDos: '',
                            celularCanalDos: '',
                            volumenClienteTres: '',
                            suscripcionNubeCanalDos: '',
                            volumenClienteCuatro: '',
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
                                <FormContainer className="grid grid-cols-12 grid-rows-15 items-center gap-x-3 gap-y-4 auto-cols-max">
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

                                    <Avatar className="col-start-1 row-start-2 mr-4 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                                        1
                                    </Avatar>

                                    <FormItem
                                        className="col-start-2 col-end-6 row-start-2 mb-0"
                                        invalid={
                                            errors.celular && touched.celular
                                        }
                                        errorMessage={errors.celular}
                                    >
                                        <Field
                                            placeholder="Celulares"
                                            type="text"
                                            name="celular"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="col-start-6 col-end-10 row-start-2 mb-0"
                                        invalid={
                                            errors.oneShot && touched.oneShot
                                        }
                                        errorMessage={errors.oneShot}
                                    >
                                        <Field name="oneShot">
                                            {({ field, form }) => (
                                                <Select
                                                    placeholder="One shot"
                                                    field={field}
                                                    form={form}
                                                    options={options}
                                                    value={options.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.oneShot
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

                                    <FormItem
                                        className="col-start-10 col-end-13 row-start-2 mb-0"
                                        invalid={
                                            errors.producto && touched.producto
                                        }
                                        errorMessage={errors.producto}
                                    >
                                        <Field name="producto">
                                            {({ field, form }) => (
                                                <Select
                                                    placeholder="Producto"
                                                    field={field}
                                                    form={form}
                                                    options={options}
                                                    value={options.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.producto
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

                                    <Avatar className="row-start-3 mr-4 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                                        2
                                    </Avatar>

                                    <FormItem
                                        className="col-start-2 col-end-6 row-start-3 mb-0"
                                        invalid={
                                            errors.suscripcionNube &&
                                            touched.suscripcionNube
                                        }
                                        errorMessage={errors.suscripcionNube}
                                    >
                                        <Field
                                            placeholder="Suscripción nube"
                                            type="text"
                                            name="suscripcionNube"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="col-start-6 col-end-10 row-start-3 mb-0"
                                        invalid={
                                            errors.suscripcionMensual &&
                                            touched.suscripcionMensual
                                        }
                                        errorMessage={errors.suscripcionMensual}
                                    >
                                        <Field name="suscripcionMensual">
                                            {({ field, form }) => (
                                                <Select
                                                    placeholder="Suscripción mensual"
                                                    field={field}
                                                    form={form}
                                                    options={options}
                                                    value={options.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.suscripcionMensual
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

                                    <FormItem
                                        className="row-start-3 col-start-10 col-end-13 mb-0"
                                        invalid={
                                            errors.servicio && touched.servicio
                                        }
                                        errorMessage={errors.servicio}
                                    >
                                        <Field name="servicio">
                                            {({ field, form }) => (
                                                <Select
                                                    placeholder="Servicio"
                                                    field={field}
                                                    form={form}
                                                    options={options}
                                                    value={options.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.servicio
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

                                    <FormItem className="row-start-4 col-start-1 col-end-4 mb-0">
                                        <div className="flex justify-between gap-x-2">
                                            <Button variant="solid">
                                                Agregar item
                                            </Button>
                                            <Button
                                                variant="solid"
                                                color="red-600"
                                            >
                                                Eliminar item
                                            </Button>
                                        </div>
                                    </FormItem>

                                    <span className="row-start-5 col-start-1 col-end-6">
                                        Pais
                                    </span>

                                    <FormItem
                                        className="row-start-6 col-start-1 col-end-6 mb-0"
                                        invalid={Boolean(
                                            errors.pais && touched.pais
                                        )}
                                        errorMessage={errors.pais}
                                    >
                                        <Field name="pais">
                                            {({ field, form }) => (
                                                <Select
                                                    placeholder="Pais"
                                                    componentAs={
                                                        CreatableSelect
                                                    }
                                                    isMulti
                                                    field={field}
                                                    form={form}
                                                    options={options}
                                                    value={values.pais}
                                                    onChange={(option) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            option
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <span className="row-start-7 col-start-1  col-end-6">
                                        Canal
                                    </span>
                                    <span className="row-start-7 col-start-6  col-end-8">
                                        Volumen por cliente
                                    </span>
                                    <span className="row-start-7 col-start-8  col-end-13">
                                        ¿Son las ventas de productos a un mismo
                                        cliente?
                                    </span>

                                    <FormItem
                                        className="row-start-8 col-start-1 col-end-8 mb-0"
                                        invalid={errors.canal && touched.canal}
                                        errorMessage={errors.canal}
                                    >
                                        <Field
                                            placeholder="Nombre"
                                            type="text"
                                            name="canal"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="row-start-8 col-start-8  col-end-11 mb-0"
                                        invalid={
                                            errors.mismoCliente &&
                                            touched.mismoCliente
                                        }
                                        errorMessage={errors.mismoCliente}
                                    >
                                        <Field name="mismoCliente">
                                            {({ field, form }) => (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={options}
                                                    value={options.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.mismoCliente
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

                                    <FormItem
                                        className="row-start-9 col-start-2 col-end-6 mb-0"
                                        invalid={
                                            errors.celularCanal &&
                                            touched.celularCanal
                                        }
                                        errorMessage={errors.celularCanal}
                                    >
                                        <Field
                                            placeholder="Celulares"
                                            type="text"
                                            name="celularCanal"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="row-start-9 col-start-6 col-end-8 mb-0"
                                        invalid={
                                            errors.volumenCliente &&
                                            touched.volumenCliente
                                        }
                                        errorMessage={errors.volumenCliente}
                                    >
                                        <Field
                                            placeholder="Numero"
                                            type="text"
                                            name="volumenCliente"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="row-start-10 col-start-2 col-end-6 mb-0"
                                        invalid={
                                            errors.suscripcionNubeCanal &&
                                            touched.suscripcionNubeCanal
                                        }
                                        errorMessage={
                                            errors.suscripcionNubeCanal
                                        }
                                    >
                                        <Field
                                            placeholder="Suscripción nube"
                                            type="text"
                                            name="suscripcionNubeCanal"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="row-start-10 col-start-6 col-end-8 mb-0"
                                        invalid={
                                            errors.volumenClienteDos &&
                                            touched.volumenClienteDos
                                        }
                                        errorMessage={errors.volumenClienteDos}
                                    >
                                        <Field
                                            placeholder="Numero"
                                            type="text"
                                            name="volumenClienteDos"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="row-start-11 col-start-1 col-end-8 mb-0"
                                        invalid={
                                            errors.canalDos && touched.canalDos
                                        }
                                        errorMessage={errors.canalDos}
                                    >
                                        <Field
                                            placeholder="Nombre"
                                            type="text"
                                            name="canalDos"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="row-start-11 col-start-8  col-end-11 mb-0"
                                        invalid={
                                            errors.mismoClienteDos &&
                                            touched.mismoClienteDos
                                        }
                                        errorMessage={errors.mismoClienteDos}
                                    >
                                        <Field name="mismoClienteDos">
                                            {({ field, form }) => (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={options}
                                                    value={options.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.mismoClienteDos
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

                                    <FormItem
                                        className="row-start-12 col-start-2 col-end-6 mb-0"
                                        invalid={
                                            errors.celularCanalDos &&
                                            touched.celularCanalDos
                                        }
                                        errorMessage={errors.celularCanalDos}
                                    >
                                        <Field
                                            placeholder="Celulares"
                                            type="text"
                                            name="celularCanalDos"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="row-start-12 col-start-6 col-end-8 mb-0"
                                        invalid={
                                            errors.volumenClienteTres &&
                                            touched.volumenClienteTres
                                        }
                                        errorMessage={errors.volumenClienteTres}
                                    >
                                        <Field
                                            placeholder="Numero"
                                            type="text"
                                            name="volumenClienteTres"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="row-start-13 col-start-2 col-end-6 mb-0"
                                        invalid={
                                            errors.suscripcionNubeCanalDos &&
                                            touched.suscripcionNubeCanalDos
                                        }
                                        errorMessage={
                                            errors.suscripcionNubeCanalDos
                                        }
                                    >
                                        <Field
                                            placeholder="Suscripción nube"
                                            type="text"
                                            name="suscripcionNubeCanalDos"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        className="row-start-13 col-start-6 col-end-8 mb-0"
                                        invalid={
                                            errors.volumenClienteCuatro &&
                                            touched.volumenClienteCuatro
                                        }
                                        errorMessage={
                                            errors.volumenClienteCuatro
                                        }
                                    >
                                        <Field
                                            placeholder="Numero"
                                            type="text"
                                            name="volumenClienteCuatro"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem className="row-start-14 row-end-15 col-start-1 col-end-4 mb-0">
                                        <div className="flex gap-x-2">
                                            <Button variant="solid">
                                                Agregar canal
                                            </Button>
                                            <Button
                                                variant="solid"
                                                color="red-600"
                                            >
                                                Eliminar canal
                                            </Button>
                                        </div>
                                    </FormItem>

                                    {/* <FormItem className=" row-start-4 mb-0">
                                        <div className="flex justify-center">
                                            <Button
                                                variant="solid"
                                                type="submit"
                                            >
                                                Cargar datos
                                            </Button>
                                        </div>
                                    </FormItem> */}
                                </FormContainer>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default AssumptionVentas
