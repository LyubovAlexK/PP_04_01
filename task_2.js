 function filter(obj, property, condition) {

    let filterResult = [];

    for (let key of obj) {
        if (key[property] === condition) {
            filterResult.push(key);
        }
    }
    return filterResult;
 }

 let objects = [ 
    { name: 'Василий', surname: 'Васильев' }, 
    { name: 'Иван', surname: 'Иванов' }, 
    { name: 'Пётр', surname: 'Петров' } 
];

let result = filter(objects, 'name', 'Иван'); 

console.log(result);