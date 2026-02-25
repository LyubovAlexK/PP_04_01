//Объявление переменных и массива
let count = 10;
let n = 3;
let arr = [];
let result=-1;

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

//Нахождение индекса числа n в массиве
for (let i=0; i<arr.length;++i){
    if (arr[i]===n) result=i;
    break;
}

//Вывод результата
result>-1 ? console.log(`Число ${n} в массиве имеет индекс: ${result}`): console.log(`Число ${n} не встречается в массиве!`);