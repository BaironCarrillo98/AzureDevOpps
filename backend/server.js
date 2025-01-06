
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const dbConfig = {
    user: 'becarrilloo',
    password: 'Aa1000319984',
    server: 'bairon-server.database.windows.net',
    database: 'proveedores',
    options: {
        encrypt: true,
    }
};

// Conexión a la base de datos
sql.connect(dbConfig).then(pool => {
    if (pool.connected) console.log("Conexión a la base de datos establecida.");

    // Obtener todas las tareas
    app.get('/tasks', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Tasks');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Crear una nueva tarea
    app.post('/tasks', async (req, res) => {
        const { title, description } = req.body;
        try {
            await pool.request()
                .input('title', sql.VarChar, title)
                .input('description', sql.VarChar, description)
                .query('INSERT INTO Tasks (Title, Description) VALUES (@title, @description)');
            res.status(201).send('Tarea creada.');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Actualizar una tarea
    app.put('/tasks/:id', async (req, res) => {
        const { id } = req.params;
        const { title, description } = req.body;
        try {
            await pool.request()
                .input('id', sql.Int, id)
                .input('title', sql.VarChar, title)
                .input('description', sql.VarChar, description)
                .query('UPDATE Tasks SET Title = @title, Description = @description WHERE Id = @id');
            res.send('Tarea actualizada.');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Eliminar una tarea
    app.delete('/tasks/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Tasks WHERE Id = @id');
            res.send('Tarea eliminada.');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
}).catch(err => console.error("Error conectando a la base de datos:", err));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
