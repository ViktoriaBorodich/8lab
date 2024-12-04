// Получаем элементы из DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Функция для сохранения задач в localStorage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').textContent,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Функция для загрузки задач из localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  if (tasks) {
    tasks.forEach(task => {
      const listItem = document.createElement('li');
      const taskSpan = document.createElement('span');
      taskSpan.textContent = task.text;
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Удалить';
      const completeBtn = document.createElement('button');
      completeBtn.textContent = 'Выполнено';

      if (task.completed) {
        listItem.classList.add('completed');
      }

      deleteBtn.addEventListener('click', () => {
        listItem.remove();
        saveTasks();
      });
      completeBtn.addEventListener('click', () => {
        listItem.classList.toggle('completed');
        saveTasks();
      });

      listItem.appendChild(taskSpan);
      listItem.appendChild(completeBtn);
      listItem.appendChild(deleteBtn);
      taskList.appendChild(listItem);
    });
  }
}

// Функция для фильтрации задач
function filterTasks(filter) {
  const tasks = taskList.querySelectorAll('li');
  tasks.forEach(task => {
    switch (filter) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
      case 'uncompleted':
        task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
        break;
    }
  });
}

// Функция для добавления задачи
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  // Создаем элементы задачи
  const listItem = document.createElement('li');
  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  const completeBtn = document.createElement('button');
  completeBtn.textContent = 'Выполнено';

  // Добавляем обработчики событий
  deleteBtn.addEventListener('click', () => {
    listItem.remove();
    saveTasks();
    filterTasks(document.querySelector('.filter-btn.active').id.replace('filter', '').toLowerCase());
  });
  completeBtn.addEventListener('click', () => {
    listItem.classList.toggle('completed');
    saveTasks();
    filterTasks(document.querySelector('.filter-btn.active').id.replace('filter', '').toLowerCase());
  });

  // Добавляем элементы в DOM
  listItem.appendChild(taskSpan);
  listItem.appendChild(completeBtn);
  listItem.appendChild(deleteBtn);
  taskList.appendChild(listItem);

  // Очищаем поле ввода
  taskInput.value = '';

  // Сохраняем задачи
  saveTasks();
}

// Добавляем обработчик событий на кнопку добавления задачи
addTaskBtn.addEventListener('click', addTask);

// Добавляем обработчик события нажатия клавиши Enter в поле ввода
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Добавляем обработчики событий на кнопки фильтрации
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    filterTasks(btn.id.replace('filter', '').toLowerCase());
  });
});

// Загружаем задачи при загрузке страницы
loadTasks();

// Изначально показываем все задачи
filterTasks('all');
