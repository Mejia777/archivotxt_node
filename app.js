const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para el manejo de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true }));

// Ruta para el formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para procesar el formulario
app.post('/prestamo', (req, res) => {
    const { id, nombre, apellido, titulo, autor, editorial, año } = req.body;

    // Verifica que todos los campos estén presentes
    if (!id || !nombre || !apellido || !titulo || !autor || !editorial || !año) {
        return res.redirect('/error.html');
    }

    // Crea el contenido del archivo
    const contenido = `${id}, ${nombre}, ${apellido}, ${titulo}, ${autor}, ${editorial}, ${año}`;

    // Nombre del archivo
    const fileName = `id_${id}.txt`;

    // Ruta del archivo
    const filePath = path.join(__dirname, 'data', fileName);

    // Escribe el contenido en el archivo
    fs.writeFile(filePath, contenido, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error interno del servidor');
        }
        // Envía el archivo para su descarga
        res.download(filePath, 'id_' + id + '.txt', (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Error al descargar el archivo');
            }
            console.log('Archivo descargado correctamente');
        });
    });
});

// Ruta para errores
app.get('/error.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

