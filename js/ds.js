////CREANDO ELEMENTO PRODUCTO , PARA EL CONTENEDOR DE PRODUCTOS

function creandoElementoProduct(producto) {
  const contenedorProducto = document.createElement("DIV");
  contenedorProducto.className = "product-tienda";
  contenedorProducto.setAttribute("data-id", `${producto.id}`);

  contenedorProducto.innerHTML = `
      <a href="#">
        <div class="container-img">
          <img src="../img/Sin_imagen.jpg" alt="sin imagen" />
        </div>
      </a>
  
      <div class="info-product">
        <a href="#">
          <h3>${producto.nombre}</h3>
        </a>
        <small>${producto.precio}</small>
        <div class="btn-Add-produc">
  
          <a href="#" class="btn-primary" data-btn-action="add-btn-cart" data-modal="#JsModalCarrito">AGREGAR AL CARRITO </a>
        </div>
      </div>   `;

  return contenedorProducto;
}
///METODOS DE EVENTO DE AGREGAR AL CARRITO
function modificandoPalabraArticuloDeLosProductos(carrito) {
  const cantidadArticulos = document.querySelector(".cant-arti");

  if (cantidadArticulos) {
    cantidadArticulos.textContent = carrito.length;

    if (carrito.length >= 1) {
      const padreH2 = cantidadArticulos.closest("h2");

      if (padreH2) {
        padreH2.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            let texto = node.textContent;

            if (carrito.length > 1) {
              texto = texto.replace(/\bARTICULO\b/, "ARTICULOS");
            } else if (carrito.length === 1) {
              texto = texto.replace(/\bARTICULOS\b/, "ARTICULO");
            }

            node.textContent = texto;
          }
        });
      }
    } else {
      cantidadArticulos.textContent = "";
    }
  }
}

///METODOS DE RENDERIZAR
function renderCarritoProductos() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const modalList = document.querySelector(".modal-list");
  let fragmento = document.createDocumentFragment();

  modalList.innerHTML = "";
  carrito.forEach((producto) => {
    fragmento.appendChild(creandoElementoCarritoProducto(producto));
  });
  modalList.appendChild(fragmento);
}
function creandoElementoCarritoProducto(producto) {
  const contenedorProducto = document.createElement("DIV");
  contenedorProducto.className = "modal-item";
  contenedorProducto.setAttribute("data-id", `${producto.id}`);

  contenedorProducto.innerHTML = `
         <div class="modal-thumb">
          <img src="../img/Sin_imagen.jpg" alt="sin imagen" />
        </div>
        <div class="modal-text-product">
          <span>${producto.nombre}</span>
          <div class="selector-cantidad">
            <i class="fa fa-minus restar-cantidad"></i>
            <input
              type="text"
              value="${producto.cantidad}"
              class="carrito-item-cantidad"
              disabled
            />
            <i class="fa fa-plus sumar-cantidad"></i>
            <span class="btn-eliminar">
              <i class="fa fa-trash"></i>
            </span>
          </div>
          <p class="carrito-item-precio"><strong>${producto.precio}</strong></p>
        </div>
       `;

  return contenedorProducto;
}

///AGREGANDO PRODUCTO
function agregandoProductoAlCarrito(target) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (target) {
    const producto_seleccionado =
      target.parentElement.parentElement.parentElement;

    const dataId = producto_seleccionado.getAttribute("data-id");
    const existenciaProductoCarrito = carrito.find(
      (producto) => String(producto.id) === String(dataId)
    );

    if (!existenciaProductoCarrito) {
      ///SI EL PRODUCTO NO EXISTE EN EL CARRITO LO AGREGAMOS
      const producto = product_json.find(
        (producto) => String(producto.id) === String(dataId)
      );

      const { id, nombre, precio } = producto;
      let cantidad = 1;
      const productoCarrito = { id, nombre, precio, cantidad };
      carrito.push(productoCarrito);
    } else {
      //SI EL PRODUCTO EXISTE EN EL CARRITO , MODIFICAMOS LA CANTIDAD
      existenciaProductoCarrito.cantidad++;
    }

    modificandoPalabraArticuloDeLosProductos(carrito);
    actualizandoNumeroDelCarrito(carrito);
    actualizarTotal(obteniendoTotal(carrito));
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}
///ACTUALIZANDO NUMERO DEL CARRITO
function actualizandoNumeroDelCarrito(carrito) {
  const numeroCarrito = document.querySelector(".numero-carrito");

  if (carrito.length > 0) {
    numeroCarrito.style.backgroundColor = "#79afdb";
    numeroCarrito.textContent = carrito.length;
    numeroCarrito.style.display = "inline";
  } else {
    numeroCarrito.style.display = "none";
  }
}
///ELIMINAR PRODUCTOS
function eliminarProducto(target) {
  if (target.closest(".btn-eliminar")) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const modalItem = target.closest(".modal-item");
    const productId = parseInt(modalItem.getAttribute("data-id"));
    carrito = carrito.filter((producto) => producto.id !== productId);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    modificandoPalabraArticuloDeLosProductos(carrito);
    actualizarTotal(obteniendoTotal(carrito));
    actualizandoNumeroDelCarrito(carrito);
    renderCarritoProductos();
  }
}
///SUMAR-CANTIDAD

