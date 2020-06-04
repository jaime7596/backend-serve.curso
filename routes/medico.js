var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autentificacion');
var Medico = require('../models/medico')

// ============================================================
// Obtener todos los Medicos
// ============================================================
app.get('/', (req, res, next) => {

    
    var desde = req.query.desde || 0
    desde = Number(desde)

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
        (err, medicos ) => {
            if(err){
                return res.status(500).json({
                    ok:true,
                    mensaje:'Error al obtener Medicos'
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });
            });
    });
});

// ============================================================
// Crear nuevo Medico 
// ============================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital,
    });

    medico.save((err, medicoDB)=> {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                erros: err
            });
        }

        return res.status(201).json({
            ok: true,
            medico: medicoDB
        });
    });

});

// ============================================================
// Editar un Medico
// ============================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res)=> {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medicoDB)=> {
        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al modificar Medico',
                errors: err 
            });
        }

        if(!medicoDB) {
            return res.status(404).json({
                ok: false,
                mensaje: `Medico con el id: ${id} no encontrado`,
                errors: `Medico con el id: ${id} no encontrado`,
            });
        }

        medicoDB.nombre = body.nombre;
        medicoDB.usuario = req.usuario._id;
        medicoDB.hospital = body.hospital;

        medicoDB.save((err, medicoGuardado)=> {
            if(err) {
                return res.status(404).json({
                    ok:false,
                    mensaje: 'Error al editar Medico'
                });
            }

            return res.status(200).json({
                ok:true,
                medicoGuardado
            });
        }); 
    });
});

// ============================================================
// Borrar un Medico
// ============================================================

app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {
        if(err) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al eliminar medico',
                erros: err
            });
        }

        if(!medicoEliminado) {
            return res.status(404).json({
                ok: false,
                mensaje: `Medico con el id: ${id} no encontrado`,
                errors: `Medico con el id: ${id} no encontrado`,
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medicoEliminado
        });
    });
})



module.exports = app;