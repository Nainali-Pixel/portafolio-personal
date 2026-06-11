CREATE DATABASE portafolio_db;
USE portafolio_db;

CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  mensaje TEXT NOT NULL,
  creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_nombre VARCHAR(120) NOT NULL,
  cliente_email VARCHAR(120) NOT NULL,
  direccion VARCHAR(250) NOT NULL,
  productos TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bestiario_usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(80) NOT NULL,
  nombre VARCHAR(120) NOT NULL
);

CREATE TABLE bestiario_colecciones (
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
