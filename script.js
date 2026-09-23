// Get elements from HTML

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const clearCompleted = document.getElementById("clearCompleted");


// Get tasks from localStorage

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";


// Save tasks

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}


// Display tasks

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.dataset.id = task.id;


        li.innerHTML = `
            <input type="checkbox"
                   class="check-task"
                   ${task.completed ? "checked" : ""}>

            <span class="task-text">${task.text}</span>

            <button class="edit-btn">Edit</button>

            <button class="delete-btn">Delete</button>
        `;


        taskList.appendChild(li);
    });


    updateStats();
}


// Update statistics

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const active = total - completed;

    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;
}


// Add new task

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false
    };


    tasks.push(newTask);

    saveTasks();

    displayTasks();

    taskInput.value = "";

    taskInput.focus();
}


// Add button event

addBtn.addEventListener("click", addTask);


// Press Enter to add task

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Event Delegation

taskList.addEventListener("click", function(event) {

    const taskElement = event.target.closest(".task");

    if (!taskElement) {
        return;
    }


    const taskId = Number(taskElement.dataset.id);


    // Delete task

    if (event.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== taskId);

        saveTasks();

        displayTasks();
    }


    // Edit task

    if (event.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === taskId);

        const newText = prompt("Edit your task:", task.text);


        if (newText !== null && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();

            displayTasks();
        }
    }

});


// Complete / Uncomplete task

taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("check-task")) {
        return;
    }


    const taskElement = event.target.closest(".task");

    const taskId = Number(taskElement.dataset.id);


    const task = tasks.find(task => task.id === taskId);

    task.completed = event.target.checked;


    saveTasks();

    displayTasks();
});


// Filter buttons

document.querySelector(".filters").addEventListener("click", function(event) {

    if (!event.target.classList.contains("filter")) {
        return;
    }


    document.querySelectorAll(".filter").forEach(button => {
        button.classList.remove("active");
    });


    event.target.classList.add("active");


    currentFilter = event.target.dataset.filter;


    displayTasks();
});


// Clear completed tasks

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    displayTasks();
});


// Initial display

displayTasks();