(function() {
    //преобразовываем данные в JSON
    function dataToJson(data){
        return JSON.stringify(data);
    }

    //преобразовываем JSON в данные
    function jsonToData(data){
        return JSON.parse(data);
    }

    //читаем данные из localStorage
    function getTodoData(key){
        return localStorage.getItem(key);
    }

    //записываем данные в localStorage
    function setTodoData(key, data){
        localStorage.setItem(key, data);
    }

    //сохраняем список дел в localStorage
    function saveTodoListToStorage(key, todoList){
        let jsonData = dataToJson(todoList);
        setTodoData(key, jsonData);
    }

    //читаем список дел из localStorage
    function loadTodoListFromStorage(key) {
        const data = getTodoData(key);
        return data ? jsonToData(data) : [];
    }

    //создаем новое дело
    function createNewTodo(name, done, arr){
        let maxId;

        //проверка на пустоту списка дел
        if (arr.length === 0) maxId = 1;
        else {
            let ids = arr.map(item => item.id);
            maxId = Math.max(...ids)+1;
        }

        //возвращаем новый объект
        return {
            id: maxId,
            name: name,
            done: done
        }
    }
    //создаем и возвращаем заголовок приложения
    function createAppTitle(title){
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //проверка на пустоту поля для ввода
    function disabledInput(input, button)
    {
        //если поле для ввода пустое, кнопка неактивна
        if (!input.value) button.disabled = true;
        //иначе активна
        else button.disabled = false;
    }
    //создаем и возвращаем форму для создания дела
    function createTodoItemForm(){
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        //изначально кнопка неактивна
        button.disabled = true;

        //вызываем проверку на пустоту поля для ввода
        input.addEventListener('input', function(){
            disabledInput(input, button);
        })

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    //создаем и возвращаем элемент списка (дело)
    function createTodoItem(todoData){
        let item = document.createElement('li');

        //кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        //устанавливаем стили для элементов списка,
        //а также для размещения кнопок
        //в его правой части с помощью flex
        item.textContent = todoData.name;
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        item.classList.add('btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        //вкладываем кнопки в отдельный элемент, чтобы
        //они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        //приложению нужен доступ к самому элементу и кнопкам
        //чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    //создаем и возвращаем список элементов
    function createTodoList(){
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    //создаем и возвращаем список дел
    function createTodoApp(container, title = 'Список дел', listName = 'default'){
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();
        let todoListData = loadTodoListFromStorage(listName);

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        //отображаем загруженные дела
        function renderTodoList(){
            todoList.innerHTML = '';
            for (let i = 0; i < todoListData.length; i++) {
                let todoData = todoListData[i];
                let todoItem = createTodoItem(todoData);
                todoItem.item.dataset.id = todoData.id;
        
            if (todoData.done) {
                todoItem.item.classList.add('list-group-item-success');
            }
            //добавляем обработчики на кнопки
            todoItem.doneButton.addEventListener('click', function(){
                todoItem.item.classList.toggle('list-group-item-success');

                let foundTodo = todoListData.find(obj => obj.id == todoItem.item.dataset.id);
                //меняем статус
                if (foundTodo) {
                    foundTodo.done = !foundTodo.done;
                    saveTodoListToStorage(listName, todoListData);
                }
            });
            todoItem.deleteButton.addEventListener('click', function(){
                if (confirm('Вы уверены?')){
                    todoItem.item.remove();

                    //удаляем из массива дело
                    let todoRemove = todoItem.item.dataset.id;
                    todoListData = todoListData.filter(obj => obj.id != todoRemove);
                    saveTodoListToStorage(listName, todoListData);
                }
            });
        
            todoList.append(todoItem.item);
            }
        }

        renderTodoList();

        //браузер создает событие submit на форме по нажатию
        //на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e){
            e.preventDefault();

            if (!todoItemForm.input.value) return;

            //создаем и добавляем в список новое дело
            let newTodo = createNewTodo(todoItemForm.input.value, false, todoListData);
            todoListData.push(newTodo);

            //сохраняем данные
            saveTodoListToStorage(listName, todoListData);

            //выводим список
            renderTodoList();

            todoItemForm.input.value = '';
            disabledInput(todoItemForm.input, todoItemForm.button);
            });
        }
        window.createTodoApp = createTodoApp;
})();
