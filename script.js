const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const clearTasksButton = document.getElementById('clearTasksButton');
const filters = document.querySelectorAll('.filter');
const notification = document.querySelector('.notification');

// Event listeners
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
clearTasksButton.addEventListener('click', clearAllTasks);
filters.forEach(filter => filter.addEventListener('click', filterTasks));

// Load tasks from local storage on page load
loadTasks();

// Add task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;
        li.classList.add('fade-in');
        li.appendChild(createDeleteButton());
        li.onclick = function() {
            toggleTaskCompletion(li);
        };
        taskList.appendChild(li);
        saveTaskToLocalStorage(taskText);
        showNotification('Task added!');
        taskInput.value = '';
    } else {
        showNotification('Please enter a task!');
    }
}

// Create delete button
function createDeleteButton() {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.onclick = function(event) {
        event.stopPropagation(); // Prevent toggling completion on delete
        deleteTask(this.parentElement);
    };
    return deleteButton;
}

// Save task to local storage
function saveTaskToLocalStorage(taskText) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get tasks from local storage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Load tasks from local storage
function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) {
            li.classList.add('completed');
        }
        li.appendChild(createDeleteButton());
        li.onclick = function() {
            toggleTaskCompletion(li);
        };
        taskList.appendChild(li);
    });
}

// Toggle task completion
function toggleTaskCompletion(taskElement) {
    taskElement.classList.toggle('completed');
    const taskText = taskElement.textContent.replace('Delete', '').trim();
    const tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(task => task.text === taskText);
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete task
function deleteTask(taskElement) {
    const taskText = taskElement.textContent.replace('Delete', '').trim();
    taskElement.classList.add('fade-out');
    setTimeout(() => {
        taskElement.remove();
        removeTaskFromLocalStorage(taskText);
        showNotification('Task deleted!');
    }, 300);
}

// Remove task from local storage
function removeTaskFromLocalStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filter tasks
function filterTasks(e) {
    const filter = e.target.dataset.filter;
    const tasks = taskList.querySelectorAll('li');

    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'active':
                task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    });

    filters.forEach(filterButton => filterButton.classList.remove('active'));
    e.target.classList.add('active');
}

// Clear all completed tasks
function clearAllTasks() {
    const tasks = taskList.querySelectorAll('li.completed');
    tasks.forEach(task => {
        task.remove();
        removeTaskFromLocalStorage(task.textContent.replace('Delete', '').trim());
    });
    showNotification('Completed tasks cleared!');
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.style.opacity = '1';
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000); // Fade out after 3 seconds
}
