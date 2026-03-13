function createStudentsList(listArr) {
    let elUl = document.createElement('ul');

    for (let student of listArr)
    {
        let elLi = document.createElement('li');
        let elH2 = document.createElement('h2');
        let elSpan = document.createElement('span');

        elH2.textContent = student['name'];
        elSpan.textContent = `Возраст: ${student['age']}`;

        elLi.append(elH2, elSpan);
        elUl.append(elLi);
    }

    document.body.appendChild(elUl);
}

let allStudents=[ 
 {name: 'Валя', age: 11}, 
 {name: 'Таня',age: 24}, 
 {name: 'Рома',age: 21}, 
 {name: 'Надя', age: 34}, 
 {name: 'Антон', age: 7} 
] 

let elBtn = document.querySelector('#btn');
elBtn.addEventListener('click', function() {
    createStudentsList(allStudents);
});