import React from 'react'
import { Field, Form, Formik} from 'formik'
import {
    Input,
    Button,
    FormItem,
    Table,
    Card,
    FormContainer,
} from 'components/ui'
const { Tr, Td, TBody } = Table

const plazos = {
    contado:'',
    treintaDias: '',
    cuarentaycincoDias: '',
    sesentaDias: '',
    noventaDias: '',
    cveinteDias:'',
    ccincuentaDias:'',
    cochenteDias:'',
    ddiezDiaz:'',
    dcuarentaDias:'',
    dsetentaDias:'',
    trescientosDias:'',
    ttreintaDias:'',
    IVA:'',
    imponible:'',
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


const AssumptionsFinancieras
 = () => {
    
    return (
        <div>
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
                        cobranzas: plazos,
                        pagoProducto: plazos,
                        pagoServicio: plazos,
                        stock:'',
                        inversion: plazos,
                    }}
                    onSubmit={(values, { resetForm, setSubmitting }) => {
                        console.log('values', values)
                    }}
                >
                    {({ values, touched, errors, resetForm }) => (
                        <Form>
                            <FormContainer >
                                <Table>
                                    <TBody>
                                        <Tr className="w-[1900px]">
                                            <Td className="w-[1900px] grid grid-cols-10  gap-x-3 ">
                                        <Card className="col-start-1 col-end-3 row-start-1">
                                            <h5 className='mb-[18px]'>Plazo de cobranzas</h5>
                                            <div className='flex justify-end mb-3'>
                                                <p className='w-[60%] '>% Sobre Total</p>
                                            </div>
                                            <div>
                                                {tiempos.map((
                                                            time,
                                                            index
                                                        ) => {
                                                            return (
                                                            <div key={index} className={`flex justify-between items-center mb-1 ${time.name=== 'IVA' && 'border border-transparent border-t-gray-300 pt-2'}`}>
                                                                <p className='mt-[-30px] w-[40%]'>
                                                                {time.name === 'IVA' ? 'IVA DF (venta)' :
                                                                    (time.name === 'imponible' ? 'Imponible sobre venta' : time.label)}
                                                                </p>
                                                                <FormItem className=" w-[60%]"
                                                                >
                                                                    <Field
                                                                        placeholder="0.0"
                                                                        name={`cobranzas.${time.name}`}
                                                                        type="number"
                                                                        size="sm"
                                                                        suffix="%"
                                                                        component={
                                                                            Input
                                                                        }
                                                                    />
                                                                </FormItem>
                                                            </div>
                                                            )
                                                        }
                                                ) }
                                            </div>
                                        </Card>
                                        <Card className="col-start-3 col-end-5 row-start-1">
                                            <h5 className='mb-[18px]'>Plazo de pago - Productos</h5>
                                            <div className='flex justify-end mb-3'>
                                                <p className='w-[60%] '>% Sobre Total</p>
                                            </div>
                                            <div>
                                            {tiempos.map((
                                                            time,
                                                            index
                                                        ) => {
                                                            return (
                                                            <div key={index}  className={`flex justify-between items-center mb-1 ${time.name=== 'IVA' && 'border border-transparent border-t-gray-300 pt-2'}`}>
                                                                <p  className='mt-[-30px] w-[40%]'>
                                                                    {time.name=== 'IVA' ? 'IVA CF (costo)' :
                                                                    (time.name=== 'imponible' ? 'Imponible sobre costo' : time.label)}
                                                                    </p>
                                                                <FormItem className=" w-[60%]">
                                                                    <Field
                                                                        placeholder="0.0"
                                                                        name={`pagoProducto.${time.name}`}
                                                                        type="number"
                                                                        size="sm"
                                                                        suffix="%"
                                                                        component={
                                                                            Input
                                                                        }
                                                                    />
                                                                </FormItem>
                                                            </div>
                                                            )
                                                        }
                                                ) }
                                            </div>
                                        </Card>
                                        <Card className="col-start-5 col-end-7 row-start-1">
                                            <h5 className='mb-[18px]'>Plazo de pago - Servicios/Gasto</h5>
                                            <div className='flex justify-end mb-3'>
                                                <p className='w-[60%] '>% Sobre Total</p>
                                            </div>
                                            <div>
                                            {tiempos.map((
                                                            time,
                                                            index
                                                        ) => {
                                                            return (
                                                            <div key={index}  className={`flex justify-between items-center mb-1 ${time.name=== 'IVA' && 'border border-transparent border-t-gray-300 pt-2'}`}>
                                                                <p className='mt-[-30px] w-[40%]'>
                                                                    {time.name === 'IVA' ? 'IVA CF (costo)' :
                                                                    (time.name === 'imponible' ? 'Imponible sobre costo' : time.label)}
                                                                </p>
                                                                <FormItem className=" w-[60%]">
                                                                    <Field
                                                                        placeholder="0.0"
                                                                        name={`pagoServicio.${time.name}`}
                                                                        type="number"
                                                                        size="sm"
                                                                        suffix="%"
                                                                        component={
                                                                            Input
                                                                        }
                                                                    />
                                                                </FormItem>
                                                            </div>
                                                            )
                                                        }
                                                ) }
                                            </div>
                                        </Card>
                                        <Card className="col-start-7 col-end-9 row-start-1">
                                            <h5 className='mb-[18px]'>Meses de Stock</h5>
                                            <div>
                                                <FormItem className=" w-[60%]">
                                                    <Field
                                                        placeholder="0.0"
                                                        name="stock"
                                                        type="number"
                                                        size="sm"
                                                        suffix="%"
                                                        component={
                                                            Input
                                                        }
                                                    />
                                                </FormItem>
                                            </div>
                                        </Card>
                                        <Card className="col-start-9 col-end-11 row-start-1">
                                            <h5 className='mb-[18px]'>Inversión</h5>
                                            <div className='flex justify-end mb-3'>
                                                <p className='w-[60%] '>% Sobre Total</p>
                                            </div>
                                            <div>
                                            {tiempos.map((
                                                            time,
                                                            index
                                                        ) => {
                                                            return (
                                                            <div key={index}  className={`flex justify-between items-center ${time.name=== 'IVA' && 'border border-transparent border-t-gray-300 pt-2'}`}>
                                                                <p className='mt-[-30px] w-[40%]'>
                                                                    {time.name === 'IVA' ? 'IVA CF (costo)' :
                                                                    (time.name === 'imponible' ? 'Imponible sobre costo' : time.label)}
                                                                </p>
                                                                <FormItem className=" w-[60%] ">
                                                                    <Field
                                                                        placeholder="0.0"
                                                                        name={`inversion.${time.name}`}
                                                                        type="number"
                                                                        size="sm"
                                                                        suffix="%"
                                                                        component={
                                                                            Input
                                                                        }
                                                                    />
                                                                </FormItem>
                                                            </div>
                                                            )
                                                        }
                                                ) }
                                            </div>
                                        </Card>
                                        </Td>
                                        </Tr>
                                    </TBody>
                                </Table>
                                
                                <div className='flex justify-end'>
                                    <Button
                                    className='flex justify-end mt-6'
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

