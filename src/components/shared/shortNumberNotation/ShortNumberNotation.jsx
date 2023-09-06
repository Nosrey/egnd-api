function ShortNumberNotation({ numero }) {
  // Convertir el número de entrada a un tipo numérico
  let num;
  if (typeof numero === 'string') {
    num = parseInt(numero.replace(/\./g, ''));
  } else {
    num = numero;
  }

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

  return <span className="cursor-default">{`${numeroFormateado} ${sufijos[exp]}`}</span>;
}

export default ShortNumberNotation;
