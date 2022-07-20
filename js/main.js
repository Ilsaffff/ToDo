const form = document.querySelector("#form"); // Форма, которая отправляет задачу
const taskInput = document.querySelector("#taskInput"); // То куда мы пишем
const tasksList = document.querySelector("#tasksList"); // ul который нам нужен для добавления новой разметки (новой задачи) в html
const emptyList = document.querySelector("#emptyList");

let tasks = [];
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}
checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

// Функции
function addTask(event) {
  event.preventDefault(); // Останавливает перезагрузку страницы и сохраняет переменную

  const taskText = taskInput.value; // Перекидывает taskInput в taskText, на доску задач

  const newTask = {
    // Создание объекта
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);
  saveToLocalStorage(); // Добавляем задачу в память

  // Формируем CSS класс
  renderTask(newTask);
  taskInput.value = ""; // Чтобы инпут очищался
  taskInput.focus(); // Чтобы фокус был на инпуте
  checkEmptyList(); // Проверяем наличие задач для надписи "Список дел пуст"
}
function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parentNode = event.target.closest(".list-group-item");

  // Определяем ID задачи
  const id = Number(parentNode.id);

  // Вводим индекс задачи, которую нужно удалить
  const index = tasks.findIndex((task) => task.id === id);

  // Удаляем задачу из массива tasks
  tasks.splice(index, 1);
  saveToLocalStorage();

  parentNode.remove();
  checkEmptyList();
}
function doneTask(event) {
  if ((event.target.dataset.action = "done")) {
    const parentNode = event.target.closest(".list-group-item");
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;
    saveToLocalStorage();
    const taskTitle = parentNode.querySelector(".task-title");
    taskTitle.classList.toggle("task-title--done");
  }
}
function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emtyListEl = document.querySelector("#emptyList");
    emtyListEl ? emtyListEl.remove() : null;
  }
}
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTask(task) {
  const cssClass = task.done ? "task title task-title--done" : "task-title";

  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item"> 
  <span class="${cssClass}">${task.text}</span>
  <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18">
      </button>
      <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Done" width="18" height="18">
      </button>
  </div>
</li>`;
  // Создаётся разметка для задачи в доску задач
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
