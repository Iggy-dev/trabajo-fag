// Simulación del carrito de compras
let cart = [];
let notificationQueue = [];
let isNotificationActive = false;

// Añadir producto al carrito
document.getElementById("add-to-cart-button").addEventListener("click", function() {
    const color = document.getElementById("color").value;
    const size = document.getElementById("size").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    const product = {
        name: "Vaso de Fiesta",
        color: color,
        size: size,
        quantity: quantity
    };

    addToCart(product);
    updateCartCount();
    addNotificationToQueue("Producto añadido al carrito!");
});

document.getElementById("cart-button").addEventListener("click", function() {
    window.location.href = 'cart.html'; // Redirigir a la página de carrito
});

// Función para añadir un producto al carrito
function addToCart(product) {
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.name === product.name && item.color === product.color && item.size === product.size);
    if (existingProductIndex !== -1) {
        // Si ya está, actualizar la cantidad
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Si no está, añadir al carrito
        cart.push(product);
    }

    // Guardar el carrito en el almacenamiento local
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").innerText = cartCount;
}

// Función para añadir notificación a la cola
function addNotificationToQueue(message) {
    notificationQueue.push(message);
    processNotificationQueue();
}

// Función para procesar la cola de notificaciones
function processNotificationQueue() {
    if (!isNotificationActive && notificationQueue.length > 0) {
        const message = notificationQueue.shift();
        showNotification(message);
    }
}

// Función para mostrar la notificación
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

// Cargar el carrito desde el almacenamiento local cuando la página se carga
window.addEventListener('load', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});

