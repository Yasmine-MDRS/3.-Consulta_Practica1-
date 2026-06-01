const { db } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { correo, contrasena, domicilio } = req.body;

    if (!correo || !contrasena || !domicilio) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const [existe] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(contrasena, 10);

    await db.query(
      'INSERT INTO usuarios (correo, contrasena, domicilio) VALUES (?, ?, ?)',
      [correo, passwordHash, domicilio]
    );

    res.json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ message: 'Correo y contraseña obligatorios' });
    }

    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'Correo no registrado' });
    }

    const usuario = usuarios[0];

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id_user: usuario.id_user, correo: usuario.correo },
      process.env.JWT_SECRET || 'starlight_secret',
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Inicio de sesión correcto',
      token,
      usuario: {
        id_user: usuario.id_user,
        correo: usuario.correo,
        domicilio: usuario.domicilio,
        nombre_completo: usuario.nombre_completo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

module.exports = {
  register,
  login
};  