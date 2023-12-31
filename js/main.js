// Función para obtener el título de una carta, si no tiene, devuelve 'Sin título'
const obtenerTituloCarta = (producto) => producto.title || "Sin título";

// Función para crear un elemento carta y devolverlo
function crearElementoCarta(producto) {
  const carta = document.createElement("div");
  carta.className = "card";
  carta.innerHTML = `
    <h4 class="numero-carta">Carta N°${producto.id}</h4>
    <h4 class="titulo-carta">${obtenerTituloCarta(producto)}</h4>
    <div class="container-img">
      <img src="${producto.image}" alt="${obtenerTituloCarta(producto)}">
    </div> 
    <div class="personaje">
    ${producto.personaje}
    </div> 
    <button class="boton-precio">$${producto.price}</button>
  `;
  return carta;
}

// Función para crear cartas y agregarlas al contenedor
function crearProductos(datos, contenedor) {
  for (const producto of datos) {
    const carta = crearElementoCarta(producto);
    contenedor.appendChild(carta);
  }
}

// Obtener datos desde el archivo JSON
fetch("js/data/dbz.json")
  .then((response) => response.json())
  .then((data) => {
    // Crear cartas y agregarlas al contenedor con id 'container-dbz'
    crearProductos(data, document.getElementById("container-dbz"));
  })
  .catch((error) => console.error("Error al obtener los datos:", error));

// Lógica para mostrar/ocultar el botón de desplazamiento basado en el desplazamiento de la página
window.onscroll = function () {
  var button = document.getElementById("scrollButton");
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
};

// Función para desplazar al inicio de la página
function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

//barra de busqueda
function buscar() {
  const input = document.getElementById("searchInput");
  const term = input.value.toLowerCase();

  const cartas = document.querySelectorAll(".card");

  cartas.forEach((carta) => {
    const numeroCarta = carta
      .querySelector(".numero-carta")
      .textContent.toLowerCase();
    const titulo = carta
      .querySelector(".titulo-carta")
      .textContent.toLowerCase();
    const personaje = carta
      .querySelector(".personaje")
      .textContent.toLowerCase();

    // Buscar tanto por título como por personaje
    if (
      titulo.includes(term) ||
      personaje.includes(term) ||
      numeroCarta.includes(term)
    ) {
      carta.classList.remove("oculta"); // Quitar clase para mostrar la carta
    } else {
      carta.classList.add("oculta"); // Agregar clase para ocultar la carta
    }
  });
}

function resetBuscar() {
  const input = document.getElementById("searchInput");
  input.value = ""; // Limpiar el valor del input

  const cartas = document.querySelectorAll(".card");

  cartas.forEach((carta) => {
    carta.style.display = "block"; // Mostrar todas las cartas
  });
}

// Función para alternar entre modos 'claro' y 'oscuro'
function alternarModo() {
  const cuerpo = document.body;
  const barraNavegacion = document.querySelector(".navbar");
  const botonModo = document.getElementById("cambiarModo");
  const cartas = document.querySelectorAll(".card");

  if (cuerpo.classList.contains("light-mode")) {
    // Cambio al modo oscuro
    cuerpo.classList.remove("light-mode");
    cuerpo.classList.add("dark-mode");
    barraNavegacion.classList.remove("navbar-light", "navbar-light-mode");
    barraNavegacion.classList.add("navbar-dark", "bg-dark");
    botonModo.textContent = "Modo Claro";
    localStorage.setItem("modo", "oscuro");
    // Agregar clase a las cartas para modo oscuro
    cartas.forEach((carta) => {
      carta.classList.remove("modo-claro");
      carta.classList.add("modo-oscuro");
    });
  } else {
    // Cambio al modo claro
    cuerpo.classList.remove("dark-mode");
    cuerpo.classList.add("light-mode");
    barraNavegacion.classList.remove("navbar-dark", "bg-dark");
    barraNavegacion.classList.add("navbar-light", "navbar-light-mode");
    botonModo.textContent = "Modo Oscuro";
    localStorage.setItem("modo", "claro");
    // Agregar clase a las cartas para modo claro
    cartas.forEach((carta) => {
      carta.classList.remove("modo-oscuro");
      carta.classList.add("modo-claro");
    });
  }
}

