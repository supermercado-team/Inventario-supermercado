const formCategoria = document.getElementById("formCategoria");
const tablaCategorias = document.getElementById("tablaCategorias");

let categorias = [];

formCategoria.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const categoria = {
        nombre: document.getElementById("nombreCategoria").value,
        descripcion: document.getElementById("descripcionCategoria").value
    };

    categorias.push(categoria);
    mostrarCategorias();
    formCategoria.reset();
});

function mostrarCategorias() {
    tablaCategorias.innerHTML = "";

    categorias.forEach((categoria, indice) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${categoria.nombre}</td>
            <td>${categoria.descripcion}</td>
            <td>
                <button onclick="editarCategoria(${indice})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarCategoria(${indice})">Eliminar</button>
            </td>
        `;

        tablaCategorias.appendChild(fila);
    });
}

function eliminarCategoria(indice) {
    categorias.splice(indice, 1);
    mostrarCategorias();
}

function editarCategoria(indice) {
    const nuevaDescripcion = prompt("Nueva descripción:", categorias[indice].descripcion);

    if (nuevaDescripcion !== null) {
        categorias[indice].descripcion = nuevaDescripcion;
        mostrarCategorias();
    }
}