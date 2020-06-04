var express = require('express');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico')

var app = express();

// ============================================================
// Busqueda General
// ============================================================
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    Promise.all( [
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)])
    .then( respuestas => {
        res.status(201).json({
            ok: true,
            mensaje: 'Peticion Realizada Correctamente',
            hospitales: respuestas[0],
            medicos: respuestas[1]

        });
    });

});


function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((err, hospitales) => {
            if(err){
                reject('Error al cargar los hospitales', err);
            }else {
                resolve(hospitales);
            }
        });
    });
}



function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .exec((err, medicos) => {
            if(err){
                reject('Error al cargar los medicos', err);
            }else {
                resolve(medicos);
            }
        })
    })
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({},'nombre email role')
            .or([{'nombre': regex}, {'email': regex}])
            .exec((err, usuarios) => {
                if(err) {
                    reject('Error al cargar usuarios', err)
                } else{
                    resolve(usuarios)
                }
            });
    });
}


// ============================================================
// Busqueda Coleccion Medicos
// ============================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch( tabla ) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        
            default: return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuarios, medicos y hospitales',
                error: {message: 'Tipo de tabla/coleccion no valido'}
            });
    }

    promesa.then(data => {
        return res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

    // buscarMedicos(regex)
    //     .then(medicos => {
    //         res.status(200).json({
    //             medicos
    //         });
    //     })
});


module.exports = app;