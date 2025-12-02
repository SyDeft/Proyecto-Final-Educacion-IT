const API_BASE = "/api";
const PROD_ENDPOINT = `${API_BASE}/productos`;
const PEDIDOS_ENDPOINT = `${API_BASE}/carrito`;
const LS_CARRITO = "mi_carrito_v2";

export async function obtenerProductos() {
  try {
    const r = await fetch(PROD_ENDPOINT);
    if (!r.ok) throw new Error("No se pudieron obtener productos");
    return await r.json();
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return [];
  }
}

export async function crearProducto(producto) {
  try {
    let fotoParaEnviar = producto.foto;
    
    if (producto.foto && producto.foto.startsWith('data:image')) {
      if (producto.foto.length > 300000) {
        console.warn('Imagen demasiado grande después de compresión, usando placeholder');
        fotoParaEnviar = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Pet+Shop';
      }
    }
    
    const productoParaEnviar = {
      ...producto,
      foto: fotoParaEnviar,
      precio: Number(producto.precio) || 0,
      stock: Number(producto.stock) || 0,
      edadDesde: Number(producto.edadDesde) || 0,
      edadHasta: Number(producto.edadHasta) || 0
    };

    console.log('Enviando producto (tamaño foto):', productoParaEnviar.foto?.length || 0, 'bytes');

    const r = await fetch(PROD_ENDPOINT, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(productoParaEnviar)
    });
    
    if (!r.ok) {
      const errorText = await r.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${r.status}: ${r.statusText}`);
    }
    
    return await r.json();
  } catch (error) {
    console.error("Error en crearProducto:", error);
    throw new Error(`Error al crear producto: ${error.message}`);
  }
}

export async function actualizarProducto(id, datos) {
  try {
    const r = await fetch(`${PROD_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(datos)
    });
    
    if (!r.ok) {
      const errorText = await r.text();
      throw new Error(`Error ${r.status}: ${errorText}`);
    }
    
    return await r.json();
  } catch (error) {
    console.error("Error en actualizarProducto:", error);
    throw new Error(`Error al actualizar producto: ${error.message}`);
  }
}

export async function eliminarProducto(id) {
  try {
    const r = await fetch(`${PROD_ENDPOINT}/${id}`, { 
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!r.ok) {
      const errorText = await r.text();
      throw new Error(`Error ${r.status}: ${errorText}`);
    }
    
    return await r.json();
  } catch (error) {
    console.error("Error en eliminarProducto:", error);
    throw new Error(`Error al eliminar producto: ${error.message}`);
  }
}

export async function guardarPedidoEnServer(pedido) {
  try {
    const r = await fetch(PEDIDOS_ENDPOINT, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(pedido)
    });
    
    if (!r.ok) {
      const errorText = await r.text();
      throw new Error(`Error ${r.status}: ${errorText}`);
    }
    
    return await r.json();
  } catch (error) {
    console.error("Error en guardarPedidoEnServer:", error);
    throw new Error(`Error al guardar pedido: ${error.message}`);
  }
}

export function obtenerCarritoLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_CARRITO)) || [];
  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    return [];
  }
}

export function guardarCarritoLocal(carrito) {
  try {
    localStorage.setItem(LS_CARRITO, JSON.stringify(carrito));
  } catch (error) {
    console.error("Error guardando carrito:", error);
  }
}

export function agregarItemCarrito(producto) {
  try {
    const carrito = obtenerCarritoLocal();
    const existe = carrito.find(p => p.id === producto.id);
    
    if (existe) {
      existe.cantidad = (existe.cantidad || 1) + 1;
    } else {
      const productoCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        foto: producto.foto,
        cantidad: 1
      };
      carrito.push(productoCarrito);
    }
    
    guardarCarritoLocal(carrito);
    return true;
  } catch (error) {
    console.error("Error agregando item al carrito:", error);
    return false;
  }
}

export function eliminarItemCarrito(id) {
  try {
    const carrito = obtenerCarritoLocal().filter(p => p.id !== id);
    guardarCarritoLocal(carrito);
    return true;
  } catch (error) {
    console.error("Error eliminando item del carrito:", error);
    return false;
  }
}

export function actualizarCantidadCarrito(id, cantidad) {
  try {
    const carrito = obtenerCarritoLocal();
    const nuevoCarrito = carrito.map(p => 
      p.id === id ? { ...p, cantidad: parseInt(cantidad) || 1 } : p
    );
    guardarCarritoLocal(nuevoCarrito);
    return true;
  } catch (error) {
    console.error("Error actualizando cantidad:", error);
    return false;
  }
}

export function vaciarCarritoLocal() {
  try {
    localStorage.removeItem(LS_CARRITO);
    return true;
  } catch (error) {
    console.error("Error vaciando carrito:", error);
    return false;
  }
}