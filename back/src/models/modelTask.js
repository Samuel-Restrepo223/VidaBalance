import { Schema, model} from 'mongoose';

const esquemaTareas = new Schema({
    titulo:{type: String, required: true},
    descripcion: {type: String, required: true},
    estado: {type: String, required: true},
    fechaDeVancimiento: {type: Date, require: true}
},
{
    versionKey: false,
    timestamps: true
});

export default model('productos',esquemaTareas);