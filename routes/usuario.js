var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autentificacion');
var SEED = require('../config/config').SEED;
var app = express();
var Usuario = require('../models/usuario');

// =======================================
// Obtener todos los usuarios
// =======================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0
    desde = Number(desde)

    Usuario.find({}, 'nombre email img role')
    .skip(desde)
    .limit(5)
    .exec((err, usuarios) => {
            if( err ) res.status(500).json({
                ok:true,
                mensaje: 'Error cargando usuarios',
                errors: err
            });

            Usuario.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });

            })
        })
    
});

// =======================================
// Verificar Token
// =======================================
// app.use('/',( req, res, next) => {
//     var token = req.query.token;
//     jwt.verify(token, SEED, (err, decoded ) => {
//         if( err) {
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'Error de Autentificacion',
//                 errors: err
//             });
//         }
//         next();
//     });
// });


// =======================================
// Crear nuevo usuario
// =======================================

app.post('/', mdAutenticacion.verificaToken ,(req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioDb) => {
        if( err ) return res.status(500).json({
            ok:false,
            mensaje: 'Error cargando usuarios',
            errors: err
        });

        
        return res.status(201).json({
            ok: true,
            usuario: usuarioDb,
            usuarioToken: req.usuario
        });
    });
});

// =======================================
// Actualizar un usuario
// =======================================

app.put('/:id', mdAutenticacion.verificaToken ,(req, res) => {
    var id = req.params.id
    var body = req.body


    Usuario.findById(id, (err, usuario)=> {
        if( err ) return res.status(500).json({
            ok:false,
            mensaje: 'Error al buscar usuario',
            errors: err
        });
        
        if( err ) return res.status(400).json({
            ok:false,
            mensaje: `Usuario con el id ${id} no existe`,
            errors: { message: 'No existe un usuario con ese ID'}
        });

        usuario.nombre = body.nombre
        usuario.email = body.email
        usuario.role = body.role

        usuario.save((err, usuarioDb) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuario.password = '*************'

            return res.status(200).json({
                ok: true,
                usuario: usuarioDb
            });
        });
    });
});

// =======================================
// Borrar un usuario
// =======================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)=> {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro usuario a borrar',
                errors: {message: 'No se encontro usuario a borrar'}
            });
        }

        return res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;