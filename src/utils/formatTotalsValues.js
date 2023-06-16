
export default function formatNumber(value) {
    const number = parseFloat(value);
    if (!Number.isNaN(number)) {
      return Math.floor(number).toLocaleString('en-US').replace(/,/g, '.');
    }
    return value;
};