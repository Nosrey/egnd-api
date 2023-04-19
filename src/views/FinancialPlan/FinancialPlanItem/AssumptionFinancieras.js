/* eslint-disable no-nested-ternary */
import {
  Alert,
  Button,
  Card,
  FormContainer,
  FormItem,
  Input,
  Table,
} from 'components/ui'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { createAssumpFinanciera, getUser } from 'services/Requests'
import { useMedia } from 'utils/hooks/useMedia'

const { Tr, Td, TBody } = Table

const plazos = {
  contado: '',
  treintaDias: '',
  cuarentaycincoDias: '',
  sesentaDias: '',
  noventaDias: '',
  cveinteDias: '',
  ccincuentaDias: '',
  cochenteDias: '',
  ddiezDiaz: '',
  dcuarentaDias: '',
  dsetentaDias: '',
  trescientosDias: '',
  ttreintaDias: '',
  IVA: '',
  imponible: '',
}

const defaultState = {
  cobranzas: plazos,
  pagoProducto: plazos,
  pagoServicio: plazos,
  stock: '',
  inversion: plazos,
}

const tiempos = [
  { name: 'contado', label: 'Contado' },
  { name: 'treintaDias', label: '30 días' },
  { name: 'cuarentaycincoDias', label: '45 días' },
  { name: 'sesentaDias', label: '60 días' },
  { name: 'noventaDias', label: '90 días' },
  { name: 'cveinteDias', label: '120 días' },
  { name: 'ccincuentaDias', label: '150 días' },
  { name: 'cochenteDias', label: '180 días' },
  { name: 'ddiezDiaz', label: '210 días' },
  { name: 'dcuarentaDias', label: '240 días' },
  { name: 'dsetentaDias', label: '270 días' },
  { name: 'trescientosDias', label: '300 días' },
  { name: 'ttreintaDias', label: '330 días' },
  { name: 'IVA', label: 'IVA' },
  { name: 'imponible', label: 'Imponible' },
]

