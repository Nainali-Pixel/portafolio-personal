const loginForm = document.getElementById('login-form');
const loginAlert = document.getElementById('login-alert');
const heroPanel = document.querySelector('.hero-panel');
const coleccionSection = document.getElementById('coleccion-section');
const usuarioNombre = document.getElementById('usuario-nombre');
const perfilNombre = document.getElementById('perfil-nombre');
const perfilEmail = document.getElementById('perfil-email');
const coleccionGrid = document.getElementById('coleccion-grid');
const amigosGrid = document.getElementById('amigos-grid');
const friendsSection = document.getElementById('friends-section');
const mapSection = document.getElementById('map-section');
const logoutBtn = document.getElementById('logout-btn');
const searchInput = document.getElementById('coleccion-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const viewButtons = document.querySelectorAll('.view-tab');
const detallePanel = document.getElementById('detalle-panel');
const detalleCard = document.getElementById('detalle-card');
const detalleClose = document.getElementById('detalle-close');
const perfilBtn = document.getElementById('perfil-btn');
const cambiarPasswordBtn = document.getElementById('cambiar-password-btn');
const perfilModal = document.getElementById('perfil-modal');
const passwordModal = document.getElementById('password-modal');
const perfilCerrar = document.getElementById('perfil-cerrar');
const passwordCerrar = document.getElementById('password-cerrar');
const perfilForm = document.getElementById('perfil-form');
const passwordForm = document.getElementById('password-form');

let coleccionActual = [];
let amigosActual = [];
let filtroActivo = 'todos';
let vistaActual = 'descubiertas';
let usuarioActual = null;

const TODAS_LAS_CRATUREAS = [
  { id: 1, nombre: 'Serafina del Lago', tipo: 'Acuático', descripcion: 'Una criatura de aguas lunares que ilumina las profundidades.', poder: 'Ondas de calma', atributo: 'Agua', habitat: 'Lagos lunares', alimentacion: 'Algas brillantes, néctar de luna', datos_curiosos: 'Susurros de agua oculta entre bosques', tamano: '1.8 m', peso: '45 kg', rareza: 'Legendaria', nivel: 5 },
  { id: 2, nombre: 'Nocturna Alada', tipo: 'Aéreo', descripcion: 'Sus alas brillan en tonos azules bajo la luna llena.', poder: 'Viento estelar', atributo: 'Aire', habitat: 'Cumbres y nubes nocturnas', alimentacion: 'Pétalos de nube y luz estelar', datos_curiosos: 'Prefiere noches frías', tamano: '2.1 m', peso: '19 kg', rareza: 'Rara', nivel: 4 },
  { id: 3, nombre: 'Guardiana de Cristal', tipo: 'Místico', descripcion: 'Protege los secretos de los bosques encantados.', poder: 'Escudo de luz', atributo: 'Magia', habitat: 'Bosques encantados', alimentacion: 'Bayas cristalinas y rocío', datos_curiosos: 'Aprecia las leyendas antiguas', tamano: '1.4 m', peso: '32 kg', rareza: 'Épica', nivel: 5 },
  { id: 4, nombre: 'Abyssal Coral', tipo: 'Acuático', descripcion: 'Nace entre arrecifes con destellos de galaxias marinas.', poder: 'Tromba marina', atributo: 'Agua', habitat: 'Arrecifes profundos', alimentacion: 'Plancton estelar y corrientes frías', datos_curiosos: 'Cambia de color con la marea', tamano: '1.6 m', peso: '38 kg', rareza: 'Rara', nivel: 4 },
  { id: 5, nombre: 'Fénix Nebular', tipo: 'Aéreo', descripcion: 'Resurge de las cenizas con plumas de neón cósmico.', poder: 'Llama astral', atributo: 'Fuego', habitat: 'Cielos nocturnos', alimentacion: 'Brasa cósmica y semillas de estrella', datos_curiosos: 'Su canto crea auroras', tamano: '1.9 m', peso: '24 kg', rareza: 'Legendaria', nivel: 5 },
  { id: 6, nombre: 'Titán Lunar', tipo: 'Terrestre', descripcion: 'Pisa la tierra dejando senderos de polvo de estrellas.', poder: 'Terremoto lunar', atributo: 'Tierra', habitat: 'Llanuras de piedra lunar', alimentacion: 'Raíces energizadas y minerales', datos_curiosos: 'Sus pisadas despiertan cristales', tamano: '2.4 m', peso: '110 kg', rareza: 'Épica', nivel: 5 },
  { id: 7, nombre: 'Aurora Serpiente', tipo: 'Acuático', descripcion: 'Surge entre las auroras con escamas de luz.', poder: 'Resplandor frio', atributo: 'Agua', habitat: 'Ríos boreales', alimentacion: 'Hielo lumínico', datos_curiosos: 'Cambia de color según el clima', tamano: '3.5 m', peso: '85 kg', rareza: 'Rara', nivel: 4 },
  { id: 8, nombre: 'Víbora Boreal', tipo: 'Terrestre', descripcion: 'Su cola emite polvo de estrellas en cada paso.', poder: 'Veneno glacial', atributo: 'Tierra', habitat: 'Tundras congeladas', alimentacion: 'Musgo estelar', datos_curiosos: 'Su veneno congela', tamano: '2.2 m', peso: '40 kg', rareza: 'Épica', nivel: 5 },
  { id: 9, nombre: 'Draco Nitro', tipo: 'Aéreo', descripcion: 'Sus alas eléctricas rasgan el cielo nocturno.', poder: 'Rayo oscuro', atributo: 'Aire', habitat: 'Cumbres tormentosas', alimentacion: 'Rayos y ozono', datos_curiosos: 'Sus ronquidos suenan como truenos', tamano: '4.5 m', peso: '210 kg', rareza: 'Legendaria', nivel: 5 },
  { id: 10, nombre: 'Quimera Sombra', tipo: 'Místico', descripcion: 'Nacida del fuego y la niebla eterna.', poder: 'Furia onírica', atributo: 'Magia', habitat: 'Cuevas abisales', alimentacion: 'Sueños perdidos', datos_curiosos: 'Puede atravesar paredes oscuras', tamano: '2.8 m', peso: '150 kg', rareza: 'Épica', nivel: 5 },
  { id: 11, nombre: 'Fuego del Abismo', tipo: 'Terrestre', descripcion: 'Los volcanes obedecen su presencia.', poder: 'Llama eterna', atributo: 'Fuego', habitat: 'Fosas volcánicas', alimentacion: 'Magma y carbón', datos_curiosos: 'Sus pasos derriten la roca', tamano: '3.0 m', peso: '500 kg', rareza: 'Rara', nivel: 4 },
  { id: 12, nombre: 'Selene Niebla', tipo: 'Aéreo', descripcion: 'Aparece entre nubes y susurra secretos.', poder: 'Cosquilleo lunar', atributo: 'Aire', habitat: 'Valles neblinosos', alimentacion: 'Rocío de medianoche', datos_curiosos: 'Es invisible de día', tamano: '1.2 m', peso: '12 kg', rareza: 'Rara', nivel: 4 },
  { id: 13, nombre: 'Lince Lunar', tipo: 'Terrestre', descripcion: 'Sus pasos no dejan huellas en la noche.', poder: 'Sigilo estelar', atributo: 'Tierra', habitat: 'Bosques de coníferas', alimentacion: 'Frutos lunares', datos_curiosos: 'Sus ojos brillan como faros', tamano: '1.5 m', peso: '45 kg', rareza: 'Épica', nivel: 4 },
  { id: 14, nombre: 'Ninfa Crepuscular', tipo: 'Místico', descripcion: 'Vive entre la bruma que aparece al atardecer.', poder: 'Encanto de penumbra', atributo: 'Magia', habitat: 'Claros del atardecer', alimentacion: 'Néctar de sol', datos_curiosos: 'Su risa cura heridas', tamano: '1.1 m', peso: '20 kg', rareza: 'Rara', nivel: 4 },
  { id: 15, nombre: 'Golem de Raíz', tipo: 'Terrestre', descripcion: 'Despierta gusanos antiguos con cada pisada.', poder: 'Regeneración', atributo: 'Tierra', habitat: 'Bosques ancestrales', alimentacion: 'Minerales profundos', datos_curiosos: 'Puede dormir por siglos', tamano: '5.0 m', peso: '1200 kg', rareza: 'Rara', nivel: 4 },
  { id: 16, nombre: 'Espíritu del Valle', tipo: 'Místico', descripcion: 'Protege los valles y a los viajeros perdidos.', poder: 'Bendición verde', atributo: 'Magia', habitat: 'Cañones místicos', alimentacion: 'Energía eólica', datos_curiosos: 'Guía a los viajeros con luces', tamano: '2.0 m', peso: '0 kg', rareza: 'Legendaria', nivel: 5 },
  { id: 17, nombre: 'Cuervo Umbral', tipo: 'Aéreo', descripcion: 'Aparece entre las sombras y lleva mensajes.', poder: 'Vigilia eterna', atributo: 'Aire', habitat: 'Ruinas antiguas', alimentacion: 'Ecos del pasado', datos_curiosos: 'Repite palabras olvidadas', tamano: '0.8 m', peso: '3 kg', rareza: 'Rara', nivel: 4 }
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
      amigosActual = Array.isArray(datos.amigos) ? datos.amigos : [];
      coleccionActual = datos.coleccion;
      usuarioNombre.textContent = usuarioActual.nombre;
      actualizarPerfilUI();
      coleccionSection.classList.remove('hidden');
      friendsSection.classList.remove('hidden');
      mapSection.classList.remove('hidden');
      heroPanel.classList.add('hidden');
      mostrarColeccion();
      mostrarAmigos(Array.isArray(datos.amigos) ? datos.amigos : undefined);
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

function mostrarAmigos() {
  const renderAmigos = (lista) => {
    document.getElementById('perfil-amigos-count').textContent = `${lista.length} amigo${lista.length === 1 ? '' : 's'}`;
    amigosGrid.innerHTML = lista.length > 0 ? lista.map(amigo => `
      <article class="friend-card ${amigo.id === usuarioActual.id ? 'friend-me' : ''}">
        <div>
          <h4>${amigo.nombre}</h4>
          <p>${amigo.email}</p>
        </div>
        <button class="friend-view-btn" data-id="${amigo.id}">Ver perfil</button>
      </article>
    `).join('') : '<p class="empty-message">Este perfil aún no tiene amigos conectados.</p>';

    amigosGrid.querySelectorAll('.friend-view-btn').forEach(btn => {
      btn.addEventListener('click', () => mostrarPerfilAmigo(btn.dataset.id));
    });
  };

  if (!usuarioActual || !usuarioActual.id) {
    renderAmigos([]);
    return;
  }

  fetch(`/api/bestiario/usuario/${usuarioActual.id}`)
    .then(res => res.json())
    .then(data => {
      if (!data.ok) {
        mostrarAlertaLogin('No se pudieron cargar los amigos del perfil.');
        return;
      }
      amigosActual = Array.isArray(data.amigos) ? data.amigos : [];
      renderAmigos(amigosActual);
    })
    .catch(() => mostrarAlertaLogin('No se pudo conectar con el servidor para cargar amigos.'));
}

function mostrarPerfilAmigo(id) {
  fetch(`/api/bestiario/usuario/${id}`)
    .then(res => res.json())
    .then(data => {
      if (!data.ok) {
        mostrarAlertaLogin('No se pudo cargar el perfil del amigo.');
        return;
      }

      const coleccion = data.coleccion || [];
      detalleCard.innerHTML = `
        <div class="detalle-header">
          <h3>${data.usuario.nombre}</h3>
          <span class="detalle-rareza">Perfil amigo</span>
        </div>
        <div class="detalle-meta">
          <span>${data.usuario.email}</span>
          <span>${coleccion.length} criaturas</span>
        </div>
        <div class="detalle-grid detalle-grid--full">
          ${coleccion.map(item => `
            <div>
              <strong>${item.nombre}</strong>
              <p>${item.tipo} · Nivel ${item.nivel}</p>
              <p>${item.descripcion}</p>
            </div>
          `).join('')}
        </div>
      `;
      detallePanel.classList.remove('hidden');
    })
    .catch(() => mostrarAlertaLogin('Error cargando perfil de amigo.'));
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

function actualizarPerfilUI() {
  if (!usuarioActual) return;
  perfilNombre.textContent = usuarioActual.nombre;
  perfilEmail.textContent = usuarioActual.email;
}

function abrirPerfil() {
  if (!usuarioActual) return;
  document.getElementById('perfil-nombre-input').value = usuarioActual.nombre;
  document.getElementById('perfil-email-input').value = usuarioActual.email;
  perfilModal.classList.remove('hidden');
}

function abrirPassword() {
  passwordForm.reset();
  passwordModal.classList.remove('hidden');
}

function cerrarPerfilModal() {
  perfilModal.classList.add('hidden');
}

function cerrarPasswordModal() {
  passwordModal.classList.add('hidden');
}

perfilBtn.addEventListener('click', abrirPerfil);
cambiarPasswordBtn.addEventListener('click', abrirPassword);
perfilCerrar.addEventListener('click', cerrarPerfilModal);
passwordCerrar.addEventListener('click', cerrarPasswordModal);
perfilModal.addEventListener('click', (event) => {
  if (event.target === perfilModal) cerrarPerfilModal();
});
passwordModal.addEventListener('click', (event) => {
  if (event.target === passwordModal) cerrarPasswordModal();
});

perfilForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const nombre = document.getElementById('perfil-nombre-input').value.trim();
  const email = document.getElementById('perfil-email-input').value.trim();

  try {
    const respuesta = await fetch(`/api/bestiario/usuario/${usuarioActual.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email })
    });
    const datos = await respuesta.json();

    if (datos.ok) {
      usuarioActual.nombre = nombre;
      usuarioActual.email = email;
      actualizarPerfilUI();
      usuarioNombre.textContent = usuarioActual.nombre;
      cerrarPerfilModal();
      mostrarAlertaLogin('Perfil actualizado correctamente', 'success');
    } else {
      mostrarAlertaLogin(`Error: ${datos.msg}`);
    }
  } catch (error) {
    mostrarAlertaLogin('Error al actualizar el perfil. Intenta de nuevo.');
  }
});

passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const currentPassword = document.getElementById('old-password-input').value.trim();
  const newPassword = document.getElementById('new-password-input').value.trim();
  const confirmPass = document.getElementById('confirm-password-input').value.trim();

  if (newPassword.length < 4) {
    mostrarAlertaLogin('❌ La nueva contraseña debe tener al menos 4 caracteres');
    return;
  }
  if (newPassword !== confirmPass) {
    mostrarAlertaLogin('❌ Las contraseñas no coinciden');
    return;
  }

  try {
    const respuesta = await fetch(`/api/bestiario/usuario/${usuarioActual.id}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const datos = await respuesta.json();

    if (datos.ok) {
      cerrarPasswordModal();
      mostrarAlertaLogin('✅ Contraseña actualizada correctamente', 'success');
    } else {
      mostrarAlertaLogin(`❌ ${datos.msg}`);
    }
  } catch (error) {
    mostrarAlertaLogin('❌ Error al actualizar la contraseña. Intenta de nuevo.');
  }
});

function limpiarSesion() {
  usuarioActual = null;
  coleccionActual = [];
  filtroActivo = 'todos';
  vistaActual = 'descubiertas';
  coleccionSection.classList.add('hidden');
  loginForm.closest('.hero-panel').classList.remove('hidden');
  loginForm.reset();
  usuarioNombre.textContent = '';
  perfilNombre.textContent = '';
  perfilEmail.textContent = '';
  filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tipo === 'todos'));
  viewButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.vista === 'descubiertas'));
  coleccionGrid.innerHTML = '';
  amigosGrid.innerHTML = '';
  friendsSection.classList.add('hidden');
  mapSection.classList.add('hidden');
  heroPanel.classList.remove('hidden');
  heroPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  cerrarPerfilModal();
  cerrarPasswordModal();
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  iniciarSesion(email, password);
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

const themeToggle = document.getElementById('theme-toggle');

function aplicarTemaOscuro(activar) {
  const body = document.body;
  if (activar) {
    body.classList.add('dark-theme');
    themeToggle.textContent = 'Modo luminoso';
    localStorage.setItem('bestiarioTema', 'dark');
  } else {
    body.classList.remove('dark-theme');
    themeToggle.textContent = 'Modo nocturno';
    localStorage.setItem('bestiarioTema', 'light');
  }
}

themeToggle.addEventListener('click', () => {
  const esOscuro = !document.body.classList.contains('dark-theme');
  aplicarTemaOscuro(esOscuro);
});

(function cargarTemaInicial() {
  const temaGuardado = localStorage.getItem('bestiarioTema');
  aplicarTemaOscuro(temaGuardado === 'dark');
})();
