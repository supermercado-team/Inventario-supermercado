const state = {
  suppliers: [],
  products: [],
  orders: [],
  globalMinStock: 5,
  editingSupplierId: null,
  selectedProductIdForUpdate: null,
};

const selectors = {
  supplierName: document.getElementById('supplierName'),
  supplierContact: document.getElementById('supplierContact'),
  supplierPhone: document.getElementById('supplierPhone'),
  supplierEmail: document.getElementById('supplierEmail'),
  saveSupplier: document.getElementById('saveSupplier'),
  supplierSearch: document.getElementById('supplierSearch'),
  supplierTable: document.getElementById('supplierTable'),
  productName: document.getElementById('productName'),
  productStock: document.getElementById('productStock'),
  addProduct: document.getElementById('addProduct'),
  inventoryProduct: document.getElementById('inventoryProduct'),
  inventoryQuantity: document.getElementById('inventoryQuantity'),
  inventoryType: document.getElementById('inventoryType'),
  registerMovement: document.getElementById('registerMovement'),
  updateStockQuantity: document.getElementById('updateStockQuantity'),
  updateStock: document.getElementById('updateStock'),
  productTable: document.getElementById('productTable'),
  globalMinStock: document.getElementById('globalMinStock'),
  saveMinStock: document.getElementById('saveMinStock'),
  criticalCount: document.getElementById('criticalCount'),
  emptyCount: document.getElementById('emptyCount'),
  alertTable: document.getElementById('alertTable'),
  orderSupplier: document.getElementById('orderSupplier'),
  orderProduct: document.getElementById('orderProduct'),
  orderQuantity: document.getElementById('orderQuantity'),
  orderStatus: document.getElementById('orderStatus'),
  addOrder: document.getElementById('addOrder'),
  orderTable: document.getElementById('orderTable'),
  tabs: document.querySelectorAll('.tabs button'),
  panels: document.querySelectorAll('.panel'),
};

function loadState() {
  const saved = JSON.parse(localStorage.getItem('supermarketState') || '{}');
  state.suppliers = saved.suppliers || [];
  state.products = saved.products || [];
  state.orders = saved.orders || [];
  state.globalMinStock = saved.globalMinStock ?? 5;
  selectors.globalMinStock.value = state.globalMinStock;
}

function saveState() {
  localStorage.setItem('supermarketState', JSON.stringify({
    suppliers: state.suppliers,
    products: state.products,
    orders: state.orders,
    globalMinStock: state.globalMinStock,
  }));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function showNotification(message) {
  alert(message);
}

function renderSuppliers() {
  const query = selectors.supplierSearch.value.toLowerCase().trim();
  selectors.supplierTable.innerHTML = '';
  state.suppliers
    .filter((supplier) => supplier.name.toLowerCase().includes(query))
    .forEach((supplier) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${supplier.name}</td>
        <td>${supplier.contact}</td>
        <td>${supplier.phone}</td>
        <td>${supplier.email}</td>
        <td>
          <button class="secondary" data-action="edit" data-id="${supplier.id}">Editar</button>
          <button class="delete" data-action="delete" data-id="${supplier.id}">Eliminar</button>
        </td>
      `;
      selectors.supplierTable.appendChild(row);
    });
  renderSupplierOptions();
}

function renderSupplierOptions() {
  selectors.orderSupplier.innerHTML = '<option value="">Seleccionar proveedor</option>';
  state.suppliers.forEach((supplier) => {
    const option = document.createElement('option');
    option.value = supplier.id;
    option.textContent = supplier.name;
    selectors.orderSupplier.appendChild(option);
  });
}

function renderProducts() {
  selectors.inventoryProduct.innerHTML = '<option value="">Seleccionar producto</option>';
  selectors.orderProduct.innerHTML = '<option value="">Seleccionar producto</option>';
  selectors.productTable.innerHTML = '';

  state.products.forEach((product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.stock}</td>
      <td>${product.minStock}</td>
      <td>
        <button class="secondary" data-action="select" data-id="${product.id}">Seleccionar</button>
      </td>
    `;
    selectors.productTable.appendChild(row);

    const inventoryOption = document.createElement('option');
    inventoryOption.value = product.id;
    inventoryOption.textContent = product.name;
    selectors.inventoryProduct.appendChild(inventoryOption);

    const orderOption = document.createElement('option');
    orderOption.value = product.id;
    orderOption.textContent = product.name;
    selectors.orderProduct.appendChild(orderOption);
  });
}

function renderAlerts() {
  const alerts = state.products.map((product) => {
    const status = product.stock === 0 ? 'Agotado' : product.stock <= state.globalMinStock ? 'Crítico' : 'Normal';
    return { ...product, status };
  });
  selectors.alertTable.innerHTML = '';
  const criticalCount = alerts.filter((item) => item.status === 'Crítico').length;
  const emptyCount = alerts.filter((item) => item.status === 'Agotado').length;
  selectors.criticalCount.textContent = criticalCount;
  selectors.emptyCount.textContent = emptyCount;

  alerts.forEach((product) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.stock}</td>
      <td>${product.status}</td>
    `;
    selectors.alertTable.appendChild(row);
  });
}

function renderOrders() {
  selectors.orderTable.innerHTML = '';
  state.orders.forEach((order) => {
    const supplier = state.suppliers.find((item) => item.id === order.supplierId)?.name || 'Proveedor no válido';
    const product = state.products.find((item) => item.id === order.productId)?.name || 'Producto no válido';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${supplier}</td>
      <td>${product}</td>
      <td>${order.quantity}</td>
      <td>${order.status}</td>
      <td>${new Date(order.date).toLocaleString()}</td>
    `;
    selectors.orderTable.appendChild(row);
  });
}

