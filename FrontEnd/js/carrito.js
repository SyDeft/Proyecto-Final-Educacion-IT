import { obtenerCarritoLocal, guardarCarritoLocal, eliminarItemCarrito, actualizarCantidadCarrito, vaciarCarritoLocal } from "./api.js";
function htmlTablaCarrito(carrito) {
  if (!carrito.length) return `<p style="text-align: center; padding: 2rem;">El carrito está vacío.</p>`;

  const filas = carrito.map(p => `
    <tr data-id="${p.id}">
      <td><img src="${p.foto || 'https://via.placeholder.com/60x60/4a90e2/ffffff?text=No+Img'}" width="60"></td>
      <td>${p.nombre}</td>
      <td>$${p.precio}</td>
      <td>
        <button class="cant-btn" data-op="dec" data-id="${p.id}">-</button>
        <input class="cant-input" data-id="${p.id}" value="${p.cantidad}" size="2">
        <button class="cant-btn" data-op="inc" data-id="${p.id}">+</button>
      </td>
      <td>$${(p.precio * p.cantidad).toFixed(2)}</td>
      <td><button class="btn-eliminar" data-id="${p.id}">Eliminar</button></td>
    </tr>`).join("");

  const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

  return `
    <table class="tabla-productos">
      <thead><tr><th>Foto</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
    <div style="text-align: right; padding: 1rem; font-size: 1.2rem; font-weight: bold;">
      Total: $${total.toFixed(2)}
    </div>
    <div class="carrito-actions" style="display: flex; gap: 1rem; justify-content: flex-end; padding: 1rem;">
      <button id="vaciar-carrito" style="background: #666; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Vaciar carrito</button>
      <button id="confirmar-compra" style="background: #4a90e2; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Confirmar compra</button>
    </div>
  `;
}

export function inicializarCarrito() {
  const contenedor = document.getElementById("carrito-contenedor");
  if (!contenedor) return;

  function render() {
    const carrito = obtenerCarritoLocal();
    contenedor.innerHTML = htmlTablaCarrito(carrito);
  }
  contenedor.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) {
      if (e.target.id === "vaciar-carrito") {
        if (!confirm("Vaciar carrito?")) return;
        vaciarCarritoLocal();
        render();
        return;
      }
      if (e.target.id === "confirmar-compra") {
        location.hash = "#/confirmar";
        return;
      }
      return;
    }

    if (e.target.classList.contains("btn-eliminar")) {
      eliminarItemCarrito(id);
      render();
      return;
    }

    if (e.target.classList.contains("cant-btn")) {
      const op = e.target.dataset.op;
      const carrito = obtenerCarritoLocal();
      const item = carrito.find(p => p.id === id);
      if (!item) return;
      if (op === "inc") item.cantidad++;
      else if (op === "dec" && item.cantidad > 1) item.cantidad--;
      guardarCarritoLocal(carrito);
      render();
      return;
    }
  });

  contenedor.addEventListener("change", (e) => {
    if (e.target.classList.contains("cant-input")) {
      const id = e.target.dataset.id;
      let qty = parseInt(e.target.value) || 1;
      if (qty < 1) qty = 1;
      actualizarCantidadCarrito(id, qty);
      render();
    }
  });

  render();
}