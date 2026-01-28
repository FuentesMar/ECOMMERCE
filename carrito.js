const productos = [
    { id: 1, nombre: "BLUE DE CHANNEL", precio: 89.99, imagen: "https://api-assets.wikiparfum.com/_resized/9u48sfzyx59kn712in1deikrsmm140lo1yr7ui6vs6jm0puyej68tognoxhp-w500-q85.jpg" },
    { id: 2, nombre: "VERSACE EROS FLAME", precio: 59.99, imagen: "https://ss701.liverpool.com.mx/xl/1082734275.jpg" },
    { id: 3, nombre: "CK ONE", precio: 79.99, imagen: "https://hips.hearstapps.com/hmg-prod/images/calvin-klein-ck-one-1655113747.jpg?crop=1.00xw:0.928xh;0,0.0392xh&resize=1200:*" },
    { id: 4, nombre: "VALENTINO BORN IN ROMA", precio: 69.99, imagen: "https://ss701.liverpool.com.mx/xl/1141945196.jpg" },
    { id: 5, nombre: "DIOR SAVAGE", precio: 99.99, imagen: "https://ss701.liverpool.com.mx/xl/1161020857.jpg" },
    { id: 6, nombre: "HUGO BOSS BOTTLED", precio: 54.99, imagen: "https://cdn11.bigcommerce.com/s-2vt02okold/images/stencil/1280x1280/products/3367/7005/HBOSB_3__93833.1731099892.jpg?c=1" },
    { id: 7, nombre: "INVICTUS", precio: 89.99, imagen: "https://lamarinamx.vtexassets.com/arquivos/ids/155584/3349668515660_1.jpg?v=637213913888670000" },
    { id: 8, nombre: "PACO RABANNE 1 MILLION", precio: 79.99, imagen: "https://ss701.liverpool.com.mx/xl/1158934121.jpg" }
];

let usuarioActual = null;

const productosGrid = document.getElementById('productos-grid');
const btnUsuario = document.getElementById('btn-usuario');
const btnCarrito = document.getElementById('btn-carrito');
const btnFavoritos = document.getElementById('btn-favoritos');
const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
const formularioLogin = document.getElementById('formulario-login');
const inputUsuario = document.getElementById('usuario');
const inputPassword = document.getElementById('password');
const loginModal = new bootstrap.Modal(document.getElementById('login-modal'));
const carritoModal = new bootstrap.Modal(document.getElementById('carrito-modal'));
const favoritosModal = new bootstrap.Modal(document.getElementById('favoritos-modal'));
const listaCarrito = document.getElementById('lista-carrito');
const listaFavoritos = document.getElementById('lista-favoritos');
const totalCarrito = document.getElementById('total-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const contadorFavoritos = document.getElementById('contador-favoritos');
const nombreUsuario = document.getElementById('nombre-usuario');

document.addEventListener('DOMContentLoaded', () => {
    cargarUsuario();
    renderizarProductos();
    actualizarContadores();
    
    btnUsuario.addEventListener('click', () => {
        if (usuarioActual) {
            cerrarSesion();
        } else {
            loginModal.show();
        }
    });

    btnCarrito.addEventListener('click', () => {
        if (!usuarioActual) {
            alert('Inicia sesión primero');
            loginModal.show();
            return;
        }
        actualizarListaCarrito();
        carritoModal.show();
    });

    btnFavoritos.addEventListener('click', () => {
        if (!usuarioActual) {
            alert('Inicia sesión primero');
            loginModal.show();
            return;
        }
        actualizarListaFavoritos();
        favoritosModal.show();
    });

    btnVaciarCarrito.addEventListener('click', vaciarCarrito);
    formularioLogin.addEventListener('submit', procesarLogin);
});

function procesarLogin(e) {
    e.preventDefault();
    const usuario = inputUsuario.value.trim();
    const password = inputPassword.value;
    
    if (!usuario || !password) {
        alert('Completa todos los campos');
        return;
    }
    
    usuarioActual = { usuario: usuario };
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    loginModal.hide();
    formularioLogin.reset();
    actualizarUI();
    alert(`¡Bienvenido ${usuario}!`);
}

function cargarUsuario() {
    const datos = localStorage.getItem('usuarioActual');
    if (datos) {
        usuarioActual = JSON.parse(datos);
        actualizarUI();
    }
}

function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('usuarioActual');
    nombreUsuario.textContent = 'Ingresa';
    btnUsuario.innerHTML = `<i class="fas fa-user"></i> Ingresa`;
    actualizarContadores();
}

function validarSesion() {
    if (!usuarioActual) {
        alert('Por favor, inicia sesión primero');
        loginModal.show();
        return false;
    }
    return true;
}

