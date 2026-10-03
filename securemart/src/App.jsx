import { useMemo, useState } from "react";

const products = [
  {
    id: 1,
    name: "Nova X Pro Smartphone",
    category: "Electronics",
    price: 34999,
    oldPrice: 42999,
    rating: 4.6,
    reviews: 1248,
    emoji: "📱",
    badge: "Best Seller",
    description:
      "Premium smartphone with a high-resolution display, powerful processor and all-day battery.",
  },
  {
    id: 2,
    name: "AeroBook Pro 15",
    category: "Electronics",
    price: 74999,
    oldPrice: 84999,
    rating: 4.8,
    reviews: 642,
    emoji: "💻",
    badge: "Top Rated",
    description:
      "Powerful laptop designed for productivity, development and entertainment.",
  },
  {
    id: 3,
    name: "SonicWave Wireless Headphones",
    category: "Electronics",
    price: 2499,
    oldPrice: 3999,
    rating: 4.4,
    reviews: 2891,
    emoji: "🎧",
    badge: "Deal",
    description:
      "Wireless headphones with deep bass, active noise cancellation and long battery life.",
  },
  {
    id: 4,
    name: "Mecha RGB Gaming Keyboard",
    category: "Gaming",
    price: 2999,
    oldPrice: 4499,
    rating: 4.5,
    reviews: 876,
    emoji: "⌨️",
    badge: "Popular",
    description:
      "Mechanical RGB keyboard with tactile switches and customizable lighting.",
  },
  {
    id: 5,
    name: "Velocity Gaming Mouse",
    category: "Gaming",
    price: 1499,
    oldPrice: 2199,
    rating: 4.5,
    reviews: 1352,
    emoji: "🖱️",
    badge: "Deal",
    description:
      "High precision gaming mouse with adjustable DPI and ergonomic design.",
  },
  {
    id: 6,
    name: "Urban Runner Sneakers",
    category: "Fashion",
    price: 2799,
    oldPrice: 3999,
    rating: 4.3,
    reviews: 923,
    emoji: "👟",
    badge: "Trending",
    description:
      "Comfortable everyday sneakers designed for walking, running and casual wear.",
  },
  {
    id: 7,
    name: "Classic Denim Jacket",
    category: "Fashion",
    price: 2299,
    oldPrice: 3299,
    rating: 4.2,
    reviews: 421,
    emoji: "🧥",
    badge: "New",
    description:
      "Classic denim jacket with a modern fit suitable for everyday styling.",
  },
  {
    id: 8,
    name: "AquaSteel Thermal Bottle",
    category: "Home",
    price: 899,
    oldPrice: 1299,
    rating: 4.7,
    reviews: 1823,
    emoji: "🥤",
    badge: "Best Seller",
    description:
      "Insulated stainless steel bottle that keeps drinks hot or cold for hours.",
  },
  {
    id: 9,
    name: "LumaDesk LED Lamp",
    category: "Home",
    price: 1299,
    oldPrice: 1899,
    rating: 4.4,
    reviews: 612,
    emoji: "💡",
    badge: "Deal",
    description:
      "Adjustable LED desk lamp with multiple brightness modes and a modern design.",
  },
  {
    id: 10,
    name: "Galaxy Explorer Backpack",
    category: "Fashion",
    price: 1799,
    oldPrice: 2499,
    rating: 4.5,
    reviews: 735,
    emoji: "🎒",
    badge: "Popular",
    description:
      "Spacious everyday backpack with laptop compartment and water-resistant material.",
  },
  {
    id: 11,
    name: "Pro Controller X",
    category: "Gaming",
    price: 3999,
    oldPrice: 4999,
    rating: 4.6,
    reviews: 534,
    emoji: "🎮",
    badge: "Top Rated",
    description:
      "Wireless gaming controller with responsive triggers and ergonomic grips.",
  },
  {
    id: 12,
    name: "Smart Fitness Watch",
    category: "Electronics",
    price: 4999,
    oldPrice: 6999,
    rating: 4.5,
    reviews: 1540,
    emoji: "⌚",
    badge: "Trending",
    description:
      "Smartwatch with activity tracking, notifications, heart-rate monitoring and more.",
  },
];

