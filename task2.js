let a = 13.123456789;
let b =2.123;

let precision = 5;

let aNormalized = Math.floor(a % 1, Math.pow(10, precision));
let bNormalized = Math.floor(b % 1, Math.pow(10, precision));

console.log('Первое число больше: ', aNormalized > bNormalized);
console.log('Первое число меньше: ', aNormalized < bNormalized);
console.log('Первое число больше или равно: ', aNormalized >= bNormalized);
console.log('Первое число меньше или равно: ', aNormalized <= bNormalized);
console.log('Числа равны: ', aNormalized === bNormalized);
console.log('Числа неравны: ', aNormalized !== bNormalized);