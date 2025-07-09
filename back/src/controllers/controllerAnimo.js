import Animo from "../models/modelAnimo.js";

// Obtener todos los registros de estado de ánimo
export const getAnimos = async (req, res) => {
  try {
    const animos = await Animo.find();
    res.json(animos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los estados de ánimo", error });
  }
};