const categories = [
  { name: "All", icon: "✨" },
  { name: "Electronics", icon: "📱" },
  { name: "Gaming", icon: "🎮" },
  { name: "Fashion", icon: "👕" },
  { name: "Home", icon: "🏠" },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [sort, setSort] = useState("featured");
  const [toast, setToast] = useState("");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, search, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function showToast(message) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    showToast(`${product.name} added to cart`);
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  function updateQuantity(productId, change) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleWishlist(product) {
    setWishlist((current) => {
      const exists = current.includes(product.id);

      if (exists) {
        showToast("Removed from wishlist");
        return current.filter((id) => id !== product.id);
      }

      showToast("Added to wishlist");
      return [...current, product.id];
    });
  }

  function selectCategory(category) {
    setActiveCategory(category);
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-main">
          <div className="logo" onClick={() => window.scrollTo({ top: 0 })}>
            <div className="logo-mark">S</div>
            <div>
              <div className="logo-text">Secure<span>Mart</span></div>
              <div className="logo-subtitle">Shop Smart. Shop Secure.</div>
            </div>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰
          </button>

          <div className="search-wrapper">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="search-button">⌕</button>
          </div>

          <div className="header-actions">
            <button
              className="header-action"
              onClick={() => setShowAccount(true)}
            >
              <span className="action-icon">👤</span>
              <span>
                <small>Hello, Sign in</small>
                <strong>Account</strong>
              </span>
            </button>

            <button
              className="header-action wishlist-header"
              onClick={() => showToast(`${wishlist.length} items in wishlist`)}
            >
              <span className="action-icon">♡</span>
              <span>
                <small>My</small>
                <strong>Wishlist</strong>
              </span>
              {wishlist.length > 0 && (
                <b className="count-badge">{wishlist.length}</b>
              )}
            </button>

            <button
              className="cart-button"
              onClick={() => setShowCart(true)}
            >
              <span className="cart-icon">🛒</span>
              <span>Cart</span>
              {cartCount > 0 && (
                <b className="cart-count">{cartCount}</b>
              )}
            </button>
          </div>
        </div>

        <nav className={`navigation ${showMenu ? "navigation-open" : ""}`}>
          <button onClick={() => setShowMenu(false)}>☰ All</button>
          <button onClick={() => selectCategory("Electronics")}>
            Electronics
          </button>
          <button onClick={() => selectCategory("Gaming")}>Gaming</button>
          <button onClick={() => selectCategory("Fashion")}>Fashion</button>
          <button onClick={() => selectCategory("Home")}>Home & Kitchen</button>
          <button onClick={() => showToast("Today's deals opened")}>
            Today's Deals
          </button>
          <button onClick={() => showToast("Best sellers opened")}>
            Best Sellers
          </button>
          <button onClick={() => showToast("New arrivals opened")}>
            New Arrivals
          </button>
          <button onClick={() => showToast("Customer service opened")}>
            Customer Service
          </button>
        </nav>
      </header>

      {/* HERO */}
      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-tag">⚡ SECURE DEALS OF THE DAY</div>

            <h1>
              Everything you need.
              <br />
              <span>One secure marketplace.</span>
            </h1>

            <p>
              Discover great products from trusted sellers with a shopping
              experience designed with security in mind.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() => selectCategory("All")}
              >
                Shop Now →
              </button>

              <button
                className="secondary-button"
                onClick={() => selectCategory("Electronics")}
              >
                Explore Electronics
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <strong>50K+</strong>
                <span>Products</span>
              </div>
              <div>
                <strong>10K+</strong>
                <span>Happy Customers</span>
              </div>
              <div>
                <strong>500+</strong>
                <span>Trusted Sellers</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-card card-one">
              <span>🔒</span>
              <div>
                <strong>Secure Shopping</strong>
                <small>Your security matters</small>
              </div>
            </div>

            <div className="hero-product">
              <div className="hero-product-circle">📱</div>
              <div className="hero-product-info">
                <span>FEATURED PRODUCT</span>
                <h3>Nova X Pro</h3>
                <strong>{formatPrice(34999)}</strong>
              </div>
            </div>

            <div className="floating-card card-two">
              <span>⚡</span>
              <div>
                <strong>Fast Delivery</strong>
                <small>Across India</small>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE</span>
              <h2>Shop by Category</h2>
            </div>

            <button
              className="text-button"
              onClick={() => selectCategory("All")}
            >
              View all →
            </button>
          </div>

          <div className="category-grid">
            {categories.slice(1).map((category) => (
              <button
                className="category-card"
                key={category.name}
                onClick={() => selectCategory(category.name)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <span>
                  {products.filter((p) => p.category === category.name).length}{" "}
                  products
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* SECURITY PROMO */}
        <section className="security-banner">
          <div className="security-icon">🛡️</div>

          <div>
            <span className="section-label">SECURE BY DESIGN</span>
            <h2>Your shopping security matters to us.</h2>
            <p>
              SecureMart is designed to monitor system activity and protect
              your shopping experience.
            </p>
          </div>

          <button
            className="security-button"
            onClick={() => showToast("Secure shopping information opened")}
          >
            Learn More →
          </button>
        </section>

        {/* PRODUCTS */}
        <section className="section products-section" id="products">
          <div className="section-heading products-heading">
            <div>
              <span className="section-label">DISCOVER</span>
              <h2>Popular Products</h2>
              <p>{filteredProducts.length} products available</p>
            </div>

            <div className="sort-area">
              <label htmlFor="sort">Sort by</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-search">
              <div>🔍</div>
              <h3>No products found</h3>
              <p>Try another search term or category.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onWishlist={() => toggleWishlist(product)}
                  onAdd={() => addToCart(product)}
                  onView={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </section>

        {/* TRUST SECTION */}
        <section className="trust-section">
          <div className="trust-card">
            <span>🚚</span>
            <div>
              <h3>Fast Delivery</h3>
              <p>Reliable delivery across India</p>
            </div>
          </div>

          <div className="trust-card">
            <span>🔐</span>
            <div>
              <h3>Secure Payments</h3>
              <p>Your payment information is protected</p>
            </div>
          </div>

          <div className="trust-card">
            <span>↩️</span>
            <div>
              <h3>Easy Returns</h3>
              <p>Simple and convenient returns</p>
            </div>
          </div>

          <div className="trust-card">
            <span>✓</span>
            <div>
              <h3>Verified Sellers</h3>
              <p>Shop with confidence</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="logo footer-logo">
              <div className="logo-mark">S</div>
              <div className="logo-text">
                Secure<span>Mart</span>
              </div>
            </div>

            <p>
              A modern e-commerce marketplace designed around a secure,
              intelligent shopping experience.
            </p>

            <div className="footer-social">
              <span>f</span>
              <span>𝕏</span>
              <span>◎</span>
              <span>in</span>
            </div>
          </div>

          <div className="footer-column">
            <h3>Get to Know Us</h3>
            <button>About SecureMart</button>
            <button>Careers</button>
            <button>Press</button>
            <button>Our Technology</button>
          </div>

          <div className="footer-column">
            <h3>Customer Service</h3>
            <button>Help Center</button>
            <button>Returns</button>
            <button>Shipping</button>
            <button>Contact Us</button>
          </div>

          <div className="footer-column">
            <h3>For Sellers</h3>
            <button>Sell on SecureMart</button>
            <button>Seller Center</button>
            <button>Seller Policies</button>
            <button>Partner With Us</button>
          </div>

          <div className="footer-column">
            <h3>Security</h3>
            <button>Privacy</button>
            <button>Security Center</button>
            <button>Report an Issue</button>
            <button>Terms of Service</button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 SecureMart. All rights reserved.</span>
          <span>🔒 Secure shopping experience</span>
        </div>
      </footer>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            <div className="modal-product-image">
              <span>{selectedProduct.emoji}</span>
              <div className="modal-badge">{selectedProduct.badge}</div>
            </div>

            <div className="modal-product-details">
              <span className="product-category">
                {selectedProduct.category}
              </span>

              <h2>{selectedProduct.name}</h2>

              <div className="rating">
                <strong>{selectedProduct.rating}</strong>
                <span>★</span>
                <small>{selectedProduct.reviews} ratings</small>
              </div>

              <p>{selectedProduct.description}</p>

              <div className="modal-price">
                <strong>{formatPrice(selectedProduct.price)}</strong>
                <del>{formatPrice(selectedProduct.oldPrice)}</del>
              </div>

              <div className="delivery-box">
                <span>🚚</span>
                <div>
                  <strong>Free delivery</strong>
                  <p>Delivery available across India</p>
                </div>
              </div>

              <button
                className="primary-button full-button"
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {showCart && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="section-label">YOUR SHOPPING</span>
                <h2>Cart</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowCart(false)}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div>🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add products to get started.</p>
                <button
                  className="primary-button"
                  onClick={() => setShowCart(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-image">{item.emoji}</div>

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <strong>{formatPrice(item.price)}</strong>

                        <div className="quantity-control">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-button"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <strong className="free">FREE</strong>
                  </div>

                  <div className="summary-total">
                    <span>Total</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>

                  <button
                    className="primary-button full-button"
                    onClick={() => {
                      showToast("Checkout will be connected to the backend later");
                      setShowCart(false);
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* ACCOUNT MODAL */}
      {showAccount && (
        <div
          className="modal-overlay"
          onClick={() => setShowAccount(false)}
        >
          <div className="account-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowAccount(false)}
            >
              ×
            </button>

            <div className="account-icon">👤</div>

            <h2>Welcome to SecureMart</h2>
            <p>Sign in to access your account, orders and wishlist.</p>

            <input
              className="modal-input"
              type="email"
              placeholder="Email address"
            />

            <input
              className="modal-input"
              type="password"
              placeholder="Password"
            />

            <button
              className="primary-button full-button"
              onClick={() => {
                showToast("Authentication will be connected to FastAPI later");
                setShowAccount(false);
              }}
            >
              Sign In
            </button>

            <p className="signup-text">
              New to SecureMart? <button>Create an account</button>
            </p>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function ProductCard({
  product,
  isWishlisted,
  onWishlist,
  onAdd,
  onView,
}) {
  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <article className="product-card">
      <div className="product-image">
        <button
          className={`wishlist-button ${
            isWishlisted ? "wishlisted" : ""
          }`}
          onClick={onWishlist}
          aria-label="Add to wishlist"
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

        <span className="product-emoji">{product.emoji}</span>

        <div className="product-badge">{product.badge}</div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>

        <h3 onClick={onView}>{product.name}</h3>

        <div className="rating">
          <strong>{product.rating}</strong>
          <span>★</span>
          <small>({product.reviews})</small>
        </div>

        <div className="price-row">
          <strong>{formatPrice(product.price)}</strong>
          <del>{formatPrice(product.oldPrice)}</del>
          <span>{discount}% off</span>
        </div>

        <p className="delivery-text">
          🚚 <strong>FREE delivery</strong>
        </p>

        <div className="product-actions">
          <button className="view-button" onClick={onView}>
            View
          </button>

          <button className="add-button" onClick={onAdd}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default App;