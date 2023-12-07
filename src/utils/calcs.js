/* eslint-disable no-multi-assign */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-loop-func */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unsafe-optional-chaining */
import { MONTHS, optionsBienes } from 'constants/forms.constants';

export const  redondearHaciaArribaConDosDecimales = (numero) =>{
  // Multiplicar por 100 para mover dos decimales a la izquierda
  let multiplicado = numero * 100;
  // Redondear hacia arriba
  let redondeado = Math.ceil(multiplicado);
  // Dividir por 100 para devolver los dos decimales
  let resultado = redondeado / 100;
  
  return resultado;
}


export const showMultiplicacionPxQ = (dataVolumen, dataPrecio) => {
  console.log('DATA VOL', dataVolumen)
  console.log('DATA PRECIO  ', dataPrecio)

  for (let i = 0; i < dataVolumen.length; i++) {
    // entro a cada pais
    for (let x = 0; x < dataVolumen[i].stats.length; x++) {
      // a cada canal
      for (let j = 0; j < dataVolumen[i].stats[x].productos.length; j++) {
        // cada producto
        for (
          let t = 0;
          t < dataVolumen[i].stats[x].productos[j].años.length;
          t++
        ) {
          // año
          const totalesAnio = [];
          MONTHS.forEach((month) => {
            // OBTENGO EL VALOR DE CADA OUTPUT QUE ES PRECIO X VOLUMEN
            const volMes =
              dataVolumen[i].stats[x].productos[j].años[t].volMeses[month];
            const precioMes =
              dataPrecio[i].stats[x].productos[j].años[t].volMeses[month];
            const ventaMes = (dataVolumen[i].stats[x].productos[j].años[
              t
            ].volMeses[month] = Math.round(volMes) * Math.round(precioMes));
            totalesAnio.push(ventaMes);
            return ventaMes;
          });
          const totalVentasAnual = totalesAnio.reduce((a, b) => a + b, 0); // CALCULO EL TOTAL POR Anio
          dataVolumen[i].stats[x].productos[j].años[t].ventasTotal =
            totalVentasAnual;
        }
      }
    }
  }
  return dataVolumen;
};


// infoForm    :  { argentina: [{canal}]  , chile: [{canal}]}
export const calculateVentas = (infoForm) => {
  let dataVentas = []
  for (let guia = 0; guia < 10; guia++) {
    let tot = 0;
    Object.values(infoForm).map((m, indexPais) => {
      m.map((p) => {
        p.productos.map((o, indexO) => {
          o.años.map((a, indexY) => {
            if (indexY=== guia) {
              tot += Number(a.ventasTotal ? a.ventasTotal : 0);
                }
              });
            });
          });
        });
    dataVentas.push(tot)
  }
  
  // retorno un array de 10 numeros  ,el total de ventas por cada año
  return dataVentas;
}

export const calculateVentasTipo = (infoForm, tipo) => {
  let dataVentas = []
  for (let guia = 0; guia < 10; guia++) {
    let tot = 0;
    Object.values(infoForm).map((m, indexPais) => {
      m.map((p) => {
        p.productos.map((o, indexO) => {
          o.años.map((a, indexY) => {
            if (indexY=== guia && o.type === tipo) {
              tot += Number(a.ventasTotal ? a.ventasTotal : 0);
                }
              });
            });
          });
        });
    dataVentas.push(tot)
  }
  
  // retorno un array de 10 numeros  ,el total de ventas por cada año
  return dataVentas;
}

export const calculateCostosAnuales = (costoData, volumenData) => {
  const arrayCostosUnitarios=[]
  for (let i = 0; i < 10; i++) {
    let acum = 0;

    // Iterar sobre las claves (paises)
    costoData.forEach((pais, indexPais) => {
      // Iterar sobre los elementos del array de cada pais
      pais.stats.forEach((canal, indexCanal) => {
        canal.productos.forEach((prod, indexProd) => {
          MONTHS.map((s, indexM) => {
            const costoU = isNaN(prod.años[i].volMeses[s]) ? 0 : prod.años[i].volMeses[s];
            const vol = isNaN(volumenData[indexPais].stats[indexCanal].productos[indexProd].años[i].volMeses[s]) ? 0
            : volumenData[indexPais].stats[indexCanal].productos[indexProd].años[i].volMeses[s];
            
            acum += costoU * vol;

          })
        })
      });
    });
    arrayCostosUnitarios.push(acum) 
  }

  return arrayCostosUnitarios
}

