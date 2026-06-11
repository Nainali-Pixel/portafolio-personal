const loginForm = document.getElementById('login-form');
const loginAlert = document.getElementById('login-alert');
const coleccionSection = document.getElementById('coleccion-section');
const usuarioNombre = document.getElementById('usuario-nombre');
const coleccionGrid = document.getElementById('coleccion-grid');
const logoutBtn = document.getElementById('logout-btn');
const searchInput = document.getElementById('coleccion-search');
const filterButtons = document.querySelectorAll('.filter-btn');

let coleccionActual = [];
let filtroActivo = 'todos';
let usuarioActual = null;

const CUENTAS_DE_PRUEBA = [
  { email: 'mystic@luna.com', password: 'luna2024' },
  { email: 'orion@estrella.com', password: 'orion2024' }
];

function mostrarAlertaLogin(mensaje, tipo = 'error') {
  loginAlert.textContent = mensaje;
  loginAlert.className = `login-alert ${tipo} visible`;
  setTimeout(() => loginAlert.classList.remove('visible'), 3800);
}

async function iniciarSesion(email, password) {
  try {
    const respuesta = await fetch('/api/bestiario/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const datos = await respuesta.json();

    if (datos.ok) {
      usuarioActual = datos.usuario;
      coleccionActual = datos.coleccion;
      usuarioNombre.textContent = usuarioActual.nombre;
      coleccionSection.classList.remove('hidden');
      loginForm.closest('.hero-panel').classList.add('hidden');
      mostrarColeccion();
      mostrarAlertaLogin(`✅ Colección cargada para ${usuarioActual.nombre}`, 'success');
    } else {
      mostrarAlertaLogin(`❌ ${datos.msg}`);
    }
  } catch (error) {
    mostrarAlertaLogin('❌ No se pudo conectar con el servidor. Revisa la conexión.');
  }
}

function mostrarColeccion() {
  const termino = searchInput.value.trim().toLowerCase();
  const filtrados = coleccionActual.filter(item => {
    const cumpleTipo = filtroActivo === 'todos' || item.tipo === filtroActivo;
    const cumpleBusqueda = item.nombre.toLowerCase().includes(termino) || item.descripcion.toLowerCase().includes(termino);
    return cumpleTipo && cumpleBusqueda;
  });

  if (filtrados.length === 0) {
    coleccionGrid.innerHTML = '<p class="empty-message">No se encontró ninguna criatura con esos filtros.</p>';
    return;
  }

  coleccionGrid.innerHTML = filtrados.map(item => `
    <article class="bestiario-card">
      <div class="card-icon">${item.icono}</div>
      <div class="card-header">
        <h3>${item.nombre}</h3>
        <span class="card-level">Nivel ${item.nivel}</span>
      </div>
      <p class="card-type">${item.tipo} · ${item.atributo}</p>
      <p class="card-description">${item.descripcion}</p>
      <div class="card-footer">
        <span class="card-power">Poder: ${item.poder}</span>
        <span class="card-hint">${item.rareza}</span>
      </div>
    </article>
  `).join('');
}

function limpiarSesion() {
  usuarioActual = null;
  coleccionActual = [];
  filtroActivo = 'todos';
  coleccionSection.classList.add('hidden');
  loginForm.closest('.hero-panel').classList.remove('hidden');
  loginForm.reset();
  usuarioNombre.textContent = '';
  filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tipo === 'todos'));
  coleccionGrid.innerHTML = '';
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  iniciarSesion(email, password);
});

document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const email = btn.dataset.email;
    const password = btn.dataset.password;
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    iniciarSesion(email, password);
  });
});

logoutBtn.addEventListener('click', limpiarSesion);

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    filtroActivo = btn.dataset.tipo;
    mostrarColeccion();
  });
});

searchInput.addEventListener('input', mostrarColeccion);
