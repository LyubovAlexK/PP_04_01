let n = -3;
let m = -10;

//кол-во цифр, которые могут быть сгенерированы
let range = Math.abs(m - n);
//округленное число1 от 0 до range
let namberInRange1 = Math.round(Math.random() * range);
//округленное число2 от 0 до range
let namberInRange2 = Math.round(Math.random() * range);
//левая граница возможного числа
let min = Math.min(n,m);

let firstNum = min+namberInRange1;
let secondNum = min+namberInRange2;

console.log('Первое произвольное число: ', firstNum);
console.log('Второе произвольное число: ', secondNum);

console.log('Первое число больше: ', aNormalized > bNormalized);
console.log('Первое число меньше: ', aNormalized < bNormalized);
console.log('Первое число больше или равно: ', aNormalized >= bNormalized);
console.log('Первое число меньше или равно: ', aNormalized <= bNormalized);
console.log('Числа равны: ', aNormalized === bNormalized);
console.log('Числа неравны: ', aNormalized !== bNormalized);