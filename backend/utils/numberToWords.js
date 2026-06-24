/**
 * Indian Number-to-Words Converter
 * Converts an integer to its Indian English representation.
 * Example: 1360 → "One Thousand Three Hundred Sixty Only"
 */

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

function twoDigit(n) {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
}

function numberToWords(num) {
  if (num === 0) return 'Zero Only';

  num = Math.floor(Math.abs(num));
  let words = '';

  // Crore
  if (num >= 10000000) {
    words += twoDigit(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }

  // Lakh
  if (num >= 100000) {
    words += twoDigit(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }

  // Thousand
  if (num >= 1000) {
    words += twoDigit(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }

  // Hundred
  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
    if (num > 0) words += 'and ';
  }

  // Tens + Units
  words += twoDigit(num);

  return 'Rupees ' + words.trim() + ' Only';
}

module.exports = { numberToWords };
