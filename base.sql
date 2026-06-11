CREATE DATABASE IF NOT EXISTS portafolio_db;
USE portafolio_db;

CREATE TABLE IF NOT EXISTS contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  mensaje TEXT NOT NULL,
  creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_nombre VARCHAR(120) NOT NULL,
  cliente_email VARCHAR(120) NOT NULL,
  direccion VARCHAR(250) NOT NULL,
  productos TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bestiario_usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(80) NOT NULL,
  nombre VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS bestiario_amigos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  amigo_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_usuario_amigo (usuario_id, amigo_id),
  FOREIGN KEY (usuario_id) REFERENCES bestiario_usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (amigo_id) REFERENCES bestiario_usuarios(id) ON DELETE CASCADE
);

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
);
INSERT IGNORE INTO bestiario_usuarios (email, password, nombre) VALUES
  ('mystic@correo.com', 'luna2024', 'Mystic Luna'),
  ('orion@correo.com', 'orion2024', 'Orion Star'),
  ('aurora@correo.com', 'aurora2024', 'Aurora Sky'),
  ('draco@correo.com', 'draco2024', 'Draco Ember'),
  ('selene@correo.com', 'selene2024', 'Selene Whisper'),
  ('terra@correo.com', 'terra2024', 'Terra Grove');

INSERT IGNORE INTO bestiario_colecciones (usuario_id, nombre, tipo, descripcion, poder, atributo, icono, rareza, nivel) VALUES
  (1, 'Serafina del Lago', 'Acuático', 'Una criatura de aguas lunares que ilumina las profundidades.', 'Ondas de calma', 'Agua', '🌊', 'Legendaria', 5),
  (1, 'Nocturna Alada', 'Aéreo', 'Sus alas brillan en tonos azules bajo la luna llena.', 'Viento estelar', 'Aire', '💨', 'Rara', 4),
  (1, 'Guardiana de Cristal', 'Místico', 'Protege los secretos de los bosques encantados.', 'Escudo de luz', 'Magia', '✨', 'Épica', 5),
  (2, 'Abyssal Coral', 'Acuático', 'Nace entre arrecifes con destellos de galaxias marinas.', 'Tromba marina', 'Agua', '🌊', 'Rara', 4),
  (2, 'Fénix Nebular', 'Aéreo', 'Resurge de las cenizas con plumas de neón cósmico.', 'Llama astral', 'Fuego', '🔥', 'Legendaria', 5),
  (2, 'Titán Lunar', 'Terrestre', 'Pisa la tierra dejando senderos de polvo de estrellas.', 'Terremoto lunar', 'Tierra', '🌿', 'Épica', 5),
  (3, 'Aurora Serpiente', 'Acuático', 'Surge entre las auroras con escamas de luz.', 'Resplandor frio', 'Agua', '🌊', 'Rara', 4),
  (3, 'Víbora Boreal', 'Terrestre', 'Su cola emite polvo de estrellas en cada paso.', 'Veneno glacial', 'Tierra', '🌌', 'Épica', 5),
  (4, 'Draco Nitro', 'Aéreo', 'Sus alas eléctricas rasgan el cielo nocturno.', 'Rayo oscuro', 'Aire', '⚡', 'Legendaria', 5),
  (4, 'Quimera Sombra', 'Místico', 'Nacida del fuego y la niebla eterna.', 'Furia onírica', 'Magia', '✨', 'Épica', 5),
  (4, 'Fuego del Abismo', 'Terrestre', 'Los volcanes obedecen su presencia.', 'Llama eterna', 'Fuego', '🔥', 'Rara', 4),
  (5, 'Selene Niebla', 'Aéreo', 'Aparece entre nubes y susurra secretos.', 'Cosquilleo lunar', 'Aire', '🌙', 'Rara', 4),
  (5, 'Lince Lunar', 'Terrestre', 'Sus pasos no dejan huellas en la noche.', 'Sigilo estelar', 'Tierra', '🌿', 'Épica', 4),
  (5, 'Ninfa Crepuscular', 'Místico', 'Vive entre la bruma que aparece al atardecer.', 'Encanto de penumbra', 'Magia', '✨', 'Rara', 4),
  (6, 'Golem de Raíz', 'Terrestre', 'Despierta gusanos antiguos con cada pisada.', 'Regeneración', 'Tierra', '🌿', 'Rara', 4),
  (6, 'Espíritu del Valle', 'Místico', 'Protege los valles y a los viajeros perdidos.', 'Bendición verde', 'Magia', '✨', 'Legendaria', 5),
  (6, 'Cuervo Umbral', 'Aéreo', 'Aparece entre las sombras y lleva mensajes misteriosos.', 'Vigilia eterna', 'Aire', '🌫️', 'Rara', 4);

INSERT IGNORE INTO bestiario_amigos (usuario_id, amigo_id) VALUES
  (1, 2), (2, 1),
  (1, 3), (3, 1),
  (1, 5), (5, 1),
  (2, 4), (4, 2),
  (3, 6), (6, 3),
  (4, 5), (5, 4),
  (4, 6), (6, 4),
  (6, 2), (2, 6);