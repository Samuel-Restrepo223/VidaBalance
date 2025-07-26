const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const taskId = localStorage.getItem('selectedTaskId');
  const deleteMessage = document.getElementById('deleteMessage');
  const btnDelete = document.getElementById('btnDelete');
  const btnBack = document.getElementById('btnBack');

  if (!token || !taskId) {
    window.location.href = '/viewTasks.html';
    return;
  }

  btnDelete.addEventListener('click', async () => {
    deleteMessage.textContent = '';
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al eliminar tarea');
      }
      deleteMessage.style.color = 'green';
      deleteMessage.textContent = 'Tarea eliminada exitosamente';
      localStorage.removeItem('selectedTaskId');
    } catch (err) {
      deleteMessage.style.color = 'red';
      deleteMessage.textContent = err.message;
    }
  });

  btnBack.addEventListener('click', () => {
    localStorage.removeItem('selectedTaskId');
    window.location.href = '/viewTasks.html';
  });
});

