const products = [
  { id: 1, name: "Лапка КПП OTOM синяя", image: "/static/images/7195958399.jpg", price: 999 },
  { id: 2, name: "Лапка КПП OTOM красная", image: "/static/images/7195958399.jpg", price: 200 },
  { id: 3, name: "Руль IGP 22/28мм", image: "/static/images/z9248laqqj3ior01rgl6dc5ha2yth94c.jpg", price: 150 },
  { id: 4, name: "Руль IGP 22/28мм", image: "/static/images/9pz5qasv62j604s9b9ji2fe0ukjn6q6o.jpg", price: 300 },
  { id: 5, name: "Защита рук Zetta", image: "/static/images/7379477234.jpg", price: 250 },
  { id: 6, name: "Защита рук", image: "/static/images/7644093156.jpg", price: 180 },
  { id: 7, name: "Пульт Ктм, Кнопки запуска", image: "/static/images/dispositivo-luz-de-freno-bomba-nissin.jpg", price: 220 },
  { id: 8, name: "Смартком Комплект Ланза 302т", image: "/static/images/IMG_20250911_115353.jpg.webp", price: 190 },
  { id: 9, name: "Пластик Ktm 20-22г", image: "/static/images/7097555750.jpg", price: 270 },
  { id: 10, name: "FEX чехол сиденья", image: "/static/images/fex-18-23526_xl.jpg", price: 320 },
  { id: 11, name: "Масло ZIC X9 4т", image: "/static/images/6143152451.jpg", price: 140 },
  { id: 12, name: "Масло LAVR 10w-40", image: "/static/images/7364265278.jpg", price: 210 },
  { id: 13, name: "Масло MOTUL 2т", image: "/static/images/324ae8c208cd36ef987fc92edf811c4a.jpeg", price: 100 },
];

const itemsPerPage = 6;
let currentPage = 1;
let filteredProducts = products;

function createFlyingImage(imageSrc, startRect, endRect) {
  const flyingImage = document.createElement('img');
  flyingImage.src = imageSrc;
  flyingImage.style.position = 'fixed';
  flyingImage.style.width = '50px';
  flyingImage.style.height = '50px';
  flyingImage.style.borderRadius = '8px';
  flyingImage.style.objectFit = 'cover';
  flyingImage.style.zIndex = '10000';
  flyingImage.style.pointerEvents = 'none';
  flyingImage.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  flyingImage.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
  
  flyingImage.style.left = `${startRect.left + startRect.width / 2 - 25}px`;
  flyingImage.style.top = `${startRect.top + startRect.height / 2 - 25}px`;
  flyingImage.style.opacity = '1';
  flyingImage.style.transform = 'scale(1) rotate(0deg)';
  
  document.body.appendChild(flyingImage);
  
  requestAnimationFrame(() => {
    flyingImage.style.left = `${endRect.left + endRect.width / 2 - 25}px`;
    flyingImage.style.top = `${endRect.top + endRect.height / 2 - 25}px`;
    flyingImage.style.transform = 'scale(0.3) rotate(360deg)';
    flyingImage.style.opacity = '0.5';
  });
  
  setTimeout(() => {
    if (flyingImage.parentNode) {
      flyingImage.parentNode.removeChild(flyingImage);
    }
  }, 800);
}

function getCartButtonPosition() {
  const cartButton = document.getElementById('cart-button');
  if (cartButton) {
    return cartButton.getBoundingClientRect();
  }
  return {
    left: window.innerWidth - 100,
    top: window.innerHeight - 100,
    width: 50,
    height: 50
  };
}

function updateTotalPrice() {
  const cartItems = sessionStorage.getItem('cart_items');
  let totalPrice = 0;
  
  if (cartItems) {
    const itemIds = cartItems.split(',').map(id => parseInt(id.trim()));
    itemIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        totalPrice += product.price;
      }
    });
  }
  
  const totalPriceElement = document.getElementById('total-price');
  if (totalPriceElement) {
    totalPriceElement.textContent = `Общая сумма: ${totalPrice} руб.`;
  }
}

