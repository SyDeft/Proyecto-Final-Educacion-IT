const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
require("dotenv").config();

const productosRoutes = require("./routes/productos.routes");
const carritoRoutes = require("./routes/carrito.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../FrontEnd")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../FrontEnd/index.html"));
});

app.use("/api/productos", productosRoutes);
app.use("/api/carrito", carritoRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
});