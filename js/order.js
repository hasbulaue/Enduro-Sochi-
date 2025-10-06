console.log(sessionStorage.getItem('cart_items'))

const products = [
  { id: 1, name: "Лапка КПП OTOM синяя", image: "../images/7195986433.jpg", price: 999 },
  { id: 2, name: "Лапка КПП OTOM красная", image: "../images/7195958399.jpg", price: 200 },
  { id: 3, name: "Руль IGP 22/28мм", image: "../images/z9248laqqj3ior01rgl6dc5ha2yth94c.jpg", price: 150 },
  { id: 4, name: "Руль IGP 22/28мм", image: "../images/9pz5qasv62j604s9b9ji2fe0ukjn6q6o.jpg", price: 300 },
  { id: 5, name: "Защита рук Zetta", image: "../images/7379477234.jpg", price: 250 },
  { id: 6, name: "Защита рук", image: "../images/7644093156.jpg", price: 180 },
  { id: 7, name: "Пульт Ктм, Кнопки запуска", image: "../images/dispositivo-luz-de-freno-bomba-nissin.jpg", price: 220 },
  { id: 9, name: "Пластик Ktm 20-22г", image: "../images/7097555750.jpg", price: 270 },
  { id: 10, name: "FEX чехол сиденья", image: "../images/fex-18-23526_xl.jpg", price: 320 },
  { id: 11, name: "Масло ZIC X9 4т", image: "../images/6143152451.jpg", price: 140 },
  { id: 12, name: "Масло LAVR 10w-40", image: "../images/7364265278.jpg", price: 210 },
  { id: 13, name: "Масло MOTUL 2т", image: "../images/324ae8c208cd36ef987fc92edf811c4a.jpeg", price: 100 },
];


