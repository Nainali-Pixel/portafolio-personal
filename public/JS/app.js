const links = document.querySelectorAll('[data-page]');
const pages = document.querySelectorAll('.page');
const cards = document.querySelectorAll('.project-card');
const form = document.getElementById('contact-form');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageID = link.dataset.page;

        pages.forEach(page => { page.classList.remove('active'); });
        document.getElementById(pageID).classList.add('active');
    });
});

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('destacada');
    });
    card.addEventListener('mouseleave', () => {
        card.classList.remove('destacada');
    });
});

function mostrarAlerta(mensaje, tipo) {
    const alerta = document.getElementById('alerta');
    alerta.textContent = mensaje;
    alerta.className = `alert ${tipo}`;
    alerta.classList.add('visible');
    setTimeout(() => {
        alerta.classList.remove('visible');
    }, 3000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (nombre.length < 3) {
        mostrarAlerta('El nombre debe tener al menos 3 caracteres.', 'error');
        return;
    }

    if (email.length < 5 || !email.includes('@')) {
        mostrarAlerta('Por favor, ingresa un correo electrónico válido.', 'error');
        return;
    }

    if (mensaje.length < 10) {
        mostrarAlerta('El mensaje debe tener al menos 10 caracteres.', 'error');
        return;
    }

    const respuesta = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, mensaje })
    });
    const data = await respuesta.json();
    mostrarAlerta(data.msg, data.ok ? 'exito' : 'error');
    if (data.ok) {
        form.reset();
    }
});
