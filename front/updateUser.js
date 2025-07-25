const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  
  if (!user || !token) {
    window.location.href = '/index.html';
    return;
  }

  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const updateMessage = document.getElementById('updateMessage');
  const form = document.getElementById('updateUserForm');

  nombreInput.value = user.nombre;
  emailInput.value = user.email;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    updateMessage.textContent = '';

    try {
      const res = await fetch(`${API_BASE}/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          nombre: nombreInput.value.trim(),
          email: emailInput.value.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');

      updateMessage.style.color = 'green';
      updateMessage.textContent = 'Usuario actualizado exitosamente';
      // Actualiza localStorage con nuevos datos
      localStorage.setItem('user', JSON.stringify({
        ...user,
        nombre: nombreInput.value.trim(),
        email: emailInput.value.trim()
      }));
    } catch (err) {
      updateMessage.style.color = 'red';
      updateMessage.textContent = err.message;
    }
  });
});
