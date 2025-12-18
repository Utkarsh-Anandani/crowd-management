export function convertDecimalToTime(decimalTime: number) {
  const minutes = Math.floor(decimalTime);
  const seconds = Math.round((decimalTime - minutes) * 60);
  return `${minutes} min ${seconds} sec`;
}