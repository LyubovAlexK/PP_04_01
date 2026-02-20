let userName = 'Любовь';
let userSurname = 'любовь';

let firstCharName = userName.substring(0, 1);
let lastCharName = userName.substring(1);

let firstCharSurname = userSurname.substring(0, 1);
let lastCharSurname = userSurname.substring(1);

let correctName = firstCharName.toUpperCase() + lastCharName.toLowerCase();
let correctSurname = firstCharSurname.toUpperCase() + lastCharSurname.toLowerCase();

console.log(`Преобразованное имя пользователя: ${correctName}`);
console.log(`Преобразованная фамилия пользователя: ${correctSurname}`);

userName === correctName ? console.log('Имя осталось без изменений') : console.log('Имя было преобразовано');
userSurname === correctSurname ? console.log('Фамилия осталось без изменений') : console.log('Фамилия была преобразована');