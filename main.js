// main.js

// Этап 2. Создан массив объектов студентов
const studentsList = [
    {
        surname: 'Иванов',
        name: 'Иван',
        middleName: 'Иванович',
        birthDate: new Date(2002, 4, 15),
        startYear: 2020,
        faculty: 'Юридический'
    },
    {
        surname: 'Кремлякова',
        name: 'Любовь',
        middleName: 'Александровна',
        birthDate: new Date(2006, 1, 12),
        startYear: 2022,
        faculty: 'Информационных технологий'
    },
    {
        surname: 'Карпов',
        name: 'Никита',
        middleName: 'Александрович',
        birthDate: new Date(2006, 12, 21),
        startYear: 2022,
        faculty: 'Информационных технологий'
    },
    {
        surname: 'Кузнецов',
        name: 'Тимур',
        middleName: 'Анатольевич',
        birthDate: new Date(2006, 6, 2),
        startYear: 2022,
        faculty: 'Информационных технологий'
    },
    {
        surname: 'Смирнова',
        name: 'Дарья',
        middleName: 'Павловна',
        birthDate: new Date(2002, 6, 15),
        startYear: 2020,
        faculty: 'Математический'
    }
];

// Текущий массив для отображения (с учетом фильтрации и сортировки)
let currentDisplayList = [...studentsList];
let currentSortField = null;
let currentSortDirection = 'asc';

// Вспомогательные функции
function getCurrentYear() {
    return new Date().getFullYear();
}

function getCurrentDate() {
    return new Date();
}

// Вычисляем возраст по дате рождения
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Форматируем даты в формат ДД.ММ.ГГГГ
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Получаем статус обучения и форматированного периода
function getStudyStatus(student) {
    const startYear = student.startYear;
    const endYear = startYear + 4;
    const currentYear = getCurrentYear();
    const currentMonth = new Date().getMonth();
    
    let status;
    if (currentYear > endYear || (currentYear === endYear && currentMonth >= 8)) {
        status = 'закончил';
    } else {
        let course = currentYear - startYear;
        if (currentMonth < 8) {
            course--;
        }
        if (course < 1) course = 1;
        if (course > 4) course = 4;
        status = `${course} курс`;
    }
    
    return `${startYear}-${endYear} (${status})`;
}

// Получаем полное ФИО
function getFullName(student) {
    return `${student.surname} ${student.name} ${student.middleName}`;
}

// Этап 3. Создание функции вывода одного студента в таблицу
function getStudentItem(studentObj) {
    const row = document.createElement('tr');
    
    const fioCell = document.createElement('td');
    fioCell.textContent = getFullName(studentObj);
    row.appendChild(fioCell);
    
    const facultyCell = document.createElement('td');
    facultyCell.textContent = studentObj.faculty;
    row.appendChild(facultyCell);
    
    const birthCell = document.createElement('td');
    const age = calculateAge(studentObj.birthDate);
    birthCell.textContent = `${formatDate(studentObj.birthDate)} (${age} лет)`;
    row.appendChild(birthCell);
    
    const studyCell = document.createElement('td');
    studyCell.textContent = getStudyStatus(studentObj);
    row.appendChild(studyCell);
    
    return row;
}

// Этап 4. Создание функции отрисовки всех студентов
function renderStudentsTable(studentsArray) {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';
    
    studentsArray.forEach(student => {
        tbody.appendChild(getStudentItem(student));
    });
}

