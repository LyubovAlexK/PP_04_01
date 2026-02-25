//Объявление переменных и массива
let count = 42;
let n = -3;
let m = -10;

let arr = [];

//Вычисляем значения для рандома
let min=Math.min(n,m);
let max=Math.max(n,m);

//Заполнение массива данными
for (let i=0; i < count; ++i){
    let randomNum = (Math.round(Math.random()*(max - min + 1) + min));
    arr.push(randomNum);
}

//Вывод результата
console.log(arr);