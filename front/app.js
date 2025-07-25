//logueo,tareas y rgistro
const API_BASE = 'http://localhost:3000/api';

// Mostrar/ocultar contraseña en formularios
document.querySelectorAll('.togglePassword').forEach(button => {
  button.addEventListener('click', () => {
    const input = button.previousElementSibling;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    button.textContent = type === 'password' ? '👁️' : '🙈';
  });
});

// --- FUNCIONALIDAD PARA home.html ---
if (document.getElementById('userInfo')) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    document.getElementById('userId').textContent = user._id || 'N/A';
    document.getElementById('userName').textContent = user.nombre || 'N/A';
    document.getElementById('userEmail').textContent = user.email || 'N/A';
    const imgElement = document.getElementById('userImage');
      if (imgElement && user.imagen) {
      imgElement.src = user.imagen;
      imgElement.alt = `Foto de ${user.nombre}`;
    } else if (imgElement) {
      imgElement.src = 'default-avatar.png'; // o alguna imagen por defecto
      imgElement.alt = 'Sin foto';
    }
  }

  // Botones de home.html
  document.getElementById('btnLogin')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  });

  document.getElementById('btnCrear')?.addEventListener('click', () => {
    window.location.href = '/tasks.html';
  });

  document.getElementById('btnVer')?.addEventListener('click', () => {
    window.location.href = '/tasks.html';
  });

  document.getElementById('btnActualizar')?.addEventListener('click', () => {
    alert('Función actualizar tarea pendiente.');
  });

  document.getElementById('btnEliminar')?.addEventListener('click', () => {
    alert('Función eliminar tarea pendiente.');
  });
}

// --- LOGIN Y REGISTRO ---
if (document.getElementById('loginForm')) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginError = document.getElementById('loginError');
  const registerError = document.getElementById('registerError');

  loginTab.onclick = () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    loginError.textContent = '';
    registerError.textContent = '';
  };

  registerTab.onclick = () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    loginError.textContent = '';
    registerError.textContent = '';
  };

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    loginError.textContent = '';
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en login');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'home.html';
    } catch (err) {
      loginError.textContent = err.message;
    }
  });

  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    registerError.textContent = '';
    const nombre = document.getElementById('registerNombre').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const imagenInput = document.getElementById('registerImagen');
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('password', password);
    if (imagenInput.files[0]) {
      formData.append('imagen', imagenInput.files[0]);
    }

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en registro');
      alert('Usuario registrado correctamente. Por favor inicia sesión.');
      loginTab.click();
      registerForm.reset();
    } catch (err) {
      registerError.textContent = err.message;
    }
  });
}

// --- GESTIÓN DE TAREAS ---
if (document.getElementById('taskList')) {
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

  const token = localStorage.getItem('token');
  if (!token) window.location.href = 'index.html';

  logoutBtn.onclick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  };

  const headers = {
    'Content-Type': 'application/json',
    'x-auth-token': token,
  };

  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.imagen) {
    const imgElement = document.getElementById('userImage');
    if (imgElement) {
      imgElement.src = user.imagen;
      imgElement.alt = `Foto de ${user.nombre}`;
    }
  }

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, { headers });
      if (!res.ok) throw new Error('No se pudieron cargar las tareas');
      const tasks = await res.json();
      renderTasks(tasks);
    } catch (err) {
      taskList.innerHTML = `<li class="error-msg">${err.message}</li>`;
    }
  };

  const renderTasks = (tasks) => {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
      taskList.innerHTML = '<li>No tienes tareas creadas.</li>';
      return;
    }
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.textContent = `${task.titulo} - Estado: ${task.estado}`;
      li.onclick = () => loadTask(task);
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Eliminar';
      delBtn.className = 'delete-btn';
      delBtn.onclick = async (e) => {
        e.stopPropagation();
        if (confirm('¿Eliminar esta tarea?')) {
          try {
            const res = await fetch(`${API_BASE}/tasks/${task._id}`, {
              method: 'DELETE',
              headers: { 'x-auth-token': token },
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
  };

  const loadTask = (task) => {
    taskIdInput.value = task._id;
    tituloInput.value = task.titulo;
    descripcionInput.value = task.descripcion;
    fechaInput.value = task.fechaDeVencimiento.split('T')[0];
    estadoSelect.value = task.estado;
    calificacionInput.value = task.calificacion;
    cancelEditBtn.style.display = 'inline-block';
  };

  cancelEditBtn.onclick = () => {
    taskIdInput.value = '';
    taskForm.reset();
    cancelEditBtn.style.display = 'none';
  };

  taskForm.onsubmit = async (e) => {
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
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  };

  fetchTasks();
}
