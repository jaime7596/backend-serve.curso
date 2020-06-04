var moongose = require('mongoose');
var Schema = moongose.Schema;

var medicoSchema = new Schema({
    nombre: {type: String, required:[true, 'El nombre es necesario']},
    img:{type: String, required:false},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required:true},
    hospital:{type: Schema.Types.ObjectId, ref: 'Hospital', required:[true, 'El id Hospital es un campo obligatorio']}
},{collection: 'medicos'});

module.exports = moongose.model('Medico', medicoSchema);