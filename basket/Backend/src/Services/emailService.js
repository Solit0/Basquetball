// 🔴 1. FORZAMOS la carga del .env aquí mismo antes de hacer cualquier otra cosa
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("=== CREDENCIALES NODEMAILER ===");
console.log("Usuario:", process.env.GMAIL_USER);
console.log("Password cargado:", process.env.GMAIL_PASSWORD ? "SÍ" : "NO (Revisa tu archivo .env)");
console.log("===============================");

// 3. Configuramos el transportador explícitamente para Google
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Usa SSL
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});
 
const enviarReciboCompra = async (emailDestino, nombreUsuario, detallesBoleto) => {
    try {
        const htmlContent = `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px;">¡Gracias por tu compra, ${nombreUsuario}!</h1>
                </div>
                <div style="padding: 20px; color: #374151;">
                    <p style="font-size: 16px;">Tus lugares están asegurados. Aquí tienes los detalles oficiales de tu reserva:</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px;">
                            <li style="margin-bottom: 10px;">🏀 <strong>Encuentro:</strong> ${detallesBoleto.partido}</li>
                            <li style="margin-bottom: 10px;">🎟️ <strong>Zona:</strong> ${detallesBoleto.zona}</li>
                            <li style="margin-bottom: 10px;">👥 <strong>Cantidad:</strong> ${detallesBoleto.cantidad} boleto(s)</li>
                            <li>💳 <strong>Total Pagado:</strong> $${detallesBoleto.total} USD</li>
                        </ul>
                    </div>
                    
                    <p style="font-size: 14px; color: #6b7280;">Por favor, presenta este correo (digital o impreso) en la entrada el día del evento.</p>
                </div>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"Taquilla BasketPro" <${process.env.GMAIL_USER}>`,
            to: emailDestino,
            subject: '🎟️ Tu recibo oficial de BasketPro',
            html: htmlContent
        });

        console.log(`📧 [EMAIL SERVICE] Recibo enviado correctamente a: ${emailDestino}`);
        return info;
    } catch (error) {
        console.error("❌ [EMAIL SERVICE ERROR] Falló el envío del correo:", error);
        throw error;
    }
};

module.exports = { 
    enviarReciboCompra 
};