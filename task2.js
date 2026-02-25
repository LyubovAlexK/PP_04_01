//Объявление переменной и массива
let count = 10;
let arr = [];

//Заполнение массива упорядоченных чисел
for (let i=1; i<=count; ++i){
    arr.push(i);
}

//Перемешивание данных массива
for (let i=0; i<arr.length; ++i){
    let temp=arr[i];
    let j = Math.floor(Math.random()*count);
    arr[i]=arr[j];
    arr[j]=temp;
}

//Вывод результата
console.log(arr);