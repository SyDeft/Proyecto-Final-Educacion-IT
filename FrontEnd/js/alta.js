import { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } from "./api.js";

let formularioEnProceso = false;

export function inicializarAlta() {
  const form = document.querySelector(".formulario-alta-producto");
  const tbody = document.getElementById("tabla-productos-body");

  if (!form) {
    console.error("No se encontró el formulario de alta");
    return;
  }

  configurarPreviewImagen();
  cargarProductosEnTabla();

  form.addEventListener("submit", manejarSubmit, false);

  form.addEventListener("blur", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") {
      validarCampo(e.target);
    }
  }, true);

  if (tbody) {
    tbody.addEventListener("click", manejarAccionesTabla);
  }
}

async function manejarSubmit(e) {
  e.preventDefault();
  
  if (formularioEnProceso) {
    console.log('Formulario ya en proceso, ignorando...');
    return;
  }
  
  formularioEnProceso = true;
  
  const form = e.target;
  const submitBtn = form.querySelector('.boton-enviar');
  const originalText = submitBtn.textContent;
  
  try {
    submitBtn.textContent = 'Guardando...';
    submitBtn.disabled = true;
    
    if (!validarFormulario()) {
      throw new Error("Por favor corrige los errores del formulario");
    }

    const producto = await obtenerDatosFormulario();
    console.log("Producto a crear:", producto);
    
    const resultado = await crearProducto(producto);
    console.log("Producto creado:", resultado);
    
    alert("Producto creado exitosamente");
    form.reset();
    ocultarPreview();
    await cargarProductosEnTabla();
    
  } catch (error) {
    console.error("Error creando producto:", error);
    alert(`Error al crear producto: ${error.message}`);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    formularioEnProceso = false;
  }
}

function configurarPreviewImagen() {
  const inputFoto = document.querySelector('input[name="foto"]');
  const previewContainer = document.getElementById('preview-container');
  const imagePreview = document.getElementById('image-preview');

  if (inputFoto && previewContainer && imagePreview) {
    inputFoto.addEventListener('change', async function(e) {
      const file = e.target.files[0];
      
      if (file) {
        if (!file.type.startsWith('image/')) {
          mostrarError(this, 'Por favor selecciona un archivo de imagen válido');
          this.value = '';
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          mostrarError(this, 'La imagen es demasiado grande. Máximo 2MB permitido.');
          this.value = '';
          return;
        }

        limpiarError(this);

        try {
          const imagenComprimida = await comprimirImagen(file, 500000);
          imagePreview.src = imagenComprimida;
          previewContainer.style.display = 'block';
        } catch (error) {
          console.error('Error procesando imagen:', error);
          mostrarError(this, 'Error al procesar la imagen');
          previewContainer.style.display = 'none';
        }
      } else {
        previewContainer.style.display = 'none';
      }
    });
  }
}
// COMPRIMIR IMAGEN Y QUE NO ME DE ERROR EL MOCKAPI
function comprimirImagen(file, maxSizeBytes) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    reader.onload = function(e) {
      img.onload = function() {
        let width = img.width;
        let height = img.height;
        const maxDimension = 800;

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        let calidad = 0.8;
        let base64 = canvas.toDataURL('image/jpeg', calidad);

        while (base64.length > maxSizeBytes && calidad > 0.3) {
          calidad -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', calidad);
        }

        if (base64.length > maxSizeBytes) {
          console.warn('Imagen demasiado grande después de compresión, usando placeholder');
          resolve('https://via.placeholder.com/400x300/667eea/ffffff?text=Pet+Shop');
        } else {
          resolve(base64);
        }
      };

      img.onerror = function() {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = e.target.result;
    };

    reader.onerror = function() {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsDataURL(file);
  });
}

function ocultarPreview() {
  const previewContainer = document.getElementById('preview-container');
  if (previewContainer) {
    previewContainer.style.display = 'none';
  }
}

async function obtenerDatosFormulario() {
  const form = document.querySelector(".formulario-alta-producto");
  const fd = new FormData(form);
  const inputFoto = document.querySelector('input[name="foto"]');
  
  let fotoBase64 = "https://via.placeholder.com/400x300/667eea/ffffff?text=Pet+Shop";
  
  if (inputFoto.files && inputFoto.files[0]) {
    try {
      fotoBase64 = await comprimirImagen(inputFoto.files[0], 300000);
      console.log('Tamaño de imagen comprimida:', fotoBase64.length, 'bytes');
    } catch (error) {
      console.warn("Error procesando imagen, usando placeholder:", error);
    }
  }
  
  return {
    nombre: fd.get("nombre")?.trim() || "",
    precio: parseFloat(fd.get("precio")) || 0,
    stock: parseInt(fd.get("stock")) || 0,
    marca: fd.get("marca")?.trim() || "",
    categoria: fd.get("categoria") || "",
    descripcion: fd.get("descripcion")?.trim() || "",
    descripcionLarga: fd.get("descripcionLarga")?.trim() || "",
    envioGratis: fd.get("envioGratis") === "si",
    edadDesde: parseInt(fd.get("edadDesde")) || 0,
    edadHasta: parseInt(fd.get("edadHasta")) || 0,
    foto: fotoBase64,
    fechaAlta: new Date().toISOString()
  };
}

