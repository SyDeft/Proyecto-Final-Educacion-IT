const { getDB } = require("../config/db");

async function guardarPedido(pedido) {
  const db = getDB();

  const doc = {
    ...pedido,
    fecha: new Date().toISOString()
  };

  const result = await db.collection("pedidos").insertOne(doc);

  return {
    id: result.insertedId.toString(),
    ...pedido
  };
}

module.exports = { guardarPedido };
