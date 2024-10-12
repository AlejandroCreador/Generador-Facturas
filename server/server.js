// server/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de Express
const app = express();
const port = 3500;

// Middleware para manejar datos en formato JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Multer para recibir archivos PDF
const upload = multer({ dest: 'uploads/' });

// Ruta para servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Configurar Nodemailer para enviar correos
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Cambia por tu host SMTP si no es Gmail
    port: 465, // Usa el puerto correcto (465 para SSL o 587 para TLS)
    secure: true, // Usa true para SSL y false para TLS
    auth: {
        user: 'tu_correo@gmail.com', // Cambia esto por tu correo
        pass: 'tu_contraseña', // Cambia esto por tu contraseña o clave de aplicación
    },
});

// Ruta POST para enviar correo con el PDF adjunto
app.post('/send-email', upload.single('pdf'), (req, res) => {
    const { toEmail } = req.body;
    const pdfPath = req.file.path;

    // Configuración del correo electrónico
    const mailOptions = {
        from: 'tu_correo@gmail.com',
        to: toEmail,
        subject: 'Factura generada',
        text: 'Adjunto encontrarás la factura generada.',
        attachments: [
            {
                filename: 'factura.pdf',
                path: pdfPath, // El archivo PDF se envía como adjunto
            },
        ],
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Error al enviar el correo', error });
        }

        // Eliminar el archivo PDF después de enviarlo
        fs.unlink(pdfPath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo PDF', err);
            }
        });

        res.status(200).json({ message: 'Correo enviado correctamente' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Ruta de manejo de errores
app.get('/error', (req, res) => {
    res.status(500).send('Ha ocurrido un error. Por favor, intenta nuevamente.');
});
