const formulario = document.getElementById("formProducto");
const tablaProductos = document.getElementById("tablaProductos");
const busqueda = document.getElementById("busqueda");

let productos = [];

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const producto = {
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        categoria: document.getElementById("categoria").value,
        proveedor: document.getElementById("proveedor").value,
        precio: document.getElementById("precio").value,
        stock: document.getElementById("stock").value
    };

    productos.push(producto);
    mostrarProductos(productos);
    formulario.reset();
});

function mostrarProductos(lista) {
    tablaProductos.innerHTML = "";

    lista.forEach((producto, indice) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>${producto.proveedor}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarProducto(${indice})">
                    Eliminar
                </button>
            </td>
        `;

        tablaProductos.appendChild(fila);
    });
}

function eliminarProducto(indice) {
    productos.splice(indice, 1);
    mostrarProductos(productos);
}

busqueda.addEventListener("input", function() {
    const texto = busqueda.value.toLowerCase();

    const filtrados = productos.filter(producto =>
        producto.codigo.toLowerCase().includes(texto) ||
        producto.nombre.toLowerCase().includes(texto)
    );

    mostrarProductos(filtrados);
});