export const calculateCostosAnualesTipo = (costoData, volumenData, tipo) => {
  const arrayCostosUnitarios=[]
  for (let i = 0; i < 10; i++) {
    let acum = 0;

    // Iterar sobre las claves (paises)
    costoData.forEach((pais, indexPais) => {
      // Iterar sobre los elementos del array de cada pais
      pais.stats.forEach((canal, indexCanal) => {
        canal.productos.forEach((prod, indexProd) => {
          if (prod.type === tipo) {
            MONTHS.map((s, indexM) => {
              const costoU = isNaN(prod.años[i].volMeses[s]) ? 0 : prod.años[i].volMeses[s];
              const vol = isNaN(volumenData[indexPais].stats[indexCanal].productos[indexProd].años[i].volMeses[s]) ? 0
              : volumenData[indexPais].stats[indexCanal].productos[indexProd].años[i].volMeses[s];
              
              acum += costoU * vol;
  
            })
          }
        })
      });
    });
    arrayCostosUnitarios.push(acum) 
  }

  return arrayCostosUnitarios
}


export const totComisiones = (costoData, infoForm) => {
  let comisiones = []
  for (let i = 0; i < 10; i++) {
    let sum = 0
    costoData.forEach((pais, indexPais) => {
      pais.stats.forEach((canal, indexCanal) => {
        canal.productos.forEach((prod, indexProd) => {
            // deinfo form saco las ventas de ese pord de ese canal de ese pais
            const ventas = infoForm[pais.countryName][indexCanal].productos[indexProd].años[i].ventasTotal;
            
            // de costo data saco las comisiones 
            sum += (prod.comision / 100) * ventas;
            sum += (prod.cargos / 100) * ventas;
            sum += (prod.impuesto / 100) * ventas;
        })
      });
    });
    comisiones.push(sum)
  }
  return comisiones;
}

export const totComisionesTipo = (costoData, infoForm, tipo) => {
  let comisiones = []
  for (let i = 0; i < 10; i++) {
    let sum = 0
    costoData.forEach((pais, indexPais) => {
      pais.stats.forEach((canal, indexCanal) => {
        canal.productos.forEach((prod, indexProd) => {
            // deinfo form saco las ventas de ese pord de ese canal de ese pais
            const ventas = infoForm[pais.countryName][indexCanal].productos[indexProd].años[i].ventasTotal;
            
            const tipoCostoMap = {
              comision: 'comision',
              cargos: 'cargos',
              impuesto: 'impuesto',
            };
            
            const tipoCosto = tipoCostoMap[tipo];
            sum += (prod[tipoCosto] / 100) * ventas;
        })
      });
    });
    comisiones.push(sum)
  }
  return comisiones;
}

export const calculateCostosTotales = (costoData, infoForm, volumenData) => {
  // a cada posicion, es decir, a cada anio de mi array de Costos Unitarios tengo que sumarle los costos por comisiones e impuestos
  const comisiones = totComisiones(costoData, infoForm); // me devuelve las comisiones totales en $ por anio teniendo en cuenta todos los prod , canales y paises
  const costosUnitarios = calculateCostosAnuales(costoData, volumenData);

  const arrCostosTotales = []
  for (let i = 0; i < costosUnitarios.length; i++) {
    arrCostosTotales.push(costosUnitarios[i] + comisiones[i]);
  }
  return arrCostosTotales   // array de diez posiciones sumando en cada una los costos extras por comisiones mas lso costos unitarios
}

export const calculateMargenBrutoPesos = (costoData, infoForm, volumenData) => {
  const costosTotales =   calculateCostosTotales(costoData, infoForm, volumenData);
  const ventas = calculateVentas(infoForm);
  const resultado = [];
  for (let i = 0; i < ventas.length; i++) {
    // Calcular la ganancia restando costos de ventas
    let ganancia = ventas[i] - costosTotales[i];
    resultado.push(redondearHaciaArribaConDosDecimales(ganancia));
  }
  return resultado;
}
export const calculateMargenBrutoPorcentaje = (costoData, infoForm, volumenData) => {
  const costosTotales =   calculateCostosTotales(costoData, infoForm, volumenData);
  const ventas = calculateVentas(infoForm);
  const resultado = [];
  for (let i = 0; i < ventas.length; i++) {
    // Calcular la ganancia restando costos de ventas
    let ganancia = ventas[i] - costosTotales[i];
  
    // Calcular el porcentaje de ganancia en relación con las ventas
    let porcentajeGanancia = (ganancia / ventas[i]) * 100;
    resultado.push(redondearHaciaArribaConDosDecimales(porcentajeGanancia));
  }
  return resultado;
}

