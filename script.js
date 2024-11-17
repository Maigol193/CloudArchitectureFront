function fetchProducts(callback) {
  fetch('ec2-3-222-117-215.compute-1.amazonaws.com/api/productos')
    .then(response => response.json())
    .then(products => callback(products))
    .catch(err => console.error('Error al obtener productos:', err));
}

function displayProducts() {
  fetchProducts(function (products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';  // Limpiar la lista antes de agregar los nuevos productos

    // Iterar sobre los productos y extraer los valores de los atributos
    products.forEach(function (product, index) {
      const row = document.createElement('tr');
      
      // Extraer el valor de cada atributo de acuerdo con el tipo de dato
      const name = product.name.S;  // Obtener el valor de "name" (String)
      const description = product.description.S;  // Obtener el valor de "description" (String)
      const price = product.price.N;  // Obtener el valor de "price" (Number, pero como string)
      const quantity = product.quantity.N;  // Obtener el valor de "quantity" (Number, pero como string)
      const productId = product.productId.S;  // Obtener el valor de "productId"
      
      // Crear la fila de la tabla con los valores extraídos
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${name}</td>
        <td>${description}</td>
        <td>${parseFloat(price)}</td>  <!-- Convertir el precio a número -->
        <td>${parseInt(quantity)}</td>  <!-- Convertir la cantidad a número -->
        <td>
          <button onclick="editProduct('${productId}', '${name}', '${description}', '${price}', '${quantity}')">Editar</button>
          <button onclick="deleteProduct('${productId}')">Eliminar</button>
        </td>
      `;
      productList.appendChild(row);
    });
  });
}

function editProduct(productId, name, description, price, quantity) {
  // Redirigir a la página de edición y pasar los parámetros por URL
  window.location.href = `EditarProducto.html?productId=${productId}&name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&price=${price}&quantity=${quantity}`;
}

displayProducts();

function addProduct(product, callback) {
  fetch('ec2-3-222-117-215.compute-1.amazonaws.com/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
    .then(() => callback())
    .catch(err => console.error('Error al agregar producto:', err));
}

const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
  addProductForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const product = {
      productId: Date.now().toString(), // Genera un ID único
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      price: document.getElementById('product-price').value,
      quantity: document.getElementById('product-quantity').value,
    };

    addProduct(product, function () {
      window.location.href = 'PaginaPrincipal.html'; // Redirige después de agregar
    });
  });
}

function deleteProduct(productId) {
  fetch('ec2-3-222-117-215.compute-1.amazonaws.com/api/productos/' + productId, {
    method: 'DELETE',
  })
    .then(() => displayProducts())
    .catch(err => console.error('Error al eliminar producto:', err));
}

function updateProduct(productId, product, callback) {
  fetch('ec2-3-222-117-215.compute-1.amazonaws.com/api/productos/' + productId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
    .then(() => callback())
    .catch(err => console.error('Error al actualizar producto:', err));
}

const editProductForm = document.getElementById('edit-product-form');
if (editProductForm) {
  // Obtener los parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('productId');
  const name = params.get('name');
  const description = params.get('description');
  const price = params.get('price');
  const quantity = params.get('quantity');

  // Establecer los valores en los campos del formulario
  document.getElementById('product-name').value = name;
  document.getElementById('product-description').value = description;
  document.getElementById('product-price').value = price;
  document.getElementById('product-quantity').value = quantity;

  // Evento al enviar el formulario
  editProductForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const updatedProduct = {
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      price: document.getElementById('product-price').value,
      quantity: document.getElementById('product-quantity').value,
    };

    // Llamar a la función de actualización con el productId y los nuevos datos
    updateProduct(productId, updatedProduct, function () {
      window.location.href = 'PaginaPrincipal.html'; // Redirigir después de actualizar
    });
  });
}
