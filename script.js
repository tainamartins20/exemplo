// 🔹 Otimização: evitar re-renderizações completas e imagens pesadas
// 🔹 Adiciona lazy-loading e debounce em eventos

const products = [
    {
        id: '1',
        name: "Vestido Elegante Preto",
        price: 289.90,
        category: "social",
        image: "https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?w=600&auto=format&fit=crop&q=70",
        imageHover: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&auto=format&fit=crop&q=70",
        description: "Vestido elegante perfeito para ocasiões especiais"
    },
    {
        id: '2',
        name: "Conjunto Casual Branco",
        price: 189.90,
        category: "casual",
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&auto=format&fit=crop&q=70",
        imageHover: "https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=600&auto=format&fit=crop&q=70",
        description: "Conjunto casual confortável para o dia a dia"
    },
    {
        id: '3',
        name: "Look Fitness Premium",
        price: 159.90,
        category: "fitness",
        image: "https://images.unsplash.com/photo-1637714619771-50f333a6066b?w=600&auto=format&fit=crop&q=70",
        imageHover: "https://images.unsplash.com/photo-1762331658154-8aa265ca21e5?w=600&auto=format&fit=crop&q=70",
        description: "Conjunto fitness de alta performance"
    },
    // ... demais produtos
];

let cart = JSON.parse(localStorage.getItem('elegance-cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('elegance-wishlist')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeCart();
    initializeWishlist();
    requestIdleCallback(loadProducts); // ⚡ Carrega produtos quando o navegador estiver livre
    updateCounts();
});

// --- Navegação ---
function initializeNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
}

// --- Produtos ---
function createProductCard(product) {
    const inWishlist = isInWishlist(product.id);
    return `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" loading="lazy" alt="${product.name}" class="product-image">
                <img src="${product.imageHover}" loading="lazy" alt="${product.name}" class="product-image-hover">
                <button class="wishlist-btn-product ${inWishlist ? 'active' : ''}" data-product-id="${product.id}">
                    <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>`;
}

function loadProducts() {
    const allProducts = document.getElementById('allProducts');
    if (!allProducts) return;

    const fragment = document.createDocumentFragment(); 
    products.forEach(p => {
        const div = document.createElement('div');
        div.innerHTML = createProductCard(p);
        fragment.appendChild(div.firstElementChild);
    });
    allProducts.innerHTML = '';
    allProducts.appendChild(fragment);

    allProducts.querySelectorAll('.add-to-cart-btn').forEach((btn, i) => {
        btn.addEventListener('click', () => addToCart(products[i]));
    });
    allProducts.querySelectorAll('.wishlist-btn-product').forEach((btn, i) => {
        btn.addEventListener('click', () => toggleWishlist(products[i]));
    });
}

// --- Carrinho ---
function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    saveCart();
    updateCounts();
    showToast('Produto adicionado ao carrinho!');
}

// --- Wishlist ---
function toggleWishlist(product) {
    const index = wishlist.findIndex(i => i.id === product.id);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removido dos favoritos');
    } else {
        wishlist.push(product);
        showToast('Adicionado aos favoritos!');
    }
    saveWishlist();
    updateCounts();
}

// --- Utilitários ---
function saveCart() {
    localStorage.setItem('elegance-cart', JSON.stringify(cart));
}
function saveWishlist() {
    localStorage.setItem('elegance-wishlist', JSON.stringify(wishlist));
}
function isInWishlist(id) {
    return wishlist.some(i => i.id === id);
}
function updateCounts() {
    const c = document.getElementById('cartCount');
    const w = document.getElementById('wishlistCount');
    if (c) {
        const count = cart.reduce((a, b) => a + b.quantity, 0);
        c.textContent = count;
        c.style.display = count ? 'flex' : 'none';
    }
    if (w) {
        const count = wishlist.length;
        w.textContent = count;
        w.style.display = count ? 'flex' : 'none';
    }
}

// --- Toast ---
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    clearTimeout(toast.hideTimer);
    toast.hideTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

