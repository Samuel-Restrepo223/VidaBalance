const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createTaskForm');
  const message = document.getElementById('message');
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Debes iniciar sesión primero');
    window.location.href = '/index.html';
    return;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    message.textContent = '';

    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const fechaDeVencimiento = document.getElementById('fechaVencimiento').value;
    const estado = document.getElementById('estado').value;
    const calificacion = parseInt(document.getElementById('calificacion').value) || 0;

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ titulo, descripcion, fechaDeVencimiento, estado, calificacion })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear la tarea');

      message.style.color = 'green';
      message.textContent = 'Tarea creada exitosamente';

      form.reset();
    } catch (err) {
      message.style.color = 'red';
      message.textContent = err.message;
    }
  });
});
