var cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <strong>${item.name}</strong> - Color: ${item.color}, Talla: ${item.size}
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                    <button onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            total += item.quantity * 10; // Precio fijo de $10 por unidad para simplificación
        });
    }
    cartTotalElement.innerText = `$${total.toFixed(2)}`;
}

function updateQuantity(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    } else if (change < 0) {
        removeFromCart(index);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

console.log("Carrito cargado: ", cart);

document.addEventListener('DOMContentLoaded', function() {
    renderCart();

    document.getElementById('goback-button').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    document.getElementById('checkout-button').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('El carrito está vacío. Añade productos antes de proceder al pago.');
        } else {
            // Mostrar el modal con la información del pedido
            const orderId = generateOrderId();
            document.getElementById('order-id').innerText = orderId;
            document.getElementById('checkout-modal').style.display = 'flex';
            
            // Vaciar el carrito y redirigir después de un tiempo
            setTimeout(function() {
                cart = [];
                localStorage.removeItem('cart');
                window.location.href = 'index.html';
            }, 3000);
        }
    });

    function generateOrderId() {
        return 'ORD-' + Math.floor(Math.random() * 1000000);
    }

    function closeModal() {
        document.getElementById('checkout-modal').style.display = 'none';
    }
});

function showNotification(message) {
    isNotificationActive = true;
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerText = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("fade-out");
        notification.addEventListener("transitionend", () => {
            notification.remove();
            isNotificationActive = false;
            processNotificationQueue();
        });
    }, 3000);
}

document.head.insertAdjacentHTML('beforeend', `
    <style>
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            opacity: 1;
            transition: opacity 0.5s, transform 0.5s;
        }
        .notification.fade-out {
            opacity: 0;
            transform: translateY(20px);
        }
    </style>
`);