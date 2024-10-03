document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const nameForm = document.getElementById('name-form');
    const progressFill = document.getElementById('progress-fill');
    const userNameSpan = document.getElementById('user-name');
    const themeToggleBtn = document.getElementById('theme-toggle');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let darkMode = localStorage.getItem('dark_mode') === '1';

    let userName = 'Guest';
    userNameSpan.textContent = userName;

    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('name').value;

        if (nameInput) {
            userName = nameInput;
            userNameSpan.textContent = userName;
            document.getElementById('name').value = '';
        } else {
            userNameSpan.textContent = 'Guest';
        }
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDateInput = document.getElementById('task-date').value;
        const taskDate = taskDateInput ? new Date(taskDateInput).toLocaleDateString() : new Date().toLocaleDateString();

        tasks.push({ name: taskName, status: 'pending', date: taskDate });
        updateLocalStorage();
        renderTasks('all');
        document.getElementById('task-name').value = '';
        document.getElementById('task-date').value = '';
    });

    document.querySelectorAll('.task-filter button').forEach(button => {
        button.addEventListener('click', () => {
            renderTasks(button.dataset.filter);
        });
    });

    themeToggleBtn.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('dark_mode', darkMode ? '1' : '0');
    });

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            if (filter === 'all' || task.status === filter) {
                const taskItem = document.createElement('li');
                taskItem.innerHTML = `
                    <div>
                        <span>${task.name}</span>
                        <span>${task.date}</span>
                    </div>
                    <div class="task-actions">
                        <button onclick="editTask(${index})">Edit</button>
                        ${task.status === 'pending' ? 
                        `<button onclick="markComplete(${index})">Complete</button>` : 
                        `<button onclick="markPending(${index})">Pending</button>`}
                        <button onclick="deleteTask(${index})">Delete</button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            }
        });

        updateProgressBar();
    }

    window.editTask = function (index) {
        const newTaskName = prompt("Edit task name:", tasks[index].name);
        if (newTaskName !== null && newTaskName.trim() !== "") {
            tasks[index].name = newTaskName;
        }
        
        const newTaskDate = prompt("Edit task date (MM/DD/YYYY):", tasks[index].date);
        if (newTaskDate !== null && new Date(newTaskDate).toString() !== "Invalid Date") {
            tasks[index].date = new Date(newTaskDate).toLocaleDateString();
        }

        updateLocalStorage();
        renderTasks('all');
    }

    window.markComplete = function (index) {
        tasks[index].status = 'completed';
        updateLocalStorage();
        renderTasks('all');
    }

    window.markPending = function (index) {
        tasks[index].status = 'pending';
        updateLocalStorage();
        renderTasks('all');
    }

    window.deleteTask = function (index) {
        tasks.splice(index, 1);
        updateLocalStorage();
        renderTasks('all');
    }

    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateProgressBar() {
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const totalTasks = tasks.length;
        const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
        progressFill.style.width = `${completionRate}%`;
    }

    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    renderTasks('all');
});
