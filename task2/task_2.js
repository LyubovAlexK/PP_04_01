function createStudentCard(student) {
    let elDiv = document.createElement('div');
    let elH2 = document.createElement('h2');
    let elSpan = document.createElement('span');
    
    elH2.textContent = student['name'];
    elSpan.textContent = `Возраст: ${student['age']} лет`;

    elDiv.appendChild(elH2);
    elDiv.appendChild(elSpan);

    document.body.append(elDiv);
}

let studentObj={ 
    name: 'Петя', 
    age: 17 
} 
createStudentCard(studentObj);