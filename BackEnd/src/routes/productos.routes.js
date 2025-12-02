const express = require("express");
const router = express.Router();

const {
  listarProductos,
  obtenerProducto,
  crearProductoCtrl,
  actualizarProductoCtrl,
  eliminarProductoCtrl
} = require("../controllers/productos.controller");

router.get("/", listarProductos);
router.get("/:id", obtenerProducto);
router.post("/", crearProductoCtrl);
router.put("/:id", actualizarProductoCtrl);
router.delete("/:id", eliminarProductoCtrl);

module.exports = router;
