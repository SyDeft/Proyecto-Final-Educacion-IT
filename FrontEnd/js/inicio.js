import { obtenerProductos, agregarItemCarrito } from "./api.js";

export async function inicializarInicio() {
  const cont = document.querySelector(".section-cards");
  if (!cont) return;

  cont.innerHTML = `
    <div style="text-align: center; width: 100%; padding: 3rem;">
      <div style="font-size: 1.2rem; color: #667eea; margin-bottom: 1rem;">🔄 Cargando productos...</div>
      <div style="width: 50px; height: 50px; border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; margin: 0 auto; animation: spin 1s linear infinite;"></div>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;

  try {
    const productos = await obtenerProductos();

    if (!productos || !productos.length) {
      cont.innerHTML = `
        <div style="text-align: center; width: 100%; padding: 3rem;">
          <div style="font-size: 1.5rem; color: #666; margin-bottom: 1rem;">Aún no tenemos stock de nuestros productos :(</div>
          <p style="color: #888;">Los productos se cargan desde la sección "Alta"</p>
        </div>
      `;
      return;
    }

    cont.innerHTML = productos.map(p => {
      const imagenSrc = p.foto && p.foto.startsWith('data:image') ? p.foto :
        p.foto && p.foto.startsWith('http') ? p.foto :
          'https://via.placeholder.com/400x300/667eea/ffffff?text=Pet+Shop';
      return `
        <section class="section-cards-individual" data-id="${p.id}">
          <img src="${imagenSrc}" 
               alt="${p.nombre}"
               loading="lazy"
               onerror="this.src='https://via.placeholder.com/400x300/667eea/ffffff?text=Error+Imagen'">
          <h3>${p.nombre}</h3>
          <h4>$${p.precio}</h4>
          <p>${p.descripcion || "Producto de calidad para tu mascota"}</p>
          <button class="add-to-cart" data-id="${p.id}">
            Agregar al Carrito
          </button>
        </section>
      `;
    }).join("");

    cont.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart");
      if (!btn) return;

      const id = btn.dataset.id;
      const producto = productos.find(x => x.id == id);
      if (!producto) {
        alert("Producto no encontrado");
        return;
      }

      agregarItemCarrito(producto);
      const originalHTML = btn.innerHTML;
      btn.innerHTML = 'Añadido al Carrito';
      btn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 2000);
    });

  } catch (err) {
    console.error("Error cargando productos:", err);
    cont.innerHTML = `
      <div style="text-align: center; width: 100%; padding: 3rem;">
        <div style="font-size: 1.5rem; color: #e74c3c; margin-bottom: 1rem;">Error al cargar productos</div>
        <p style="color: #888;">Verifica tu conexión a internet</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Reintentar
        </button>
      </div>
    `;
  }
}