function sumandoCantidad(target) {
  if (target.closest(".sumar-cantidad")) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const modalItem = target.closest(".modal-item");
    const productId = parseInt(modalItem.getAttribute("data-id"));
    let productoEncontrado = carrito.find(
      (producto) => producto.id === productId
    );

    if (productoEncontrado) {
      productoEncontrado.cantidad++;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      modificandoPalabraArticuloDeLosProductos(carrito);
      actualizarTotal(obteniendoTotal(carrito));
      renderCarritoProductos();
    }
  }
}
function obteniendoTotal(carrito) {
  const total = carrito.reduce((acumulador, producto) => {
    return acumulador + producto.precio * producto.cantidad;
  }, 0);
  return total;
}
///RESTAR-CANTIDAD

function restandoCantidad(target) {
  if (target.closest(".restar-cantidad")) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const modalItem = target.closest(".modal-item");
    const productId = parseInt(modalItem.getAttribute("data-id"));

    let productoEncontrado = carrito.find(
      (producto) => producto.id === productId
    );

    if (productoEncontrado && productoEncontrado.cantidad > 1) {
      productoEncontrado.cantidad--;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      modificandoPalabraArticuloDeLosProductos(carrito);
      actualizarTotal(obteniendoTotal(carrito));
      renderCarritoProductos();
    }
  }
}
///METODOS DEL CARRITO MODAL

function calcularTotal(carrito) {
  return carrito.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0
  );
}
///Actualizar total
function actualizarTotal(nuevoTotal) {
  const totalElement = document.querySelector(".modal-total-cart");

  totalElement.textContent = `Total: $${nuevoTotal.toFixed(2)}`;
  console.log(totalElement);
}

const icons_nav = document.querySelector("#icons-nav");
const nav = document.querySelector("#nav");
const act_open = document.querySelector("#open-menu");
const act_close = document.querySelector("#close-menu");
const iconos_deskop = document.querySelector(".container-header");

act_open.addEventListener("click", () => {
  if (!nav.contains(icons_nav)) {
    nav.appendChild(icons_nav);
  }

  if (icons_nav) {
    icons_nav.classList.add("iconos-movile");
  }

  nav.classList.add("visible");
});

act_close.addEventListener("click", () => {
  if (icons_nav) {
    icons_nav.classList.remove("iconos-movile");

    iconos_deskop.appendChild(icons_nav);
  }

  nav.classList.remove("visible");
});

let product_json = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch("../js/productos.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    return response.json();
  })

  .then((data) => {
    product_json = data;
    const html_list_product = document.querySelector(".container-tienda");

    ///CARGANDO PRODUCTO AL CONTENEDOR DE PRODUCTOS

    if (html_list_product) {
      let fragmento = document.createDocumentFragment();

      product_json.forEach((producto) => {
        fragmento.appendChild(creandoElementoProduct(producto));
      });

      html_list_product.appendChild(fragmento);

      html_list_product.addEventListener("click", (e) => {
        const target = e.target.closest('[data-btn-action="add-btn-cart"]');

        agregandoProductoAlCarrito(target);

        renderCarritoProductos();
      });

      document
        .querySelector(".modal-list")
        .addEventListener("click", (event) => {
          const target = event.target;

          // Eliminar producto
          eliminarProducto(target);
          // Sumando producto
          sumandoCantidad(target);
          // Restando producto
          restandoCantidad(target);
        });

      // CARRITO FLOTANTE

      const productos_tienda = document.querySelectorAll(
        '[data-btn-action="add-btn-cart"]'
      );
      const iconoCarrito = document.querySelector(".carrito");
      const close_modal = document.querySelector(".jsModalClose");

      iconoCarrito.addEventListener("click", (event) => {
        console.log("click en el icono");
        const modal = document.querySelector("#JsModalCarrito");
        modal.classList.add("active");
      });

      productos_tienda.forEach((produc) => {
        produc.addEventListener("click", (event) => {
          console.log("click en el producto");
          const nombre_modal = event.target.getAttribute("data-modal");

          const modal = document.querySelector(nombre_modal);
          console.log(modal);
          modal.classList.add("active");
        });
      });

      close_modal.addEventListener("click", (event) => {
        event.target.parentNode.parentNode.classList.remove("active");
      });
    }
  })

  .catch((error) => console.error("Error:", error));

///FORMULARIO
const formContacto = document.querySelector(".Form-contacto");

formContacto.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = document.querySelector("#nombre").value;
  const errorNombre = document.querySelector(".Error-nombre");

  if (nombre.length > 8) {
    errorNombre.style.display = "block";
  }

  const email = document.querySelector("#email").value;
  const errorEmail = document.querySelector(".Error-email");

  if (!email.includes("@")) {
    errorEmail.style.display = "block";
  }

  const motivo = document.querySelector("#Motivo").value;
  const errorMotivo = document.querySelector(".Error-motivo");

  if (motivo === "vacio") {
    errorMotivo.style.display = "block";
  }
});

document.querySelector("#nombre").addEventListener("input", () => {
  const nombre = document.querySelector("#nombre").value;
  const errorNombre = document.querySelector(".Error-nombre");

  if (nombre.length <= 8) {
    errorNombre.style.display = "none";
  }
});

document.querySelector("#email").addEventListener("input", () => {
  const email = document.querySelector("#email").value;
  const errorEmail = document.querySelector(".Error-email");

  if (email.includes("@")) {
    errorEmail.style.display = "none";
  }
});

document.querySelector("#Motivo").addEventListener("change", () => {
  const motivo = document.querySelector("#Motivo").value;
  const errorMotivo = document.querySelector(".Error-motivo");

  if (motivo !== "vacio") {
    errorMotivo.style.display = "none";
  }
});
