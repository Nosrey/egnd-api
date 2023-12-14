/* eslint-disable no-restricted-globals */
/* eslint-disable no-loop-func */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unsafe-optional-chaining */


import ContainerScrollable from 'components/shared/ContainerScrollable';
import MySpinner from 'components/shared/loaders/MySpinner'; 
import { Alert, FormContainer } from 'components/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { calcAmortizaciones, calcInteresMensual, calcInteresesPagadosPorAnio, calculateCostosAnuales, calculateCostosAnualesTipo, calculateCostosTotales, calculateCtas, calculateMargenBrutoPesos, calculateMargenBrutoPorcentaje, calculateVentas,calculateVentasTipo, multiplicacionPxQCapex, showMultiplicacionPxQ, totComisiones, totComisionesTipo } from 'utils/calcs';
import TablePyL from './TablePyL';

function PyL() {
  const [showLoader, setShowLoader] = useState(false);
  const currentState = useSelector((state) => state.auth.user);
  const [infoForm, setInfoForm] = useState();
  const [infoCuentas, setInfoCuentas] = useState();
  const [costoData, setCostoData] = useState();
  const [volumenData, setVolumenData] = useState();
  const [capexPData, setCapexPData] = useState();
  const [capexQData, setCapexQData] = useState();
  const [prestamosData, setPrestamosData] = useState();

  // INFO A MOSTRAR EN LA TABLA 
  const [ventasTot, setVentasTot] = useState();
  const [ventasProd, setVentasProd] = useState();
  const [ventasServ, setVentasServ] = useState();
  const [costosProd, setCostosProd] = useState();
  const [costosServ, setCostosServ] = useState();
  const [costosProduccionTotal, setCostosProduccionTotal] = useState();
  const [costosComision, setCostosComision] = useState();
  const [costosImpuestos, setCostosImpuestos] = useState();
  const [costosCargoPasarela, setCostosCargoPasarela] = useState();
  const [costosComerciales, setCostosComerciales] = useState();
  const [costosTotales, setCostosTotales] = useState();
  const [mbPesos, setMbPesos] = useState();
  const [mbPorcentaje, setMbPorcentaje] = useState();
  const [gastoEnCtas, setGastoEnCtas] = useState();
  const [ctasListado, setCtasListado] = useState();
  const [amortizaciones, setAmortizaciones] = useState();
  const [intereses, setIntereses] = useState();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    if (infoForm ) {
      setVentasTot(calculateVentas(infoForm))
      setVentasProd(calculateVentasTipo(infoForm, 'producto'))
      setVentasServ(calculateVentasTipo(infoForm, 'servicio'))
    }
  }, [infoForm]);

  useEffect(() => {
    if (costoData && volumenData ) {
      setCostosProd(calculateCostosAnualesTipo(costoData, volumenData, 'producto'))
      setCostosServ(calculateCostosAnualesTipo(costoData, volumenData, 'servicio'))
      setCostosProduccionTotal(calculateCostosAnuales(costoData, volumenData))
    }
  }, [costoData, volumenData]);

  useEffect(() => {
    if (costoData && infoForm && volumenData) {
      setCostosComision(totComisionesTipo(costoData, infoForm, 'comision'))
      setCostosImpuestos(totComisionesTipo(costoData, infoForm, 'impuesto'))
      setCostosCargoPasarela(totComisionesTipo(costoData, infoForm, 'cargos'))
      setCostosComerciales( totComisiones(costoData, infoForm))
      setCostosTotales(calculateCostosTotales(costoData, infoForm, volumenData))
      setMbPesos(calculateMargenBrutoPesos(costoData, infoForm, volumenData))
      setMbPorcentaje(calculateMargenBrutoPorcentaje(costoData, infoForm, volumenData))
    }
  }, [costoData, infoForm, volumenData]);

 
  useEffect(() => {
    if (infoCuentas) {
      setGastoEnCtas(calculateCtas(infoCuentas))

      let arrayCtas =[]
      for (let i = 0; i < 12; i++) {
        arrayCtas.push(infoCuentas.Administración.cuentas[i].name)
      }
      setCtasListado(arrayCtas)
    }
  }, [infoCuentas]);

  useEffect(() => {
    if (capexPData && capexQData) {
      const PxQCapex = multiplicacionPxQCapex(capexQData, capexPData)
      setAmortizaciones(calcAmortizaciones(PxQCapex))
    }
  }, [capexPData, capexQData]);

  useEffect(() => {
    if (prestamosData ) {
      setIntereses(calcInteresesPagadosPorAnio(prestamosData) )
    }
  }, [prestamosData]);

  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.gastosGeneralData.length !== 0) {
          // Seteo la info de ventas PxQ
            const datosPrecargados = {};
            const copyVolData = JSON.parse(JSON.stringify(data?.volumenData))
            const copyPcioData = JSON.parse(JSON.stringify(data?.precioData))

            let dataVentas = showMultiplicacionPxQ(
              copyVolData.sort((a, b) =>
                a.countryName.localeCompare(b.countryName),
              ),
              copyPcioData.sort((a, b) =>
                a.countryName.localeCompare(b.countryName),
              ),
            );
            for (let i = 0; i < dataVentas.length; i++) {
              datosPrecargados[dataVentas[i].countryName] = dataVentas[i].stats;
            }
            setInfoForm(() => ({ ...datosPrecargados }));


            if (data?.volumenData.length !== 0) {
              setVolumenData(data?.volumenData)
            } else {
              console.log("Es necesario completar la informacion de Cantidad y Volumen")
            }

            if (data?.costoData.length !== 0 ) {
              setCostoData(data?.costoData)
            } else {
              console.log("Es necesario completar la informacion de Costos Unitarios")
            }
         
        } else {
          console.log("Es necesario completar la informacion de Gastos Generales")
        }

        if (data?.gastosPorCCData.length !== 0) {
          setInfoCuentas(() => ({
            ...data?.gastosPorCCData[0].centroDeCostos[0],
          }));
        } else {
          console.log("Falta completar info en Gastos por Centro de costo")
        }

        if (data?.capexPData[0]?.length !== 0) {
          setCapexPData(data?.capexPData[0]?.capexP);
        }else {
          console.log("Falta completar info en Costo Inversiones")
        }

        if (data?.capexQData[0]?.length !== 0) {
          setCapexQData(data?.capexQData[0]?.capexQ);
        }else {
          console.log("Falta completar info en Volumen de Inversiones")
        }

        if (data?.prestamos?.length !== 0) {
          setPrestamosData(data?.prestamos);
        }else {
          console.log("Falta completar info en la sección de Préstamos")
        }
        setTimeout(() => {
          setShowLoader(false)
        }, 4000);
       
      })
      .catch((error) => console.error(error));
  }, []);


  return (
    <>
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
      {showLoader ? (
        <MySpinner />
      ) : (
        <>
        { 
        // valoresCAC.length !== 0 && valoresLTV.length !== 0 &&  valoresLTVCAC.length !== 0 &&
          <div>
          <div className="border-b-2 mb-8 pb-1">
            <h4 className="cursor-default">
              P & L
            </h4>
            <span className="cursor-default">Estados Financieros</span>
          </div>
          <div className="container-countries">
            <FormContainer className="cont-countries">
              <ContainerScrollable
                contenido={
                  <TablePyL
                    vtasTot={ventasTot || []}
                    vtasProd={ventasProd || []}
                    vtasServ={ventasServ || []}
                    costoProd={costosProd || []}
                    costoServ={costosServ || []}
                    costoProduccionTotal={costosProduccionTotal || []}
                    costoComision={costosComision || []}
                    costoImpuesto={costosImpuestos || []}
                    costoCargos={costosCargoPasarela || []}
                    costoComerciales={costosComerciales || []}
                    costoTotales={costosTotales || []}
                    mbPesos={mbPesos || []}
                    mbPorcentaje={mbPorcentaje || []}
                    ctasListado={ctasListado || []}
                    gastoEnCtas={gastoEnCtas || []}
                    amortizaciones={amortizaciones || []}
                    intereses={intereses || []}
                    showAlertSuces={(boolean) =>
                      setShowSuccessAlert(boolean)
                    }
                    showAlertError={(boolean) => setShowErrorAlert(boolean)}

                    />
                }
              />
            </FormContainer>
          </div>

        </div>
        }
          
        </>
      )}
    </>
  );
}

export default PyL;
