export function inicializarContacto() {
  const form = document.querySelector(".formulario-contacto");
  
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const comentarios = form.comentarios.value.trim();
    
    if (!nombre || !email || !comentarios) {
      alert("Por favor completa todos los campos");
      return;
    }
    
    if (!email.includes("@") || !email.includes(".")) {
      alert("Por favor ingresa un email válido");
      return;
    }
    
    alert("Mensaje enviado correctamente.");
    form.reset();
  });
}