function getOlderUser(user1, user2) {
    if (user1.age < user2.age) {
        return user2.name;
    }
    else {
        return user1.name;
    }
}

function getOlderUserArray(arrUser){
    let olderUser = arrUser[0];
    for (let user of arrUser)
    {
        if (olderUser.age < user.age) {
            olderUser.name = user.name;
            olderUser.age = user.age;
        }
    }
    return olderUser.name;
}

let user1={ 
name: 'Игорь', 
age: 17 
}; 

let user2={ 
name: 'Оля', 
age: 21 
}; 

let result = getOlderUser(user1, user2);

console.log(result);

let allUsers=[ 
{name: 'Валя', age: 11}, 
{name: 'Таня',age: 24}, 
{name: 'Рома',age: 21}, 
{name: 'Надя', age: 34}, 
{name: 'Антон', age: 7} 
];

let result1 = getOlderUserArray(allUsers);

console.log(result1);