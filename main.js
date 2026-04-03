const SERVER_URL = 'http://localhost:3000/api/students';
let studentsList = [];

async function serverGetStudents() {
    const response = await fetch(SERVER_URL);
    return await response.json();
}

async function serverAddStudent(obj) {
    const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    });
    return await response.json();
}

async function serverDeleteStudent(id) {
    await fetch(`${SERVER_URL}/${id}`, {
        method: 'DELETE',
    });
}

function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function getStudyStatus(startYear) {
    const start = Number(startYear);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const endYear = start + 4;
    
    if (currentYear > endYear || (currentYear === endYear && currentMonth >= 8)) {
        return `${start}-${endYear} (закончил)`;
    }
    let course = currentYear - start;
    if (currentMonth >= 8) course++;
    return `${start}-${endYear} (${course > 4 ? 4 : course} курс)`;
}

function getStudentItem(obj) {
    const row = document.createElement('tr');
    const fio = `${obj.surname} ${obj.name} ${obj.middleName}`;
    const birth = new Date(obj.birthday);
    const birthStr = `${String(birth.getDate()).padStart(2,'0')}.${String(birth.getMonth()+1).padStart(2,'0')}.${birth.getFullYear()}`;
    
    row.innerHTML = `
        <td>${fio}</td>
        <td>${obj.faculty}</td>
        <td>${birthStr} (${calculateAge(obj.birthday)} лет)</td>
        <td>${getStudyStatus(obj.startYear)}</td>
        <td><button class="btn btn-danger btn-sm delete-btn">Удалить</button></td>
    `;

    // Кнопка удаления
    row.querySelector('.delete-btn').onclick = async () => {
        if (confirm('Удалить студента?')) {
            await serverDeleteStudent(obj.id);
            studentsList = studentsList.filter(s => s.id !== obj.id);
            renderTable();
        }
    };

    return row;
}

async function renderTable() {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';

    let copyList = [...studentsList];
    
    const filterFio = document.getElementById('filterFio').value.toLowerCase();
    const filterFaculty = document.getElementById('filterFaculty').value.toLowerCase();
    const filterStartYear = document.getElementById('filterStartYear').value;
    const filterEndYear = document.getElementById('filterEndYear').value;

    copyList = copyList.filter(student => {
        const fullFio = `${student.surname} ${student.name} ${student.middleName}`.toLowerCase();
        if (filterFio && !fullFio.includes(filterFio)) return false;

        if (filterFaculty && !student.faculty.toLowerCase().includes(filterFaculty)) return false;

        if (filterStartYear && student.startYear !== filterStartYear) return false;

        if (filterEndYear && (Number(student.startYear) + 4) !== Number(filterEndYear)) return false;

        return true;
    });

    copyList.forEach(s => tbody.append(getStudentItem(s)));
}


document.addEventListener('DOMContentLoaded', async () => {
    // 1. Получаем данные с сервера при загрузке
    studentsList = await serverGetStudents();
    renderTable();

    // 2. Добавляем студента
    const form = document.getElementById('addStudentForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const newStudentRaw = {
            surname: document.getElementById('surname').value,
            name: document.getElementById('name').value,
            middleName: document.getElementById('middleName').value,
            birthday: document.getElementById('birthDate').value,
            startYear: document.getElementById('startYear').value,
            faculty: document.getElementById('faculty').value
        };

        const savedStudent = await serverAddStudent(newStudentRaw);
        studentsList.push(savedStudent);
        renderTable();
        form.reset();
    };

    // 3. Фильтры
    document.querySelectorAll('.form-control').forEach(input => {
        if (input.id.includes('filter')) {
            input.oninput = renderTable;
        }
    });
});