function registerSupplier() {
  const name = selectors.supplierName.value.trim();
  const contact = selectors.supplierContact.value.trim();
  const phone = selectors.supplierPhone.value.trim();
  const email = selectors.supplierEmail.value.trim();

  if (!name || !contact) {
    showNotification('Nombre y contacto son obligatorios.');
    return;
  }

  if (state.editingSupplierId) {
    const supplier = state.suppliers.find((item) => item.id === state.editingSupplierId);
    if (supplier) {
      supplier.name = name;
      supplier.contact = contact;
      supplier.phone = phone;
      supplier.email = email;
      state.editingSupplierId = null;
      selectors.saveSupplier.textContent = 'Registrar proveedor';
      showNotification('Proveedor actualizado correctamente.');
    }
  } else {
    state.suppliers.push({
      id: createId('supplier'),
      name,
      contact,
      phone,
      email,
    });
    showNotification('Proveedor registrado correctamente.');
  }

  selectors.supplierName.value = '';
  selectors.supplierContact.value = '';
  selectors.supplierPhone.value = '';
  selectors.supplierEmail.value = '';
  saveState();
  renderSuppliers();
  renderOrders();
}

function editSupplier(id) {
  const supplier = state.suppliers.find((item) => item.id === id);
  if (!supplier) return;
  selectors.supplierName.value = supplier.name;
  selectors.supplierContact.value = supplier.contact;
  selectors.supplierPhone.value = supplier.phone;
  selectors.supplierEmail.value = supplier.email;
  state.editingSupplierId = id;
  selectors.saveSupplier.textContent = 'Actualizar proveedor';
}

function deleteSupplier(id) {
  state.suppliers = state.suppliers.filter((item) => item.id !== id);
  saveState();
  renderSuppliers();
  renderOrders();
}

function addProduct() {
  const name = selectors.productName.value.trim();
  const stock = Number(selectors.productStock.value);
  if (!name) {
    showNotification('El nombre del producto es obligatorio.');
    return;
  }

  state.products.push({
    id: createId('product'),
    name,
    stock: Math.max(0, stock),
    minStock: state.globalMinStock,
  });

  selectors.productName.value = '';
  selectors.productStock.value = 0;
  saveState();
  renderProducts();
  renderAlerts();
}

function registerMovement() {
  const productId = selectors.inventoryProduct.value;
  const quantity = Number(selectors.inventoryQuantity.value);
  const type = selectors.inventoryType.value;
  if (!productId || quantity <= 0) {
    showNotification('Selecciona producto y cantidad válida.');
    return;
  }

  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  if (type === 'entrada') {
    product.stock += quantity;
  } else {
    product.stock = Math.max(0, product.stock - quantity);
  }

  saveState();
  renderProducts();
  renderAlerts();
}

function updateStock() {
  const quantity = Number(selectors.updateStockQuantity.value);
  const productId = selectors.inventoryProduct.value;
  if (!productId) {
    showNotification('Selecciona un producto para actualizar el stock.');
    return;
  }

  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  product.stock = Math.max(0, quantity);
  saveState();
  renderProducts();
  renderAlerts();
}

function saveMinimumStock() {
  const value = Number(selectors.globalMinStock.value);
  state.globalMinStock = Math.max(0, value);
  state.products.forEach((product) => {
    product.minStock = state.globalMinStock;
  });
  saveState();
  renderAlerts();
  renderProducts();
  showNotification('Stock mínimo global actualizado.');
}

function createOrder() {
  const supplierId = selectors.orderSupplier.value;
  const productId = selectors.orderProduct.value;
  const quantity = Number(selectors.orderQuantity.value);
  const status = selectors.orderStatus.value;

  if (!supplierId || !productId || quantity <= 0) {
    showNotification('Proveedor, producto y cantidad son obligatorios.');
    return;
  }

  state.orders.push({
    id: createId('order'),
    supplierId,
    productId,
    quantity,
    status,
    date: new Date().toISOString(),
  });

  saveState();
  renderOrders();
  showNotification('Pedido registrado correctamente.');
}

function handleSupplierTableClick(event) {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;
  if (!action || !id) return;
  if (action === 'edit') editSupplier(id);
  if (action === 'delete') deleteSupplier(id);
}

function handleProductTableClick(event) {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;
  if (action === 'select') {
    selectors.inventoryProduct.value = id;
  }
}

function setupTabs() {
  selectors.tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectors.tabs.forEach((button) => button.classList.remove('active'));
      selectors.panels.forEach((panel) => panel.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.add('active');
    });
  });
}

function bindEvents() {
  selectors.saveSupplier.addEventListener('click', registerSupplier);
  selectors.supplierSearch.addEventListener('input', renderSuppliers);
  selectors.addProduct.addEventListener('click', addProduct);
  selectors.registerMovement.addEventListener('click', registerMovement);
  selectors.updateStock.addEventListener('click', updateStock);
  selectors.saveMinStock.addEventListener('click', saveMinimumStock);
  selectors.addOrder.addEventListener('click', createOrder);
  selectors.supplierTable.addEventListener('click', handleSupplierTableClick);
  selectors.productTable.addEventListener('click', handleProductTableClick);
}

function initializeApp() {
  loadState();
  setupTabs();
  bindEvents();
  renderSuppliers();
  renderProducts();
  renderAlerts();
  renderOrders();
}

initializeApp();
