/* eslint-disable no-multi-assign */
import { MONTHS } from 'constants/forms.constants';

export const showMultiplicacionPxQ = (dataVolumen, dataPrecio) => {
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