function renderProducts() {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  for (const item of pageItems) {
    const div = document.createElement("div");
    div.classList.add("product");
    
    const currentItems = sessionStorage.getItem('cart_items');
    const itemCount = currentItems ? currentItems.split(',').filter(id => id === item.id.toString()).length : 0;
    
    if (itemCount > 0) {
      div.innerHTML = `
        <img src="${item.image}" class="product-image" data-id="${item.id}" />
        <p>${item.name}</p>
        <p class="price">${item.price} руб.</p>
        <div class="quantity-controls">
          <button class="decrease-btn" data-id="${item.id}">-</button>
          <span class="quantity" data-id="${item.id}">${itemCount}</span>
          <button class="increase-btn" data-id="${item.id}">+</button>
        </div>
      `;
    } else {
      div.innerHTML = `
        <img src="${item.image}" class="product-image" data-id="${item.id}" />
        <p>${item.name}</p>
        <p class="price">${item.price} руб.</p>
        <button class="add-btn" data-id="${item.id}">Добавить</button>
      `;
    }

    const addBtn = div.querySelector('.add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        const productId = this.dataset.id;
        const product = products.find(p => p.id === parseInt(productId));
        
        if (product) {
          const productImage = this.closest('.product').querySelector('.product-image');
          const startRect = productImage.getBoundingClientRect();
          const endRect = getCartButtonPosition();
          
          createFlyingImage(product.image, startRect, endRect);
        }
        
        const currentItems = sessionStorage.getItem('cart_items');
        if (currentItems) {
          sessionStorage.setItem('cart_items', currentItems + ',' + productId);
        } else {
          sessionStorage.setItem('cart_items', productId);
        }
        renderProducts();
        updateTotalPrice();
        console.log('Товар добавлен в корзину');
      });
    }

    const increaseBtn = div.querySelector('.increase-btn');
    if (increaseBtn) {
      increaseBtn.addEventListener('click', function() {
        const productId = this.dataset.id;
        const product = products.find(p => p.id === parseInt(productId));
        
        if (product) {
          const productImage = this.closest('.product').querySelector('.product-image');
          const startRect = productImage.getBoundingClientRect();
          const endRect = getCartButtonPosition();
          
          createFlyingImage(product.image, startRect, endRect);
        }
        
        const currentItems = sessionStorage.getItem('cart_items');
        if (currentItems) {
          sessionStorage.setItem('cart_items', currentItems + ',' + productId);
        } else {
          sessionStorage.setItem('cart_items', productId);
        }
        updateQuantityDisplay(productId);
        updateTotalPrice();
        console.log('Товар добавлен в корзину');
      });
    }

    const decreaseBtn = div.querySelector('.decrease-btn');
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', function() {
        const productId = this.dataset.id;
        const currentItems = sessionStorage.getItem('cart_items');
        if (currentItems) {
          const itemsArray = currentItems.split(',');
          const index = itemsArray.indexOf(productId);
          if (index !== -1) {
            itemsArray.splice(index, 1);
            sessionStorage.setItem('cart_items', itemsArray.join(','));
            
            const newCount = itemsArray.filter(id => id === productId).length;
            if (newCount === 0) {
              renderProducts();
            } else {
              updateQuantityDisplay(productId);
            }
            updateTotalPrice();
            console.log('Товар удален из корзины');
          }
        }
      });
    }

    container.appendChild(div);
  }

  renderPagination();
  updateTotalPrice();
}

function updateQuantityDisplay(productId) {
  const quantityElements = document.querySelectorAll(`.quantity[data-id="${productId}"]`);
  const currentItems = sessionStorage.getItem('cart_items');
  const itemCount = currentItems ? currentItems.split(',').filter(id => id === productId.toString()).length : 0;
  
  quantityElements.forEach(element => {
    element.textContent = itemCount;
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const pagesCount = Math.ceil(filteredProducts.length / itemsPerPage);

  for (let i = 1; i <= pagesCount; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
    });
    pagination.appendChild(btn);
  }
}

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  filteredProducts = products.filter(p => p.name.toLowerCase().includes(query));
  currentPage = 1;
  renderProducts();
});

function createCartButton() {
  const cartButton = document.createElement('button');
  cartButton.textContent = '🛒 Корзина';
  cartButton.id = 'cart-button';
  cartButton.addEventListener('click', () => {
    window.location.href = '/Enduro-Sochi-/order/';
  });
  document.body.appendChild(cartButton);
}

const totalPriceElement = document.createElement('div');
totalPriceElement.id = 'total-price';
totalPriceElement.classList.add('total-price');
document.body.appendChild(totalPriceElement);

renderProducts();
createCartButton();