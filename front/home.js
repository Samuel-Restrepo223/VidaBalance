document.addEventListener('DOMContentLoaded', () => {

const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.nombre) {
    const greetingText = document.getElementById('userGreetingText');
    const nameSpan = document.getElementById('userNameGreeting');
    if (greetingText && nameSpan) {
      greetingText.textContent = 'Hola, ';
      nameSpan.textContent = user.nombre;
    }
  }

  // Botón Login - limpia sesión y vuelve a index.html
  const btnLogin = document.getElementById('btnLogin');
  if (btnLogin) {
    btnLogin.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/index.html';
    });
  }

  // Botón Actualizar Usuario - abre updateUser.html en nueva pestaña
  const btnActualizarUsuario = document.getElementById('btnActualizarUsuario');
  if (btnActualizarUsuario) {
    btnActualizarUsuario.addEventListener('click', () => {
      window.open('/updateUser.html', '_blank');
    });
  }

  // Botón Crear - redirige a createTask.html
  const btnCrear = document.getElementById('btnCrear');
  if (btnCrear) {
    btnCrear.addEventListener('click', () => {
      window.location.href = '/createTask.html';
    });
  }

  // Botón Ver - redirige a viewTasks.html
  const btnVer = document.getElementById('btnVer');
  if (btnVer) {
    btnVer.addEventListener('click', () => {
      window.location.href = '/viewTasks.html';
    });
  }

  // Botón Actualizar - redirige a updateTask.html
  const btnActualizar = document.getElementById('btnActualizar');
  if (btnActualizar) {
    btnActualizar.addEventListener('click', () => {
      window.location.href = '/updateTask.html';
    });
  }

  // Botón Eliminar - redirige a deleteTask.html
  const btnEliminar = document.getElementById('btnEliminar');
  if (btnEliminar) {
    btnEliminar.addEventListener('click', () => {
      window.location.href = '/deleteTask.html';
    });
  }
});
