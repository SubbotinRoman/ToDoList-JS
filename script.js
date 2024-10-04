const addTask = document.querySelector('.addTask-btn');
const inputBox = document.querySelector('#input-box');
const tasksList = document.querySelector('#list');
const emptyList = document.querySelector('#emptyList');

// Создаю массив, который содержит все задачи
let tasks = [];

// Получаю данные из localStorage и записываю их в массив tasks
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

addTask.addEventListener('click', addTasks);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

// 1) ФУНКЦИЯ ДОБАВЛЕНИЯ ЗАДАЧИ

function addTasks(event) {
  // Отменяю перезагрузку страницы
  event.preventDefault();
  // Достаю текст задачи из поля ввода
  const taskText = inputBox.value;
  // Описываю задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  // Добавляю задачу в массив с задачами
  tasks.push(newTask);
  // Сохраняю список задач в харнилище браузера localStorage
  saveToLocalStorage();
  // Рендерю задачу на странице
  renderTask(newTask);
  // Очищаю после вввода и возвращаю на него фокус
  inputBox.value = '';
  inputBox.focus();
  checkEmptyList();
}

// 2) ФУНКЦИЯ УДАЛЕНИЯ ЗАДАЧИ

function deleteTask(event) {
  // Проверяю, что клик был НЕ по кнопке "удалить задачу"
  if (event.target.dataset.action !== 'delete') return;
  // Нахожу родительский элемент для кнопки delete чтобы по клику на нее удалять задачу
  const parenNode = event.target.closest('.list-li');
  // Определяю id задачи
  const id = Number(parenNode.id);
  // Удаляю задча через фильтрацию массива
  tasks = tasks.filter((task) => task.id !== id);
  // Сохраняю список задач в харнилище браузера localStorage
  saveToLocalStorage();
  // Удаляю задачу из разметки
  parenNode.remove();
  checkEmptyList();
}

// 3) ФУНКЦИЯ ОТМЕЧАЕТ ЗАДАЧУ КАК ВЫПОЛНЕНА

function doneTask(event) {
  // Проверяю, что клик был НЕ по кнопке "задача выполена"
  if (event.target.dataset.action !== 'done') return;
  const parenNode = event.target.closest('.list-li');
  // Определяю id задачи
  const id = Number(parenNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;
  // Сохраняю список задач в харнилище браузера localStorage
  saveToLocalStorage();
  const taskTitle = parenNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="img/fox.svg" alt="Empty" width="170" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
          </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListElement = document.querySelector('#emptyList');
    emptyListElement ? emptyListElement.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  // Формирую CSS класс, чтобы отобразить нужный класс
  const cssClass = task.done ? 'task-title task-title--done>' : 'task-title';
  // Формирую разметку для новой задачи и сохраняю ее в переменную
  const taskHTML = `<li id='${task.id}'class="list-li">
               <span class="${cssClass}">${task.text}</span>
               <div class="task-item__buttons">
                 <button class="button-checked" data-action="done">
                   <img src="img/checked.svg" alt="Unchecked" />
                 </button>
                 <button class="button-delete" data-action="delete">
                   <img src="img/delete.svg" alt="Delete" />
                 </button>
               </div>
             </li>`;
  // Добавляю задачу на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
