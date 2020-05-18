var express = require('express');

var app = express();

app.get('/', (req, res, next) => {
    res.status(201).json({
        ok: true,
        mensaje: 'Peticion Realizada Correctamente'
    });
});

module.exports = app;