export  const calculateCtas = (infoCuentas) => {
  const CCActivos = Object.keys(infoCuentas).filter((key) => infoCuentas[key].visible === true);
  const arrayCtas = []
  
  for (let ctaIndex = 0; ctaIndex < 12; ctaIndex++) { // evaluo doce cuentas
    let arrayanios=[]
    for (let anio = 0; anio < 10; anio++) { // x cada anio
      let sumAnio = 0
        for (let i = 0; i < CCActivos.length; i++) { // de todos mis cc activos

          sumAnio += infoCuentas[CCActivos[i]].cuentas[ctaIndex].años[anio].volTotal
        }
        arrayanios.push(sumAnio)
    }
    arrayCtas.push(arrayanios)
  }
    return arrayCtas // rray de 12 posiciones (una pro cada cuenta) con un array de 10 posiciones adentro correspondiente al total por cada anio gastado ene sa cuenta
}

export const multiplicacionPxQCapex = (dataVolumen, dataPrecio) => {
  for (let i = 0; i < dataVolumen.length; i++) {
    // entro a cada bien
      for (
        let t = 0;
        t < dataVolumen[i].años.length;
        t++
      ) {
        // año
        const totalesAnio = [];
        MONTHS.forEach((month) => {
          // OBTENGO EL VALOR DE CADA OUTPUT QUE ES PRECIO X VOLUMEN
          const volMes =
            dataVolumen[i].años[t].volMeses[month];
          const precioMes =
            dataPrecio[i].años[t].volMeses[month];
          const PxQMes = (dataVolumen[i].años[t].volMeses[month] = Math.round(volMes) * Math.round(precioMes));
          totalesAnio.push(PxQMes);
          return PxQMes;
        });
        const totalCapexAnual = totalesAnio.reduce((a, b) => a + b, 0); // CALCULO EL TOTAL POR Anio
        dataVolumen[i].años[t].ventasTotal =
          totalCapexAnual;
      }
    }
  return dataVolumen;
};

export const calcAmortizaciones = (PxQCapex) => {
  const myArrayAmort = [0,0,0,0,0,0,0,0,0,0]

    for (let j = 0; j < PxQCapex.length; j++) { // cada bien
      for (let a = 0; a < PxQCapex[j].años.length; a++) { // cada anio
        MONTHS.map((s, indexM) => {
          let valorMensual = 0
          if (PxQCapex[j].años[a].volMeses[s] !== 0 ) {
            const valorBien = PxQCapex[j].años[a].volMeses[s];
            const objetoEncontrado = optionsBienes.find(opcion => opcion.value === PxQCapex[j].bien);
            const anioAmort = objetoEncontrado.amortizacion;
            let cantMeses = anioAmort * 12
            valorMensual = valorBien / cantMeses

            const mesesRestantesPrimerAnio = 12 - indexM;
            const pcioAmortizadoPrimerAnio = mesesRestantesPrimerAnio * valorMensual;
            myArrayAmort[a] += pcioAmortizadoPrimerAnio;

            for (let x = 1; x < anioAmort - 1; x++) {
              const pcioAmortizado = 12 * valorMensual;
              const anioCurrent = a + x;
              
              if (anioCurrent <= 9) { // dentro del plazo planteado
                myArrayAmort[anioCurrent] += pcioAmortizado;
              }
            }

            if (anioAmort > 1) {
              const mesesRestantesUltimoAnio = indexM === 0 ? 12 - indexM : indexM;
              const pcioAmortizadoUltimoAnio = mesesRestantesUltimoAnio * valorMensual;
              const anioUltimo = a + anioAmort - 1;

              if (anioUltimo <= 9) { // dentro del plazo planteado
                myArrayAmort[anioUltimo] += pcioAmortizadoUltimoAnio;
              }
            }              
          }
        })
      }
    }
  return myArrayAmort
}