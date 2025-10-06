const products = [
  { id: 1, name: "Лапка КПП OTOM синяя", image: "../images/7195958399.jpg", price: 999 },
  { id: 2, name: "Лапка КПП OTOM красная", image: "../images/7195958399.jpg", price: 999 },
  { id: 3, name: "Руль IGP 22/28мм", image: "../images/z9248laqqj3ior01rgl6dc5ha2yth94c.jpg", price: 3999 },
  { id: 4, name: "Руль IGP 22/28мм", image: "../images/9pz5qasv62j604s9b9ji2fe0ukjn6q6o.jpg", price: 3999 },
  { id: 5, name: "Защита рук Zetta", image: "../images/7379477234.jpg", price: 2500 },
  { id: 6, name: "Защита рук", image: "../images/7644093156.jpg", price: 3000 },
  { id: 7, name: "Пульт Ктм, Кнопки запуска", image: "../images/dispositivo-luz-de-freno-bomba-nissin.jpg", price: 4599 },
  { id: 9, name: "Пластик Ktm 20-22г", image: "../images/7097555750.jpg", price: 5700 },
  { id: 10, name: "FEX чехол сиденья", image: "../images/fex-18-23526_xl.jpg", price: 1500 },
  { id: 11, name: "Масло ZIC X9 4т", image: "../images/6143152451.jpg", price: 900 },
  { id: 12, name: "Масло LAVR 10w-40", image: "../images/7364265278.jpg", price: 800 },
  { id: 13, name: "Масло MOTUL 2т", image: "../images/324ae8c208cd36ef987fc92edf811c4a.jpeg", price: 1500 },
];




function getCartItemsInfo() {
    const cartItems = sessionStorage.getItem('cart_items');
    let itemsInfo = [];
    let totalPrice = 0;
    
    if (cartItems && cartItems.trim() !== '') {
        const itemIds = cartItems.split(',').map(id => parseInt(id.trim()));
        const itemCounts = {};
        
        itemIds.forEach(id => {
            itemCounts[id] = (itemCounts[id] || 0) + 1;
        });
        
        Object.keys(itemCounts).forEach(id => {
            const productId = parseInt(id);
            const product = products.find(p => p.id === productId);
            if (product) {
                const quantity = itemCounts[productId];
                const itemTotal = product.price * quantity;
                totalPrice += itemTotal;
                
                itemsInfo.push({
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    total: itemTotal
                });
            }
        });
    }
    
    return { items: itemsInfo, total: totalPrice };
}

function formatOrderMessage(customerInfo, cartInfo) {
    let message = `
🛒 НОВЫЙ ЗАКАЗ С САЙТА

👤 КОНТАКТНАЯ ИНФОРМАЦИЯ:
Имя: ${customerInfo.name}
Email: ${customerInfo.email}
Телефон: ${customerInfo.phone}
Адрес Доставки: ${customerInfo.message}

📦 СОСТАВ ЗАКАЗА:
`;

    if (cartInfo.items.length === 0) {
        message += "Корзина пуста\n";
    } else {
        cartInfo.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Цена: ${item.price} руб. × ${item.quantity} = ${item.total} руб.\n\n`;
        });
    }

    message += `\n💰 ИТОГО: ${cartInfo.total} руб.`;

    return message.trim();
}

document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    const cartInfo = getCartItemsInfo();
    
    const telegramMessage = formatOrderMessage(formData, cartInfo);
    
    const botToken = '8166774313:AAEsNleY3OGFMK4EFMB0aJKbFdwtmvvgKg4';
    const chatId = '840202518';
    
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        const messageBox = document.getElementById('messageBox');
        if (data.ok) {
            messageBox.textContent = 'Заказ успешно отправлен!';
            messageBox.className = 'message success';
            document.getElementById('feedbackForm').reset();
            
            sessionStorage.removeItem('cart_items');
            
            setTimeout(() => {
                window.location.href = '/Enduro-Sochi-/orderdone/';
            }, 2000);
        } else {
            messageBox.textContent = 'Ошибка при отправке заказа. Попробуйте еще раз.';
            messageBox.className = 'message error';
        }
        messageBox.style.display = 'block';
    })
    .catch(error => {
        const messageBox = document.getElementById('messageBox');
        messageBox.textContent = 'Ошибка соединения. Попробуйте еще раз.';
        messageBox.className = 'message error';
        messageBox.style.display = 'block';
        console.error('Error:', error);
    });
});

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
            window.location.href = '/Enduro-Sochi-/order/';
        }
    });
    
    return orderSummary;
}