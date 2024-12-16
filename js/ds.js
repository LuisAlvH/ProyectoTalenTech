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

    if (html_list_product) {
      product_json.forEach((producto) => {
        const htmlProducto = `  
          <div class="produc-tienda" data-id="${producto.id}">
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
        html_list_product.innerHTML += htmlProducto;
      });
      const cantidadArticulos = document.querySelector(".cant-arti");

      if (cantidadArticulos) {
        cantidadArticulos.textContent = carrito.length;

        if (carrito.length > 1) {
          const padreH2 = cantidadArticulos.closest("h2");
          if (padreH2) {
            padreH2.childNodes.forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                if (
                  node.textContent.includes("ARTICULO") &&
                  !node.textContent.includes("ARTICULOS")
                ) {
                  node.textContent = node.textContent.replace(
                    "ARTICULO",
                    "ARTICULOS"
                  );
                }
              }
            });
          }
        }
      }

      html_list_product.addEventListener("click", (event) => {
        const target = event.target.closest('[data-btn-action="add-btn-cart"]');
        if (target) {
          const producto_seleccionado =
            event.target.parentElement.parentElement.parentElement;

          if (producto_seleccionado) {
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            const dataId = producto_seleccionado.getAttribute("data-id");

            const productoEncontrado = carrito.find(
              (producto) => String(producto.id) === String(dataId)
            );

            if (!productoEncontrado) {
              const producto = product_json.find(
                (producto) => String(producto.id) === String(dataId)
              );

              if (producto) {
                const { id, nombre, precio } = producto;
                let cantidad = 1;
                const productoCarrito = { id, nombre, precio, cantidad };

                carrito.push(productoCarrito);

                const cantidadArticulos = document.querySelector(".cant-arti");

                if (cantidadArticulos) {
                  cantidadArticulos.textContent = carrito.length;
                  if (carrito.length > 1) {
                    const padreH2 = cantidadArticulos.closest("h2");
                    if (padreH2) {
                      padreH2.childNodes.forEach((node) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                          if (
                            node.textContent.includes("ARTICULO") &&
                            !node.textContent.includes("ARTICULOS")
                          ) {
                            node.textContent = node.textContent.replace(
                              "ARTICULO",
                              "ARTICULOS"
                            );
                          }
                        }
                      });
                    }
                  }
                }
              } else {
                console.log("Producto no encontrado en product_json");
              }
            } else {
              productoEncontrado.cantidad++;
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            renderCarrito();
          }
        }
      });

      function renderCarrito() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const modalList = document.querySelector(".modal-list");
        modalList.innerHTML = "";

        carrito.forEach((producto) => {
          const htmlProductoModal = `
          <div class="modal-item" data-id="${producto.id}">
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
          </div>
        `;

          modalList.innerHTML += htmlProductoModal;
        });

        const totalElement = document.querySelector(".modal-total-cart");
        const nuevoTotal = calcularTotal(carrito);
        actualizarTotal(nuevoTotal);
      }
      function calcularTotal(carrito) {
        return carrito.reduce(
          (total, producto) => total + producto.precio * producto.cantidad,
          0
        );
      }

      function actualizarTotal(nuevoTotal) {
        const totalElement = document.querySelector(".modal-total-cart");
        totalElement.textContent = `Total: $${nuevoTotal.toFixed(2)}`;
      }

      document
        .querySelector(".modal-list")
        .addEventListener("click", (event) => {
          let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
          const target = event.target;

          // Eliminar producto
          if (target.closest(".btn-eliminar")) {
            const modalItem = target.closest(".modal-item");
            const productId = parseInt(modalItem.getAttribute("data-id"));

            carrito = carrito.filter((producto) => producto.id !== productId);
            localStorage.setItem("carrito", JSON.stringify(carrito));

            const cantidadArticulos = document.querySelector(".cant-arti");

            if (cantidadArticulos) {
              cantidadArticulos.textContent = carrito.length;

              const padreH2 = cantidadArticulos.closest("h2");
              if (padreH2) {
                padreH2.childNodes.forEach((node) => {
                  if (node.nodeType === Node.TEXT_NODE) {
                    if (
                      carrito.length === 1 &&
                      node.textContent.includes("ARTICULOS")
                    ) {
                      node.textContent = node.textContent.replace(
                        "ARTICULOS",
                        "ARTICULO"
                      );
                    }
                  }
                });
              }

              if (carrito.length == 0) {
                cantidadArticulos.textContent = "";
              }
            }

            renderCarrito();
          }

          if (target.closest(".sumar-cantidad")) {
            const modalItem = target.closest(".modal-item");
            const productId = modalItem.getAttribute("data-id");

            const productoEncontrado = carrito.find(
              (producto) => String(producto.id) === String(productId)
            );

            if (productoEncontrado) {
              productoEncontrado.cantidad++;
              localStorage.setItem("carrito", JSON.stringify(carrito));
              renderCarrito();
            }
          }

          if (target.closest(".restar-cantidad")) {
            const modalItem = target.closest(".modal-item");
            const productId = modalItem.getAttribute("data-id");

            const productoEncontrado = carrito.find(
              (producto) => String(producto.id) === String(productId)
            );

            if (productoEncontrado && productoEncontrado.cantidad > 1) {
              productoEncontrado.cantidad--;
              localStorage.setItem("carrito", JSON.stringify(carrito));
              renderCarrito();
            }

            const nuevoTotal = calcularTotal(carrito);
            actualizarTotal(nuevoTotal);
          }
        });

      renderCarrito();

      // CARRITO FLOTANTE

      const productos_tienda = document.querySelectorAll(
        '[data-btn-action="add-btn-cart"]'
      );
      const close_modal = document.querySelector(".jsModalClose");

      productos_tienda.forEach((produc) => {
        produc.addEventListener("click", (event) => {
          const nombre_modal = event.target.getAttribute("data-modal");
          const modal = document.querySelector(nombre_modal);

          modal.classList.add("active");
        });
      });

      close_modal.addEventListener("click", (event) => {
        event.target.parentNode.parentNode.classList.remove("active");
      });
    }
  })

  .catch((error) => console.error("Error:", error));

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
