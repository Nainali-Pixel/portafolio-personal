const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/contacto', async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;

        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ok: false, msg: 'Todos los campos son obligatorios.'});
        }

        await db.execute(
            'INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)',
            [nombre, email, mensaje]
        );

        res.json({ok: true, msg: 'Mensaje enviado correctamente.'});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error al enviar el mensaje.'});
    }
});

app.listen (3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});