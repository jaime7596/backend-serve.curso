var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;
    
    // Tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios']

    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no Valida',
            errors: {mensaje: 'Las extensiones validas son: ' + extensionesValidas.join(', ')}
        });
    }

    if(!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: {mensaje: 'Debe de seleccionar una imagen'}
        });
    }
    // Obtener Nombre de la archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Extensiones Permitidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo)< 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no Valida',
            errors: {mensaje: 'Las extensiones validas son: ' + extensionesValidas.join(', ')}
        });
    }


    // Nombre Perzonalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover Archivo del Temporal al path
    var path = `./uploads/${tipo}/${nombreArchivo}`
    archivo.mv(path, err => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover Arcivos',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // return res.status(200).json({
        //     ok:true,
        //     extension:  extensionArchivo
        // });
    })




});


function subirPorTipo(tipo, id, nombreArchivo, res) {
    if( tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if(!usuario) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Usuario no encontrado',
                    errors: 'Usuario no Encontrado'
                });
            }

            var pathViejo = `./uploads/usuarios/${usuario.img}`;
            // Si existe se elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }
           
            usuario.img = nombreArchivo;
            usuario.save( (err, usuarioActualizado) => {
                usuario.password = '**********'
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuarios',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok:true,
                    usuario: usuarioActualizado
                });
            });
        });        

    }
    if( tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if(!medico) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Medico no encontrado',
                    errors: 'Medico no Encontrado'
                });
            }
            var pathViejo = `./uploads/medicos/${medico.img}`;
            // Si existe se elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;
            medico.save( (err, medicoActualizado) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar medico',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok:true,
                    medico: medicoActualizado
                });
            });
        });        

    }

    if( tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if(!hospital) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Hospital no encontrado',
                    errors: 'Hospital no Encontrado'
                });
            }
            

            var pathViejo = `./uploads/hospitales/${hospital.img}`;
            // Si existe se elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save( (err, hospitalActualizado) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar medico',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok:true,
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;