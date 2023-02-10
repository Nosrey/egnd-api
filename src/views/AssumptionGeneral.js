import React from 'react'
import { FormContainer, FormItem, Input, Select, Button } from 'components/ui'
import { Field, Form, Formik } from 'formik'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

function AssumptionGeneral() {
    const colourOptions = [
        { value: 'ocean', label: 'Ocean', color: '#00B8D9' },
        { value: 'blue', label: 'Blue', color: '#0052CC' },
        { value: 'purple', label: 'Purple', color: '#5243AA' },
    ]

    const validationSchema = Yup.object().shape({
        nombreEmpresa: Yup.string().required('Please input user name!'),
        modeloNegocio: Yup.string().required('Please select one!'),
        moneda: Yup.string().required('Please select one!'),
    })
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
                            modeloNegocio: '',
                            moneda: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            console.log('values', values)
                            setTimeout(() => {
                                alert(JSON.stringify(values, null, 2))
                                setSubmitting(false)
                                resetForm()
                            }, 400)
                        }}
                    >
                        {({ touched, errors, resetForm, values }) => (
                            <Form>
                                <FormContainer className="grid grid-cols-3 grid-rows-4 items-center gap-x-3">
                                    <FormItem
                                        label="Nombre de la empresa"
                                        className="col-span-1 row-start-1"
                                        invalid={
                                            errors.nombreEmpresa &&
                                            touched.nombreEmpresa
                                        }
                                        errorMessage={errors.nombreEmpresa}
                                    >
                                        <Field
                                            type="text"
                                            name="nombreEmpresa"
                                            component={Input}
                                            placeholder="Mi empresa SRL"
                                        />
                                    </FormItem>

                                    <span className="col-start-2 col-end-3 row-start-1">
                                        Escribe el nombre de tu compañía.
                                    </span>

                                    <FormItem
                                        label="Modelo de negocio"
                                        className="col-span-1 row-start-2"
                                        invalid={
                                            errors.modeloNegocio &&
                                            touched.modeloNegocio
                                        }
                                        errorMessage={errors.modeloNegocio}
                                    >
                                        <Field name="modeloNegocio">
                                            {({ field, form }) => (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={colourOptions}
                                                    value={colourOptions.filter(
                                                        (option) =>
                                                            option.value ===
                                                            values.modeloNegocio
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
                                        ejemplos. <Link>Ver guia.</Link>
                                    </span>
                                    {/* 
                                    <FormItem
                                        label="Moneda"
                                        className="col-span-1 row-start-3"
                                        invalid={
                                            errors.moneda && touched.moneda
                                        }
                                        errorMessage={errors.moneda}
                                    >
                                        <Field
                                            type="select"
                                            name="moneda"
                                            component={Select}
                                            options={colourOptions}
                                            placeholder="Selector de moneda"
                                        />
                                    </FormItem> */}

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
                                                onClick={() =>
                                                    console.log('hasd')
                                                }
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

// import React from 'react'
// import { Input, Button, Select, FormItem, FormContainer } from 'components/ui'
// import { Field, Form, Formik } from 'formik'
// import * as Yup from 'yup'

// const options = [
//     { value: 'foo', label: 'Foo' },
//     { value: 'bar', label: 'Bar' },
// ]

// const validationSchema = Yup.object().shape({
//     input: Yup.string()
//         .min(3, 'Too Short!')
//         .max(20, 'Too Long!')
//         .required('Please input user name!'),
//     select: Yup.string().required('Please select one!'),
// })

// const AssumptionGeneral = () => {
//     return (
//         <div>
//             <Formik
//                 enableReinitialize
//                 initialValues={{
//                     input: '',
//                     select: '',
//                 }}
//                 validationSchema={validationSchema}
//                 onSubmit={(values, { setSubmitting }) => {
//                     console.log('values', values)
//                     setTimeout(() => {
//                         alert(JSON.stringify(values, null, 2))
//                         setSubmitting(false)
//                     }, 400)
//                 }}
//             >
//                 {({ values, touched, errors, resetForm }) => (
//                     <Form>
//                         <FormContainer>
//                             <FormItem
//                                 label="Empresa"
//                                 asterisk
//                                 invalid={errors.input && touched.input}
//                                 errorMessage={errors.input}
//                             >
//                                 <Field
//                                     type="text"
//                                     name="input"
//                                     component={Input}
//                                 />
//                             </FormItem>
//                             <FormItem
//                                 label="Select"
//                                 asterisk
//                                 invalid={errors.select && touched.select}
//                                 errorMessage={errors.select}
//                             >
//                                 <Field name="select">
//                                     {({ field, form }) => (
//                                         <Select
//                                             field={field}
//                                             form={form}
//                                             options={options}
//                                             value={options.filter(
//                                                 (option) =>
//                                                     option.value ===
//                                                     values.select
//                                             )}
//                                             onChange={(option) =>
//                                                 form.setFieldValue(
//                                                     field.name,
//                                                     option.value
//                                                 )
//                                             }
//                                         />
//                                     )}
//                                 </Field>
//                             </FormItem>

//                             <FormItem>
//                                 <Button variant="solid" type="submit">
//                                     Submit
//                                 </Button>
//                             </FormItem>
//                         </FormContainer>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     )
// }

// export default AssumptionGeneral
