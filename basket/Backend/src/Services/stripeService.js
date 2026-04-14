const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const crearIntentoDePago = async (monto, idTransaccion, idUsuario) => {
    try {
        const amount = Math.round(monto * 100);

        return await stripe.paymentIntents.create({
            amount,
            currency: 'usd', 
            metadata: {
                id_transaccion_db: idTransaccion,
                id_usuario: idUsuario
            },
            payment_method_types: ['card'],
        });
    } catch (error) {
        console.error("Error en Stripe Service:", error.message);
        throw error;
    }
};

module.exports = { crearIntentoDePago };