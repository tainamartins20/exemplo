// Products Data
const products = [
    {
        id: '1',
        name: "Vestido Elegante Preto",
        price: 289.90,
        category: "social",
        image: "https://images.unsplash.com/photo-1568251188392-ae32f898cb3b",
        imageHover: "https://images.unsplash.com/photo-1612336307429-8a898d10e223",
        description: "Vestido elegante perfeito para ocasiões especiais"
    },
    {
        id: '2',
        name: "Conjunto Casual Branco",
        price: 189.90,
        category: "casual",
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd",
        imageHover: "https://images.unsplash.com/photo-1603344797033-f0f4f587ab60",
        description: "Conjunto casual confortável para o dia a dia"
    },
    {
        id: '3',
        name: "Look Fitness Premium",
        price: 159.90,
        category: "fitness",
        image: "https://images.unsplash.com/photo-1637714619771-50f333a6066b",
        imageHover: "https://images.unsplash.com/photo-1762331658154-8aa265ca21e5",
        description: "Conjunto fitness de alta performance"
    },
    {
        id: '4',
        name: "Vestido Marrom Sofisticado",
        price: 319.90,
        category: "social",
        image: "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb",
        imageHover: "https://images.unsplash.com/photo-1638717366457-dbcaf6b1afbc",
        description: "Vestido sofisticado em tons terrosos"
    },
    {
        id: '5',
        name: "Trench Coat Moderno",
        price: 449.90,
        category: "casual",
        image: "https://images.unsplash.com/photo-1716004360220-213371f51df1",
        imageHover: "https://images.unsplash.com/photo-1760551937537-a29dbbfab30b",
        description: "Trench coat clássico e atemporal"
    },
    {
        id: '6',
        name: "Conjunto Verde Primavera",
        price: 199.90,
        category: "novidades",
        image: "https://images.unsplash.com/photo-1687825496176-1f881ebb6697",
        imageHover: "https://images.pexels.com/photos/34599220/pexels-photo-34599220.jpeg",
        description: "Nova coleção primavera com cores vibrantes"
    },
    {
        id: '7',
        name: "Vestido Turquesa Boutique",
        price: 279.90,
        category: "novidades",
        image: "https://images.unsplash.com/photo-1760287363707-851f4780b98c",
        imageHover: "https://images.pexels.com/photos/34563081/pexels-photo-34563081.jpeg",
        description: "Peça exclusiva da nova coleção"
    },
    {
        id: '8',
        name: "Look Fitness Conforto",
        price: 169.90,
        category: "fitness",
        image: "https://images.pexels.com/photos/3820312/pexels-photo-3820312.jpeg",
        imageHover: "https://images.pexels.com/photos/4625046/pexels-photo-4625046.jpeg",
        description: "Conjunto fitness com máximo conforto"
    }
];

// Cart and Wishlist State
let cart = JSON.parse(localStorage.getItem('elegance-cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('elegance-wishlist')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCart();
    initializeWishlist();
    loadProducts();
    updateCounts();
});

// Navigation
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Cart Functions
function initializeCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartOverlay.classList.add('open');
            cartSidebar.classList.add('open');
            renderCart();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }
}

function closeCartSidebar() {
    document.getElementById('cartOverlay').classList.remove('open');
    document.getElementById('cartSidebar').classList.remove('open');
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCounts();
    showToast('Produto adicionado ao carrinho!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCounts();
    renderCart();
    showToast('Produto removido do carrinho', 'success');
}

function updateQuantity(productId, quantity) {
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart();
        updateCounts();
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartItemCount = document.getElementById('cartItemCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    cartItemCount.textContent = getCartCount();
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Seu carrinho está vazio</p>
                <button onclick="closeCartSidebar()" class="btn-primary">Continuar Comprando</button>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-testid="cart-item-${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>R$ ${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})" data-testid="decrease-qty-${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span data-testid="item-quantity-${item.id}">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})" data-testid="increase-qty-${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')" data-testid="remove-item-${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                    <p class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `).join('');
        
        cartFooter.style.display = 'block';
        cartTotal.textContent = `R$ ${getCartTotal().toFixed(2)}`;
    }
}

function saveCart() {
    localStorage.setItem('elegance-cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Wishlist Functions
function initializeWishlist() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistOverlay = document.getElementById('wishlistOverlay');
    const closeWishlist = document.getElementById('closeWishlist');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            wishlistOverlay.classList.add('open');
            wishlistSidebar.classList.add('open');
            renderWishlist();
        });
    }
    
    if (closeWishlist) {
        closeWishlist.addEventListener('click', closeWishlistSidebar);
    }
    
    if (wishlistOverlay) {
        wishlistOverlay.addEventListener('click', closeWishlistSidebar);
    }
}

function closeWishlistSidebar() {
    document.getElementById('wishlistOverlay').classList.remove('open');
    document.getElementById('wishlistSidebar').classList.remove('open');
}

function toggleWishlist(product) {
    const index = wishlist.findIndex(item => item.id === product.id);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removido dos favoritos', 'success');
    } else {
        wishlist.push(product);
        showToast('Adicionado aos favoritos!', 'success');
    }
    
    saveWishlist();
    updateCounts();
    
    // Update wishlist button in products
    updateWishlistButtons();
}

