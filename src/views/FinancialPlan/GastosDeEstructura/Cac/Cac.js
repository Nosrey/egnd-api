/* eslint-disable no-restricted-globals */
/* eslint-disable no-loop-func */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unsafe-optional-chaining */
import MySpinner from 'components/shared/loaders/MySpinner'; 
import { MONTHS } from 'constants/forms.constants';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUser } from 'services/Requests';
import { showMultiplicacionPxQ } from 'utils/calcs';
import formatNumber from 'utils/formatTotalsValues';

function Cac() {
  const [showLoader, setShowLoader] = useState(true);
  const currentState = useSelector((state) => state.auth.user);
  const [infoVolToCalculateClient, setInfoVolToCalculateClient] = useState()
  const [dataAssump, setDataAssump] = useState();
  const [gastosPorCCData, setGastosPorCCData] = useState();
  const [valoresCAC, setValoresCAC] = useState();
  const [infoForm, setInfoForm] = useState();

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
      return acc;
    }, []);
    return sumaTotal;
  }

  const  costosMktyComercial = (gastosPorCCData) => {
    let comercialInfo = gastosPorCCData[0].centroDeCostos[0].Comercial.visible ? gastosPorCCData[0].centroDeCostos[0].Comercial.cuentas : [];
    let mktInfo = gastosPorCCData[0].centroDeCostos[0].Marketing.visible ? gastosPorCCData[0].centroDeCostos[0].Marketing.cuentas : [];

    const totGastoComercial = [...getTotalPorCC(comercialInfo)];
    const totGastoMkt = [...getTotalPorCC(mktInfo)];

    const resultadoCAC = [];
    for (let i = 0; i < totGastoComercial.length; i++) {
      resultadoCAC.push(Math.round(totGastoComercial[i] + totGastoMkt[i]));
    }
    
    return resultadoCAC;
  }

  const calculateCAC = () => {
    const costos = costosMktyComercial(gastosPorCCData);
    const nuevosClientes = calculateClients(); 
    
    return costos.map((elemento, indice) => elemento / nuevosClientes[indice]);
  }

  useEffect(() => {
    if (infoVolToCalculateClient && dataAssump && gastosPorCCData) {
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
        console.log(data)
        if (data?.gastosGeneralData.length !== 0) {
          
          // seteo la info delvolumen para usar par alos cliente sporque si uso info form estoy usando el valor de ventas
           const datosPrecargadosVol = {};
           let volDataOrdenada = JSON.parse(localStorage.getItem("volumenData")).sort((a, b) =>
           a.countryName.localeCompare(b.countryName),
           );
           for (let i = 0; i < volDataOrdenada.length; i++) {
             datosPrecargadosVol[volDataOrdenada[i].countryName] =
             volDataOrdenada[i].stats;
            }
           setInfoVolToCalculateClient(() => ({ ...datosPrecargadosVol }));
           ///


           if (data.assumptionData[0]) {
            setDataAssump(data.assumptionData[0]);
          }
           
           setGastosPorCCData(()=> ({ ...data.gastosPorCCData} ))

           
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


          </div>
        </>
      )}
    </>
  );
}

export default Cac;
