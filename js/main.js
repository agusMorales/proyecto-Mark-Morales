// Función para obtener el título de una carta, si no tiene, devuelve 'Sin título'
const obtenerTituloCarta = (producto) => producto.title || 'Sin título';

// Función para crear un elemento carta y devolverlo
function crearElementoCarta(producto) {
  const carta = document.createElement('div');
  carta.className = 'card';
  carta.innerHTML = `
    <h4 class="titulo-carta">${obtenerTituloCarta(producto)}</h4>
    <div class="container-img">
      <img src="${producto.image}" alt="${obtenerTituloCarta(producto)}">
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

// Crear cartas con datos de 'dbz' y agregarlas al contenedor con id 'container-dbz'
crearProductos(dbz, document.getElementById('container-dbz'));

// Lógica para mostrar/ocultar el botón de desplazamiento basado en el desplazamiento de la página
window.onscroll = function () {
  var button = document.getElementById("scrollButton");
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
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

// Función para alternar entre modos 'claro' y 'oscuro'
function alternarModo() {
  const cuerpo = document.body;
  const barraNavegacion = document.querySelector(".navbar");
  const botonModo = document.getElementById("modoOscuro");

  if (cuerpo.classList.contains("light-mode")) {
    // Cambio al modo oscuro
    cuerpo.classList.remove("light-mode");
    cuerpo.classList.add("dark-mode");
    barraNavegacion.classList.remove("navbar-light", "bg-light");
    barraNavegacion.classList.add("navbar-dark", "bg-dark");
    botonModo.textContent = "Modo Claro";
    localStorage.setItem("modo", "oscuro");
  } else {
    // Cambio al modo claro
    cuerpo.classList.remove("dark-mode");
    cuerpo.classList.add("light-mode");
    barraNavegacion.classList.remove("navbar-dark", "bg-dark");
    barraNavegacion.classList.add("navbar-light", "bg-secondary");
    botonModo.textContent = "Modo Oscuro";
    localStorage.setItem("modo", "claro");
  }
}

// Acción al cargar la página
window.onload = function() {
  // Verifica si el modo guardado es 'oscuro' y lo aplica
  const modoGuardado = localStorage.getItem("modo");
  if (modoGuardado === "oscuro") {
    alternarModo();
  }

  // Recupera los productos guardados en el carrito del localStorage y los muestra
  const productosEnCarrito = localStorage.getItem('productosEnCarrito');
  if (productosEnCarrito) {
    allProducts = JSON.parse(productosEnCarrito);
    showHTML();
  }
};


// Seleccionar elementos del carrito y otros elementos de interés
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

// Mostrar/ocultar el carrito al hacer clic en el ícono del carrito
btnCart.addEventListener('click', () => {
  containerCartProducts.classList.toggle('hidden-cart');
});

// Variables para controlar el carrito de compras
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');
const productsList = document.querySelector('#container-dbz');
let allProducts = []; // Lista de todos los productos en el carrito

// Variables para mostrar información del carrito
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// Agregar productos al carrito al hacer clic en los botones de precio de los productos
productsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('boton-precio')) {
    // Obtener información del producto seleccionado
    const product = e.target.closest('.card');
    const title = product.querySelector('.titulo-carta').textContent;
    const price = parseFloat(product.querySelector('.boton-precio').textContent.slice(1));

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
    } else {
      allProducts.push(infoProduct);
    }

    // Mostrar actualizaciones en el carrito y guardar en el almacenamiento local
    showHTML();
    guardarCarritoEnLocalStorage();
  }
});

// Actualizar la cantidad de productos en el carrito al interactuar con él
rowProduct.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-product')) {
    // Reducir la cantidad de un producto en el carrito
    const product = e.target.parentElement;
    const title = product.querySelector('.titulo-producto-carrito').textContent;
    allProducts = allProducts.map((prod) => {
      if (prod.title === title && prod.quantity > 1) {
        prod.quantity--;
      }
      return prod;
    });
    showHTML();
    guardarCarritoEnLocalStorage();
  } else if (e.target.classList.contains('add-product')) {
    // Aumentar la cantidad de un producto en el carrito
    const product = e.target.parentElement;
    const title = product.querySelector('.titulo-producto-carrito').textContent;
    allProducts = allProducts.map((prod) => {
      if (prod.title === title) {
        prod.quantity++;
      }
      return prod;
    });
    showHTML();
    guardarCarritoEnLocalStorage();
  } else if (e.target.classList.contains('icon-close')) {
    // Eliminar un producto del carrito
    const product = e.target.parentElement;
    const title = product.querySelector('.titulo-producto-carrito').textContent;
    allProducts = allProducts.filter((prod) => prod.title !== title);
    showHTML();
    guardarCarritoEnLocalStorage();
  }
});

// Función para guardar los productos del carrito en el almacenamiento local
function guardarCarritoEnLocalStorage() {
  localStorage.setItem('productosEnCarrito', JSON.stringify(allProducts));
}

// Función para mostrar los productos y la información en el carrito
function showHTML() {
  if (!allProducts.length) {
    // Mostrar o ocultar elementos si el carrito está vacío o tiene productos
    cartEmpty.classList.remove('hidden');
    rowProduct.classList.add('hidden');
    cartTotal.classList.add('hidden');
  } else {
    cartEmpty.classList.add('hidden');
    rowProduct.classList.remove('hidden');
    cartTotal.classList.remove('hidden');
  }

  // Limpiar el carrito antes de mostrar los productos
  rowProduct.innerHTML = '';

  let total = 0;
  let totalOfProducts = 0;

  // Mostrar cada producto en el carrito
  allProducts.forEach((product) => {
    const containerProduct = document.createElement('div');
    containerProduct.classList.add('cart-product');

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