// Acción al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  // Verifica si el modo guardado es 'oscuro' y lo aplica
  const modoGuardado = localStorage.getItem("modo");
  const botonModo = document.getElementById("cambiarModo");

  if (modoGuardado === "oscuro") {
    alternarModo(); // Cambia al modo oscuro
  }

  // Agregar evento al botón para cambiar el modo
  botonModo.addEventListener("click", function () {
    alternarModo();
  });

  // Recupera los productos guardados en el carrito del localStorage y los muestra
  const productosEnCarrito = localStorage.getItem("productosEnCarrito");
  if (productosEnCarrito) {
    allProducts = JSON.parse(productosEnCarrito);
    showHTML();
  }
});

// Seleccionar elementos del carrito y otros elementos de interés
const btnCart = document.querySelector(".container-cart-icon");
const containerCartProducts = document.querySelector(
  ".container-cart-products"
);

// Mostrar/ocultar el carrito al hacer clic en el ícono del carrito
btnCart.addEventListener("click", () => {
  containerCartProducts.classList.toggle("hidden-cart");
});

// Variables para controlar el carrito de compras
const cartInfo = document.querySelector(".cart-product");
const rowProduct = document.querySelector(".row-product");
const productsList = document.querySelector("#container-dbz");
let allProducts = []; // Lista de todos los productos en el carrito

// Variables para mostrar información del carrito
const valorTotal = document.querySelector(".total-pagar");
const countProducts = document.querySelector("#contador-productos");
const cartEmpty = document.querySelector(".cart-empty");
const cartTotal = document.querySelector(".cart-total");

// Agregar productos al carrito al hacer clic en los botones de precio de los productos
productsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("boton-precio")) {
    // Obtener información del producto seleccionado
    const product = e.target.closest(".card");
    const title = product.querySelector(".titulo-carta").textContent;
    const price = parseFloat(
      product.querySelector(".boton-precio").textContent.slice(1)
    );

    // Crear objeto con la información del producto
    const infoProduct = {
      quantity: 1,
      title: title,
      price: price,
    };

    // Comprobar si el producto ya está en el carrito
    const exists = allProducts.some((prod) => prod.title === infoProduct.title);

    // Actualizar la cantidad si el producto ya está en el carrito, o agregarlo si no
    if (exists) {
      allProducts = allProducts.map((prod) => {
        if (prod.title === infoProduct.title) {
          prod.quantity++;
        }
        return prod;
      });
      Toastify({
        text: `¡"${title}" se ha agregado al carrito!`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#28a745",
      }).showToast();
    } else {
      allProducts.push(infoProduct);
      Toastify({
        text: `¡"${title}" se ha agregado al carrito!`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#28a745",
      }).showToast();
    }

    // Mostrar actualizaciones en el carrito y guardar en el almacenamiento local
    showHTML();
    guardarCarritoEnLocalStorage();
  }
});

// Actualizar la cantidad de productos en el carrito al interactuar con él
rowProduct.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-product")) {
    // Reducir la cantidad de un producto en el carrito
    const product = e.target.parentElement;
    const title = product.querySelector(".titulo-producto-carrito").textContent;
    allProducts = allProducts.map((prod) => {
      if (prod.title === title && prod.quantity > 1) {
        prod.quantity--;
        Toastify({
          text: `¡Se ha eliminado una unidad de "${title}" del carrito!`,
          duration: 3000,
          gravity: "bottom",
          position: "right",
          backgroundColor: "#dc3545",
        }).showToast();
      }
      return prod;
    });
    showHTML();
    guardarCarritoEnLocalStorage();
  } else if (e.target.classList.contains("add-product")) {
    // Aumentar la cantidad de un producto en el carrito
    const product = e.target.parentElement;
    const title = product.querySelector(".titulo-producto-carrito").textContent;
    allProducts = allProducts.map((prod) => {
      if (prod.title === title) {
        prod.quantity++;
      }
      return prod;
    });
    showHTML();
    guardarCarritoEnLocalStorage();
    //
    Toastify({
      text: `¡"${title}" se ha agregado al carrito!`,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "#28a745",
    }).showToast();
  } else if (e.target.classList.contains("icon-close")) {
    // Eliminar un producto del carrito
    const product = e.target.parentElement;
    const title = product.querySelector(".titulo-producto-carrito").textContent;
    allProducts = allProducts.filter((prod) => prod.title !== title);
    showHTML();
    guardarCarritoEnLocalStorage();
  }
});
// Función para guardar los productos del carrito en el almacenamiento local
function guardarCarritoEnLocalStorage() {
  localStorage.setItem("productosEnCarrito", JSON.stringify(allProducts));
}