function renderWishlist() {
    const wishlistItems = document.getElementById('wishlistItems');
    const wishlistItemCount = document.getElementById('wishlistItemCount');
    
    if (!wishlistItems) return;
    
    wishlistItemCount.textContent = wishlist.length;
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart"></i>
                <p>Nenhum favorito ainda</p>
                <button onclick="closeWishlistSidebar()" class="btn-primary">Explorar Produtos</button>
            </div>
        `;
    } else {
        wishlistItems.innerHTML = wishlist.map(item => `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">R$ ${item.price.toFixed(2)}</p>
                    <button onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="btn-primary" style="margin-top: 10px; font-size: 14px; padding: 8px 16px;">
                        <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                    </button>
                </div>
                <div class="item-actions">
                    <button class="remove-wishlist-btn" onclick="toggleWishlist(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function saveWishlist() {
    localStorage.setItem('elegance-wishlist', JSON.stringify(wishlist));
}

function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

function updateWishlistButtons() {
    document.querySelectorAll('.wishlist-btn-product').forEach(btn => {
        const productId = btn.dataset.productId;
        if (isInWishlist(productId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Update Counts
function updateCounts() {
    const cartCount = document.getElementById('cartCount');
    const wishlistCount = document.getElementById('wishlistCount');
    
    if (cartCount) {
        const count = getCartCount();
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    
    if (wishlistCount) {
        const count = wishlist.length;
        wishlistCount.textContent = count;
        wishlistCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Load Products
function loadProducts() {
    const homeProducts = document.getElementById('homeProducts');
    const allProducts = document.getElementById('allProducts');
    
    if (homeProducts) {
        // Show only first 4 products on home page
        const displayProducts = products.slice(0, 4);
        homeProducts.innerHTML = displayProducts.map(createProductCard).join('');
    }
    
    if (allProducts) {
        allProducts.innerHTML = products.map(createProductCard).join('');
        updateProductsCount('all');
        
        // Add filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                filterProducts(category);
            });
        });
    }
}

function createProductCard(product) {
    const inWishlist = isInWishlist(product.id);
    return `
        <div class="product-card" data-testid="product-${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <img src="${product.imageHover}" alt="${product.name}" class="product-image-hover">
                <button 
                    class="wishlist-btn-product ${inWishlist ? 'active' : ''}" 
                    data-product-id="${product.id}"
                    data-testid="wishlist-product-${product.id}"
                    onclick='toggleWishlist(${JSON.stringify(product).replace(/'/g, "\\'")})'>
                    <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <button 
                    class="add-to-cart-btn" 
                    data-testid="add-to-cart-btn-${product.id}"
                    onclick='addToCart(${JSON.stringify(product).replace(/'/g, "\\'")})'> 
                    <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
}

function filterProducts(category) {
    const allProducts = document.getElementById('allProducts');
    const noProducts = document.getElementById('noProducts');
    
    if (!allProducts) return;
    
    let filtered = category === 'all' ? products : products.filter(p => p.category === category);
    
    if (filtered.length === 0) {
        allProducts.style.display = 'none';
        noProducts.style.display = 'block';
    } else {
        allProducts.style.display = 'grid';
        noProducts.style.display = 'none';
        allProducts.innerHTML = filtered.map(createProductCard).join('');
    }
    
    updateProductsCount(category);
}

function updateProductsCount(category) {
    const productsCount = document.getElementById('productsCount');
    if (!productsCount) return;
    
    let filtered = category === 'all' ? products : products.filter(p => p.category === category);
    const count = filtered.length;
    productsCount.textContent = `Mostrando ${count} ${count === 1 ? 'produto' : 'produtos'}`;
}

// Checkout
function openCheckout() {
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio', 'error');
        return;
    }
    
    closeCartSidebar();
    const modal = document.getElementById('checkoutModal');
    modal.classList.add('open');
    
    renderCheckoutSummary();
    
    const closeCheckout = document.getElementById('closeCheckout');
    closeCheckout.addEventListener('click', () => {
        modal.classList.remove('open');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });
    
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
}

function renderCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    checkoutSummary.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} x${item.quantity}</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    checkoutTotal.textContent = `R$ ${getCartTotal().toFixed(2)}`;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!data.name || !data.phone || !data.street || !data.number || !data.city || !data.state) {
        showToast('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    // Format WhatsApp message
    const phone = '5511999999999';
    let message = `🛍️ *NOVO PEDIDO - ELEGANCE BOUTIQUE*\n\n`;
    message += `👤 *DADOS DO CLIENTE*\n`;
    message += `Nome: ${data.name}\n`;
    message += `Telefone: ${data.phone}\n`;
    message += `Email: ${data.email || 'Não informado'}\n\n`;
    message += `📍 *ENDEREÇO DE ENTREGA*\n`;
    message += `${data.street}, ${data.number}`;
    if (data.complement) message += ` - ${data.complement}`;
    message += `\n${data.neighborhood}\n`;
    message += `${data.city} - ${data.state}\n`;
    message += `CEP: ${data.zipCode || 'Não informado'}\n\n`;
    message += `🛒 *PRODUTOS*\n`;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Qtd: ${item.quantity} | Preço: R$ ${item.price.toFixed(2)}\n`;
        message += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    message += `💰 *VALOR TOTAL: R$ ${getCartTotal().toFixed(2)}*\n\n`;
    message += `✅ Aguardando confirmação e envio!`;
    
    // Open WhatsApp
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Clear cart and close modal
    cart = [];
    saveCart();
    updateCounts();
    
    document.getElementById('checkoutModal').classList.remove('open');
    showToast('Pedido enviado! Aguarde o contato da nossa equipe.', 'success');
    
    // Reset form
    e.target.reset();
}

// WhatsApp
function openWhatsApp() {
    const phone = '5511999999999';
    const message = 'Olá! Gostaria de saber mais sobre as coleções da Elegance Boutique.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
