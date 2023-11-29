/* eslint-disable import/no-extraneous-dependencies */
import numeral from 'numeral';

export default function formatNumber(value) {
  const number = parseFloat(value);
  if (!Number.isNaN(number)) {
    return Math.floor(number).toLocaleString('en-US').replace(/,/g, '.');
  }
  return value;
}

export const formatearNumero = (numero) => {
  const esNegativo = Number(numero) < 0;
  const inputNumero = Number(numero?.replace(/\D/g, ''));
  const nuevoNum = inputNumero.toLocaleString('es-AR');
  return esNegativo ? `-${nuevoNum}` : nuevoNum;
};

export const formatNumberPrestamos = (number) => {
  const myNumeral = numeral(number);
  const currencyString = myNumeral.format('0,0.00');

  return currencyString;
};
