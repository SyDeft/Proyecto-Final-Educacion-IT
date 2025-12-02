const { getDB, ObjectId } = require("../config/db");

function mapDocumento(doc) {
  return {
    id: doc._id.toString(),
    nombre: doc.nombre,
    precio: doc.precio,
    stock: doc.stock,
    marca: doc.marca,
    categoria: doc.categoria,
    descripcion: doc.descripcion,
    descripcionLarga: doc.descripcionLarga,
    envioGratis: doc.envioGratis,
    edadDesde: doc.edadDesde,
    edadHasta: doc.edadHasta,
    foto: doc.foto,
    fechaAlta: doc.fechaAlta
  };
}

async function getAllProductos() {
  const db = getDB();
  const docs = await db.collection("productos").find().toArray();
  return docs.map(mapDocumento);
}

async function getProductoById(id) {
  const db = getDB();
  const doc = await db.collection("productos").findOne({ _id: new ObjectId(id) });
  return doc ? mapDocumento(doc) : null;
}

async function createProducto(data) {
  const db = getDB();

  const producto = {
    nombre: data.nombre,
    precio: Number(data.precio),
    stock: Number(data.stock),
    marca: data.marca || "",
    categoria: data.categoria || "",
    descripcion: data.descripcion || "",
    descripcionLarga: data.descripcionLarga || "",
    envioGratis: !!data.envioGratis,
    edadDesde: Number(data.edadDesde) || 0,
    edadHasta: Number(data.edadHasta) || 0,
    foto: data.foto || "",
    fechaAlta: data.fechaAlta || new Date().toISOString()
  };

  const result = await db.collection("productos").insertOne(producto);
  return { id: result.insertedId.toString(), ...producto };
}

async function updateProducto(id, data) {
  const db = getDB();
  const result = await db.collection("productos").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: data },
    { returnDocument: "after" }
  );

  return result.value ? mapDocumento(result.value) : null;
}

async function deleteProducto(id) {
  const db = getDB();
  const result = await db.collection("productos").deleteOne({
    _id: new ObjectId(id)
  });

  return result.deletedCount === 1;
}

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