function AssumptionsFinancieras() {
  const media = useMedia()
  const [userData, setUserData] = useState()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  const [dataFinanciera, setDataFinanciera] = useState(defaultState)
  useEffect(() => {
    getUser().then((d) => {
      setUserData(d)
      if (d.assumpFinancierasData[0]) {
        setDataFinanciera(d.assumpFinancierasData[0])
      }
    })
  }, [setDataFinanciera])

  const submit = (values) => {
    const { cobranzas, inversion, pagoProducto, pagoServicio, stock } = values

    createAssumpFinanciera(
      cobranzas,
      pagoProducto,
      pagoServicio,
      stock,
      inversion
    )
      .then((data) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })

        if (data.error) {
          setShowErrorAlert(true)
          setTimeout(() => {
            setShowErrorAlert(false)
          }, 5000)
        } else {
          setShowSuccessAlert(true)
          setTimeout(() => {
            setShowSuccessAlert(false)
          }, 5000)
        }
      })
      .catch((error) => {
        console.error(error, '[ERROR]')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setShowErrorAlert(true)
        setTimeout(() => {
          setShowErrorAlert(false)
        }, 5000)
      })
  }

  const setFormValues = (index, campo, value) => {
    if (index !== 'stock') {
      const input = tiempos[index].name
      const state = dataFinanciera.input
      const newData = { ...dataFinanciera[campo], [input]: value }
      setDataFinanciera({
        ...dataFinanciera,
        [campo]: newData,
      })
    } else {
      setDataFinanciera({ ...dataFinanciera, [index]: value })
    }
  }

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
        <h4>Assumption Financieras</h4>
        <span>Financial Plan</span>
      </div>
      <div className="border-solid border-2 border-#e5e7eb rounded-lg">
        <div className="border-b-2 px-4 py-1">
          <h6>Carga de Plazos</h6>
        </div>

        <div className="px-4 py-5">
          <Formik
            initialValues={{
              cobranzas: dataFinanciera.cobranzas,
              pagoProducto: dataFinanciera.pagoProducto,
              pagoServicio: dataFinanciera.pagoServicio,
              stock: dataFinanciera.stock,
              inversion: dataFinanciera.inversion,
            }}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              submit(dataFinanciera)
            }}
          >
            {({ values, touched, errors, resetForm }) => (
              <Form>
                <FormContainer>
                  <Table>
                    <TBody>
                      <Tr className="w-[1900px]">
                        <Td className="w-[1900px] grid grid-cols-10  gap-x-3 ">
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
                                    {time.name === 'IVA'
                                      ? 'IVA DF (venta)'
                                      : time.name === 'imponible'
                                      ? 'Imponible sobre venta'
                                      : time.label}
                                  </p>{' '}
                                  <FormItem
                                    className={`${
                                      media === 'mobile' ? 'w-[50%]' : 'w-[60%]'
                                    } `}
                                  >
                                    <Field
                                      placeholder="0.0"
                                      name={`cobranzas.${time.name}`}
                                      value={
                                        dataFinanciera.cobranzas[time.name]
                                      }
                                      type="text"
                                      size="sm"
                                      suffix="%"
                                      component={Input}
                                      onChange={(e) =>
                                        setFormValues(
                                          index,
                                          'cobranzas',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </FormItem>
                                </div>
                              ))}
                            </div>
                          </Card>
                          <Card className="col-start-3 col-end-5 row-start-1">
                            <h5 className="mb-[18px]">
                              Plazo de pago - Productos
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
                                    {time.name === 'IVA'
                                      ? 'IVA CF (costo)'
                                      : time.name === 'imponible'
                                      ? 'Imponible sobre costo'
                                      : time.label}
                                  </p>
                                  <FormItem
                                    className={`${
                                      media === 'mobile' ? 'w-[60%]' : 'w-[60%]'
                                    } `}
                                  >
                                    <Field
                                      placeholder="0.0"
                                      value={
                                        dataFinanciera.pagoProducto[time.name]
                                      }
                                      type="number"
                                      size="sm"
                                      suffix="%"
                                      component={Input}
                                      onChange={(e) =>
                                        setFormValues(
                                          index,
                                          'pagoProducto',
                                          e.target.value
                                        )
                                      }
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
                                    {time.name === 'IVA'
                                      ? 'IVA CF (costo)'
                                      : time.name === 'imponible'
                                      ? 'Imponible sobre costo'
                                      : time.label}
                                  </p>
                                  <FormItem
                                    className={`${
                                      media === 'mobile' ? 'w-[60%]' : 'w-[60%]'
                                    } `}
                                  >
                                    <Field
                                      placeholder="0.0"
                                      value={
                                        dataFinanciera.pagoServicio[time.name]
                                      }
                                      type="number"
                                      size="sm"
                                      suffix="%"
                                      component={Input}
                                      onChange={(e) =>
                                        setFormValues(
                                          index,
                                          'pagoServicio',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </FormItem>
                                </div>
                              ))}
                            </div>
                          </Card>
                          <Card className="col-start-7 col-end-9 row-start-1">
                            <h5 className="mb-[18px]">Meses de Stock</h5>
                            <div>
                              <FormItem
                                className={`${
                                  media === 'mobile' ? 'w-[60%]' : 'w-[60%]'
                                } `}
                              >
                                <Field
                                  placeholder="0.0"
                                  value={dataFinanciera.stock}
                                  type="number"
                                  size="sm"
                                  suffix="%"
                                  component={Input}
                                  onChange={(e) =>
                                    setFormValues(
                                      'stock',
                                      'pagoProducto',
                                      e.target.value
                                    )
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
                                    {time.name === 'IVA'
                                      ? 'IVA CF (costo)'
                                      : time.name === 'imponible'
                                      ? 'Imponible sobre costo'
                                      : time.label}
                                  </p>
                                  <FormItem
                                    className={`${
                                      media === 'mobile' ? 'w-[60%]' : 'w-[60%]'
                                    } `}
                                  >
                                    <Field
                                      placeholder="0.0"
                                      value={
                                        dataFinanciera.inversion[time.name]
                                      }
                                      type="number"
                                      size="sm"
                                      suffix="%"
                                      component={Input}
                                      onChange={(e) =>
                                        setFormValues(
                                          index,
                                          'inversion',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </FormItem>
                                </div>
                              ))}
                            </div>
                          </Card>
                        </Td>
                      </Tr>
                    </TBody>
                  </Table>

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
      </div>
    </div>
  )
}

export default AssumptionsFinancieras
