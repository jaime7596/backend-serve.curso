// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar Variables
var app = express();


// Body Parser
// ****parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// ****parse application/json
app.use(bodyParser.json())


// Importar Rutas
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=> {
    if(err) throw err;
});


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);

//Escuchar Peticiones 
app.listen(9000, ()=> {
    console.log('Express Server puerto 9000: \x1b[32m%s\x1b[0m', 'online');
    
});