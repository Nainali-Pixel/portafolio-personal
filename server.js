const express = require('express');
const cors = require('cors');
const db = require('./public/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PRODUCTOS = [
  { id: 1, nombre: 'Ramo Estelar', precio: 4290, descripcion: 'Ramo elegante preparado para regalar en ocasiones especiales.', categoria: 'Regalar', tipo: 'Ramo', imagen: '' },
  { id: 2, nombre: 'Bouquet Romántico', precio: 4890, descripcion: 'Ramo mixto ideal para aniversarios con toque clásico.', categoria: 'Regalar', tipo: 'Ramo', imagen: '' },
  { id: 3, nombre: 'Arreglo Boda Blanca', precio: 6390, descripcion: 'Arreglo nupcial refinado para ceremonias y recepciones.', categoria: 'Arreglos', tipo: 'Boda', imagen: '' },
  { id: 4, nombre: 'Corona de Condolencias', precio: 5490, descripcion: 'Arreglo solemne y respetuoso para funerales y homenajes.', categoria: 'Arreglos', tipo: 'Funeral', imagen: '' },
  { id: 5, nombre: 'Centro de Mesa Elegante', precio: 3790, descripcion: 'Arreglo decorativo para eventos especiales y cenas formales.', categoria: 'Arreglos', tipo: 'Evento', imagen: '' },
  { id: 6, nombre: 'Macetero de Suculentas', precio: 2490, descripcion: 'Combinación de suculentas en maceta lista para plantar y decorar.', categoria: 'Plantar', tipo: 'Macetero', imagen: '' },
  { id: 7, nombre: 'Kit de Semillas Florales', precio: 1790, descripcion: 'Pack de semillas para plantar y ver crecer un jardín de colores.', categoria: 'Plantar', tipo: 'Semillas', imagen: '' },
  { id: 8, nombre: 'Jardín Aromático', precio: 2990, descripcion: 'Macetero con plantas aromáticas para cultivar en casa.', categoria: 'Plantar', tipo: 'Macetero', imagen: '' },
  { id: 9, nombre: 'Ramo de Celebración', precio: 4390, descripcion: 'Ramo vibrante ideal para cumpleaños y felicitaciones.', categoria: 'Regalar', tipo: 'Ramo', imagen: '' },
  { id: 10, nombre: 'Arreglo Corporativo', precio: 5590, descripcion: 'Arreglo moderno diseñado para oficinas y salas de espera.', categoria: 'Arreglos', tipo: 'Decoración', imagen: '' }
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
      imagen VARCHAR(240) DEFAULT '',
      habitat VARCHAR(120) NOT NULL,
      alimentacion VARCHAR(120) NOT NULL,
      datos_curiosos TEXT NOT NULL,
      tamano VARCHAR(80) NOT NULL,
      peso VARCHAR(80) NOT NULL,
      rareza VARCHAR(80) NOT NULL,
      nivel INT NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_usuario_nombre (usuario_id, nombre),
      FOREIGN KEY (usuario_id) REFERENCES bestiario_usuarios(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    ALTER TABLE bestiario_colecciones
      ADD COLUMN IF NOT EXISTS imagen VARCHAR(240) DEFAULT '',
      ADD COLUMN IF NOT EXISTS habitat VARCHAR(120) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS alimentacion VARCHAR(120) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS datos_curiosos TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS tamano VARCHAR(80) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS peso VARCHAR(80) NOT NULL DEFAULT '';
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
    (usuario_id, nombre, tipo, descripcion, poder, atributo, imagen, habitat, alimentacion, datos_curiosos, tamano, peso, rareza, nivel) VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    ids['mystic@luna.com'], 'Serafina del Lago', 'Acuático', 'Una criatura de aguas lunares que ilumina las profundidades.', 'Ondas de calma', 'Agua', '', 'Lagos lunares', 'Algas brillantes, néctar de luna', 'Susurros de agua oculta entre bosques', '1.8 m', '45 kg', 'Legendaria', 5,
    ids['mystic@luna.com'], 'Nocturna Alada', 'Aéreo', 'Sus alas brillan en tonos azules bajo la luna llena.', 'Viento estelar', 'Aire', '', 'Cumbres y nubes nocturnas', 'Pétalos de nube y luz estelar', 'Prefiere noches frías', '2.1 m', '19 kg', 'Rara', 4,
    ids['mystic@luna.com'], 'Guardiana de Cristal', 'Místico', 'Protege los secretos de los bosques encantados.', 'Escudo de luz', 'Magia', '', 'Bosques encantados', 'Bayas cristalinas y rocío', 'Aprecia las leyendas antiguas', '1.4 m', '32 kg', 'Épica', 5,
    ids['orion@estrella.com'], 'Abyssal Coral', 'Acuático', 'Nace entre arrecifes con destellos de galaxias marinas.', 'Tromba marina', 'Agua', '', 'Arrecifes profundos', 'Plancton estelar y corrientes frías', 'Cambia de color con la marea', '1.6 m', '38 kg', 'Rara', 4,
    ids['orion@estrella.com'], 'Fénix Nebular', 'Aéreo', 'Resurge de las cenizas con plumas de neón cósmico.', 'Llama astral', 'Fuego', '', 'Cielos nocturnos', 'Brasa cósmica y semillas de estrella', 'Su canto crea auroras', '1.9 m', '24 kg', 'Legendaria', 5,
    ids['orion@estrella.com'], 'Titán Lunar', 'Terrestre', 'Pisa la tierra dejando senderos de polvo de estrellas.', 'Terremoto lunar', 'Tierra', '', 'Llanuras de piedra lunar', 'Raíces energizadas y minerales', 'Sus pisadas despiertan cristales', '2.4 m', '110 kg', 'Épica', 5
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
      'SELECT id, nombre, tipo, descripcion, poder, atributo, imagen, habitat, alimentacion, datos_curiosos, tamano, peso, rareza, nivel FROM bestiario_colecciones WHERE usuario_id = ? ORDER BY nivel DESC, nombre ASC',
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
