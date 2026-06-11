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
);
INSERT IGNORE INTO bestiario_usuarios (email, password, nombre) VALUES
  ('mystic@correo.com', '1234', 'Mystic Luna'),
  ('orion@correo.com', '1234', 'Orion Star'),
  ('aurora@correo.com', '1234', 'Aurora Sky'),
  ('draco@correo.com', '1234', 'Draco Ember'),
  ('selene@correo.com', '1234', 'Selene Whisper'),
  ('terra@correo.com', '1234', 'Terra Grove');

INSERT IGNORE INTO bestiario_colecciones (usuario_id, nombre, tipo, descripcion, poder, atributo, imagen, habitat, alimentacion, datos_curiosos, tamano, peso, rareza, nivel) VALUES
  (1, 'Serafina del Lago', 'Acuático', 'Una criatura de aguas lunares que ilumina las profundidades.', 'Ondas de calma', 'Agua', '', 'Lagos lunares', 'Algas brillantes, néctar de luna', 'Susurros de agua oculta entre bosques', '1.8 m', '45 kg', 'Legendaria', 5),
  (1, 'Nocturna Alada', 'Aéreo', 'Sus alas brillan en tonos azules bajo la luna llena.', 'Viento estelar', 'Aire', '', 'Cumbres y nubes nocturnas', 'Pétalos de nube y luz estelar', 'Prefiere noches frías', '2.1 m', '19 kg', 'Rara', 4),
  (1, 'Guardiana de Cristal', 'Místico', 'Protege los secretos de los bosques encantados.', 'Escudo de luz', 'Magia', '', 'Bosques encantados', 'Bayas cristalinas y rocío', 'Aprecia las leyendas antiguas', '1.4 m', '32 kg', 'Épica', 5),
  (2, 'Abyssal Coral', 'Acuático', 'Nace entre arrecifes con destellos de galaxias marinas.', 'Tromba marina', 'Agua', '', 'Arrecifes profundos', 'Plancton estelar y corrientes frías', 'Cambia de color con la marea', '1.6 m', '38 kg', 'Rara', 4),
  (2, 'Fénix Nebular', 'Aéreo', 'Resurge de las cenizas con plumas de neón cósmico.', 'Llama astral', 'Fuego', '', 'Cielos nocturnos', 'Brasa cósmica y semillas de estrella', 'Su canto crea auroras', '1.9 m', '24 kg', 'Legendaria', 5),
  (2, 'Titán Lunar', 'Terrestre', 'Pisa la tierra dejando senderos de polvo de estrellas.', 'Terremoto lunar', 'Tierra', '', 'Llanuras de piedra lunar', 'Raíces energizadas y minerales', 'Sus pisadas despiertan cristales', '2.4 m', '110 kg', 'Épica', 5),
  (3, 'Aurora Serpiente', 'Acuático', 'Surge entre las auroras con escamas de luz.', 'Resplandor frio', 'Agua', '', 'Ríos boreales', 'Hielo lumínico', 'Cambia de color según el clima', '3.5 m', '85 kg', 'Rara', 4),
  (3, 'Víbora Boreal', 'Terrestre', 'Su cola emite polvo de estrellas en cada paso.', 'Veneno glacial', 'Tierra', '', 'Tundras congeladas', 'Musgo estelar', 'Su veneno congela', '2.2 m', '40 kg', 'Épica', 5),
  (4, 'Draco Nitro', 'Aéreo', 'Sus alas eléctricas rasgan el cielo nocturno.', 'Rayo oscuro', 'Aire', '', 'Cumbres tormentosas', 'Rayos y ozono', 'Sus ronquidos suenan como truenos', '4.5 m', '210 kg', 'Legendaria', 5),
  (4, 'Quimera Sombra', 'Místico', 'Nacida del fuego y la niebla eterna.', 'Furia onírica', 'Magia', '', 'Cuevas abisales', 'Sueños perdidos', 'Puede atravesar paredes oscuras', '2.8 m', '150 kg', 'Épica', 5),
  (4, 'Fuego del Abismo', 'Terrestre', 'Los volcanes obedecen su presencia.', 'Llama eterna', 'Fuego', '', 'Fosas volcánicas', 'Magma y carbón', 'Sus pasos derriten la roca', '3.0 m', '500 kg', 'Rara', 4),
  (5, 'Selene Niebla', 'Aéreo', 'Aparece entre nubes y susurra secretos.', 'Cosquilleo lunar', 'Aire', '', 'Valles neblinosos', 'Rocío de medianoche', 'Es invisible de día', '1.2 m', '12 kg', 'Rara', 4),
  (5, 'Lince Lunar', 'Terrestre', 'Sus pasos no dejan huellas en la noche.', 'Sigilo estelar', 'Tierra', '', 'Bosques de coníferas', 'Frutos lunares', 'Sus ojos brillan como faros', '1.5 m', '45 kg', 'Épica', 4),
  (5, 'Ninfa Crepuscular', 'Místico', 'Vive entre la bruma que aparece al atardecer.', 'Encanto de penumbra', 'Magia', '', 'Claros del atardecer', 'Néctar de sol', 'Su risa cura heridas', '1.1 m', '20 kg', 'Rara', 4),
  (6, 'Golem de Raíz', 'Terrestre', 'Despierta gusanos antiguos con cada pisada.', 'Regeneración', 'Tierra', '', 'Bosques ancestrales', 'Minerales profundos', 'Puede dormir por siglos', '5.0 m', '1200 kg', 'Rara', 4),
  (6, 'Espíritu del Valle', 'Místico', 'Protege los valles y a los viajeros perdidos.', 'Bendición verde', 'Magia', '', 'Cañones místicos', 'Energía eólica', 'Guía a los viajeros con luces', '2.0 m', '0 kg', 'Legendaria', 5),
  (6, 'Cuervo Umbral', 'Aéreo', 'Aparece entre las sombras y lleva mensajes.', 'Vigilia eterna', 'Aire', '', 'Ruinas antiguas', 'Ecos del pasado', 'Repite palabras olvidadas', '0.8 m', '3 kg', 'Rara', 4);

INSERT IGNORE INTO bestiario_amigos (usuario_id, amigo_id) VALUES
  (1, 2), (2, 1),
  (1, 3), (3, 1),
  (1, 5), (5, 1),
  (2, 4), (4, 2),
  (3, 6), (6, 3),
  (4, 5), (5, 4),
  (4, 6), (6, 4),
  (6, 2), (2, 6);