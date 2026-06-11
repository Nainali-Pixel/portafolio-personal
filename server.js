const express = require('express');
const cors = require('cors');
const db = require('./public/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PRODUCTOS = [
  { id: 1, nombre: 'Rosa Roja', precio: 2990, descripcion: 'Elegante rosa de tallo largo, símbolo del amor', emoji: '🌹', categoria: 'Rosas' },
  { id: 2, nombre: 'Tulipán Morado', precio: 1990, descripcion: 'Delicado tulipán de color morado intenso', emoji: '🌷', categoria: 'Tulipanes' },
  { id: 3, nombre: 'Girasol', precio: 1490, descripcion: 'Alegre girasol que ilumina cualquier espacio', emoji: '🌻', categoria: 'Silvestres' },
  { id: 4, nombre: 'Orquídea Blanca', precio: 4990, descripcion: 'Exótica orquídea blanca de larga duración', emoji: '🌸', categoria: 'Orquídeas' },
  { id: 5, nombre: 'Lavanda', precio: 2490, descripcion: 'Aromática lavanda con propiedades relajantes', emoji: '💜', categoria: 'Especiales' },
  { id: 6, nombre: 'Margarita', precio: 990, descripcion: 'Pequeña y adorable margarita campestre', emoji: '🌼', categoria: 'Silvestres' },
  { id: 7, nombre: 'Peonía Rosa', precio: 3490, descripcion: 'Voluminosa peonía de color rosa suave', emoji: '🌸', categoria: 'Especiales' },
  { id: 8, nombre: 'Cala Blanca', precio: 2990, descripcion: 'Elegante cala blanca ideal para ocasiones especiales', emoji: '🤍', categoria: 'Especiales' },
  { id: 9, nombre: 'Rosa Amarilla', precio: 2490, descripcion: 'Rosa de color amarillo sol que transmite alegría', emoji: '🌹', categoria: 'Rosas' },
  { id: 10, nombre: 'Lirio Azul', precio: 3290, descripcion: 'Exótico lirio de color azul violáceo', emoji: '💙', categoria: 'Especiales' }
];

