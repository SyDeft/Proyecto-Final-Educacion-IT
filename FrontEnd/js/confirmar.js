import { obtenerCarritoLocal, vaciarCarritoLocal, guardarPedidoEnServer } from "./api.js";

export function inicializarConfirmar() {
  const cont = document.getElementById("resumen-items");
  const totalEl = document.getElementById("total-final");
  const form = document.querySelector(".form-confirmacion");
  if (!cont || !form) return;

  const carrito = obtenerCarritoLocal();
  if (!carrito.length) {
    cont.innerHTML = "<p style='text-align: center; padding: 2rem;'>No hay items en el carrito.</p>";
    totalEl.textContent = "";
    return;
  }

  let total = 0;
  cont.innerHTML = carrito.map(p => {
    total += (p.precio * p.cantidad);
    return `<div class="item-resumen" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #ddd;">
      <img src="${p.foto || 'https://via.placeholder.com/60x60/4a90e2/ffffff?text=No+Img'}" width="60"/>
      <div>
        <p><b>${p.nombre}</b></p>
        <p>Cantidad: ${p.cantidad}</p>
        <p>$${p.precio}</p>
      </div>
    </div>`;
  }).join("");
  totalEl.textContent = `Total: $${total.toFixed(2)}`;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const pedido = {
      cliente: fd.get("nombre"),
      direccion: fd.get("direccion"),
      telefono: fd.get("telefono"),
      pago: fd.get("pago"),
      items: carrito,
      total
    };

    try {
      await guardarPedidoEnServer(pedido);
      alert("Pedido confirmado");
      vaciarCarritoLocal();
      location.hash = "#/inicio";
    } catch (err) {
      console.error(err);
      alert("Error guardando pedido");
    }
  });
}
