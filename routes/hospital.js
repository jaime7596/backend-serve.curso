var express = require('express');
var mdAutenticacion = require('../middlewares/autentificacion');
var app = express();
var Hospital = require('../models/hospital');

// =======================================
// Obtener todos los Hospitales
// =======================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0
    desde = Number(desde)

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
        (err, hospitales)=> {
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hopitales: hospitales,
                    total: conteo
                });
            })
        });
});

// ============================================================
// Crear nuevo Hospital
// ============================================================

app.post('/', mdAutenticacion.verificaToken , (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        return res.status(201).json({
            ok: true,
            hospital: hospitalDB,
        });
    });
});

// ============================================================
// Actualizar un Hospital
// ============================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id
    var body = req.body
    console.log(id);
    

    Hospital.findById(id, (err, hospitalDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }
        
        if(!hospitalDB) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Hospital no encontrado',
                errors: 'Hospital no Encontrado'
            });
        }

        hospitalDB.nombre = body.nombre
        hospitalDB.usuario = req.usuario._id;
        

        hospitalDB.save((err, hospitalUpdate) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                hospital: hospitalUpdate
            })
        });
    });
});

// ============================================================
// Borrar un hospital
// ============================================================

app.delete('/:id', (req, res) => {
    id = req.params.id

    Hospital.findByIdAndRemove(id, (err, hospitalRemove) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if(!hospitalRemove) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Hospital no encontrado',
                errors: err
            });
        }

        return res.status(200).json({
            ok: true,
            hospitalBorrado: hospitalRemove
        });

    });
});

module.exports = app;