async function inicializarBaseDatos() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contactos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL,
      email VARCHAR(140) NOT NULL,
      mensaje TEXT NOT NULL,
      creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cliente_nombre VARCHAR(120) NOT NULL,
      cliente_email VARCHAR(140) NOT NULL,
      direccion VARCHAR(250) NOT NULL,
      productos TEXT NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS bestiario_usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(140) NOT NULL UNIQUE,
      password VARCHAR(120) NOT NULL,
      nombre VARCHAR(120) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS bestiario_colecciones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      nombre VARCHAR(120) NOT NULL,
      tipo VARCHAR(60) NOT NULL,
      descripcion TEXT NOT NULL,
      poder VARCHAR(120) NOT NULL,
      atributo VARCHAR(80) NOT NULL,
      icono VARCHAR(12) NOT NULL,
      rareza VARCHAR(80) NOT NULL,
      nivel INT NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_usuario_nombre (usuario_id, nombre),
      FOREIGN KEY (usuario_id) REFERENCES bestiario_usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`INSERT IGNORE INTO bestiario_usuarios (email, password, nombre) VALUES
    (?, ?, ?),
    (?, ?, ?)
  `, [
    'mystic@luna.com', 'luna2024', 'Luna Dreamer',
    'orion@estrella.com', 'orion2024', 'Orion Storm'
  ]);

  const [usuarios] = await db.execute(
    'SELECT id, email FROM bestiario_usuarios WHERE email IN (?, ?)',
    ['mystic@luna.com', 'orion@estrella.com']
  );

  const ids = {};
  usuarios.forEach(user => { ids[user.email] = user.id; });

  await db.execute(`INSERT IGNORE INTO bestiario_colecciones 
    (usuario_id, nombre, tipo, descripcion, poder, atributo, icono, rareza, nivel) VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    ids['mystic@luna.com'], 'Serafina del Lago', 'Acuático', 'Una criatura de aguas lunares que ilumina las profundidades.', 'Ondas de calma', 'Agua', '🌊', 'Legendaria', 5,
    ids['mystic@luna.com'], 'Nocturna Alada', 'Aéreo', 'Sus alas brillan en tonos azules bajo la luna llena.', 'Viento estelar', 'Aire', '🦋', 'Rara', 4,
    ids['mystic@luna.com'], 'Guardiana de Cristal', 'Místico', 'Protege los secretos de los bosques encantados.', 'Escudo de luz', 'Magia', '🪄', 'Épica', 5,
    ids['orion@estrella.com'], 'Abyssal Coral', 'Acuático', 'Nace entre arrecifes con destellos de galaxias marinas.', 'Tromba marina', 'Agua', '🐙', 'Rara', 4,
    ids['orion@estrella.com'], 'Fénix Nebular', 'Aéreo', 'Resurge de las cenizas con plumas de neón cósmico.', 'Llama astral', 'Fuego', '🔥', 'Legendaria', 5,
    ids['orion@estrella.com'], 'Titán Lunar', 'Terrestre', 'Pisa la tierra dejando senderos de polvo de estrellas.', 'Terremoto lunar', 'Tierra', '🌑', 'Épica', 5
  ]);
}

app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ ok:false, msg:'Datos incompletos' });
    }

    await db.execute(
      'INSERT INTO contactos(nombre, email, mensaje) VALUES (?, ?, ?)',
      [nombre, email, mensaje]
    );

    res.json({ ok:true, msg:'Mensaje guardado correctamente' });
  } catch (error) {
    console.error('Error en /api/contacto:', error);
    res.status(500).json({ ok:false, msg:'Error al guardar el mensaje' });
  }
});

app.get('/api/flores/productos', (req, res) => {
  res.json(PRODUCTOS);
});

app.post('/api/flores/pedido', async (req, res) => {
  try {
    const { cliente_nombre, cliente_email, direccion, productos, total } = req.body;

    if (!cliente_nombre || !cliente_email || !direccion || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ ok:false, msg:'Datos de pedido incompletos' });
    }

    await db.execute(
      'INSERT INTO pedidos(cliente_nombre, cliente_email, direccion, productos, total) VALUES (?, ?, ?, ?, ?)',
      [cliente_nombre, cliente_email, direccion, JSON.stringify(productos), total]
    );

    res.json({ ok:true, msg:'Pedido recibido correctamente' });
  } catch (error) {
    console.error('Error en /api/flores/pedido:', error);
    res.status(500).json({ ok:false, msg:'No fue posible procesar el pedido' });
  }
});

app.post('/api/bestiario/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok:false, msg:'Completa el correo y la contraseña' });
    }

    const [rows] = await db.execute(
      'SELECT id, nombre FROM bestiario_usuarios WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok:false, msg:'Credenciales incorrectas' });
    }

    const usuario = rows[0];
    const [coleccion] = await db.execute(
      'SELECT nombre, tipo, descripcion, poder, atributo, icono, rareza, nivel FROM bestiario_colecciones WHERE usuario_id = ? ORDER BY nivel DESC, nombre ASC',
      [usuario.id]
    );

    res.json({ ok:true, usuario: { id: usuario.id, nombre: usuario.nombre, email }, coleccion });
  } catch (error) {
    console.error('Error en /api/bestiario/login:', error);
    res.status(500).json({ ok:false, msg:'Error al iniciar sesión' });
  }
});

(async () => {
  try {
    await inicializarBaseDatos();
    app.listen(3000, () => {
      console.log('Servidor ejecutándose en http://localhost:3000');
    });
  } catch (error) {
    console.error('No se pudo inicializar la base de datos:', error);
    process.exit(1);
  }
})();
