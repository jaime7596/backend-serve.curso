// Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar Variables
var app = express();

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=> {
    if(err) throw err;
});


// Rutas
app.get('/', (req, res, next) => {
    res.status(201).json({
        ok: true,
        mensaje: 'Peticion Realizada Correctamente'
    });
})

//Escuchar Peticiones 
app.listen(9000, ()=> {
    console.log('Express Server puerto 9000: \x1b[32m%s\x1b[0m', 'online');
    
});