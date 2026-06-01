const { db } = require('../config/db');
const bcrypt = require('bcryptjs');
const { enviarPinRecuperacion } = require('../services/brevo.service');

const generarPin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const validarPassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
  return regex.test(password);
};

const solicitarPin = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({
        message: 'Ingresa tu correo'
      });
    }

    const [usuarios] = await db.query(
      'SELECT id_user, correo, rol FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        message: 'El correo no está registrado'
      });
    }

    const usuario = usuarios[0];

    if (usuario.rol !== 'cliente') {
      return res.status(403).json({
        message: 'No se encontró la cuenta'
      });
    }

    const pin = generarPin();

    await db.query(
      `UPDATE password_resets
       SET usado = TRUE
       WHERE correo = ? AND usado = FALSE`,
      [correo]
    );

    const expiraEn = new Date(Date.now() + 60 * 1000);

    await db.query(
      `INSERT INTO password_resets
       (id_user, correo, pin, expira_en, usado)
       VALUES (?, ?, ?, ?, FALSE)`,
      [
        usuario.id_user,
        correo,
        pin,
        expiraEn
      ]
    );

    await enviarPinRecuperacion(correo, pin);

    res.json({
      message: 'PIN enviado correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al enviar el PIN'
    });
  }
};

const verificarPin = async (req, res) => {
  try {
    const { correo, pin } = req.body;

    if (!correo || !pin) {
      return res.status(400).json({
        message: 'Correo y PIN obligatorios'
      });
    }

    const [rows] = await db.query(
      `SELECT *
       FROM password_resets
       WHERE correo = ?
       AND pin = ?
       AND usado = FALSE
       ORDER BY creado_en DESC
       LIMIT 1`,
      [correo, pin]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: 'PIN incorrecto'
      });
    }

    const reset = rows[0];

    if (new Date(reset.expira_en) < new Date()) {
      return res.status(400).json({
        message: 'El PIN expiró, solicita uno nuevo'
      });
    }

    res.json({
      message: 'PIN verificado correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al verificar PIN'
    });
  }
};

const cambiarPassword = async (req, res) => {
  try {
    const { correo, pin, nuevaPassword } = req.body;

    if (!correo || !pin || !nuevaPassword) {
      return res.status(400).json({
        message: 'Datos incompletos'
      });
    }

    if (!validarPassword(nuevaPassword)) {
      return res.status(400).json({
        message: 'La contraseña debe tener mínimo 6 caracteres, letras, números y un símbolo especial'
      });
    }

    const [rows] = await db.query(
      `SELECT *
       FROM password_resets
       WHERE correo = ?
       AND pin = ?
       AND usado = FALSE
       ORDER BY creado_en DESC
       LIMIT 1`,
      [correo, pin]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: 'PIN inválido'
      });
    }

    const reset = rows[0];

    if (new Date(reset.expira_en) < new Date()) {
      return res.status(400).json({
        message: 'El PIN expiró'
      });
    }

    const hash = await bcrypt.hash(nuevaPassword, 10);

    await db.query(
      'UPDATE usuarios SET contrasena = ? WHERE correo = ? AND rol = ?',
      [hash, correo, 'cliente']
    );

    await db.query(
      'UPDATE password_resets SET usado = TRUE WHERE id_reset = ?',
      [reset.id_reset]
    );

    res.json({
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al cambiar contraseña'
    });
  }
};

module.exports = {
  solicitarPin,
  verificarPin,
  cambiarPassword
};