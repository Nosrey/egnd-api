
function ShortNumberNotation({ numero }) {
    // Convertir el número de entrada a un tipo numérico
    let num = parseInt(numero.replace(/\./g, ''));

    const sufijos = {
      0: '',
      3: 'K',
      6: 'M',
      9: 'B',
      12: 'T',
      15: 'Qa',
    };

    let exp = 0;

    while (num >= 1000 && exp < 15) {
      num /= 1000;
      exp += 3;
    }

    // Formatear el número con dos decimales si es igual o mayor a 1000
    const numeroFormateado = exp >= 3 ? num.toFixed(2) : num.toFixed(0);

    return <span>{`${numeroFormateado} ${sufijos[exp]}`}</span>;
  }

export default ShortNumberNotation;