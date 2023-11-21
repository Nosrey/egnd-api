/* eslint-disable no-restricted-globals */
/* eslint-disable no-loop-func */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unsafe-optional-chaining */

/// FALTA : tiket medio , margen bruto   par acalcular el LTV 
// despues hay que ver si lo que se hace cuando se tra la data tiene las validaciones correctas y en que caso debo mostrar algun plaveholder si me falta algun dato 
import ContainerScrollable from 'components/shared/ContainerScrollable';
import MySpinner from 'components/shared/loaders/MySpinner'; 
import { FormContainer } from 'components/ui';
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { showMultiplicacionPxQ } from 'utils/calcs';
import formatNumber from 'utils/formatTotalsValues';
import TableCac from './TableCac';
import GraficoDashed from './GraficoDashed';
import GraficoDeBarra from './GraficoDeBarra';
import GraficoDashedLTVCAC from './GraficoDashedLTVCAC';

function Cac() {
  const [showLoader, setShowLoader] = useState(true);
  const currentState = useSelector((state) => state.auth.user);
  const [infoVolToCalculateClient, setInfoVolToCalculateClient] = useState()
  const [dataAssump, setDataAssump] = useState();
  const [gastosPorCCData, setGastosPorCCData] = useState();
  const [valoresCAC, setValoresCAC] = useState();
  const [infoForm, setInfoForm] = useState();
  const [volumenData, setVolumenData] = useState();
  const [assumptionData, setAssumptionData] = useState();


  const calcNewClients = (data, indexY, indexMes, indexChannel, indexProd) =>
    Number(
      formatNumber(
        data.años[indexY].volMeses[MONTHS[indexMes]] /
          dataAssump.canales[indexChannel].items[indexProd].volumen -
          (data.años[indexY].volMeses[MONTHS[indexMes - 1]] /
            dataAssump.canales[indexChannel].items[indexProd].volumen -
            ((data.años[indexY].volMeses[MONTHS[indexMes - 1]] /
              dataAssump.canales[indexChannel].items[indexProd].volumen) *
              dataAssump.churns[indexChannel].items[indexProd]
                .porcentajeChurn) /
              100),
      ),
  );

  const calculateClients = () => {
    let nuevoClientes = []
    let newC = 0;

    for (let guia = 0; guia < 10; guia++) {
      // esta logica esta sacada del dashboard de ventas liea 244 donde s ehace el calculo para lo nuevos clientes por año , si hay cambiso alla, aplicarlos aca
      Object.values(infoVolToCalculateClient).map((d, indexPais) => {
        d.map((i, indexChannel) => {
          i.productos.map((p, indexProd) => {
            p.años.map((a, indexY) => {
              if (indexY=== guia) {
                  MONTHS.map((o, indexMes) => {
                      newC +=
                        indexMes === 0
                          ? 0
                          : calcNewClients(
                              p,
                              indexY,
                              indexMes,
                              indexChannel,
                              indexProd,
                            );
                      
                  });
                  if (indexProd === i.productos.length-1 && indexPais === Object.values(infoVolToCalculateClient).length -1) {
                    const valor = isNaN(newC) ? 0 : newC
                    nuevoClientes.push(valor)
                    newC =0
                  }
                }
              });
            });
          });
      });
    }
    // retorno un array de 10 numeros  ,el total de clientes nuevos por cada año
    return nuevoClientes;
  }

  
  const calculateVentas = () => {
    let dataVentas = []
    let tot = 0;

    for (let guia = 0; guia < 10; guia++) {
      Object.values(infoForm).map((m, indexPais) => {
        m.map((p) => {
          p.productos.map((o, indexO) => {
            o.años.map((a, indexY) => {
              if (indexY=== guia) {
                MONTHS.map((s, indexM) => {
                  tot += Number(a.ventasTotal);
                  if (indexO === p.productos.length-1 && indexPais === Object.values(infoForm).length -1 && indexM === 11) {
                        const valor = isNaN(tot) ? 0 : tot
                        dataVentas.push(valor)
                        tot= 0
                      }
                });
              }
            });
          });
        });
      });
    }
    
    // retorno un array de 10 numeros  ,el total de clientes nuevos por cada año
    return dataVentas;
  }

  const getTotalPorCC  = (cc) =>{
    // Logica para obtener un array de 10 posiciones correspondiente al total gastado en ese centro de costo por año
    for (let i = 0; i < cc.length; i++) {
      let anos = cc[i].años;
      let volTotalArray = [];
    
      for (let j = 0; j < anos.length; j++) {
        let {volMeses} = anos[j];
        let volTotal = volMeses && Object.values(volMeses).reduce((acc, value) => acc + value, 0);
        volTotalArray.push(volTotal);
      }
    
      cc[i].años = volTotalArray;
    }
    
    let sumaTotal = cc.reduce((acc, obj) => {
      for (let i = 0; i < obj.años.length; i++) {
        acc[i] = (acc[i] || 0) + obj.años[i];
      }
      return acc ;
    }, []);
    return sumaTotal;
  }

  const  costosMktyComercial = (gastosPorCCData) => {
    // let comercialInfo = gastosPorCCData[0].centroDeCostos[0].Comercial.visible ? gastosPorCCData[0].centroDeCostos[0].Comercial.cuentas : [];
    console.log(gastosPorCCData[0])
    // let mktInfo = gastosPorCCData[0].centroDeCostos[0].Marketing.visible ? gastosPorCCData[0].centroDeCostos[0].Marketing.cuentas : [];

    // const totGastoComercial = [...getTotalPorCC(comercialInfo)];
    // const totGastoMkt = [...getTotalPorCC(mktInfo)];
    // console.log(totGastoComercial)
    const resultadoCAC = [];
    // for (let i = 0; i < totGastoComercial.length; i++) {
    //   resultadoCAC.push(Math.round(totGastoComercial[i] + totGastoMkt[i]));
    // }
    console.log(resultadoCAC)
    return resultadoCAC;
  }


  // LTV

  const getValueMes = (indexPais, indexCanal, indexProd, indexYear, indexMes) =>
    infoVolToCalculateClient[volumenData[indexPais].countryName][indexCanal].productos[indexProd].años[
      indexYear
    ].volMeses[MONTHS[indexMes]];


  const getBajas = (indexPais, indexCanal, indexProd, indexYear, indexMes) => {
    const volMesPasado = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      Number(indexMes) - 1,
    );
   
    const volEsteMes = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      indexMes
    );
    const volXCliente =assumptionData[0].canales[indexCanal].items[indexProd].volumen;
    const clientesMesPasado = volMesPasado/ volXCliente;
    const clientesEsteMes = volEsteMes / volXCliente;
    const churnTeorico = assumptionData[0].churns[indexCanal].items[indexProd].porcentajeChurn;
    
    let rdo;
    if (indexMes=== 0 && indexYear===0) {
      rdo = ''
    } else {
      rdo = (clientesEsteMes - clientesMesPasado >= 0)
      ? ((volMesPasado / volXCliente) * churnTeorico) / 100
      : (clientesMesPasado - clientesEsteMes);
     }

    return rdo;
  };

  const getInicio = (indexPais, indexCanal, indexProd, indexYear, indexMes) => {
    const volEsteMes = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      indexMes
    );
    const volXCliente = assumptionData[0].canales[indexCanal].items[indexProd].volumen;

      let rdo
      if (indexMes === 0 && indexYear === 0) {
        rdo = volEsteMes/ volXCliente
      } else {
        rdo= getFinal(indexPais, indexCanal, indexProd, indexYear, indexMes-1)
      }
    return rdo;
  };

 
  const getAltas = (indexPais, indexCanal, indexProd, indexYear, indexMes) => {
    const volMesPasado = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      Number(indexMes) - 1,
    );
    const volEsteMes = getValueMes(
      indexPais,
      indexCanal,
      indexProd,
      indexYear,
      indexMes
    );
    const volXCliente = assumptionData[0].canales[indexCanal].items[indexProd].volumen;

    const clientesMesPasado = volMesPasado/ volXCliente;
    const clientesEsteMes = volEsteMes / volXCliente;

    const churnTeorico = assumptionData[0].churns[indexCanal].items[indexProd].porcentajeChurn;

    let rdo;
    if (indexMes=== 0 && indexYear===0) {
      rdo = ''
    } else {
      rdo = (clientesEsteMes - clientesMesPasado >= 0)
      ? (clientesEsteMes - clientesMesPasado + ((volMesPasado / volXCliente) * churnTeorico) / 100) 
      : 0;
    }

    return rdo;
  };

  const getFinal = (indexPais, indexCanal, indexProd, indexYear, indexMes) =>( getInicio(indexPais, indexCanal, indexProd, indexYear, indexMes)+ getAltas(indexPais, indexCanal, indexProd, indexYear, indexMes)) -
  getBajas(indexPais, indexCanal, indexProd, indexYear, indexMes);
   

  const calculateCicloCliente = () => {
    let dataBajas = []
    let dataClientesInicio = []

    for (let guia = 0; guia < 10; guia++) {
      let dataBajasAnio = []
      let dataClientesInicioAnio = []
      Object.values(infoForm).map((m, indexPais) => {
        m.map((p, indexCanal) => {
          p.productos.map((o, indexProd) => {
            o.años.map((a, indexYear) => {
              if (indexYear=== guia) {
                MONTHS.map((s, indexMes) => {
                  dataBajasAnio.push( getBajas(indexPais, indexCanal, indexProd, indexYear, indexMes))
                  dataClientesInicioAnio.push( getInicio(indexPais, indexCanal, indexProd, indexYear, indexMes))

                });
              }
            });
          });
        });
      });
      // obtengo un array de 10  posiciones , cada posicin en la sumatoria de todas las bajas de ese anio, si es '' o nan lo suma como 0 
      dataBajas.push(dataBajasAnio.reduce((acumulador, valor) => acumulador + (isNaN(valor) ? 0 : (typeof valor === 'string' ? 0 : Math.round(valor))), 0))
      dataClientesInicio.push(dataClientesInicioAnio.reduce((acumulador, valor) => acumulador + (isNaN(valor) ? 0 : (typeof valor === 'string' ? 0 : Math.round(valor))), 0))
    }
    
    console.log(dataClientesInicio)
    // const churnFinal = dataBajas/clientesInicio;
    // return 1/churnFinal; // array de die valores d esto
  }
  
  const calculateCAC = () => {
    const costos = costosMktyComercial(gastosPorCCData);
    const nuevosClientes = calculateClients(); 
    // calculateCicloCliente()
    return costos.map((elemento, indice) => elemento / nuevosClientes[indice]);
  }

  // const calculateLTV = () => {
  //   const cicloCLiente = calculateCicloCliente(gastosPorCCData);
  //   const avClientes = calculateAvClientes(); 
  //   const margenBruto = calculateCMGB(); 
  //   return cicloCLiente * avClientes * margenBruto; //son aarrays
  // }

  useEffect(() => {
    if (infoVolToCalculateClient && dataAssump && gastosPorCCData) {
      console.log(gastosPorCCData)
      setValoresCAC([...calculateCAC()])
    }
  }, [infoVolToCalculateClient, dataAssump, gastosPorCCData])

  useEffect(() => {
    if (infoForm) {
      calculateVentas()
    }
  }, [infoForm])


  useEffect(() => {
    getUser(currentState.id)
      .then((data) => {
        if (data?.gastosGeneralData.length !== 0) {
          
          // seteo la info delvolumen para usar par alos cliente sporque si uso info form estoy usando el valor de ventas
           const datosPrecargadosVol = {};
           let volDataOrdenada = JSON.parse(localStorage.getItem("volumenData")).sort((a, b) =>
           a.countryName.localeCompare(b.countryName),
           );
          //  setVolumenData(data?.volumenData)
           for (let i = 0; i < volDataOrdenada.length; i++) {
             datosPrecargadosVol[volDataOrdenada[i].countryName] =
             volDataOrdenada[i].stats;
            }
           setInfoVolToCalculateClient(() => ({ ...datosPrecargadosVol }));
           ///


           if (data.assumptionData[0]) {
            setDataAssump(data.assumptionData[0]);
          }

           console.log(data)
           if (data.gastosPorCCData.length !== 0) {
             setGastosPorCCData(()=> ({ ...data.gastosPorCCData} ))
           } else {
            console.log('es necesario commpletar Proyeccion de gastos por cc ')
           }

           if (data?.volumenData.length !== 0) {
            // setVolumenData(data?.volumenData.sort((a, b) =>
            //   a.countryName.localeCompare(b.countryName),
            // ))
            setVolumenData(data?.volumenData)
          }

          if (data?.assumptionData.length !== 0) {
            setAssumptionData(data?.assumptionData)
            // setAssumptionData(data?.assumptionData.sort((a, b) =>
            //   a.countryName.localeCompare(b.countryName),
            // ))
          }
          // Seteo la info de ventas PxQ
            const datosPrecargados = {};
            let dataVentas = showMultiplicacionPxQ(
              data?.volumenData.sort((a, b) =>
                a.countryName.localeCompare(b.countryName),
              ),
              data?.precioData.sort((a, b) =>
                a.countryName.localeCompare(b.countryName),
              ),
            );
            for (let i = 0; i < dataVentas.length; i++) {
              datosPrecargados[dataVentas[i].countryName] = dataVentas[i].stats;
            }
            setInfoForm(() => ({ ...datosPrecargados }));

         
            
            // **********************************
        }// mostarr completar assumption gastos

       
        setShowLoader(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const LTV = [22, 43, 52, 73, 81, 89, 111, 134, 192, 207 ];
  const CAC = [223, 329, 452, 730, 813,1029, 1112, 1343, 1390, 1407 ];
  const LTVCAC = [0.09, 0.13, 0.11, 0.1, 0.09, 0.08, 0.09,0.09, 0.13, 0.14 ];
  return (
    <>
      {showLoader ? (
        <MySpinner />
      ) : (
        <>
          <div>
            <div className="border-b-2 mb-8 pb-1">
              <h4 className="cursor-default">
                CAC
              </h4>
              <span className="cursor-default">Gastos de Estructura</span>
            </div>
            <div className="container-countries">
              <FormContainer className="cont-countries">
                <ContainerScrollable
                  contenido={
                    <TableCac
                      cac={CAC}
                      ltv={LTV}
                      ltvcac={LTVCAC}
                    />
                  }
                />
              </FormContainer>
            </div>

            <div className=" mt-[40px]">
                <h5>CAC y LTV</h5>
                <GraficoDashed   cac={CAC} ltv={LTV}/>
              </div>

              <div className=" mt-[40px]">
                  <h5>LTV / CAC</h5>
                  <GraficoDashedLTVCAC  ltvcac={LTVCAC} />
                </div>
          </div>
        </>
      )}
    </>
  );
}

export default Cac;
