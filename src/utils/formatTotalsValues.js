
export default function formatNumber(value) {
    const number = parseFloat(value);
    if (!Number.isNaN(number)) {
      return Math.floor(number).toLocaleString('en-US').replace(/,/g, '.');
    }
    return value;
};

export const formatearNumero = (numero) => {
  const esNegativo = Number(numero) < 0;
  const inputNumero = Number(numero?.replace(/\D/g, ''));
  const nuevoNum = inputNumero.toLocaleString('es-AR');
  return esNegativo ? `-${nuevoNum}` : nuevoNum;
}