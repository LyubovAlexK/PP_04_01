function createStudentCard(name, age) {
    let elDiv = document.createElement('div');
    let elH2 = document.createElement('h2');
    let elSpan = document.createElement('span');
    
    elH2.textContent = name;
    elSpan.textContent = `Возраст: ${age} лет`;

    elDiv.appendChild(elH2);
    elDiv.appendChild(elSpan);

    document.body.append(elDiv);
}

createStudentCard('Любовь', 20);