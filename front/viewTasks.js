const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async () => {
  const taskList = document.getElementById('taskList');
  const logoutBtn = document.getElementById('logoutBtn');
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Debes iniciar sesión');
    window.location.href = '/index.html';
    return;
  }

  logoutBtn.onclick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  };

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { 'x-auth-token': token }
    });
    if (!res.ok) throw new Error('Error al cargar tareas');
    const tasks = await res.json();

    if (tasks.length === 0) {
      taskList.innerHTML = '<li>No tienes tareas creadas.</li>';
      return;
    }

    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `${task.titulo} - Estado: ${task.estado}`;

      // Botón para editar
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        localStorage.setItem('selectedTaskId', task._id);
        window.location.href = '/updateTask.html';
      };

      // Botón para eliminar
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Eliminar';
      delBtn.onclick = (e) => {
        e.stopPropagation();
        localStorage.setItem('selectedTaskId', task._id);
        window.location.href = '/deleteTask.html';
      };

      li.appendChild(editBtn);
      li.appendChild(delBtn);
      taskList.appendChild(li);
    });
  } catch (err) {
    taskList.innerHTML = `<li class="error-msg">${err.message}</li>`;
  }
});
