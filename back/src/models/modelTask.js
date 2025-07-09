import mongoose from 'mongoose';

const tareaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en ejecucion', 'retenida', 'finalizada'],
    default: 'pendiente'
  },
  calificacion: {
    type: Number,
    min: 1,
    max: 5
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});

export default mongoose.model('Tarea', tareaSchema);
