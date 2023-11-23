import React from 'react'
import classNames from 'classnames'
import { MONTHS } from 'constants/forms.constants';

export  const inicio = (indexPais, indexCanal, indexProd, volumenData, assumptionData) => {
  const volEsteMes = getValueMes(
    indexPais,
    indexCanal,
    indexProd,
    0,
    0,
    volumenData
  );
  const volXCliente =
  assumptionData[0].canales[indexCanal].items[indexProd].volumen;
  
  const myArrayResultado = []
  
  for (let i = 0; i < 10; i++) {
    const subarray = [];
    for (let j = 0; j <= 11; j++) {
      if (i===0 && j=== 0) {
        subarray.push(volEsteMes/ volXCliente); 
      } else {
        const lastIndex = subarray.length - 1;
        const lastValue = subarray[lastIndex];

        let nuevoValor = lastValue + getAltas(indexPais, indexCanal, indexProd, i, j - 1,volumenData, assumptionData) - getBajas(indexPais, indexCanal, indexProd, i, j - 1 ,volumenData, assumptionData);

        if (Number.isNaN(nuevoValor)) {
          nuevoValor = myArrayResultado[i-1][11] + getAltas(indexPais, indexCanal, indexProd, i, j=== 0 ? j: j - 1,volumenData, assumptionData) - getBajas(indexPais, indexCanal, indexProd, i, j=== 0 ? j: j - 1, volumenData, assumptionData);
        } 
          subarray.push(nuevoValor); 


      }

    }
    myArrayResultado.push(subarray);
  }
  return myArrayResultado
}
export  const getAltas = (indexPais, indexCanal, indexProd, indexYear, indexMes,volumenData, assumptionData) => {
  const volMesPasado = (indexMes === 0 && indexYear!== 0 ) ? getValueMes(
    indexPais,
    indexCanal,
    indexProd,
    Number(indexYear) - 1,
    11,
    volumenData
  ) :
  getValueMes(
    indexPais,
    indexCanal,
    indexProd,
    indexYear,
    Number(indexMes) - 1,
    volumenData
  );
  const volEsteMes = getValueMes(
    indexPais,
    indexCanal,
    indexProd,
    indexYear,
    indexMes,
    volumenData
  );
  const volXCliente =
    assumptionData[0].canales[indexCanal].items[indexProd].volumen;

  const clientesMesPasado = volMesPasado/ volXCliente;
  const clientesEsteMes = volEsteMes / volXCliente;

  const churnTeorico =
    assumptionData[0].churns[indexCanal].items[indexProd]
      .porcentajeChurn;

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

export  const getBajas = (indexPais, indexCanal, indexProd, indexYear, indexMes, volumenData, assumptionData) => {
  const volMesPasado = (indexMes === 0 && indexYear!== 0 ) ? getValueMes(
    indexPais,
    indexCanal,
    indexProd,
    Number(indexYear) - 1,
    11,
    volumenData
  ) :
  getValueMes(
    indexPais,
    indexCanal,
    indexProd,
    indexYear,
    Number(indexMes) - 1,
    volumenData
  );
  const volEsteMes = getValueMes(
    indexPais,
    indexCanal,
    indexProd,
    indexYear,
    indexMes,
    volumenData
  );
  const volXCliente =
    assumptionData[0].canales[indexCanal].items[indexProd].volumen;

  const clientesMesPasado = volMesPasado/ volXCliente;
  const clientesEsteMes = volEsteMes / volXCliente;
  
  const churnTeorico =
  assumptionData[0].churns[indexCanal].items[indexProd]
    .porcentajeChurn;
  
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

export  const getValueMes = (indexPais, indexCanal, indexProd, indexYear, indexMes, volumenData) =>
volumenData[indexPais].stats[indexCanal].productos[indexProd].años[
  indexYear
].volMeses[MONTHS[indexMes]];


const churnPorcentaje = (indexPais, indexCanal, indexProd, volumenData, assumptionData) => {
  const myArrayResultado = []
  const volXCliente =
  assumptionData[0].canales[indexCanal].items[indexProd].volumen;

  for (let i = 0; i < 10; i++) {
    const subarray = [];
    for (let j = 0; j <= 11; j++) {
      const bajas = getBajas(indexPais, indexCanal, indexProd, i, j ,volumenData, assumptionData);

      if (i===0 && j=== 0) {
        subarray.push(0); 
      } else {
        // el numero de bajas de este mes dividido Clientes del mes pasado
        const volMesPasado = getValueMes(
          indexPais,
          indexCanal,
          indexProd,
          j===0 && i !== 0 ? i-1 : i, // si es el primero de un anio no tiene valor anterior para bsucar entonces va al array anterior a la ultima posicion
          j===0 && i !== 0 ? 11 : j-1,
          volumenData
        );
        let clientesMesPasado = volMesPasado/ volXCliente

        if (i ===0 && j=== 2&& indexPais === 0 && indexCanal=== 0 && indexProd===0) {
         console.log("BAJAS",bajas) 
         console.log("inico mes pasado",clientesMesPasado) 

        }
          subarray.push(bajas / clientesMesPasado *100); 
      }

    }
    myArrayResultado.push(subarray);
  }
  return myArrayResultado
}

export const modifyDataWithInitialClients =(originalData, volumenData, assumptionData) => {
  const  copy = JSON.parse(JSON.stringify(originalData));
      // Obtener las claves (paises) del objeto
      const paises = Object.keys(copy);
      // Iterar sobre las claves (paises)
      paises.forEach((pais, indexPais) => {
        // Iterar sobre los elementos del array de cada pais
        copy[pais].forEach((canal, indexCanal) => {
          // Modificar la propiedad 'productos'
          canal.productos.forEach((prod, indexProd) => {
            prod.valoresInicioChurn= inicio(indexPais,indexCanal, indexProd, volumenData, assumptionData)
            prod.churnPorcetajes = churnPorcentaje(indexPais,indexCanal, indexProd, volumenData, assumptionData)
          })
        });
      })
      console.log("***********88RETORNO****" , copy)
  return copy
}