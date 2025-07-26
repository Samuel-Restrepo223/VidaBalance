const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const pageTitle = document.getElementById('pageTitle');
  const taskList = document.getElementById('taskList');
  const taskForm = document.getElementById('taskForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const cancelEditBtn = document.getElementById('cancelEdit');
  const taskIdInput = document.getElementById('taskId');
  const tituloInput = document.getElementById('titulo');
  const descripcionInput = document.getElementById('descripcion');
  const fechaInput = document.getElementById('fechaVencimiento');
  const estadoSelect = document.getElementById('estado');
  const calificacionInput = document.getElementById('calificacion');
  const saveBtn = document.getElementById('saveBtn');

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

  const headers = {
    'Content-Type': 'application/json',
    'x-auth-token': token,
  };

  // Cargar tareas
  async function fetchTasks() {
    try {
      const res = await fetch(`${API_BASE}/tasks`, { headers });
      if (!res.ok) throw new Error('No se pudieron cargar las tareas');
      const tasks = await res.json();
      renderTasks(tasks);
    } catch (err) {
      taskList.innerHTML = `<li class="error-msg">${err.message}</li>`;
    }
  }

  // Mostrar tareas en lista
  function renderTasks(tasks) {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
      taskList.innerHTML = '<li>No tienes tareas creadas.</li>';
      return;
    }
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `${task.titulo} - Estado: ${task.estado}`;
      li.onclick = () => loadTask(task);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Eliminar';
      delBtn.className = 'delete-btn';
      delBtn.onclick = async e => {
        e.stopPropagation();
        if (confirm('¿Eliminar esta tarea?')) {
          try {
            const res = await fetch(`${API_BASE}/tasks/${task._id}`, {
              method: 'DELETE',
              headers,
            });
            if (!res.ok) throw new Error('Error al eliminar la tarea');
            fetchTasks();
          } catch (err) {
            alert(err.message);
          }
        }
      };
      li.appendChild(delBtn);
      taskList.appendChild(li);
    });
  }

  // Cargar tarea en formulario para editar
  function loadTask(task) {
    taskIdInput.value = task._id;
    tituloInput.value = task.titulo;
    descripcionInput.value = task.descripcion;
    fechaInput.value = task.fechaDeVencimiento.split('T')[0];
    estadoSelect.value = task.estado;
    calificacionInput.value = task.calificacion;
    cancelEditBtn.style.display = 'inline-block';
    saveBtn.textContent = 'Actualizar Tarea';
    pageTitle.textContent = 'Actualizar Tarea';
  }

  // Cancelar edición
  cancelEditBtn.onclick = () => {
    taskIdInput.value = '';
    taskForm.reset();
    cancelEditBtn.style.display = 'none';
    saveBtn.textContent = 'Crear Tarea';
    pageTitle.textContent = 'Crear Nueva Tarea';
  };

  // Crear o actualizar tarea
  taskForm.onsubmit = async e => {
    e.preventDefault();

    const id = taskIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/tasks/${id}` : `${API_BASE}/tasks`;

    const body = {
      titulo: tituloInput.value,
      descripcion: descripcionInput.value,
      fechaDeVencimiento: fechaInput.value,
      estado: estadoSelect.value,
      calificacion: parseInt(calificacionInput.value) || 0,
    };

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar la tarea');
      taskForm.reset();
      taskIdInput.value = '';
      cancelEditBtn.style.display = 'none';
      saveBtn.textContent = 'Crear Tarea';
      pageTitle.textContent = 'Crear Nueva Tarea';
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  // Carga inicial
  fetchTasks();
});
