/* =============================================
   PORTAFOLIO - app.js
   Funciones: Navegación SPA, Estrellas animadas,
   Efecto typewriter, Barras de habilidad,
   Contadores, Validación y envío de formulario
   ============================================= */

// =============================================
// CANVAS - CAMPO DE ESTRELLAS ANIMADO
// =============================================
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

function redimensionarCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
redimensionarCanvas();
window.addEventListener('resize', redimensionarCanvas);

// Crear las estrellas con posición y características aleatorias
const estrellas = [];
const CANTIDAD_ESTRELLAS = 220;

for (let i = 0; i < CANTIDAD_ESTRELLAS; i++) {
  estrellas.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radio: Math.random() * 1.8 + 0.3,
    velocidad: Math.random() * 0.2 + 0.05,
    opacidad: Math.random() * 0.8 + 0.2,
    parpadeo: Math.random() * Math.PI * 2,
    velocidadParpadeo: Math.random() * 0.03 + 0.01
  });
}

// Animación principal del campo de estrellas
function animarEstrellas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  estrellas.forEach(estrella => {
    // Actualizar parpadeo
    estrella.parpadeo += estrella.velocidadParpadeo;
    const alfa = (Math.sin(estrella.parpadeo) * 0.4 + 0.6) * estrella.opacidad;

    // Dibujar estrella
    ctx.beginPath();
    ctx.arc(estrella.x, estrella.y, estrella.radio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(224, 242, 254, ${alfa})`;
    ctx.fill();

    // Mover estrella muy lentamente hacia abajo (deriva)
    estrella.y += estrella.velocidad * 0.08;
    if (estrella.y > canvas.height) {
      estrella.y = 0;
      estrella.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animarEstrellas);
}

animarEstrellas();

// =============================================
// NAVEGACIÓN SPA (Single Page Application)
// =============================================
const navLinks = document.querySelectorAll('[data-page]');
const secciones = document.querySelectorAll('.page');

/**
 * Navegar a una seccion del portafolio
 * @param {string} paginaId - ID de la sección a mostrar
 */
function navegarA(paginaId) {
  // Ocultar todas las secciones
  secciones.forEach(s => s.classList.remove('active'));
  // Mostrar la sección solicitada o regresar a inicio si no existe
  const seccion = document.getElementById(paginaId) || document.getElementById('inicio');
  if (seccion) {
    seccion.classList.add('active');
    location.hash = seccion.id;
    // Ejecutar funciones especiales al entrar a ciertas secciones
    if (seccion.id === 'habilidades') animarBarrasHabilidad();
    if (seccion.id === 'sobre-mi') animarContadores();
  }

  // Actualizar estado activo en el menú
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === paginaId);
  });
}

// Agregar evento de clic a los links del menú
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navegarA(link.dataset.page);
  });
});

// Navegación mediante hash y carga inicial
window.addEventListener('hashchange', () => {
  const destino = location.hash.replace('#', '') || 'inicio';
  navegarA(destino);
});

const paginaInicial = location.hash.replace('#', '') || 'inicio';
setTimeout(() => navegarA(paginaInicial), 0);

// =============================================
// EFECTO TYPEWRITER
// =============================================
const textoTypewriter = document.getElementById('typewriter');
const texto = 'Milena Escobar 🌊';
let indexLetra = 0;

function escribir() {
  if (indexLetra < texto.length) {
    textoTypewriter.textContent += texto.charAt(indexLetra);
    indexLetra++;
    setTimeout(escribir, 90);
  } else {
    // Al terminar, hacer parpadear el cursor y luego borrarlo y repetir
    setTimeout(borrar, 3000);
  }
}

function borrar() {
  if (textoTypewriter.textContent.length > 0) {
    textoTypewriter.textContent = textoTypewriter.textContent.slice(0, -1);
    setTimeout(borrar, 50);
  } else {
    indexLetra = 0;
    setTimeout(escribir, 600);
  }
}

// Iniciar efecto typewriter después de un pequeño delay
setTimeout(escribir, 800);

// =============================================
// ANIMACIÓN DE CONTADORES (Sección "Sobre mí")
// =============================================
let contadoresAnimados = false;

/**
 * Anima un número desde 0 hasta el valor objetivo
 * @param {Element} elemento - Elemento donde se muestra el número
 * @param {number} objetivo - Número final
 * @param {number} duracion - Duración de la animación en ms
 */
function animarContador(elemento, objetivo, duracion = 1500) {
  let inicio = 0;
  const intervalo = 30;
  const pasos = duracion / intervalo;
  const incremento = objetivo / pasos;

  const timer = setInterval(() => {
    inicio += incremento;
    if (inicio >= objetivo) {
      inicio = objetivo;
      clearInterval(timer);
    }
    elemento.textContent = Math.floor(inicio);
  }, intervalo);
}

function animarContadores() {
  if (contadoresAnimados) return; // Solo se ejecuta una vez
  contadoresAnimados = true;

  document.querySelectorAll('.stat-number').forEach(stat => {
    const objetivo = parseInt(stat.dataset.target, 10);
    animarContador(stat, objetivo);
  });
}

// =============================================
// ANIMACIÓN DE BARRAS DE HABILIDAD
// =============================================
let barrasAnimadas = false;

function animarBarrasHabilidad() {
  if (barrasAnimadas) return; // Solo se ejecuta una vez
  barrasAnimadas = true;

  // Pequeño delay para que la seccion sea visible primero
  setTimeout(() => {
    document.querySelectorAll('.skill-fill').forEach(barra => {
      const anchura = barra.dataset.width;
      barra.style.width = anchura + '%';
    });
  }, 200);
}

// =============================================
// FORMULARIO DE CONTACTO - VALIDACIÓN Y ENVÍO
// =============================================
const formulario = document.getElementById('contact-form');
const btnEnviar = document.getElementById('btn-enviar');

/**
 * Muestra una alerta al usuario debajo del formulario
 * @param {string} mensaje - Texto a mostrar
 * @param {string} tipo - 'exito' o 'error'
 */
function mostrarAlerta(mensaje, tipo) {
  const alerta = document.getElementById('alerta');
  alerta.textContent = mensaje;
  alerta.className = `alerta ${tipo} visible`;

  // Ocultar automáticamente después de 4 segundos
  setTimeout(() => {
    alerta.classList.remove('visible');
  }, 4000);
}

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  // Validaciones del lado del cliente
  if (nombre.length < 3) {
    mostrarAlerta('⚠️ El nombre debe tener al menos 3 caracteres.', 'error');
    return;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    mostrarAlerta('⚠️ Por favor ingresa un correo electrónico válido.', 'error');
    return;
  }

  if (mensaje.length < 10) {
    mostrarAlerta('⚠️ El mensaje debe tener al menos 10 caracteres.', 'error');
    return;
  }

  // Deshabilitar botón mientras se envía
  btnEnviar.disabled = true;
  btnEnviar.querySelector('span').textContent = 'Enviando... ⏳';

  try {
    // Enviar datos al backend con fetch
    const respuesta = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, mensaje })
    });

    const datos = await respuesta.json();

    if (datos.ok) {
      mostrarAlerta('✅ ¡Mensaje enviado correctamente! Te responderé pronto.', 'exito');
      formulario.reset();
    } else {
      mostrarAlerta(`❌ Error: ${datos.msg}`, 'error');
    }
  } catch (error) {
    // Error de red u otro problema
    mostrarAlerta('❌ No se pudo conectar con el servidor. Inténtalo más tarde.', 'error');
  } finally {
    // Re-habilitar botón
    btnEnviar.disabled = false;
    btnEnviar.querySelector('span').textContent = 'Enviar Mensaje 🚀';
  }
});

// =============================================
// HIGHLIGHT DE CARDS AL PASAR EL MOUSE
// =============================================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('destacada'));
  card.addEventListener('mouseleave', () => card.classList.remove('destacada'));
});

// =============================================
// INICIALIZACIÓN
// =============================================
// Mostrar la sección de inicio por defecto
navegarA('inicio');