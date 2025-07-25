const API_BASE = 'http://localhost:3000/api';

// Función para obtener tareas actuales del usuario
async function fetchTasks(token) {
  const res = await fetch(`${API_BASE}/tasks`, {
    headers: { 'x-auth-token': token }
  });
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
}

// Función para mostrar tareas en consola (puedes adaptar para mostrar en UI)
function mostrarTareas(tareas) {
  console.clear();
  console.log('Tareas actuales:');
  tareas.forEach(t => {
    console.log(`- ${t.titulo} (Estado: ${t.estado})`);
  });
}

// Manejo de botones
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para usar las tareas');
    window.location.href = '/index.html';
    return;
  }

  // Crear tarea
  document.getElementById('btnCrear').addEventListener('click', async () => {
    const titulo = prompt('Título de la tarea:');
    const descripcion = prompt('Descripción:');
    const fechaDeVencimiento = prompt('Fecha de vencimiento (YYYY-MM-DD):');

    if (!titulo || !descripcion || !fechaDeVencimiento) {
      alert('Datos incompletos');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ titulo, descripcion, fechaDeVencimiento })
      });
      if (!res.ok) throw new Error('Error al crear tarea');
      alert('Tarea creada');
    } catch (err) {
      alert(err.message);
    }
  });

  // Ver tareas
  document.getElementById('btnVer').addEventListener('click', async () => {
    try {
      const tareas = await fetchTasks(token);
      mostrarTareas(tareas);
      alert('Revisa la consola para ver las tareas.');
    } catch (err) {
      alert(err.message);
    }
  });

  // Actualizar tarea
  document.getElementById('btnActualizar').addEventListener('click', async () => {
    const taskId = prompt('ID de la tarea a actualizar:');
    if (!taskId) return alert('ID requerido');

    const titulo = prompt('Nuevo título (dejar vacío para no cambiar):');
    const descripcion = prompt('Nueva descripción (dejar vacío para no cambiar):');
    const fechaDeVencimiento = prompt('Nueva fecha de vencimiento (YYYY-MM-DD) (dejar vacío para no cambiar):');
    const estado = prompt('Nuevo estado (pendiente, en progreso, completada) (dejar vacío para no cambiar):');
    const calificacionInput = prompt('Nueva calificación (0-5) (dejar vacío para no cambiar):');
    const calificacion = calificacionInput ? parseInt(calificacionInput) : undefined;

    const body = {};
    if (titulo) body.titulo = titulo;
    if (descripcion) body.descripcion = descripcion;
    if (fechaDeVencimiento) body.fechaDeVencimiento = fechaDeVencimiento;
    if (estado) body.estado = estado;
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
      if (!res.ok) throw new Error('Error al actualizar tarea');
      alert('Tarea actualizada');
    } catch (err) {
      alert(err.message);
    }
  });

  // Eliminar tarea
  document.getElementById('btnEliminar').addEventListener('click', async () => {
    const taskId = prompt('ID de la tarea a eliminar:');
    if (!taskId) return alert('ID requerido');

    if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (!res.ok) throw new Error('Error al eliminar tarea');
      alert('Tarea eliminada');
    } catch (err) {
      alert(err.message);
    }
  });
});
