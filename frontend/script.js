
const apiUrl = 'http://localhost:3000/tasks';

document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });

    loadTasks();
});

async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const tasksList = document.getElementById('tasks');
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        tasksList.innerHTML += `
            <li>
                <div>
                    <strong>${task.Title}</strong>
                    <p>${task.Description}</p>
                </div>
                <button onclick="deleteTask(${task.Id})">Eliminar</button>
            </li>
        `;
    });
}

async function deleteTask(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    loadTasks();
}

loadTasks();
