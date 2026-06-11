const loginForm = document.getElementById('login-form');
const loginAlert = document.getElementById('login-alert');
const coleccionSection = document.getElementById('coleccion-section');
const usuarioNombre = document.getElementById('usuario-nombre');
const coleccionGrid = document.getElementById('coleccion-grid');
const logoutBtn = document.getElementById('logout-btn');
const searchInput = document.getElementById('coleccion-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const viewButtons = document.querySelectorAll('.view-tab');
const detallePanel = document.getElementById('detalle-panel');
const detalleCard = document.getElementById('detalle-card');
const detalleClose = document.getElementById('detalle-close');

let coleccionActual = [];
let filtroActivo = 'todos';
let vistaActual = 'descubiertas';
let usuarioActual = null;

const TODAS_LAS_CRATUREAS = [
  { id: 1, nombre: 'Serafina del Lago', tipo: 'Acuático', descripcion: 'Una criatura de aguas lunares que ilumina las profundidades.', poder: 'Ondas de calma', atributo: 'Agua', habitat: 'Lagos lunares', alimentacion: 'Algas brillantes, néctar de luna', datos_curiosos: 'Susurros de agua oculta entre bosques', tamano: '1.8 m', peso: '45 kg', rareza: 'Legendaria', nivel: 5 },
  { id: 2, nombre: 'Nocturna Alada', tipo: 'Aéreo', descripcion: 'Sus alas brillan en tonos azules bajo la luna llena.', poder: 'Viento estelar', atributo: 'Aire', habitat: 'Cumbres y nubes nocturnas', alimentacion: 'Pétalos de nube y luz estelar', datos_curiosos: 'Prefiere noches frías', tamano: '2.1 m', peso: '19 kg', rareza: 'Rara', nivel: 4 },
  { id: 3, nombre: 'Guardiana de Cristal', tipo: 'Místico', descripcion: 'Protege los secretos de los bosques encantados.', poder: 'Escudo de luz', atributo: 'Magia', habitat: 'Bosques encantados', alimentacion: 'Bayas cristalinas y rocío', datos_curiosos: 'Aprecia las leyendas antiguas', tamano: '1.4 m', peso: '32 kg', rareza: 'Épica', nivel: 5 },
  { id: 4, nombre: 'Abyssal Coral', tipo: 'Acuático', descripcion: 'Nace entre arrecifes con destellos de galaxias marinas.', poder: 'Tromba marina', atributo: 'Agua', habitat: 'Arrecifes profundos', alimentacion: 'Plancton estelar y corrientes frías', datos_curiosos: 'Cambia de color con la marea', tamano: '1.6 m', peso: '38 kg', rareza: 'Rara', nivel: 4 },
  { id: 5, nombre: 'Fénix Nebular', tipo: 'Aéreo', descripcion: 'Resurge de las cenizas con plumas de neón cósmico.', poder: 'Llama astral', atributo: 'Fuego', habitat: 'Cielos nocturnos', alimentacion: 'Brasa cósmica y semillas de estrella', datos_curiosos: 'Su canto crea auroras', tamano: '1.9 m', peso: '24 kg', rareza: 'Legendaria', nivel: 5 },
  { id: 6, nombre: 'Titán Lunar', tipo: 'Terrestre', descripcion: 'Pisa la tierra dejando senderos de polvo de estrellas.', poder: 'Terremoto lunar', atributo: 'Tierra', habitat: 'Llanuras de piedra lunar', alimentacion: 'Raíces energizadas y minerales', datos_curiosos: 'Sus pisadas despiertan cristales', tamano: '2.4 m', peso: '110 kg', rareza: 'Épica', nivel: 5 }
];

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

function getIcono(tipo) {
  switch (tipo) {
    case 'Acuático': return '🌊';
    case 'Aéreo': return '💨';
    case 'Terrestre': return '🌿';
    case 'Místico': return '✨';
    default: return '🔮';
  }
}

function obtenerItemsParaVista() {
  const descubiertas = coleccionActual.map(item => ({ ...item, descubierto: true }));
  const noDescubiertas = TODAS_LAS_CRATUREAS
    .filter(item => !coleccionActual.some(desc => desc.nombre === item.nombre))
    .map(item => ({ ...item, descubierto: false }));

  return vistaActual === 'descubiertas' ? descubiertas : noDescubiertas;
}

function mostrarColeccion() {
  const termino = searchInput.value.trim().toLowerCase();
  const items = obtenerItemsParaVista();

  const filtrados = items.filter(item => {
    const cumpleTipo = filtroActivo === 'todos' || item.tipo === filtroActivo;
    const cumpleBusqueda = item.nombre.toLowerCase().includes(termino) || item.descripcion.toLowerCase().includes(termino);
    return cumpleTipo && cumpleBusqueda;
  });

  if (filtrados.length === 0) {
    coleccionGrid.innerHTML = '<p class="empty-message">No se encontró ninguna criatura con esos filtros.</p>';
    return;
  }

  coleccionGrid.innerHTML = filtrados.map(item => `
    <article class="bestiario-card ${item.descubierto ? '' : 'locked-card'}" onclick="mostrarDetalle(${item.id})">
      <div class="card-icon">${getIcono(item.tipo)}</div>
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
      ${item.descubierto ? '' : '<div class="lock-label">Sin descubrir</div>'}
    </article>
  `).join('');
}

function mostrarDetalle(id) {
  const item = coleccionActual.find(item => item.id === id);
  if (!item) {
    detalleCard.innerHTML = `
      <div class="detalle-header">
        <h3>Bestia aún no descubierta</h3>
      </div>
      <p class="detalle-texto">Aún no has descubierto esta criatura. Continúa explorando para desbloquearla.</p>
    `;
  } else {
    detalleCard.innerHTML = `
      <div class="detalle-header">
        <h3>${item.nombre}</h3>
        <span class="detalle-rareza">${item.rareza}</span>
      </div>
      <div class="detalle-meta">
        <span>${item.tipo} · ${item.atributo}</span>
        <span>Nivel ${item.nivel}</span>
      </div>
      <p class="detalle-texto">${item.descripcion}</p>
      <div class="detalle-grid">
        <div><strong>Hábitat:</strong><span>${item.habitat}</span></div>
        <div><strong>Alimentación:</strong><span>${item.alimentacion}</span></div>
        <div><strong>Tamaño:</strong><span>${item.tamano}</span></div>
        <div><strong>Peso:</strong><span>${item.peso}</span></div>
      </div>
      <div class="detalle-curiosidad">
        <h4>Dato curioso</h4>
        <p>${item.datos_curiosos}</p>
      </div>
    `;
  }

  detallePanel.classList.remove('hidden');
}

function cerrarDetalle() {
  detallePanel.classList.add('hidden');
}

detalleClose.addEventListener('click', cerrarDetalle);
detallePanel.addEventListener('click', (event) => {
  if (event.target === detallePanel) {
    cerrarDetalle();
  }
});

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

viewButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    viewButtons.forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    vistaActual = btn.dataset.vista;
    filtroActivo = 'todos';
    filterButtons.forEach(item => item.classList.toggle('active', item.dataset.tipo === 'todos'));
    mostrarColeccion();
  });
});

searchInput.addEventListener('input', mostrarColeccion);
