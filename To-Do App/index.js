// To-Do Project
let list = [];

const display = document.querySelector(".display");
const allTasks = document.getElementById("allTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");
const emptyState = document.getElementById("emptyState");
const inputError = document.getElementById("inputError");
const savedTasks = localStorage.getItem("tasks");

let taskId;
if (savedTasks) {
  list = JSON.parse(savedTasks);
}

if (list.length === 0) {
  taskId = 0;
} else {
  const ids = list.map((item) => item.id);
  taskId = Math.max(...ids);
}

emptyCheck();
renderTaskLists();

updateCount();

console.log(list);

const addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", (event) => {
  const input = document.getElementById("input");
  const value = input.value.trim();
  if (value === "") {
    inputError.hidden = false;
    inputError.textContent = "Please Enter a Task";
    return;
  }

  taskId++;
  display.style.display = "grid";
  inputError.hidden = true;

  const task = addNote(value, taskId);
  saveTasks();
  renderTaskLists();
  emptyCheck();
  updateCount();
  input.value = "";
});

function addNote(value, taskId) {
  const task = {
    id: taskId,
    task: value,
    completed: false,
  };
  list.push(task);
  console.log(list);
  return task;
}

function emptyCheck() {
  if (list.length !== 0) {
    emptyState.style.display = "none";
  } else {
    emptyState.style.display = "block";
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(list));
}

function renderTaskLists() {
  allTasks.textContent = "";
  completedTasks.textContent = "";
  activeTasks.textContent = "";
  list.forEach((item) => {
    renderTask(item, allTasks);
    if (item.completed) {
      renderTask(item, completedTasks);
    } else {
      renderTask(item, activeTasks);
    }
  });
}

function renderTask(task, container) {
  const noteContainer = document.createElement("div");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  const msgDisplay = document.createElement("p");
  const deleteBtn = document.createElement("button");
  display.style.display = "grid";

  noteContainer.classList.add("noteContainer");
  noteContainer.dataset.taskId = task.id;

  msgDisplay.textContent = task.task;
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("deleteBtn");
  container.append(noteContainer);
  noteContainer.append(checkbox);
  noteContainer.append(msgDisplay);
  noteContainer.append(deleteBtn);

  checkbox.dataset.taskId = task.id;
  checkbox.checked = task.completed;
  if (task.completed) {
    msgDisplay.classList.add("completed");
  }

  checkbox.addEventListener("change", (event) => {
    const task = list.find(
      (item) => item.id === Number(checkbox.dataset.taskId),
    );
    task.completed = checkbox.checked;
    renderTaskLists();
    saveTasks();
    updateCount();
  });

  deleteBtn.dataset.taskId = task.id;
  deleteBtn.addEventListener("click", (event) => {
    list = list.filter((item) => item.id !== Number(deleteBtn.dataset.taskId));

    saveTasks();
    renderTaskLists();
    emptyCheck();
    updateCount();

    if (list.length === 0) {
      display.style.display = "none";
    }
  });
}

function updateCount() {
  const taskCount = document.getElementById("taskCount");
  const completedTask = list.filter((item) => item.completed);
  const remainingTaskDisplay = document.getElementById("remainingTask");
  const completedDisplay = document.getElementById("completedTask");
  const remainingTask = list.filter((item) => !item.completed);
  taskCount.textContent = `Total: ${list.length}`;
  completedDisplay.textContent = `Completed Task: ${completedTask.length}`;
  remainingTaskDisplay.textContent = `Remaining Task: ${remainingTask.length}`;
}
