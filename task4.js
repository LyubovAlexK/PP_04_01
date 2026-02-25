//Объявление массивов
let arr1 = [2, 2, 17, 21, 45, 12, 54, 31, 53];
let arr2 = [12, 44, 23, 5];
let result = [];

//Вычисляем общее кол-во чисел в массивах
let count = arr1.length+arr2.length;

//Объединяем массивы
let i=0;
let j=0;
let arr1LastIndex = arr1.length-1;
while(result.length!==count)
{
    if (i>arr1LastIndex) {
        result.push(arr2[j]);
        j++;
    }
    else{
        result.push(arr1[i]);
        i++;
    }
}

//Вывод результата
console.log(result);