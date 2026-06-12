const ventas = [
    {
        producto: "Arroz Diana",
        cantidad: 5,
        total: 25000,
        fecha: "2026-06-06"
    },
    {
        producto: "Aceite Premier",
        cantidad: 3,
        total: 42000,
        fecha: "2026-06-06"
    },
    {
        producto: "Arroz Diana",
        cantidad: 2,
        total: 10000,
        fecha: "2026-06-06"
    }
];

const tablaReportes = document.getElementById("tablaReportes");
const ventasDia = document.getElementById("ventasDia");
const totalVendido = document.getElementById("totalVendido");
const productoMasVendido = document.getElementById("productoMasVendido");

let total = 0;
let productosVendidos = {};

ventas.forEach(venta => {
    total += venta.total;

    if (productosVendidos[venta.producto]) {
        productosVendidos[venta.producto] += venta.cantidad;
    } else {
        productosVendidos[venta.producto] = venta.cantidad;
    }

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${venta.producto}</td>
        <td>${venta.cantidad}</td>
        <td>$${venta.total}</td>
        <td>${venta.fecha}</td>
    `;

    tablaReportes.appendChild(fila);
});

ventasDia.textContent = ventas.length;
totalVendido.textContent = total;

let productoTop = "";
let mayorCantidad = 0;

for (let producto in productosVendidos) {
    if (productosVendidos[producto] > mayorCantidad) {
        mayorCantidad = productosVendidos[producto];
        productoTop = producto;
    }
}

productoMasVendido.textContent = productoTop;