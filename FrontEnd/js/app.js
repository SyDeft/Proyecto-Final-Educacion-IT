const main = document.getElementById("contenido");

const rutas = {
  inicio: "vistas/inicio.html",
  alta: "vistas/alta.html",
  carrito: "vistas/carrito.html",
  contacto: "vistas/contacto.html",
  nosotros: "vistas/nosotros.html",
  confirmar: "vistas/confirmar.html"
};

async function cargar(nombre) {
  if (!main) return console.error("No existe #contenido en index.html");
  
  main.innerHTML = `
    <div style="text-align: center; padding: 3rem;">
      <div style="font-size: 1.2rem; color: #667eea; margin-bottom: 1rem;">🔄 Cargando...</div>
      <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; margin: 0 auto; animation: spin 1s linear infinite;"></div>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;
  
  const archivo = rutas[nombre] || rutas["inicio"];
  
  try {
    const res = await fetch(archivo);
    if (!res.ok) throw new Error("Archivo no encontrado: " + archivo);
    const html = await res.text();
    main.innerHTML = html;
    setTimeout(() => {
      switch(nombre) {
        case "inicio":
          import("./inicio.js")
            .then(m => m.inicializarInicio())
            .catch(err => console.error("Error cargando inicio.js:", err));
          import("./slider.js")
            .then(m => m.inicializarSlider())
            .catch(err => console.error("Error cargando slider.js:", err));
          break;
          
        case "alta":
          import("./alta.js")
            .then(m => m.inicializarAlta())
            .catch(err => console.error("Error cargando alta.js:", err));
          break;
          
        case "carrito":
          import("./carrito.js")
            .then(m => m.inicializarCarrito())
            .catch(err => console.error("Error cargando carrito.js:", err));
          break;
          
        case "contacto":
          import("./contacto.js")
            .then(m => m.inicializarContacto())
            .catch(err => console.error("Error cargando contacto.js:", err));
          break;
          
        case "confirmar":
          import("./confirmar.js")
            .then(m => m.inicializarConfirmar())
            .catch(err => console.error("Error cargando confirmar.js:", err));
          break;
          
        case "nosotros":
          break;
      }
    }, 100);
  } catch (err) {
    console.error(err);
    main.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <div style="font-size: 1.5rem; color: #e74c3c; margin-bottom: 1rem;">❌ Error cargando la página</div>
        <p style="color: #888; margin-bottom: 1.5rem;">${err.message}</p>
        <button onclick="location.reload()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
          🔄 Reintentar
        </button>
      </div>
    `;
  }
}

function router() {
  const hash = location.hash.replace("#/", "") || "inicio";
  cargar(hash);
}

document.addEventListener("DOMContentLoaded", function() {
  const navLinks = document.querySelectorAll(".nav-right a");
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const target = this.getAttribute("href").replace("#", "");
      location.hash = `#/${target}`;
    });
  });
  router();
});

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

window.addEventListener('error', function(e) {
  console.error('Error global:', e.error);
});
window.router = router;
window.cargar = cargar;