// Función para mostrar los productos y la información en el carrito
function showHTML() {
  if (!allProducts.length) {
    // Mostrar o ocultar elementos si el carrito está vacío o tiene productos
    cartEmpty.classList.remove("hidden");
    rowProduct.classList.add("hidden");
    cartTotal.classList.add("hidden");
  } else {
    cartEmpty.classList.add("hidden");
    rowProduct.classList.remove("hidden");
    cartTotal.classList.remove("hidden");
  }

  // Limpiar el carrito antes de mostrar los productos
  rowProduct.innerHTML = "";

  let total = 0;
  let totalOfProducts = 0;

  // Mostrar cada producto en el carrito
  allProducts.forEach((product) => {
    const containerProduct = document.createElement("div");
    containerProduct.classList.add("cart-product");

    containerProduct.innerHTML = `
      <div class="info-cart-product">
        <button class="remove-product">-</button>
        <span class="cantidad-producto-carrito">${product.quantity}</span>
        <button class="add-product">+</button>
        <p class="titulo-producto-carrito">${product.title}</p>
        <span class="precio-producto-carrito">$${product.price}</span>
        <span class="icon-close">&#10005;</span>
      </div>
    `;

    // Agregar el producto al carrito
    rowProduct.append(containerProduct);

    // Calcular el total y la cantidad de productos en el carrito
    total += parseInt(product.quantity * product.price);
    totalOfProducts += product.quantity;
  });

  // Mostrar el total y la cantidad de productos en el carrito
  valorTotal.innerText = `$${total}`;
  countProducts.innerText = totalOfProducts;
}

// Función para abrir el modal de tarjeta
function realizarPagoConTarjeta() {
  // Obtener datos del formulario
  const numeroTarjeta = document.getElementById("numeroTarjeta").value;
  const nombreTitular = document.getElementById("nombreTitular").value;
  const fechaExpiracion = document.getElementById("fechaExpiracion").value;
  const codigoSeguridad = document.getElementById("codigoSeguridad").value;

  // Validar datos (aquí debes agregar tus propias condiciones de validación)
  if (
    !numeroTarjeta ||
    !nombreTitular ||
    !fechaExpiracion ||
    !codigoSeguridad
  ) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, complete todos los campos del formulario",
    });
    return;
  }

  // Aquí puedes agregar lógica adicional para procesar el pago

  // Después de realizar el pago, agrega la clase al formulario
  const formTarjeta = document.getElementById("formTarjeta");
  formTarjeta.classList.add("formulario-pagado");

  // Muestra una alerta de éxito
  Swal.fire({
    icon: "success",
    title: "Pago realizado con éxito",
    text: "Gracias por tu compra",
  });

  // Cierra el modal después de realizar el pago (si es necesario)
  cerrarModalTarjeta();
}

// Evento al hacer clic en el botón de pagar
document.querySelector(".btn-pagar").addEventListener("click", () => {
  // Aquí puedes abrir el modal de la tarjeta antes de realizar el pago
  abrirModalTarjeta();
});

// Función para abrir el modal de la tarjeta
function abrirModalTarjeta() {
  const modalTarjeta = document.getElementById("modalTarjeta");
  modalTarjeta.style.display = "block";
}

// Función para cerrar el modal de la tarjeta
function cerrarModalTarjeta() {
  const modalTarjeta = document.getElementById("modalTarjeta");
  modalTarjeta.style.display = "none";
}
