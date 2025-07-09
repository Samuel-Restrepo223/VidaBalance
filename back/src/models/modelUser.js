import Usuario from "../models/modelUser.js";

export const loginUsuario = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario || usuario.contrasena !== contrasena) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    res.json({ mensaje: "Inicio de sesión exitoso", usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};


