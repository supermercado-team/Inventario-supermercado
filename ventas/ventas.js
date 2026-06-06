const formularioVenta = document.getElementById("formVenta");
const tablaVentas = document.getElementById("tablaVentas");
const totalVentas = document.getElementById("totalVentas");

let ventas = [];
let totalGeneral = 0;

formularioVenta.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const producto = document.getElementById("producto").value;
    const cantidad = Number(document.getElementById("cantidad").value);
    const precio = Number(document.getElementById("precio").value);
    const metodoPago = document.getElementById("metodoPago").value;

    const subtotal = cantidad * precio;

    const venta = {
        producto,
        cantidad,
        precio,
        subtotal,
        metodoPago
    };

    ventas.push(venta);
    totalGeneral += subtotal;

    mostrarVentas();
    formularioVenta.reset();
});

function mostrarVentas() {
    tablaVentas.innerHTML = "";

    ventas.forEach((venta) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>$${venta.precio}</td>
            <td>$${venta.subtotal}</td>
            <td>${venta.metodoPago}</td>
        `;

        tablaVentas.appendChild(fila);
    });

    totalVentas.textContent = totalGeneral;
}