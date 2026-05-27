const { db } = require('../config/db');

const getPerfil = async (req, res) => {
  try {
    const { id_user } = req.params;

    const [rows] = await db.query(
      `SELECT id_user, correo, domicilio, nombre_completo, rfc,
              regimen_fiscal, uso_cfdi, codigo_postal
       FROM usuarios
       WHERE id_user = ?`,
      [id_user]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

const updatePerfil = async (req, res) => {
  try {
    const { id_user } = req.params;

    const {
      nombre_completo,
      domicilio,
      rfc,
      regimen_fiscal,
      uso_cfdi,
      codigo_postal
    } = req.body;

    await db.query(
      `UPDATE usuarios
       SET nombre_completo = ?,
           domicilio = ?,
           rfc = ?,
           regimen_fiscal = ?,
           uso_cfdi = ?,
           codigo_postal = ?
       WHERE id_user = ?`,
      [
        nombre_completo,
        domicilio,
        rfc,
        regimen_fiscal,
        uso_cfdi,
        codigo_postal,
        id_user
      ]
    );

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

module.exports = {
  getPerfil,
  updatePerfil
};