var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    console.log('PATH',pathImagen);
    
    if(fs.existsSync(pathImagen)) {
         return res.sendFile(pathImagen)
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        return res.sendFile(pathNoImagen); 
    }

});

module.exports = app;