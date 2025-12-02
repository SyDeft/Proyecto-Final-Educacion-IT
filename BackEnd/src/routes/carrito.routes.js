const express = require("express");
const router = express.Router();
const { crearPedido } = require("../controllers/carrito.controller");

router.post("/", crearPedido);

module.exports = router;
