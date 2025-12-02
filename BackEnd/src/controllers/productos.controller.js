const {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} = require("../models/productos.model");
const { ObjectId } = require("../config/db");

async function listarProductos(req, res) {
  try {
    const productos = await getAllProductos();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

async function obtenerProducto(req, res) {
  try {
    const { id } = req.params;

    try {
      new ObjectId(id);
    } catch {
      return res.status(400).json({ error: "ID inválido" });
    }

    const producto = await getProductoById(id);

    if (!producto) return res.status(404).json({ error: "No encontrado" });

    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
}

async function crearProductoCtrl(req, res) {
  try {
    const nuevo = await createProducto(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al crear producto" });
  }
}

async function actualizarProductoCtrl(req, res) {
  try {
    const { id } = req.params;
    const actualizado = await updateProducto(id, req.body);

    if (!actualizado) return res.status(404).json({ error: "No encontrado" });

    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar" });
  }
}

async function eliminarProductoCtrl(req, res) {
  try {
    const { id } = req.params;
    const borrado = await deleteProducto(id);

    if (!borrado) return res.status(404).json({ error: "No encontrado" });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar" });
  }
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProductoCtrl,
  actualizarProductoCtrl,
  eliminarProductoCtrl
};
