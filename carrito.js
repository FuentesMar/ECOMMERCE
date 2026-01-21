let carrito = [];
const listaHTML = document.querySelector('#lista-carrito');
const totalHTML = document.querySelector('#total-pago');
const btnVaciar = document.querySelector('#btn-vaciar');
const botones = document.querySelectorAll('.btn-agregar');

botones.forEach(boton => {
    boton.addEventListener('click', () => {
        const nombre = boton.getAttribute('data-nombre');
        const precio = parseFloat(boton.getAttribute('data-precio'));
        carrito.push({ nombre, precio });
        renderizarCarrito();
    });
});

function renderizarCarrito() {
    listaHTML.innerHTML = '';
    let total = 0;
    carrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.padding = '10px 0';
        li.style.borderBottom = '1px solid #eee';
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio}
            <button onclick="eliminarProducto(${index})" style="color: red; border: none; background: none; cursor: pointer;">Eliminar</button>
        `;
        listaHTML.appendChild(li);
        total += producto.precio;
    });
    totalHTML.innerText = total.toFixed(2);
}

window.eliminarProducto = (index) => {
    carrito.splice(index, 1);
    renderizarCarrito();
};

btnVaciar.addEventListener('click', () => {
    carrito = [];
    renderizarCarrito();
});