// Функция сортировки
function sortStudents(students, field, direction) {
    const sorted = [...students];
    
    sorted.sort((a, b) => {
        let aValue, bValue;
        
        switch (field) {
            case 'fio':
                aValue = getFullName(a);
                bValue = getFullName(b);
                break;
            case 'faculty':
                aValue = a.faculty;
                bValue = b.faculty;
                break;
            case 'birthDate':
                aValue = a.birthDate.getTime();
                bValue = b.birthDate.getTime();
                break;
            case 'startYear':
                aValue = a.startYear;
                bValue = b.startYear;
                break;
            default:
                return 0;
        }
        
        if (direction === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    
    return sorted;
}

// Функция фильтрации
function filterStudents(students) {
    const filterFio = document.getElementById('filterFio').value.trim().toLowerCase();
    const filterFaculty = document.getElementById('filterFaculty').value.trim().toLowerCase();
    const filterStartYear = document.getElementById('filterStartYear').value;
    const filterEndYear = document.getElementById('filterEndYear').value;
    
    return students.filter(student => {
        if (filterFio) {
            const fullNameLower = getFullName(student).toLowerCase();
            if (!fullNameLower.includes(filterFio)) {
                return false;
            }
        }
        
        if (filterFaculty && !student.faculty.toLowerCase().includes(filterFaculty)) {
            return false;
        }
        
        if (filterStartYear && student.startYear !== parseInt(filterStartYear)) {
            return false;
        }
        
        if (filterEndYear && (student.startYear + 4) !== parseInt(filterEndYear)) {
            return false;
        }
        
        return true;
    });
}

// Функция обновления таблицы (применяет фильтры и сортировку)
function updateTable() {
    let filtered = filterStudents(studentsList);
    
    if (currentSortField) {
        filtered = sortStudents(filtered, currentSortField, currentSortDirection);
    }
    
    currentDisplayList = filtered;
    renderStudentsTable(currentDisplayList);
}

// Валидация формы добавления студента
function validateStudentForm(surname, name, middleName, birthDate, startYear, faculty) {
    const errors = [];
    const currentDate = getCurrentDate();
    const minBirthDate = new Date(1900, 0, 1);
    
    if (!surname.trim()) errors.push('Фамилия не может быть пустой');
    if (!name.trim()) errors.push('Имя не может быть пустым');
    if (!middleName.trim()) errors.push('Отчество не может быть пустым');
    if (!faculty.trim()) errors.push('Факультет не может быть пустым');
    
    if (!birthDate) {
        errors.push('Дата рождения обязательна');
    } else {
        const birth = new Date(birthDate);
        if (birth < minBirthDate) {
            errors.push('Дата рождения не может быть раньше 01.01.1900');
        }
        if (birth > currentDate) {
            errors.push('Дата рождения не может быть позже текущей даты');
        }
    }
    
    if (!startYear) {
        errors.push('Год начала обучения обязателен');
    } else {
        const year = parseInt(startYear);
        if (year < 2000) {
            errors.push('Год начала обучения не может быть раньше 2000');
        }
        if (year > getCurrentYear()) {
            errors.push('Год начала обучения не может быть позже текущего года');
        }
    }
    
    return errors;
}

// Отображение ошибок валидации
function showErrors(errors) {
    const errorsDiv = document.getElementById('formErrors');
    if (errors.length > 0) {
        errorsDiv.innerHTML = '<strong>Ошибки валидации:</strong><ul>' + 
            errors.map(err => `<li>${err}</li>`).join('') + '</ul>';
        errorsDiv.classList.remove('d-none');
    } else {
        errorsDiv.classList.add('d-none');
    }
}

// Очистка формы
function clearForm() {
    document.getElementById('surname').value = '';
    document.getElementById('name').value = '';
    document.getElementById('middleName').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('startYear').value = '';
    document.getElementById('faculty').value = '';
}

// Добавляем нового студента
function addStudent(event) {
    event.preventDefault();
    
    const surname = document.getElementById('surname').value;
    const name = document.getElementById('name').value;
    const middleName = document.getElementById('middleName').value;
    const birthDateValue = document.getElementById('birthDate').value;
    const startYearValue = document.getElementById('startYear').value;
    const faculty = document.getElementById('faculty').value;
    
    const errors = validateStudentForm(surname, name, middleName, birthDateValue, startYearValue, faculty);
    
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    const newStudent = {
        surname: surname.trim(),
        name: name.trim(),
        middleName: middleName.trim(),
        birthDate: new Date(birthDateValue),
        startYear: parseInt(startYearValue),
        faculty: faculty.trim()
    };
    
    studentsList.push(newStudent);
    clearForm();
    showErrors([]);
    updateTable();
}

// Настройка сортировки по клику на заголовки
function setupSorting() {
    const headers = document.querySelectorAll('.sortable');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.dataset.sort;
            
            if (currentSortField === sortField) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortField = sortField;
                currentSortDirection = 'asc';
            }
            
            updateTable();
        });
    });
}

// Настройка фильтров
function setupFilters() {
    const filterInputs = ['filterFio', 'filterFaculty', 'filterStartYear', 'filterEndYear'];
    filterInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', () => {
            currentSortField = null;
            currentSortDirection = 'asc';
            updateTable();
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    renderStudentsTable(studentsList);
    currentDisplayList = [...studentsList];
    
    const form = document.getElementById('addStudentForm');
    form.addEventListener('submit', addStudent);
    
    setupSorting();
    setupFilters();
});