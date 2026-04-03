/* eslint-disable no-console */
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { createServer } = require('http');

const DB_FILE = './db.json';
const URI_PREFIX = '/api/students';
const PORT = 3000;

class StudentApiError extends Error {
  constructor(statusCode, data) {
    super();
    this.statusCode = statusCode;
    this.data = data;
  }
}

function drainJson(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => { resolve(JSON.parse(data)); });
  });
}

// Проверка и создание объекта студента
function makeStudentFromData(data) {
  const errors = [];
  const student = {
    surname: data.surname && String(data.surname),
    name: data.name && String(data.name),
    middleName: data.middleName && String(data.middleName),
    birthday: data.birthday && String(data.birthday),
    startYear: data.startYear && String(data.startYear),
    faculty: data.faculty && String(data.faculty),
  };

  if (!student.surname) errors.push({ field: 'surname', message: 'Не указана фамилия' });
  if (!student.name) errors.push({ field: 'name', message: 'Не указано имя' });
  if (!student.faculty) errors.push({ field: 'faculty', message: 'Не указан факультет' });

  if (errors.length) throw new StudentApiError(422, { errors });
  return student;
}

function getStudentsList() {
  try {
    return JSON.parse(readFileSync(DB_FILE, 'utf8') || '[]');
  } catch {
    return [];
  }
}

function createStudent(data) {
  const newItem = makeStudentFromData(data);
  newItem.id = Date.now().toString();
  const list = getStudentsList();
  list.push(newItem);
  writeFileSync(DB_FILE, JSON.stringify(list), { encoding: 'utf8' });
  return newItem;
}

function deleteStudent(itemId) {
  const items = getStudentsList();
  const itemIndex = items.findIndex(({ id }) => id === itemId);
  if (itemIndex === -1) throw new StudentApiError(404, { message: 'Student Not Found' });
  items.splice(itemIndex, 1);
  writeFileSync(DB_FILE, JSON.stringify(items), { encoding: 'utf8' });
  return {};
}

if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, '[]', { encoding: 'utf8' });

createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  if (!req.url || !req.url.startsWith(URI_PREFIX)) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Not Found' }));
    return;
  }

  const uri = req.url.substr(URI_PREFIX.length);

  try {
    const body = await (async () => {
      if (uri === '' || uri === '/') {
        if (req.method === 'GET') return getStudentsList();
        if (req.method === 'POST') {
          res.statusCode = 201;
          return createStudent(await drainJson(req));
        }
      } else {
        const itemId = uri.substr(1);
        if (req.method === 'DELETE') return deleteStudent(itemId);
      }
      return null;
    })();
    res.end(JSON.stringify(body));
  } catch (err) {
    if (err instanceof StudentApiError) {
      res.writeHead(err.statusCode);
      res.end(JSON.stringify(err.data));
    } else {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Internal Server Error' }));
      console.error(err);
    }
  }
})
  .on('listening', () => {
    console.log(`\n  Сервер студентов запущен!`);
    console.log(`  Адрес: http://localhost:${PORT}`);
    console.log('\nНажмите CTRL+C, чтобы остановить сервер\n');
    console.log('Доступные методы API:');
    console.log(`GET    ${URI_PREFIX} - Получить список всех студентов`);
    console.log(`POST   ${URI_PREFIX} - Добавить нового студента`);
    console.log(`DELETE ${URI_PREFIX}/{id} - Удалить студента по его ID`);
  })
  .listen(PORT);