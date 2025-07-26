const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const taskId = localStorage.getItem('selectedTaskId');

  if (!token || !taskId) {
    window.location.href = '/viewTasks.html';
    return;
  }

  const form = document.getElementById('updateTaskForm');
  const message = document.getElementById('updateMessage');

  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      headers: { 'x-auth-token': token }
    });
    if (!res.ok) throw new Error('No se pudo cargar la tarea');
    const task = await res.json();

    document.getElementById('titulo').value = task.titulo;
    document.getElementById('descripcion').value = task.descripcion;
    document.getElementById('fechaDeVencimiento').value = task.fechaDeVencimiento.split('T')[0];
    document.getElementById('estado').value = task.estado;
    document.getElementById('calificacion').value = task.calificacion;
  } catch (err) {
    message.style.color = 'red';
    message.textContent = err.message;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    message.textContent = '';

    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const fechaDeVencimiento = document.getElementById('fechaDeVencimiento').value;
    const estado = document.getElementById('estado').value;
    const calificacionInput = document.getElementById('calificacion').value;
    const calificacion = calificacionInput ? parseInt(calificacionInput) : undefined;

    const body = { titulo, descripcion, fechaDeVencimiento, estado };
    if (calificacion !== undefined) body.calificacion = calificacion;

    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al actualizar tarea');
      }

      message.style.color = 'green';
      message.textContent = 'Tarea actualizada exitosamente';
      localStorage.removeItem('selectedTaskId');
    } catch (err) {
      message.style.color = 'red';
      message.textContent = err.message;
    }
  });
});

