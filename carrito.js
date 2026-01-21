let carrito = [];

// Elementos del DOM
const listaHTML = document.querySelector('#lista-carrito');
const totalHTML = document.querySelector('#total-pago');
const contadorHTML = document.querySelector('#contador-productos');
const btnVaciar = document.querySelector('#btn-vaciar');
const botonesAgregar = document.querySelectorAll('.btn-agregar');

// Elementos del Modal
const modal = document.querySelector('#carrito-modal');
const btnAbrir = document.querySelector('#abrir-carrito');
const btnCerrar = document.querySelector('#cerrar-carrito');

// --- EVENTOS ---

// Abrir y cerrar modal
btnAbrir.onclick = () => modal.style.display = "block";
btnCerrar.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

// Botones de agregar
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
        const nombre = boton.getAttribute('data-nombre');
        const precio = parseFloat(boton.getAttribute('data-precio'));
        
        agregarAlCarrito(nombre, precio);
    });
});

// Botón vaciar
btnVaciar.onclick = () => {
    carrito = [];
    actualizarInterfaz();
};

// --- FUNCIONES ---

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarInterfaz();
}

function actualizarInterfaz() {
    // Limpiar lista
    listaHTML.innerHTML = '';
    let total = 0;

    // Crear elementos de la lista
    carrito.forEach((prod, index) => {
        const li = document.createElement('li');
        li.classList.add('item-carrito');
        li.innerHTML = `
            <span>${prod.nombre}</span>
            <span>$${prod.precio} 
                <button onclick="eliminarProducto(${index})" style="margin-left:10px; color:red; border:none; background:none; cursor:pointer;">X</button>
            </span>
        `;
        listaHTML.appendChild(li);
        total += prod.precio;
    });

    // Actualizar números
    totalHTML.innerText = total.toFixed(2);
    contadorHTML.innerText = carrito.length;
}

// Función global para los botones de eliminar internos
window.eliminarProducto = (index) => {
    carrito.splice(index, 1);
    actualizarInterfaz();
};