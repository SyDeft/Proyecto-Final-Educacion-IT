const { guardarPedido } = require("../models/carrito.model");

async function crearPedido(req, res) {
  try {
    const pedido = req.body;

    console.log("Pedido recibido desde el frontend:");
    console.log(JSON.stringify(pedido, null, 2));

    const guardado = await guardarPedido(pedido);

    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error guardando pedido:", error);
    res.status(500).json({ error: "Error al guardar pedido" });
  }
}

module.exports = { crearPedido };