function validarFormulario() {
  const campos = document.querySelectorAll(".formulario-alta-producto [name]");
  let valido = true;

  campos.forEach(campo => {
    if (!validarCampo(campo)) {
      valido = false;
    }
  });
  const inputFoto = document.querySelector('input[name="foto"]');
  if (inputFoto && !inputFoto.files.length) {
    mostrarError(inputFoto, "Debes seleccionar una imagen");
    valido = false;
  }

  return valido;
}

function validarCampo(campo) {
  const valor = campo.value.trim();
  const nombre = campo.name;
  let esValido = true;
  let mensaje = "";

  limpiarError(campo);
  switch (nombre) {
    case "nombre":
      if (!valor) {
        mensaje = "El nombre es obligatorio";
        esValido = false;
      } else if (valor.length < 2) {
        mensaje = "El nombre debe tener al menos 2 caracteres";
        esValido = false;
      }
      break;

    case "precio":
      if (!valor || parseFloat(valor) <= 0) {
        mensaje = "El precio debe ser mayor a 0";
        esValido = false;
      }
      break;

    case "stock":
      if (!valor || parseInt(valor) < 0) {
        mensaje = "El stock no puede ser negativo";
        esValido = false;
      }
      break;

    case "marca":
      if (!valor) {
        mensaje = "La marca es obligatoria";
        esValido = false;
      }
      break;

    case "categoria":
      if (!valor) {
        mensaje = "La categoría es obligatoria";
        esValido = false;
      }
      break;

    case "descripcion":
      if (!valor) {
        mensaje = "La descripción corta es obligatoria";
        esValido = false;
      }
      break;
  }

  if (!esValido) {
    mostrarError(campo, mensaje);
  }

  return esValido;
}

function mostrarError(campo, mensaje) {
  campo.style.borderColor = "#e74c3c";
  
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-msg";
  errorDiv.textContent = mensaje;
  errorDiv.style.color = "#e74c3c";
  errorDiv.style.fontSize = "0.8rem";
  errorDiv.style.marginTop = "5px";
  
  campo.parentNode.appendChild(errorDiv);
}

function limpiarError(campo) {
  campo.style.borderColor = "#ddd";
  
  const errorExistente = campo.parentNode.querySelector(".error-msg");
  if (errorExistente) {
    errorExistente.remove();
  }
}

async function cargarProductosEnTabla() {
  const tbody = document.getElementById("tabla-productos-body");
  if (!tbody) return;

  try {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem;">Cargando productos...</td></tr>`;
    
    const productos = await obtenerProductos();
    
    if (!productos.length) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem;">No hay productos registrados</td></tr>`;
      return;
    }

    tbody.innerHTML = productos.map(producto => `
      <tr data-id="${producto.id}">
        <td>
          <img src="${producto.foto || 'https://via.placeholder.com/60x60/4a90e2/ffffff?text=No+Img'}" 
               width="60" height="60" style="object-fit: cover; border-radius: 4px;"
               onerror="this.src='https://via.placeholder.com/60x60/4a90e2/ffffff?text=Error'">
        </td>
        <td>${producto.nombre}</td>
        <td>$${producto.precio}</td>
        <td>
          <button class="btn-stock" data-op="decrementar">-</button>
          <span class="stock-value">${producto.stock}</span>
          <button class="btn-stock" data-op="incrementar">+</button>
        </td>
        <td>${producto.marca}</td>
        <td>${producto.categoria}</td>
        <td title="${producto.descripcion}">${(producto.descripcion || '').substring(0, 30)}...</td>
        <td>${producto.envioGratis ? 'Sí' : 'No'}</td>
        <td>
          <button class="btn-guardar" style="display:none;">Guardar</button>
          <button class="btn-eliminar">Borrar</button>
        </td>
      </tr>
    `).join("");
  } catch (error) {
    console.error("Error cargando productos:", error);
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #e74c3c;">Error al cargar productos: ${error.message}</td></tr>`;
  }
}

async function manejarAccionesTabla(e) {
  const target = e.target;
  const fila = target.closest("tr");
  const id = fila?.dataset.id;

  if (!id) return;

  if (target.classList.contains("btn-eliminar")) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await eliminarProducto(id);
        await cargarProductosEnTabla();
        alert("Producto eliminado");
      } catch (error) {
        console.error("Error eliminando producto:", error);
        alert(`rror al eliminar producto: ${error.message}`);
      }
    }
  }

  if (target.classList.contains("btn-stock")) {
    const operacion = target.dataset.op;
    const spanStock = fila.querySelector(".stock-value");
    const btnGuardar = fila.querySelector(".btn-guardar");
    let stock = parseInt(spanStock.textContent) || 0;

    if (operacion === "incrementar") {
      stock++;
    } else if (operacion === "decrementar" && stock > 0) {
      stock--;
    }

    spanStock.textContent = stock;
    btnGuardar.style.display = "inline-block";
  }

  if (target.classList.contains("btn-guardar")) {
    const nuevoStock = parseInt(fila.querySelector(".stock-value").textContent) || 0;
    
    try {
      await actualizarProducto(id, { stock: nuevoStock });
      target.style.display = "none";
      alert("Stock actualizado");
    } catch (error) {
      console.error("Error actualizando stock:", error);
      alert(` al actualizar stock: ${error.message}`);
    }
  }
}