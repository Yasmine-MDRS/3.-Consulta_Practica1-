const enviarPinRecuperacion = async (correo, pin) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_SENDER_NAME || 'Starlight Libreria',
        email: process.env.BREVO_SENDER_EMAIL
      },
      to: [{ email: correo }],
      subject: 'Código de recuperación - Starlight',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2>Recuperación de contraseña</h2>
          <p>Tu código de verificación es:</p>
          <h1 style="letter-spacing: 6px; color: #7b2cbf;">${pin}</h1>
          <p>Este código vence en <strong>1 minuto</strong>.</p>
          <p>Si no solicitaste este cambio, ignora este correo.</p>
        </div>
      `
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Error Brevo:', data);
    throw new Error('No se pudo enviar el correo con Brevo');
  }

  return data;
};

const enviarReciboXML = async (correo, nombre, xml) => {
  const xmlBase64 = Buffer.from(xml, 'utf8').toString('base64');

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_SENDER_NAME || 'Starlight Libreria',
        email: process.env.BREVO_SENDER_EMAIL
      },
      to: [
        {
          email: correo,
          name: nombre || 'Cliente'
        }
      ],
      subject: 'Recibo de compra - Starlight',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2>Gracias por tu compra en Starlight</h2>
          <p>Adjuntamos tu recibo XML.</p>
          <p>Puedes descargarlo directamente desde este correo.</p>
        </div>
      `,
      attachment: [
        {
          content: xmlBase64,
          name: 'recibo-starlight.xml'
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Error Brevo XML:', data);
    throw new Error('No se pudo enviar el recibo XML');
  }

  return data;
};

module.exports = {
  enviarPinRecuperacion,
  enviarReciboXML
};