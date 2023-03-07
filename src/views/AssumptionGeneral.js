import React, { useEffect, useState } from 'react'
import {
    Input,
    Button,
    Select,
    FormItem,
    FormContainer,
    Upload,
} from 'components/ui'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { editBusinessInfo, getUser } from 'services/Requests'

const options = [
    { value: 'foo', label: 'Foo' },
    { value: 'bar', label: 'Bar' },
]

const MIN_UPLOAD = 1
const MAX_UPLOAD = 1

const validationSchema = Yup.object().shape({
    nombreEmpresa: Yup.string().required(
        'Por favor ingrese su nombre de negocio'
    ),
    modeloNegorcio: Yup.string().required(
        'Por favor seleccione un modelo de negocio'
    ),
    moneda: Yup.string().required('Por favor seleccione una moneda'),
    upload: Yup.array().min(MIN_UPLOAD, '¡Al menos un archivo subido!'),
})

const AssumptionGeneral = () => {
    const [info, setInfo] = useState()
    useEffect(() => {
        getUser()
            .then((data) => {
                setInfo(data)
            })
            .catch((error) => console.error(error))
    }, [])

    const onSetFormFile = (form, field, files) => {
        form.setFieldValue(field.name, files)
    }

    const beforeUpload = (file, fileList) => {
        let valid = true

        const allowedFileType = ['image/jpeg', 'image/png']
        const MAX_FILE_SIZE = 500000

        if (fileList.length >= MAX_UPLOAD) {
            return `Solo puede cargar ${MAX_UPLOAD} file(s)`
        }

        for (let f of file) {
            if (!allowedFileType.includes(f.type)) {
                valid = '¡Cargue un archivo .jpeg o .png!'
            }

            if (f.size >= MAX_FILE_SIZE) {
                valid = '¡La imagen no puede superar los 500kb!'
            }
        }

        return valid
    }

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
                    {info && (
                        <Formik
                            initialValues={{
                                nombreEmpresa: info?.businessName || '',
                                modeloNegorcio:
                                    info?.businessInfo[0]?.businessModel.toLowerCase() ||
                                    '',
                                moneda:
                                    info?.businessInfo[0]?.currency.toLowerCase() ||
                                    '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(
                                values,
                                { resetForm, setSubmitting }
                            ) => {
                                console.log(values)
                                editBusinessInfo(
                                    values?.modeloNegorcio,
                                    values?.moneda
                                )
                                    .then((data) => {
                                        setTimeout(() => {
                                            setSubmitting(false)
                                            resetForm()
                                        }, 400)
                                    })
                                    .catch((error) => {
                                        console.error(
                                            'Error de API:',
                                            error.response.data.message
                                        )
                                    })
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
                                            compañía, si no lo sabes puedes usar
                                            la guia donde te mostraremos varios
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
                                            Es la moneda para el armado del
                                            plan, luego podras convertir en
                                            otras monedas para entender mejor tu
                                            compañía.
                                        </span>

                                        <FormItem
                                            className="row-start-4"
                                            label="Upload"
                                            invalid={Boolean(
                                                errors.upload && touched.upload
                                            )}
                                            errorMessage={errors.upload}
                                        >
                                            <Field name="upload">
                                                {({ field, form }) => (
                                                    <Upload
                                                        draggable
                                                        onChange={(files) =>
                                                            onSetFormFile(
                                                                form,
                                                                field,
                                                                files
                                                            )
                                                        }
                                                        onFileRemove={(files) =>
                                                            onSetFormFile(
                                                                form,
                                                                field,
                                                                files
                                                            )
                                                        }
                                                        beforeUpload={
                                                            beforeUpload
                                                        }
                                                        fileList={values.upload}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>

                                        <FormItem className="col-start-3 row-start-5">
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
                    )}
                </div>
            </div>
        </div>
    )
}

export default AssumptionGeneral
