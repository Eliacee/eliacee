
let cart = [];
let cartTotal = 0;


let menuQuantities = {};


function updateMenuQuantity(itemName, change) {
    if (!menuQuantities[itemName]) {
        menuQuantities[itemName] = 1;
    }
    
    menuQuantities[itemName] += change;
    
    if (menuQuantities[itemName] < 1) {
        menuQuantities[itemName] = 1;
    }
    
    const qtyElement = document.getElementById('qty-' + itemName);
    if (qtyElement) {
        qtyElement.textContent = menuQuantities[itemName];
    }
}


function addToCartWithQuantity(name, price, image) {
    const quantity = menuQuantities[name] || 1;
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: quantity
        });
    }
    
    
    menuQuantities[name] = 1;
    const qtyElement = document.getElementById('qty-' + name);
    if (qtyElement) {
        qtyElement.textContent = 1;
    }
    
    updateCart();
    showCartNotification();
}


function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}


function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index > -1) {
        cart.splice(index, 1);
    }
    updateCart();
}


function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCart();
        }
    }
}


function calculateTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    return cartTotal;
}


function updateCart() {
    calculateTotal();
    
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>₱${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.name}', 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (cartCount) {
        cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);
    }
    
    if (cartTotal) {
        cartTotal.textContent = '₱' + calculateTotal().toFixed(2);
    }
    
    
    localStorage.setItem('cart', JSON.stringify(cart));
}


function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('active');
}


function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.remove('active');
}


function showCartNotification() {
    const notification = document.getElementById('cart-notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}


function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = calculateTotal();
    const confirmOrder = confirm(`Order Total: ₱${total.toFixed(2)}\n\nProceed to checkout?`);
    
    if (confirmOrder) {
        alert('Thank you for your order! We will contact you shortly to confirm your order.');
        cart = [];
        updateCart();
        closeCart();
    }
}


function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}


document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
   
    const cartModal = document.getElementById('cart-modal');
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCart();
        }
    });
});

