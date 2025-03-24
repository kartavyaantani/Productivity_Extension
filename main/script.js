// Function to set a cookie
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

// Function to get a cookie
function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

// Function to load tasks from cookies
function loadTasks() {
    const tasks = getCookie('tasks');
    if (tasks) {
        const taskArray = JSON.parse(tasks);
        taskArray.forEach(task => addTaskToDOM(task));
    }
}

// Function to add a task to the DOM
function addTaskToDOM(taskText) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.textContent = taskText;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'X';
    removeBtn.addEventListener('click', function() {
        taskList.removeChild(li);
        removeTaskFromCookies(taskText);
    });

    li.appendChild(removeBtn);
    taskList.appendChild(li);
}

// Function to remove a task from cookies
function removeTaskFromCookies(taskText) {
    const tasks = getCookie('tasks');
    if (tasks) {
        const taskArray = JSON.parse(tasks);
        const updatedTasks = taskArray.filter(task => task !== taskText);
        setCookie('tasks', JSON.stringify(updatedTasks), 7);
    }
}

// Function to add a task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText) {
        addTaskToDOM(taskText);
        const tasks = getCookie('tasks');
        const taskArray = tasks ? JSON.parse(tasks) : [];
        taskArray.push(taskText);
        setCookie('tasks', JSON.stringify(taskArray), 7);
        taskInput.value = '';
        taskInput.focus(); // Set focus back to the input field
    } else {
        alert('Please enter a task.');
    }
}

// Event listener for the Add Task button
document.getElementById('addTaskBtn').addEventListener('click', addTask);

// Event listener for the Enter key
document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Load tasks from cookies when the page loads
window.onload = loadTasks;