function updateOrderTotal() {
    const cartItems = sessionStorage.getItem('cart_items');
    let totalPrice = 0;
    let itemCount = 0;
    
    if (cartItems && cartItems.trim() !== '') {
        const itemIds = cartItems.split(',').map(id => parseInt(id.trim()));
        itemIds.forEach(id => {
            const product = products.find(p => p.id === id);
            if (product) {
                totalPrice += product.price;
                itemCount++;
            }
        });
    }
    
    const totalPriceElement = document.getElementById('order-total');
    const itemCountElement = document.getElementById('item-count');
    const checkoutButton = document.getElementById('checkout-button');
    
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice} руб.`;
    }
    
    if (itemCountElement) {
        itemCountElement.textContent = `${itemCount} ${getItemsWord(itemCount)}`;
    }
    
    if (checkoutButton) {
        checkoutButton.disabled = itemCount === 0;
        if (itemCount === 0) {
            checkoutButton.style.opacity = '0.6';
            checkoutButton.style.cursor = 'not-allowed';
        } else {
            checkoutButton.style.opacity = '1';
            checkoutButton.style.cursor = 'pointer';
        }
    }
    
    return { totalPrice, itemCount };
}

function getItemsWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return 'товар';
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        return 'товара';
    } else {
        return 'товаров';
    }
}

function createEmptyCartMessage() {
    const emptyCartDiv = document.createElement('div');
    emptyCartDiv.classList.add('empty-cart');
    emptyCartDiv.innerHTML = `
        <div class="empty-cart-icon">🛒</div>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога, чтобы сделать заказ</p>
        <a href="/Enduro-Sochi-/" class="back-to-catalog">Вернуться в каталог</a>
    `;
    return emptyCartDiv;
}

function createOrderSummary() {
    const orderSummary = document.createElement('div');
    orderSummary.classList.add('order-summary');
    orderSummary.innerHTML = `
        <div class="summary-content">
            <div class="summary-row">
                <span>Товары:</span>
                <span id="item-count">0 товаров</span>
            </div>
            <div class="summary-row total">
                <span>Итого:</span>
                <span id="order-total">0 руб.</span>
            </div>
        </div>
        <button id="checkout-button" class="checkout-btn">
            Оформить заказ
        </button>
    `;
    
    orderSummary.querySelector('#checkout-button').addEventListener('click', function() {
        if (!this.disabled) {
            window.location.href = '/Enduro-Sochi-/login/';
        }
    });
    
    return orderSummary;
}

function createBackToCatalogButton() {
    const backButton = document.createElement('button');
    backButton.id = 'back-to-catalog-btn';
    backButton.classList.add('back-to-catalog-btn');
    backButton.innerHTML = '← Вернуться к каталогу';
    
    backButton.addEventListener('click', function() {
        window.location.href = '/Enduro-Sochi-/';
    });
    
    return backButton;
}

function toggleBackButtonVisibility(hasItems) {
    const backButton = document.getElementById('back-to-catalog-btn');
    if (backButton) {
        if (hasItems) {
            backButton.style.display = 'flex';
        } else {
            backButton.style.display = 'none';
        }
    }
}

function updateItemPrice(productId, newQuantity) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const itemTotalElement = document.querySelector(`.item-total[data-id="${productId}"]`);
        if (itemTotalElement) {
            const newTotal = product.price * newQuantity;
            itemTotalElement.textContent = `${newTotal} руб.`;
            
            itemTotalElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                itemTotalElement.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

function orderProducts() {
    const cartItems = sessionStorage.getItem('cart_items');
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    const oldOrderSummary = document.querySelector('.order-summary');
    if (oldOrderSummary) {
        oldOrderSummary.remove();
    }

    const oldBackButton = document.querySelector('.back-to-catalog-btn');
    if (oldBackButton) {
        oldBackButton.remove();
    }

    const orderSummary = createOrderSummary();
    document.body.appendChild(orderSummary);

    const backButton = createBackToCatalogButton();
    document.body.appendChild(backButton);

    const hasItems = cartItems && cartItems.trim() !== '';
    
    if (hasItems) {
        const itemIds = cartItems.split(',').map(id => parseInt(id.trim()));
        const itemCounts = {};
        
        itemIds.forEach(id => {
            itemCounts[id] = (itemCounts[id] || 0) + 1;
        });

        Object.keys(itemCounts).forEach(id => {
            const productId = parseInt(id);
            const product = products.find(p => p.id === productId);
            if (product) {
                const currentQuantity = itemCounts[productId];
                const div = document.createElement('div');
                div.classList.add('product');
                div.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <p class="product-name">${product.name}</p>
                    <p class="price">${product.price} руб.</p>
                    <div class="quantity-controls">
                        <button class="decrease-btn" data-id="${product.id}">-</button>
                        <span class="quantity" data-id="${product.id}">${currentQuantity}</span>
                        <button class="increase-btn" data-id="${product.id}">+</button>
                    </div>
                `;

                div.querySelector('.increase-btn').addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    const currentItems = sessionStorage.getItem('cart_items');
                    
                    if (currentItems) {
                        sessionStorage.setItem('cart_items', currentItems + ',' + productId);
                    } else {
                        sessionStorage.setItem('cart_items', productId.toString());
                    }
                    
                    const quantityElement = this.parentElement.querySelector('.quantity');
                    const newQuantity = parseInt(quantityElement.textContent) + 1;
                    quantityElement.textContent = newQuantity;
                    
                    updateItemPrice(productId, newQuantity);
                    
                    updateOrderTotal();
                    
                    toggleBackButtonVisibility(true);
                    
                    console.log('Товар добавлен в корзину');
                });

                div.querySelector('.decrease-btn').addEventListener('click', function() {
                    const productId = parseInt(this.dataset.id);
                    const currentItems = sessionStorage.getItem('cart_items');
                    
                    if (currentItems) {
                        const itemsArray = currentItems.split(',');
                        const index = itemsArray.indexOf(productId.toString());
                        if (index !== -1) {
                            itemsArray.splice(index, 1);
                            const newItems = itemsArray.join(',');
                            
                            if (newItems === '') {
                                sessionStorage.removeItem('cart_items');
                            } else {
                                sessionStorage.setItem('cart_items', newItems);
                            }
                            
                            const quantityElement = this.parentElement.querySelector('.quantity');
                            const newQuantity = parseInt(quantityElement.textContent) - 1;
                            
                            if (newQuantity > 0) {
                                quantityElement.textContent = newQuantity;
                                updateItemPrice(productId, newQuantity);
                                
                                updateOrderTotal();
                                console.log('Товар удален из корзины');
                            } else {
                                orderProducts();
                                return;
                            }
                        }
                    }
                });

                container.appendChild(div);
            }
        });
        
        toggleBackButtonVisibility(true);
        
    } else {
        const emptyCartMessage = createEmptyCartMessage();
        container.appendChild(emptyCartMessage);
        
        toggleBackButtonVisibility(false);
    }
    
    updateOrderTotal();
}

document.addEventListener('DOMContentLoaded', function() {
    orderProducts();
});