function renderizarProductos() {
    productosGrid.innerHTML = productos.map(prod => `
        <article class="col-md-6 col-lg-3">
            <div class="card h-100">
                <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${prod.nombre}</h5>
                    <p class="card-text fw-bold text-success">$${prod.precio.toFixed(2)}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-dark btn-sm w-100 mb-2" onclick="agregarAlCarrito(${prod.id})">
                        <i class="fas fa-shopping-cart"></i> Agregar
                    </button>
                    <button class="btn btn-outline-danger btn-sm w-100" onclick="alternarFavorito(${prod.id})">
                        <i class="fas fa-heart" id="corazon-${prod.id}"></i> Favorito
                    </button>
                </div>
            </div>
        </article>
    `).join('');
    
    actualizarIconosFavoritos();
}

// ===== CARRITO =====
function agregarAlCarrito(productoId) {
    if (!usuarioActual) {
        alert('Inicia sesión primero');
        loginModal.show();
        return;
    }
    
    const producto = productos.find(p => p.id === productoId);
    const carrito = obtenerCarrito();
    carrito.push(producto);
    guardarCarrito(carrito);
    actualizarContadores();
    alert(`${producto.nombre} agregado`);
}

function obtenerCarrito() {
    if (!usuarioActual) return [];
    const clave = `carrito_${usuarioActual.usuario}`;
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
    if (usuarioActual) {
        const clave = `carrito_${usuarioActual.usuario}`;
        localStorage.setItem(clave, JSON.stringify(carrito));
    }
}

function actualizarListaCarrito() {
    const carrito = obtenerCarrito();
    listaCarrito.innerHTML = '';
    let total = 0;
    
    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<li class="list-group-item text-center">El carrito está vacío</li>';
        totalCarrito.textContent = '0.00';
        return;
    }
    
    carrito.forEach((item, index) => {
        total += item.precio;
        listaCarrito.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${item.nombre}</strong>
                    <br>
                    <small>$${item.precio.toFixed(2)}</small>
                </div>
                <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `;
    });
    
    totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    const carrito = obtenerCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    actualizarListaCarrito();
    actualizarContadores();
}

function vaciarCarrito() {
    if (confirm('¿Vaciar carrito?')) {
        guardarCarrito([]);
        actualizarListaCarrito();
        actualizarContadores();
    }
}

// ===== FAVORITOS =====
function alternarFavorito(productoId) {
    if (!usuarioActual) {
        alert('Inicia sesión primero');
        loginModal.show();
        return;
    }
    
    const favoritos = obtenerFavoritos();
    const index = favoritos.findIndex(f => f.id === productoId);
    
    if (index > -1) {
        favoritos.splice(index, 1);
    } else {
        const producto = productos.find(p => p.id === productoId);
        favoritos.push(producto);
    }
    
    guardarFavoritos(favoritos);
    actualizarIconosFavoritos();
    actualizarContadores();
}

function obtenerFavoritos() {
    if (!usuarioActual) return [];
    const clave = `favoritos_${usuarioActual.usuario}`;
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
}

function guardarFavoritos(favoritos) {
    if (usuarioActual) {
        const clave = `favoritos_${usuarioActual.usuario}`;
        localStorage.setItem(clave, JSON.stringify(favoritos));
    }
}

function actualizarIconosFavoritos() {
    const favoritos = obtenerFavoritos();
    const idsFavoritos = favoritos.map(f => f.id);
    
    productos.forEach(prod => {
        const icono = document.getElementById(`corazon-${prod.id}`);
        if (icono) {
            icono.style.color = idsFavoritos.includes(prod.id) ? 'red' : 'inherit';
        }
    });
}

function actualizarListaFavoritos() {
    const favoritos = obtenerFavoritos();
    listaFavoritos.innerHTML = '';
    
    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = '<li class="list-group-item text-center">Sin favoritos</li>';
        return;
    }
    
    favoritos.forEach((item, index) => {
        listaFavoritos.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${item.nombre}</strong>
                    <br>
                    <small>$${item.precio.toFixed(2)}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-success me-2" onclick="agregarFavoritoAlCarrito(${index})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarDelFavorito(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    });
}

function agregarFavoritoAlCarrito(index) {
    const favoritos = obtenerFavoritos();
    const producto = favoritos[index];
    const carrito = obtenerCarrito();
    carrito.push(producto);
    guardarCarrito(carrito);
    actualizarContadores();
    alert(`${producto.nombre} agregado al carrito`);
}

function eliminarDelFavorito(index) {
    const favoritos = obtenerFavoritos();
    favoritos.splice(index, 1);
    guardarFavoritos(favoritos);
    actualizarListaFavoritos();
    actualizarIconosFavoritos();
    actualizarContadores();
}

// ===== UTILIDADES =====
function actualizarContadores() {
    const carrito = obtenerCarrito();
    const favoritos = obtenerFavoritos();
    contadorCarrito.textContent = carrito.length;
    contadorFavoritos.textContent = favoritos.length;
}

function actualizarUI() {
    if (usuarioActual) {
        nombreUsuario.textContent = usuarioActual.usuario;
        btnUsuario.innerHTML = `<i class="fas fa-sign-out-alt"></i> Salir`;
    }
}