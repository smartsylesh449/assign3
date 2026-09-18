/* =========================================
   JAVASCRIPT TO-DO APPLICATION
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const remainingText =
    document.getElementById("remainingText");

const taskMessage =
    document.getElementById("taskMessage");

const clearCompleted =
    document.getElementById("clearCompleted");

const currentDay =
    document.getElementById("currentDay");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* =========================================
   STATE
========================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("syleshTasks")
    ) || [];

let currentFilter = "all";


/* =========================================
   DATE
========================================= */

function showCurrentDate() {

    const today = new Date();

    const options = {
        weekday: "short",
        month: "short",
        day: "numeric"
    };

    currentDay.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );
}


showCurrentDate();


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "syleshTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   CREATE TASK
========================================= */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const text =
            taskInput.value.trim();


        if (text === "") {

            return;

        }


        const newTask = {

            id: Date.now(),

            text: text,

            completed: false

        };


        tasks.unshift(newTask);


        saveTasks();

        renderTasks();


        taskInput.value = "";

        taskInput.focus();

    }
);


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    if (filteredTasks.length === 0) {

        emptyState.classList.add("show");

    } else {

        emptyState.classList.remove("show");

    }


    filteredTasks.forEach(
        function (task) {

            const taskElement =
                createTaskElement(task);

            taskList.appendChild(
                taskElement
            );

        }
    );


    updateStatistics();

}


/* =========================================
   FILTER TASKS
========================================= */

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(
            task => !task.completed
        );

    }


    if (currentFilter === "completed") {

        return tasks.filter(
            task => task.completed
        );

    }


    return tasks;

}


/* =========================================
   CREATE TASK ELEMENT
========================================= */

function createTaskElement(task) {

    const li =
        document.createElement("li");


    li.className =
        "task-item";


    if (task.completed) {

        li.classList.add("completed");

    }


    li.dataset.id =
        task.id;


    li.innerHTML = `

        <button
            class="check-button"
            data-action="complete"
            aria-label="${
                task.completed
                ? "Mark task as active"
                : "Mark task as completed"
            }">

            ${task.completed ? "✓" : ""}

        </button>


        <div class="task-content">

            <p class="task-text">
                ${escapeHTML(task.text)}
            </p>

        </div>


        <div class="task-buttons">

            <button
                class="action-button edit-button"
                data-action="edit"
                aria-label="Edit task">

                ✏️

            </button>


            <button
                class="action-button delete-button"
                data-action="delete"
                aria-label="Delete task">

                🗑️

            </button>

        </div>

    `;


    return li;

}


/* =========================================
   EVENT DELEGATION
========================================= */

taskList.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");


        if (!button) {

            return;

        }


        const taskItem =
            button.closest(".task-item");


        if (!taskItem) {

            return;

        }


        const taskId =
            Number(taskItem.dataset.id);


        const action =
            button.dataset.action;


        if (action === "complete") {

            toggleTask(taskId);

        }


        if (action === "delete") {

            deleteTask(taskId);

        }


        if (action === "edit") {

            editTask(taskId);

        }

    }
);


/* =========================================
   COMPLETE / UNCOMPLETE
========================================= */

function toggleTask(id) {

    tasks =
        tasks.map(
            function (task) {

                if (task.id === id) {

                    return {
                        ...task,
                        completed:
                            !task.completed
                    };

                }

                return task;

            }
        );


    saveTasks();

    renderTasks();

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();

}


/* =========================================
   EDIT TASK
========================================= */

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {

        return;

    }


    const newText =
        prompt(
            "Edit your task:",
            task.text
        );


    if (
        newText === null ||
        newText.trim() === ""
    ) {

        return;

    }


    task.text =
        newText.trim();


    saveTasks();

    renderTasks();

}


/* =========================================
   FILTER BUTTONS
========================================= */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


/* =========================================
   CLEAR COMPLETED
========================================= */

clearCompleted.addEventListener(
    "click",
    function () {

        const completedCount =
            tasks.filter(
                task => task.completed
            ).length;


        if (completedCount === 0) {

            alert(
                "There are no completed tasks."
            );

            return;

        }


        const confirmed =
            confirm(
                "Clear all completed tasks?"
            );


        if (!confirmed) {

            return;

        }


        tasks =
            tasks.filter(
                task => !task.completed
            );


        saveTasks();

        renderTasks();

    }
);


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    totalTasks.textContent =
        total;


    activeTasks.textContent =
        active;


    completedTasks.textContent =
        completed;


    remainingText.textContent =
        `${active} ${
            active === 1
            ? "task"
            : "tasks"
        } remaining`;


    if (total === 0) {

        taskMessage.textContent =
            "Start adding tasks to your list.";

    }

    else if (active === 0) {

        taskMessage.textContent =
            "🎉 All tasks completed!";

    }

    else {

        taskMessage.textContent =
            "Keep going. You've got this!";

    }

}


/* =========================================
   SECURITY
   Prevent HTML injection
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   INITIAL LOAD
========================================= */

renderTasks();