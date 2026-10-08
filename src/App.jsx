import { useMemo, useState, useEffect, useRef } from "react";
import "./App.css";

import demo from "./assets/mobile.png";
import laptopImg from "./assets/laptop.png";
import headphoneImg from "./assets/headphone.png";
import keyboardImg from "./assets/keyboard.png";
import mouseImg from "./assets/mouse.png";
import controllerImg from "./assets/controller.png";
import sneakersImg from "./assets/sneakers.png";
import jacketImg from "./assets/denim-jacket.png";
import thermosImg from "./assets/thermos.png";
import lampImg from "./assets/led-lamp.png";
import backpackImg from "./assets/backpack.png";
import watchImg from "./assets/smart-watch.png";

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  logoutUser,
  logEvent,
  getMyOrders

} from "./services/api";

const products = [
  {
    id: 1,
    name: "Nova X Pro Smartphone",
    category: "Electronics",
    price: 34999,
    oldPrice: 42999,
    rating: 4.6,
    reviews: 1248,
    image: demo,
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
    image: laptopImg,
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
    image: headphoneImg,
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
    image: keyboardImg,
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
    image: mouseImg,
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
    image: sneakersImg,
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
    image: jacketImg,
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
    image: thermosImg,
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
    image: lampImg,
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
    image: backpackImg,
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
    image: controllerImg,
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
    image: watchImg,
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

  /* =========================================================
     APP STATE
     ========================================================= */

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [cart, setCart] =
    useState([]);

  const [wishlist, setWishlist] =
    useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [showCart, setShowCart] =
    useState(false);

  const [showCheckout, setShowCheckout] =
    useState(false);

  const [checkoutStep, setCheckoutStep] =
  useState(1);

const [selectedPayment, setSelectedPayment] =
  useState("GOOGLE_PAY");

const [deliveryAddress, setDeliveryAddress] =
  useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

const [savedAddresses, setSavedAddresses] = useState([]);

const [showAddressForm, setShowAddressForm] =
  useState(false);

const [newAddress, setNewAddress] = useState({
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
});

  const [showLogin, setShowLogin] = 
    useState(false);

  const [showAccount, setShowAccount] =
    useState(false);

  const [accountSection, setAccountSection] =
    useState("overview");

  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showMenu, setShowMenu] =
    useState(false);

  const [sort, setSort] =
    useState("featured");

  const [toast, setToast] =
    useState("");

  const [heroSlide, setHeroSlide] =
    useState(0);


  /* =========================================================
     LOGIN / USER STATE
     ========================================================= */

  const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loggedInUser, setLoggedInUser] = useState(null);
const [loginLoading, setLoginLoading] = useState(false);

const [showRegister, setShowRegister] = useState(false);
const [registerName, setRegisterName] = useState("");
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");
const [registerLoading, setRegisterLoading] = useState(false);

const [showForgotPassword, setShowForgotPassword] = useState(false);
const [forgotEmail, setForgotEmail] = useState("");
const [forgotLoading, setForgotLoading] = useState(false);

const [showResetPassword, setShowResetPassword] = useState(false);
const [resetToken, setResetToken] = useState("");
const [resetNewPassword, setResetNewPassword] = useState("");
const [resetConfirmPassword, setResetConfirmPassword] = useState("");
const [resetLoading, setResetLoading] = useState(false);


  /* =========================================================
     TOAST TIMER
     ========================================================= */

  const toastTimerRef =
    useRef(null);


  /* =========================================================
     RESTORE LOGIN SESSION
     ========================================================= */
  
  useEffect(() => {
  if (
    showAccount &&
    accountSection === "orders" &&
    loggedInUser
  ) {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);

        const result = await getMyOrders();

        setMyOrders(result.orders || []);

      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error
        );

        showToast(
          error.message || "Failed to load orders"
        );

      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }
}, [
  showAccount,
  accountSection,
  loggedInUser
]);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "securemart_token"
      );

    if (!token) {
      return;
    }

    getProfile()
      .then((data) => {

        console.log(
          "Backend connection successful:",
          data
        );

        setLoggedInUser({
          id: data.userId,
        });

      })
      .catch((error) => {

        console.error(
          "Backend connection failed:",
          error.message
        );

        localStorage.removeItem(
          "securemart_token"
        );

        setLoggedInUser(null);

      });

  }, []);


  /* =========================================================
     HERO SLIDESHOW
     ========================================================= */

  useEffect(() => {

    const interval =
      setInterval(() => {

        setHeroSlide(
          (current) =>
            (current + 1) %
            products.length
        );

      }, 2500);

    return () =>
      clearInterval(interval);

  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch =
        activeCategory === "All" ||
        product.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const searchMatch =
        !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);

      return categoryMatch && searchMatch;
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

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function showToast(message) {
  setToast(message);

  if (toastTimerRef.current) {
    clearTimeout(toastTimerRef.current);
  }

  toastTimerRef.current = setTimeout(() => {
    setToast("");
    toastTimerRef.current = null;
  }, 2500);
}

  async function handleLogin() {
  if (!loginEmail || !loginPassword) {
    showToast("Please enter email and password");
    return;
  }

  try {
    setLoginLoading(true);

    const data = await loginUser(
      loginEmail,
      loginPassword
    );

    // Store JWT
    localStorage.setItem(
      "securemart_token",
      data.token
    );

    // Store logged-in user
    setLoggedInUser(data.user);

    // Clear login fields
    setLoginEmail("");
    setLoginPassword("");

    // Close sign-in modal
    setShowLogin(false);

    showToast(
      `Welcome to SecureMart, ${data.user.name}!`
    );

    console.log(
      "SecureMart login successful:",
      data.user
    );

  } catch (error) {
    console.error("Login failed:", error);

    showToast(
      error.message || "Login failed"
    );
  } finally {
    setLoginLoading(false);
  }
}
  

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    logEvent("CART_ADD", {
  productId: product.id,
  productName: product.name,
  category: product.category,
  price: product.price,
}).catch((error) => {
  console.error(
    "Failed to log CART_ADD:",
    error.message
  );
});

    showToast(`${product.name} added to cart`);
  }

  function removeFromCart(productId) {
  const product = cart.find(
    (item) => item.id === productId
  );

  setCart((currentCart) =>
    currentCart.filter(
      (item) => item.id !== productId
    )
  );

  if (product) {
    logEvent("CART_REMOVE", {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    }).catch((error) => {
      console.error(
        "Failed to log CART_REMOVE:",
        error.message
      );
    });
  }

  showToast("Item removed from cart");
}

  function updateQuantity(productId, change) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== productId) return item;

          return {
            ...item,
            quantity: item.quantity + change,
          };
        })
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
  setShowMenu(false);

  logEvent("PRODUCT_FILTER", {
    category: category,
  }).catch((error) => {
    console.error(
      "Failed to log PRODUCT_FILTER:",
      error.message
    );
  });

  setTimeout(() => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  }, 50);
}

  function clearSearch() {
    setSearch("");
    setActiveCategory("All");
  }

  return (
    <div className="app">

      {/* =====================================================
    HEADER
    ===================================================== */}

<header className="header">

  <div className="header-main">

    {/* LOGO */}

    <button
      className="logo"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        setActiveCategory("All");
        setSearch("");
      }}
    >
      <div className="logo-mark">
        S
      </div>

      <div>
        <div className="logo-text">
          Secure<span>Mart</span>
        </div>

        <div className="logo-subtitle">
          Shop Smart. Shop Secure.
        </div>
      </div>
    </button>


    {/* MOBILE MENU */}

    <button
      className="mobile-menu-btn"
      onClick={() =>
        setShowMenu(!showMenu)
      }
    >
      ☰
    </button>


    {/* SEARCH */}

    <div className="search-wrapper">

      <select
        value={activeCategory}
        onChange={(e) =>
          selectCategory(e.target.value)
        }
      >
        {categories.map((category) => (
          <option
            key={category.name}
            value={category.name}
          >
            {category.name}
          </option>
        ))}
      </select>


      <input
        type="text"
        placeholder="Search for products, brands and more..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />


      <button
        className="search-button"
        onClick={() => {

          if (search.trim()) {

            logEvent("PRODUCT_SEARCH", {
              searchQuery: search.trim(),
              category: activeCategory,
            }).catch((error) => {

              console.error(
                "Failed to log PRODUCT_SEARCH:",
                error.message
              );

            });

          }

          document
            .getElementById("products")
            ?.scrollIntoView({
              behavior: "smooth",
            });

        }}
      >
        🔍
      </button>

    </div>


    {/* HEADER ACTIONS */}

    <div className="header-actions">


      {/* ACCOUNT */}

      <button
  className="header-action"
  onClick={() => {

    if (loggedInUser) {

      setAccountSection("overview");
      setShowAccount(true);

    } else {

      setShowLogin(true);

    }

  }}
>
  <span className="action-icon">
    👤
  </span>

  <span>

    <small>
      {loggedInUser
        ? `Hello, ${loggedInUser.name}`
        : "Hello, Sign in"}
    </small>

    <strong>
      {loggedInUser
        ? "My Account"
        : "Account"}
    </strong>

  </span>

</button>


      {/* WISHLIST */}

      <button
        className="header-action wishlist-header"
        onClick={() => {
  setAccountSection("wishlist");
  setShowAccount(true);
}}
      >

        <span className="action-icon">

          {wishlist.length > 0
            ? "♥"
            : "♡"}

        </span>


        <span>

          <small>
            My
          </small>

          <strong>
            Wishlist
          </strong>

        </span>


        {wishlist.length > 0 && (

          <b className="count-badge">
            {wishlist.length}
          </b>

        )}

      </button>


      {/* CART */}

      <button
        className="cart-button"
        onClick={() =>
          setShowCart(true)
        }
      >

        <span className="cart-icon">
          🛒
        </span>

        <span>
          Cart
        </span>


        {cartCount > 0 && (

          <b className="cart-count">
            {cartCount}
          </b>

        )}

      </button>


    </div>

  </div>


  {/* NAVIGATION */}

  <nav
    className={`navigation ${
      showMenu
        ? "navigation-open"
        : ""
    }`}
  >

    <button
      onClick={() =>
        selectCategory("Electronics")
      }
    >
      Electronics
    </button>


    <button
      onClick={() =>
        selectCategory("Gaming")
      }
    >
      Gaming
    </button>


    <button
      onClick={() =>
        selectCategory("Fashion")
      }
    >
      Fashion
    </button>


    <button
      onClick={() =>
        selectCategory("Home")
      }
    >
      Home & Kitchen
    </button>

  </nav>


</header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <main>

        <section className="hero">

          {/* LEFT SIDE */}
          <div className="hero-content">

            <div className="hero-tag">
              ⚡ SECURE DEALS OF THE DAY
            </div>

            <h1>
              Everything you need.
              <br />
              <span>One secure marketplace.</span>
            </h1>

            <p>
              Discover great products from trusted sellers
              with a shopping experience designed with
              security in mind.
            </p>

            <button
              className="primary-button"
              onClick={() => selectCategory("All")}
            >
              Shop Now →
            </button>

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

          {/* =================================================
              RIGHT SIDE PRODUCT SLIDESHOW
              ================================================= */}

          <div className="hero-visual">

            <div className="hero-slideshow">

              {products.map((product, index) => (
                <img
                  key={product.id}
                  src={product.image}
                  alt={product.name}
                  className={`hero-slide ${
                    index === heroSlide
                      ? "hero-slide-active"
                      : ""
                  }`}
                />
              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            CATEGORIES
            ===================================================== */}

        <section className="section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                EXPLORE
              </span>

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
                onClick={() =>
                  selectCategory(category.name)
                }
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <h3>{category.name}</h3>

                <span>
                  {
                    products.filter(
                      (p) =>
                        p.category === category.name
                    ).length
                  }{" "}
                  products
                </span>

              </button>
            ))}

          </div>

        </section>

        {/* =====================================================
            SECURITY
            ===================================================== */}

        <section className="security-banner">

          <div className="security-icon">
            🛡️
          </div>

          <div>

            <span className="section-label">
              SECURE BY DESIGN
            </span>

            <h2>
              Your shopping security matters to us.
            </h2>

            <p>
              SecureMart is designed to monitor system
              activity and protect your shopping experience.
            </p>

          </div>

          <button
            className="security-button"
            onClick={() =>
              showToast(
                "Secure shopping information opened"
              )
            }
          >
            Learn More →
          </button>

        </section>

        {/* =====================================================
            PRODUCTS
            ===================================================== */}

        <section
          className="section products-section"
          id="products"
        >

          <div className="section-heading products-heading">

            <div>

              <span className="section-label">
                DISCOVER
              </span>

              <h2>Popular Products</h2>

              <p>
                {filteredProducts.length} products available
              </p>

            </div>

            <div className="sort-area">

              <label htmlFor="sort">
                Sort by
              </label>

              <select
                id="sort"
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
              >

                <option value="featured">
                  Featured
                </option>

                <option value="rating">
                  Top Rated
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

              </select>

            </div>

          </div>

          {filteredProducts.length === 0 ? (

            <div className="empty-search">

              <div>🔍</div>

              <h3>No products found</h3>

              <p>
                Try another search term or category.
              </p>

              <button
                className="primary-button"
                onClick={clearSearch}
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
                  isWishlisted={wishlist.includes(
                    product.id
                  )}
                  onWishlist={() =>
                    toggleWishlist(product)
                  }
                  onAdd={() =>
                    addToCart(product)
                  }
                  onView={() => {
  setSelectedProduct(product);

  logEvent("PRODUCT_VIEW", {
    productId: product.id,
    productName: product.name,
    category: product.category,
  }).catch((error) => {
    console.error(
      "Failed to log PRODUCT_VIEW:",
      error.message
    );
  });
}}
                />

              ))}

            </div>

          )}

        </section>

        {/* =====================================================
            TRUST
            ===================================================== */}

        <section className="trust-section">

          <TrustCard
            icon="🚚"
            title="Fast Delivery"
            text="Reliable delivery across India"
          />

          <TrustCard
            icon="🔐"
            title="Secure Payments"
            text="Your payment information is protected"
          />

          <TrustCard
            icon="↩️"
            title="Easy Returns"
            text="Simple and convenient returns"
          />

          <TrustCard
            icon="✓"
            title="Verified Sellers"
            text="Shop with confidence"
          />

        </section>

      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="footer">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="footer-logo">

              <div className="logo-mark">
                S
              </div>

              <div className="logo-text">
                Secure<span>Mart</span>
              </div>

            </div>

            <p>
              A modern e-commerce marketplace designed
              around a secure, intelligent shopping experience.
            </p>

            <div className="footer-social">

              <span>f</span>
              <span>𝕏</span>
              <span>◎</span>
              <span>in</span>

            </div>

          </div>

          <FooterColumn
            title="Get to Know Us"
            items={[
              "About SecureMart",
              "Careers",
              "Press",
              "Our Technology",
            ]}
          />

          <FooterColumn
            title="Customer Service"
            items={[
              "Help Center",
              "Returns",
              "Shipping",
              "Contact Us",
            ]}
          />

          <FooterColumn
            title="For Sellers"
            items={[
              "Sell on SecureMart",
              "Seller Center",
              "Seller Policies",
              "Partner With Us",
            ]}
          />

          <FooterColumn
            title="Security"
            items={[
              "Privacy",
              "Security Center",
              "Report an Issue",
              "Terms of Service",
            ]}
          />

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 SecureMart. All rights reserved.
          </span>

          <span>
            🔒 Secure shopping experience
          </span>

        </div>

      </footer>

      {/* =====================================================
          PRODUCT MODAL
          ===================================================== */}

      {selectedProduct && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedProduct(null)
          }
        >

          <div
            className="product-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              ×
            </button>

            <div className="modal-product-image">

              {selectedProduct.image ? (

                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                />

              ) : (

                <span>
                  {selectedProduct.emoji}
                </span>

              )}

              <div className="modal-badge">
                {selectedProduct.badge}
              </div>

            </div>

            <div className="modal-product-details">

              <span className="product-category">
                {selectedProduct.category}
              </span>

              <h2>
                {selectedProduct.name}
              </h2>

              <div className="rating">

                <strong>
                  {selectedProduct.rating}
                </strong>

                <span>★</span>

                <small>
                  {selectedProduct.reviews} ratings
                </small>

              </div>

              <p>
                {selectedProduct.description}
              </p>

              <div className="modal-price">

                <strong>
                  {formatPrice(
                    selectedProduct.price
                  )}
                </strong>

                <del>
                  {formatPrice(
                    selectedProduct.oldPrice
                  )}
                </del>

              </div>

              <div className="delivery-box">

                <span>🚚</span>

                <div>

                  <strong>
                    Free delivery
                  </strong>

                  <p>
                    Delivery available across India
                  </p>

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

      {/* =====================================================
          CART
          ===================================================== */}

      {showCart && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowCart(false)
          }
        >

          <aside
            className="cart-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="drawer-header">

              <div>

                <span className="section-label">
                  YOUR SHOPPING
                </span>

                <h2>Cart</h2>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowCart(false)
                }
              >
                ×
              </button>

            </div>

            {cart.length === 0 ? (

              <div className="empty-cart">

                <div>🛒</div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add products to get started.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowCart(false)
                  }
                >
                  Continue Shopping
                </button>

              </div>

            ) : (

              <>

                <div className="cart-items">

                  {cart.map((item) => (

                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      <div className="cart-item-image">

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                        ) : (

                          item.emoji

                        )}

                      </div>

                      <div className="cart-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        <strong>
                          {formatPrice(
                            item.price
                          )}
                        </strong>

                        <div className="quantity-control">

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                -1
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                1
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                        <button
                          className="remove-button"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                <div className="cart-summary">

                  <div>

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      {formatPrice(
                        cartTotal
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Delivery
                    </span>

                    <strong className="free">
                      FREE
                    </strong>

                  </div>

                  <div className="summary-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      {formatPrice(
                        cartTotal
                      )}
                    </strong>

                  </div>

                  <button
  className="primary-button full-button"
  onClick={() => {
  if (!loggedInUser) {
    showToast("Please sign in to checkout");
    setShowCart(false);
    setShowLogin(true);
    return;
  }

  logEvent("CHECKOUT_STARTED", {
    cartItems: cart.map((item) => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    totalAmount: cartTotal,
    itemCount: cart.reduce(
      (total, item) => total + item.quantity,
      0
    ),
  }).catch((error) => {
    console.error(
      "Failed to log CHECKOUT_STARTED:",
      error.message
    );
  });

  showToast("Checkout started");

  setShowCart(false);
  setShowCheckout(true);
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

      {/* =====================================================
          LOGIN
          ===================================================== */}

      {showLogin && (

        <div
          className="modal-overlay"
          onClick={() => setShowLogin(false)}
        >

          <div
            className="account-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>

            <div className="account-icon">
              👤
            </div>

            <h2>
              Sign in to SecureMart
            </h2>

            <p>
              Access your account, orders and wishlist.
            </p>

            <div className="login-form">

              <label htmlFor="login-email">
                Email
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) =>
                  setLoginEmail(e.target.value)
                }
              />

              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />

              <button
  type="button"
  className="forgot-password-button"
  style={{
    display: "block",
    width: "100%",
    marginTop: "12px",
    marginBottom: "12px",
    padding: "8px",
    background: "transparent",
    border: "none",
    color: "#2563eb",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "right",
  }}
  onClick={() => {
    setShowLogin(false);
    setForgotEmail("");
    setShowForgotPassword(true);
  }}
>
  Forgot password?
</button>

              <button
                className="primary-button full-button"
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

              <button
  type="button"
  className="create-account-button"
  onClick={() => {
    setShowLogin(false);
    setShowRegister(true);
  }}
>
  Create an account
</button>

            </div>

          </div>

        </div>

      )}

      {showForgotPassword && (
  <div
    className="modal-overlay"
    onClick={() => setShowForgotPassword(false)}
  >
    <div
      className="account-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={() => setShowForgotPassword(false)}
      >
        ×
      </button>

      <div className="account-icon">🔐</div>

      <h2>Forgot Password?</h2>

      <p className="modal-description">
        Enter your email address and we'll help you reset your password.
      </p>

      <div className="login-form">
        <label htmlFor="forgot-email">Email</label>

        <input
          id="forgot-email"
          type="email"
          placeholder="Enter your registered email"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
        />

        <button
          type="button"
          className="primary-button full-button"
          disabled={forgotLoading}
          onClick={async () => {
            if (!forgotEmail.trim()) {
              showToast("Please enter your email");
              return;
            }

            try {
              setForgotLoading(true);

              const result = await forgotPassword(
  forgotEmail.trim()
);

console.log("Password reset response:", result);

if (!result.resetToken) {
  showToast(
    "Reset request created, but no reset token was returned."
  );
  return;
}

setResetToken(result.resetToken);

setResetNewPassword("");
setResetConfirmPassword("");

setShowForgotPassword(false);
setShowResetPassword(true);

showToast(
  "Reset token generated. Create your new password."
);
            } catch (error) {
              showToast(error.message);
            } finally {
              setForgotLoading(false);
            }
          }}
        >
          {forgotLoading ? "Sending..." : "Send Reset Request"}
        </button>

        <button
          type="button"
          className="forgot-password-button"
          onClick={() => {
            setShowForgotPassword(false);
            setShowLogin(true);
          }}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  </div>
)}

{showResetPassword && (
  <div
    className="modal-overlay"
    onClick={() => setShowResetPassword(false)}
  >
    <div
      className="account-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <button
        className="modal-close"
        onClick={() => setShowResetPassword(false)}
      >
        ×
      </button>

      <div className="account-icon">
        🔑
      </div>

      <h2>
        Reset Password
      </h2>

      <p className="modal-description">
        Enter your reset token and create a new password.
      </p>

      <div className="login-form">

        {/* RESET TOKEN */}

        <label htmlFor="reset-token">
          Reset Token
        </label>

        <input
          id="reset-token"
          type="text"
          placeholder="Enter reset token"
          value={resetToken}
          onChange={(e) =>
            setResetToken(e.target.value)
          }
        />

        {/* NEW PASSWORD */}

        <label htmlFor="reset-password">
          New Password
        </label>

        <input
          id="reset-password"
          type="password"
          placeholder="Enter new password"
          value={resetNewPassword}
          onChange={(e) =>
            setResetNewPassword(e.target.value)
          }
        />

        {/* CONFIRM PASSWORD */}

        <label htmlFor="reset-confirm-password">
          Confirm New Password
        </label>

        <input
          id="reset-confirm-password"
          type="password"
          placeholder="Confirm new password"
          value={resetConfirmPassword}
          onChange={(e) =>
            setResetConfirmPassword(e.target.value)
          }
        />

        {/* RESET BUTTON */}

        <button
          type="button"
          className="primary-button full-button"
          disabled={resetLoading}
          onClick={async () => {

            if (!resetToken.trim()) {
              showToast("Please enter the reset token");
              return;
            }

            if (!resetNewPassword) {
              showToast("Please enter a new password");
              return;
            }

            if (resetNewPassword.length < 6) {
              showToast(
                "Password must be at least 6 characters"
              );
              return;
            }

            if (
              resetNewPassword !==
              resetConfirmPassword
            ) {
              showToast(
                "Passwords do not match"
              );
              return;
            }

            try {

              setResetLoading(true);

              await resetPassword(
                resetToken.trim(),
                resetNewPassword
              );

              showToast(
                "Password reset successfully"
              );

              setResetToken("");
              setResetNewPassword("");
              setResetConfirmPassword("");

              setShowResetPassword(false);
              setShowLogin(true);

            } catch (error) {

              console.error(
                "Password reset failed:",
                error
              );

              showToast(
                error.message ||
                "Password reset failed"
              );

            } finally {

              setResetLoading(false);

            }

          }}
        >
          {resetLoading
            ? "Resetting Password..."
            : "Reset Password"}
        </button>

        {/* BACK TO LOGIN */}

        <button
          type="button"
          className="forgot-password-button"
          onClick={() => {
            setShowResetPassword(false);
            setShowLogin(true);
          }}
        >
          Back to Sign In
        </button>

      </div>

    </div>
  </div>
)}

    {showRegister && (
  <div
    className="modal-overlay"
    onClick={() => setShowRegister(false)}
  >
    <div
      className="login-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <button
        className="modal-close"
        onClick={() => setShowRegister(false)}
      >
        ×
      </button>

      <div className="login-icon">
        👤
      </div>

      <h2>
        Create your SecureMart account
      </h2>

      <p className="login-subtitle">
        Join SecureMart for secure and convenient shopping.
      </p>


      {/* NAME */}

      <input
        type="text"
        placeholder="Full name"
        value={registerName}
        onChange={(e) =>
          setRegisterName(e.target.value)
        }
      />


      {/* EMAIL */}

      <input
        type="email"
        placeholder="Email address"
        value={registerEmail}
        onChange={(e) =>
          setRegisterEmail(e.target.value)
        }
      />


      {/* PASSWORD */}

      <input
        type="password"
        placeholder="Password"
        value={registerPassword}
        onChange={(e) =>
          setRegisterPassword(e.target.value)
        }
      />

      


      {/* REGISTER */}

      <button
        className="primary-button full-button"
        disabled={registerLoading}
        onClick={async () => {

          if (
            !registerName ||
            !registerEmail ||
            !registerPassword
          ) {
            showToast(
              "Please fill in all fields"
            );
            return;
          }


          if (registerPassword.length < 6) {
            showToast(
              "Password must be at least 6 characters"
            );
            return;
          }


          try {

            setRegisterLoading(true);

            await registerUser(
              registerName,
              registerEmail,
              registerPassword
            );


            showToast(
              "Account created successfully"
            );


            setRegisterName("");
            setRegisterEmail("");
            setRegisterPassword("");

            setShowRegister(false);
            setShowLogin(true);

          } catch (error) {

            console.error(
              "Registration failed:",
              error
            );

            showToast(
              error.message ||
              "Registration failed"
            );

          } finally {

            setRegisterLoading(false);

          }

        }}
      >
        {registerLoading
          ? "Creating Account..."
          : "Create Account"}
      </button>


      {/* BACK TO LOGIN */}

      <p className="signup-text">

        Already have an account?{" "}

        <button
          type="button"
          onClick={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        >
          Sign in
        </button>

      </p>

    </div>
  </div>
)}

      {/* =====================================================
    ACCOUNT DASHBOARD
    ===================================================== */}

{showAccount && (

  <div
    className="modal-overlay"
    onClick={() => setShowAccount(false)}
  >

    <div
      className="account-dashboard"
      onClick={(e) => e.stopPropagation()}
    >

      <button
        className="modal-close"
        onClick={() => setShowAccount(false)}
      >
        ×
      </button>

      {/* ACCOUNT HEADER */}

      <div className="account-dashboard-header">

        <div className="account-avatar">
          {loggedInUser?.name
            ? loggedInUser.name
                .charAt(0)
                .toUpperCase()
            : "U"}
        </div>

        <div>

          <h2>
            {loggedInUser?.name || "My Account"}
          </h2>

          <p>
            {loggedInUser?.email ||
              "Welcome to SecureMart"}
          </p>

        </div>

      </div>

      {/* REST OF YOUR EXISTING ACCOUNT DASHBOARD */}


      {/* ACCOUNT NAVIGATION */}

      <div className="account-dashboard-layout">

        <aside className="account-sidebar">

          <button
            className={
              accountSection === "overview"
                ? "account-nav active"
                : "account-nav"
            }
            onClick={() =>
              setAccountSection("overview")
            }
          >
            👤
            <span>Overview</span>
          </button>

          <button
            className={
              accountSection === "orders"
                ? "account-nav active"
                : "account-nav"
            }
            onClick={() =>
              setAccountSection("orders")
            }
          >
            📦
            <span>My Orders</span>
          </button>

          <button
            className={
              accountSection === "wishlist"
                ? "account-nav active"
                : "account-nav"
            }
            onClick={() =>
              setAccountSection("wishlist")
            }
          >
            ❤️
            <span>Wishlist</span>
          </button>

          <button
            className={
              accountSection === "addresses"
                ? "account-nav active"
                : "account-nav"
            }
            onClick={() =>
              setAccountSection("addresses")
            }
          >
            📍
            <span>Addresses</span>
          </button>

          <div className="account-sidebar-divider" />

          <button
            className="account-nav logout-nav"
            onClick={async () => {

              try {

                await logoutUser();

              } catch (error) {

                console.error(
                  "Logout failed:",
                  error.message
                );

              }

              localStorage.removeItem(
                "securemart_token"
              );

              setLoggedInUser(null);
              setShowAccount(false);

              showToast(
                "You have been signed out"
              );

            }}
          >
            🚪
            <span>Sign Out</span>
          </button>

        </aside>


        {/* ACCOUNT CONTENT */}

        <div className="account-dashboard-content">

          {accountSection === "overview" && (

            <div>

              <h3>
                Account Overview
              </h3>

              <p className="account-section-description">
                Manage your SecureMart account,
                orders and shopping preferences.
              </p>


              <div className="account-info-grid">

  {/* ACCOUNT */}
  <button
    className="account-info-card"
    onClick={() => setAccountSection("overview")}
  >
    <span>👤</span>

    <div>
      <small>
        Account
      </small>

      <strong>
        {loggedInUser?.name ||
          "SecureMart User"}
      </strong>
    </div>
  </button>


  {/* ORDERS */}
  <button
    className="account-info-card"
    onClick={() => setAccountSection("orders")}
  >
    <span>📦</span>

    <div>
      <small>
        Orders
      </small>

      <strong>
        View Order History
      </strong>
    </div>
  </button>


  {/* WISHLIST */}
  <button
    className="account-info-card"
    onClick={() => setAccountSection("wishlist")}
  >
    <span>❤️</span>

    <div>
      <small>
        Wishlist
      </small>

      <strong>
        {wishlist.length} Items
      </strong>
    </div>
  </button>


  {/* CART */}
  <button
    className="account-info-card"
    onClick={() => {
      setShowAccount(false);
      setShowCart(true);
    }}
  >
    <span>🛒</span>

    <div>
      <small>
        Cart
      </small>

      <strong>
        {cartCount} Items
      </strong>
    </div>
  </button>

</div>

            </div>

          )}


          {accountSection === "orders" && (

  <div>

    <h3>
      My Orders
    </h3>

    <p className="account-section-description">
      View your SecureMart purchase history.
    </p>

    {ordersLoading ? (

      <div className="account-empty-state">

        <div>⏳</div>

        <h4>
          Loading your orders...
        </h4>

        <p>
          Please wait while we fetch your
          purchase history.
        </p>

      </div>

    ) : myOrders.length === 0 ? (

      <div className="account-empty-state">

        <div>📦</div>

        <h4>
          No orders yet
        </h4>

        <p>
          Once you place an order,
          your purchase history will
          be displayed here.
        </p>

      </div>

    ) : (

      <div className="orders-list">

        {myOrders.map((order) => (

          <div
  className="order-card"
  key={order._id}
  onClick={() => setSelectedOrder(order)}
>

            <div className="order-card-header">

              <div>
                <strong>
                  Order #{order.metadata?.orderId}
                </strong>

                <span>
                  {new Date(
                    order.timestamp
                  ).toLocaleDateString()}
                </span>
              </div>

              <span className="order-status">
                {order.metadata?.paymentStatus ===
                "SIMULATED_SUCCESS"
                  ? "Confirmed"
                  : "Pending"}
              </span>

            </div>

            <div className="order-card-body">

              <div>
                <strong>
                  {order.metadata?.itemCount || 0}
                  {" "}
                  item(s)
                </strong>

                <p>
                  Payment:{" "}
                  {order.metadata?.paymentMethod ||
                    "N/A"}
                </p>
              </div>

              <strong className="order-total">
                ₹
                {Number(
  order.metadata?.totalAmount || 0
).toLocaleString("en-IN")}
              </strong>

            </div>

            <div className="order-card-footer">

              <span>
                Delivery:{" "}
                {order.metadata?.deliveryCity ||
                  "N/A"}
                {order.metadata?.deliveryState
                  ? `, ${order.metadata.deliveryState}`
                  : ""}
              </span>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

)}

{selectedOrder && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedOrder(null)}
  >
    <div
      className="account-modal order-details-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <button
        className="modal-close"
        onClick={() => setSelectedOrder(null)}
      >
        ×
      </button>

      <div className="account-icon">
        📦
      </div>

      <h2>
        Order Details
      </h2>

      <p className="modal-description">
        Order #{selectedOrder.metadata?.orderId}
      </p>

      <div className="order-details-content">

        <div className="order-detail-row">
          <span>Order Date</span>
          <strong>
            {new Date(
              selectedOrder.timestamp
            ).toLocaleDateString()}
          </strong>
        </div>

        <div className="order-detail-row">
          <span>Status</span>
          <strong>
            {selectedOrder.metadata?.paymentStatus ===
            "SIMULATED_SUCCESS"
              ? "Confirmed"
              : "Pending"}
          </strong>
        </div>

        <div className="order-detail-row">
          <span>Payment Method</span>
          <strong>
            {selectedOrder.metadata?.paymentMethod || "N/A"}
          </strong>
        </div>

        <div className="order-detail-row">
  <span>Delivery</span>

  <strong>
    {selectedOrder.metadata?.deliveryName || "N/A"}

    {selectedOrder.metadata?.deliveryPhone
      ? ` • ${selectedOrder.metadata.deliveryPhone}`
      : ""}

    <br />

    {selectedOrder.metadata?.deliveryAddress || "N/A"}

    <br />

    {selectedOrder.metadata?.deliveryCity || "N/A"}
    {selectedOrder.metadata?.deliveryState
      ? `, ${selectedOrder.metadata.deliveryState}`
      : ""}

    {selectedOrder.metadata?.deliveryPincode
      ? ` - ${selectedOrder.metadata.deliveryPincode}`
      : ""}
  </strong>
</div>

      </div>

      <h4 className="order-products-title">
        Items
      </h4>

      <div className="order-products-list">

        {selectedOrder.metadata?.cartItems?.map(
          (item, index) => (

            <div
              className="order-product-row"
              key={`${item.productId}-${index}`}
            >

              <div>
                <strong>
                  {item.productName}
                </strong>

                <span>
                  {item.category}
                </span>

                <span>
                  Quantity: {item.quantity}
                </span>
              </div>

              <strong>
                ₹
                {(
                  Number(item.price || 0) *
                  Number(item.quantity || 0)
                ).toLocaleString("en-IN")}
              </strong>

            </div>

          )
        )}

      </div>

      <div className="order-details-total">

        <span>
          Total Amount
        </span>

        <strong>
          ₹
          {Number(
            selectedOrder.metadata?.totalAmount || 0
          ).toLocaleString("en-IN")}
        </strong>

      </div>

    </div>
  </div>
)}


          {accountSection === "wishlist" && (

            <div>

              <h3>
                My Wishlist
              </h3>

              <p className="account-section-description">
                Products you've saved for later.
              </p>

              {wishlist.length === 0 ? (

                <div className="account-empty-state">

                  <div>❤️</div>

                  <h4>
                    Your wishlist is empty
                  </h4>

                  <p>
                    Add products to your wishlist
                    while shopping.
                  </p>

                </div>

              ) : (

                <div className="account-wishlist-list">

                  {wishlist.map((productId) => {

                    const product =
                      products.find(
                        (item) =>
                          item.id === productId
                      );

                    if (!product) return null;

                    return (

                      <div
  className="account-wishlist-item"
  key={product.id}
>
  <img
    src={product.image}
    alt={product.name}
  />

  <div className="account-wishlist-details">

    <strong>
      {product.name}
    </strong>

    <span>
      {formatPrice(product.price)}
    </span>

  </div>

  <button
    className="wishlist-remove-button"
    onClick={() =>
      toggleWishlist(product)
    }
  >
    Remove
  </button>

</div>

                    );

                  })}

                </div>

              )}

            </div>

          )}


          {accountSection === "addresses" && (

  <div>

    <h3>
      Saved Addresses
    </h3>

    <p className="account-section-description">
      Manage your delivery addresses.
    </p>


    {!showAddressForm && savedAddresses.length === 0 && (

      <div className="account-empty-state">

        <div>📍</div>

        <h4>
          No saved addresses
        </h4>

        <p>
          Your delivery addresses will
          appear here.
        </p>

        <button
          className="primary-button"
          onClick={() =>
            setShowAddressForm(true)
          }
        >
          Add Address
        </button>

      </div>

    )}


    {showAddressForm && (

      <div className="address-form-card">

        <div className="address-form-header">

          <div>
            <h4>
              Add New Address
            </h4>

            <p>
              Enter your delivery details.
            </p>
          </div>

          <button
            className="address-form-close"
            onClick={() =>
              setShowAddressForm(false)
            }
          >
            ×
          </button>

        </div>


        <div className="address-form-grid">

          <div className="checkout-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={newAddress.name}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  name: e.target.value,
                })
              }
            />

          </div>


          <div className="checkout-field">

            <label>
              Mobile Number
            </label>

            <input
              type="tel"
              placeholder="10-digit mobile number"
              maxLength="10"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  phone: e.target.value,
                })
              }
            />

          </div>


          <div className="checkout-field address-field-full">

            <label>
              Address
            </label>

            <textarea
              placeholder="House No., Building, Street, Area"
              rows="3"
              value={newAddress.address}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  address: e.target.value,
                })
              }
            />

          </div>


          <div className="checkout-field">

            <label>
              City
            </label>

            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  city: e.target.value,
                })
              }
            />

          </div>


          <div className="checkout-field">

            <label>
              State
            </label>

            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  state: e.target.value,
                })
              }
            />

          </div>


          <div className="checkout-field">

            <label>
              PIN Code
            </label>

            <input
              type="text"
              placeholder="6-digit PIN code"
              maxLength="6"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  pincode: e.target.value,
                })
              }
            />

          </div>

        </div>


        <div className="address-form-actions">

          <button
            className="secondary-button"
            onClick={() =>
              setShowAddressForm(false)
            }
          >
            Cancel
          </button>


          <button
            className="primary-button"
            onClick={() => {

              if (
                !newAddress.name ||
                !newAddress.phone ||
                !newAddress.address ||
                !newAddress.city ||
                !newAddress.state ||
                !newAddress.pincode
              ) {
                showToast(
                  "Please complete all address details"
                );
                return;
              }


              if (
                !/^\d{10}$/.test(
                  newAddress.phone
                )
              ) {
                showToast(
                  "Please enter a valid 10-digit mobile number"
                );
                return;
              }


              if (
                !/^\d{6}$/.test(
                  newAddress.pincode
                )
              ) {
                showToast(
                  "Please enter a valid 6-digit PIN code"
                );
                return;
              }


              setSavedAddresses([
                ...savedAddresses,
                {
                  ...newAddress,
                  id: Date.now(),
                },
              ]);


              setNewAddress({
                name: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
              });


              setShowAddressForm(false);

              showToast(
                "Address saved successfully"
              );

            }}
          >
            Save Address
          </button>

        </div>

      </div>

    )}


    {!showAddressForm && savedAddresses.length > 0 && (

      <div>

        <div className="saved-addresses-header">

          <h4>
            Your Addresses
          </h4>

          <button
            className="primary-button"
            onClick={() =>
              setShowAddressForm(true)
            }
          >
            + Add Address
          </button>

        </div>


        <div className="saved-address-list">

          {savedAddresses.map((address) => (

            <div
              className="saved-address-card"
              key={address.id}
            >

              <div className="saved-address-icon">
                📍
              </div>

              <div className="saved-address-details">

                <strong>
                  {address.name}
                </strong>

                <span>
                  {address.address}
                </span>

                <span>
                  {address.city},{" "}
                  {address.state} -{" "}
                  {address.pincode}
                </span>

                <span>
                  📞 {address.phone}
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    )}

  </div>

)}

        </div>

      </div>

    </div>

  </div>

)}

            {/* =====================================================
    CHECKOUT
    ===================================================== */}

{showCheckout && (

  <div
    className="modal-overlay"
    onClick={() => setShowCheckout(false)}
  >

    <div
      className="checkout-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* CLOSE BUTTON */}

      <button
        className="modal-close"
        onClick={() => setShowCheckout(false)}
      >
        ×
      </button>


      {/* CHECKOUT HEADER */}

      <div className="checkout-header">

        <div>
          <span className="section-label">
            SECURE SHOPPING
          </span>

          <h2>
            Checkout
          </h2>

          <p>
            Complete your order securely.
          </p>
        </div>

        <div className="checkout-security">
          🔒 Secure Checkout
        </div>

      </div>


      {/* CHECKOUT STEPS */}

      <div className="checkout-steps">

        <div
          className={
            checkoutStep >= 1
              ? "checkout-step active"
              : "checkout-step"
          }
        >
          <span>1</span>
          <strong>Delivery</strong>
        </div>

        <div className="checkout-step-line" />

        <div
          className={
            checkoutStep >= 2
              ? "checkout-step active"
              : "checkout-step"
          }
        >
          <span>2</span>
          <strong>Payment</strong>
        </div>

        <div className="checkout-step-line" />

        <div
          className={
            checkoutStep >= 3
              ? "checkout-step active"
              : "checkout-step"
          }
        >
          <span>3</span>
          <strong>Review</strong>
        </div>

      </div>


      {/* =================================================
          STEP 1 — DELIVERY ADDRESS
          ================================================= */}

      {checkoutStep === 1 && (

        <div className="checkout-content">

          <div className="checkout-section">

            <div className="checkout-section-title">
              <span>📍</span>

              <div>
                <h3>Delivery Address</h3>
                <p>
                  Where should we deliver your order?
                </p>
              </div>
            </div>


            <div className="checkout-form-grid">

              <div className="checkout-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={deliveryAddress.name}
                  onChange={(e) =>
                    setDeliveryAddress({
                      ...deliveryAddress,
                      name: e.target.value,
                    })
                  }
                />

              </div>


              <div className="checkout-field">

                <label>
                  Mobile Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={deliveryAddress.phone}
                  onChange={(e) =>
                    setDeliveryAddress({
                      ...deliveryAddress,
                      phone: e.target.value,
                    })
                  }
                />

              </div>


              <div className="checkout-field full">

                <label>
                  Address
                </label>

                <textarea
                  placeholder="House No., Building, Street, Area"
                  rows="3"
                  value={deliveryAddress.address}
                  onChange={(e) =>
                    setDeliveryAddress({
                      ...deliveryAddress,
                      address: e.target.value,
                    })
                  }
                />

              </div>


              <div className="checkout-field">

                <label>
                  City
                </label>

                <input
                  type="text"
                  placeholder="City"
                  value={deliveryAddress.city}
                  onChange={(e) =>
                    setDeliveryAddress({
                      ...deliveryAddress,
                      city: e.target.value,
                    })
                  }
                />

              </div>


              <div className="checkout-field">

                <label>
                  State
                </label>

                <input
                  type="text"
                  placeholder="State"
                  value={deliveryAddress.state}
                  onChange={(e) =>
                    setDeliveryAddress({
                      ...deliveryAddress,
                      state: e.target.value,
                    })
                  }
                />

              </div>


              <div className="checkout-field">

                <label>
                  PIN Code
                </label>

                <input
                  type="text"
                  placeholder="6-digit PIN code"
                  maxLength="6"
                  value={deliveryAddress.pincode}
                  onChange={(e) =>
                    setDeliveryAddress({
                      ...deliveryAddress,
                      pincode: e.target.value,
                    })
                  }
                />

              </div>

            </div>

          </div>


          {/* ORDER SUMMARY */}

          <div className="checkout-summary">

            <h3>
              Order Summary
            </h3>

            {cart.map((item) => (

              <div
                className="checkout-summary-item"
                key={item.id}
              >

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    Qty: {item.quantity}
                  </span>

                </div>

                <strong>
                  {formatPrice(
                    item.price * item.quantity
                  )}
                </strong>

              </div>

            ))}


            <div className="checkout-summary-divider" />


            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                {formatPrice(cartTotal)}
              </strong>

            </div>


            <div className="checkout-summary-row">

              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>

            </div>


            <div className="checkout-summary-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(cartTotal)}
              </strong>

            </div>

          </div>


          <button
            className="primary-button full-button"
            onClick={() => {

              if (
                !deliveryAddress.name ||
                !deliveryAddress.phone ||
                !deliveryAddress.address ||
                !deliveryAddress.city ||
                !deliveryAddress.state ||
                !deliveryAddress.pincode
              ) {

                showToast(
                  "Please complete your delivery address"
                );

                return;
              }

              if (
                !/^\d{10}$/.test(
                  deliveryAddress.phone
                )
              ) {

                showToast(
                  "Please enter a valid 10-digit mobile number"
                );

                return;
              }

              if (
                !/^\d{6}$/.test(
                  deliveryAddress.pincode
                )
              ) {

                showToast(
                  "Please enter a valid 6-digit PIN code"
                );

                return;
              }

              setCheckoutStep(2);

            }}
          >
            Continue to Payment →
          </button>

        </div>

      )}


      {/* =================================================
          STEP 2 — PAYMENT
          ================================================= */}

      {checkoutStep === 2 && (

        <div className="checkout-content">

          <div className="checkout-section">

            <div className="checkout-section-title">

              <span>💳</span>

              <div>

                <h3>
                  Choose Payment Method
                </h3>

                <p>
                  Select a simulated payment option.
                </p>

              </div>

            </div>


            <div className="payment-methods">


              {/* GOOGLE PAY */}

              <button
                className={
                  selectedPayment === "GOOGLE_PAY"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  setSelectedPayment("GOOGLE_PAY")
                }
              >

                <span className="payment-icon">
                  🟢
                </span>

                <div>
                  <strong>
                    Google Pay
                  </strong>

                  <small>
                    Pay securely using Google Pay
                  </small>
                </div>

                <span className="payment-radio">
                  {selectedPayment === "GOOGLE_PAY"
                    ? "●"
                    : "○"}
                </span>

              </button>


              {/* PHONEPE */}

              <button
                className={
                  selectedPayment === "PHONEPE"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  setSelectedPayment("PHONEPE")
                }
              >

                <span className="payment-icon">
                  🟣
                </span>

                <div>

                  <strong>
                    PhonePe
                  </strong>

                  <small>
                    Pay using your PhonePe account
                  </small>

                </div>

                <span className="payment-radio">
                  {selectedPayment === "PHONEPE"
                    ? "●"
                    : "○"}
                </span>

              </button>


              {/* PAYTM */}

              <button
                className={
                  selectedPayment === "PAYTM"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  setSelectedPayment("PAYTM")
                }
              >

                <span className="payment-icon">
                  🔵
                </span>

                <div>

                  <strong>
                    Paytm
                  </strong>

                  <small>
                    Pay using your Paytm wallet
                  </small>

                </div>

                <span className="payment-radio">
                  {selectedPayment === "PAYTM"
                    ? "●"
                    : "○"}
                </span>

              </button>


              {/* UPI */}

              <button
                className={
                  selectedPayment === "UPI"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  setSelectedPayment("UPI")
                }
              >

                <span className="payment-icon">
                  📱
                </span>

                <div>

                  <strong>
                    UPI ID
                  </strong>

                  <small>
                    Pay using any UPI application
                  </small>

                </div>

                <span className="payment-radio">
                  {selectedPayment === "UPI"
                    ? "●"
                    : "○"}
                </span>

              </button>


              {/* CARD */}

              <button
                className={
                  selectedPayment === "CARD"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  setSelectedPayment("CARD")
                }
              >

                <span className="payment-icon">
                  💳
                </span>

                <div>

                  <strong>
                    Credit / Debit Card
                  </strong>

                  <small>
                    Simulated card payment
                  </small>

                </div>

                <span className="payment-radio">
                  {selectedPayment === "CARD"
                    ? "●"
                    : "○"}
                </span>

              </button>


              {/* NET BANKING */}

              <button
                className={
                  selectedPayment === "NET_BANKING"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  setSelectedPayment("NET_BANKING")
                }
              >

                <span className="payment-icon">
                  🏦
                </span>

                <div>

                  <strong>
                    Net Banking
                  </strong>

                  <small>
                    Simulated bank payment
                  </small>

                </div>

                <span className="payment-radio">
                  {selectedPayment === "NET_BANKING"
                    ? "●"
                    : "○"}
                </span>

              </button>


              {/* COD */}

              <button
                className={
                  selectedPayment === "COD"
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() =>
                  setSelectedPayment("COD")
                }
              >

                <span className="payment-icon">
                  💵
                </span>

                <div>

                  <strong>
                    Cash on Delivery
                  </strong>

                  <small>
                    Pay when your order arrives
                  </small>

                </div>

                <span className="payment-radio">
                  {selectedPayment === "COD"
                    ? "●"
                    : "○"}
                </span>

              </button>


            </div>


            <div className="payment-notice">

              🔒

              <span>
                This is a simulated payment environment.
                No real payment or banking information
                will be processed.
              </span>

            </div>

          </div>


          {/* SUMMARY */}

          <div className="checkout-summary">

            <h3>
              Order Total
            </h3>

            <div className="checkout-summary-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(cartTotal)}
              </strong>

            </div>

          </div>


          <div className="checkout-action-row">

            <button
              className="secondary-button"
              onClick={() =>
                setCheckoutStep(1)
              }
            >
              ← Back
            </button>

            <button
              className="primary-button"
              onClick={() =>
                setCheckoutStep(3)
              }
            >
              Review Order →
            </button>

          </div>

        </div>

      )}


      {/* =================================================
          STEP 3 — REVIEW
          ================================================= */}

      {checkoutStep === 3 && (

        <div className="checkout-content">

          <div className="checkout-section">

            <div className="checkout-section-title">

              <span>✓</span>

              <div>

                <h3>
                  Review Your Order
                </h3>

                <p>
                  Confirm your details before placing
                  your order.
                </p>

              </div>

            </div>


            {/* DELIVERY ADDRESS */}

            <div className="review-card">

              <div className="review-card-header">

                <strong>
                  📍 Delivery Address
                </strong>

                <button
                  onClick={() =>
                    setCheckoutStep(1)
                  }
                >
                  Edit
                </button>

              </div>

              <p>
                <strong>
                  {deliveryAddress.name}
                </strong>
              </p>

              <p>
                {deliveryAddress.address}
              </p>

              <p>
                {deliveryAddress.city},{" "}
                {deliveryAddress.state} -{" "}
                {deliveryAddress.pincode}
              </p>

              <p>
                📞 {deliveryAddress.phone}
              </p>

            </div>


            {/* PAYMENT */}

            <div className="review-card">

              <div className="review-card-header">

                <strong>
                  💳 Payment Method
                </strong>

                <button
                  onClick={() =>
                    setCheckoutStep(2)
                  }
                >
                  Edit
                </button>

              </div>

              <p>
                {selectedPayment === "GOOGLE_PAY" &&
                  "🟢 Google Pay"}

                {selectedPayment === "PHONEPE" &&
                  "🟣 PhonePe"}

                {selectedPayment === "PAYTM" &&
                  "🔵 Paytm"}

                {selectedPayment === "UPI" &&
                  "📱 UPI ID"}

                {selectedPayment === "CARD" &&
                  "💳 Credit / Debit Card"}

                {selectedPayment === "NET_BANKING" &&
                  "🏦 Net Banking"}

                {selectedPayment === "COD" &&
                  "💵 Cash on Delivery"}
              </p>

              <small>
                Simulated payment
              </small>

            </div>


            {/* PRODUCTS */}

            <div className="review-card">

              <div className="review-card-header">

                <strong>
                  🛒 Order Items
                </strong>

              </div>

              {cart.map((item) => (

                <div
                  className="review-product"
                  key={item.id}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      Qty: {item.quantity}
                    </span>

                  </div>

                  <strong>
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </strong>

                </div>

              ))}

            </div>

          </div>


          {/* FINAL SUMMARY */}

          <div className="checkout-summary">

            <h3>
              Order Total
            </h3>

            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                {formatPrice(cartTotal)}
              </strong>

            </div>

            <div className="checkout-summary-row">

              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>

            </div>

            <div className="checkout-summary-total">

              <span>
                Total
              </span>

              <strong>
                {formatPrice(cartTotal)}
              </strong>

            </div>


            <button
              className="primary-button full-button"
              onClick={() => {

                const orderId =
                  `ORD-${Date.now()}`;

                logEvent("ORDER_CREATED", {

                  orderId: orderId,

                  cartItems: cart.map((item) => ({
                    productId: item.id,
                    productName: item.name,
                    category: item.category,
                    quantity: item.quantity,
                    price: item.price,
                  })),

                  totalAmount: cartTotal,

                  itemCount: cart.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  ),

                  paymentMethod:
                    selectedPayment,

                  paymentStatus:
  "SIMULATED_SUCCESS",

deliveryCity:
  deliveryAddress.city,

deliveryState:
  deliveryAddress.state,

deliveryName:
  deliveryAddress.name,

deliveryPhone:
  deliveryAddress.phone,

deliveryAddress:
  deliveryAddress.address,

deliveryPincode:
  deliveryAddress.pincode,

                })
                  .then(() => {

                    showToast(
                      `Order ${orderId} placed successfully`
                    );

                    setCart([]);

                    setCheckoutStep(1);

                    setDeliveryAddress({
                      name: "",
                      phone: "",
                      address: "",
                      city: "",
                      state: "",
                      pincode: "",
                    });

                    setSelectedPayment(
                      "GOOGLE_PAY"
                    );

                    setShowCheckout(false);

                  })
                  .catch((error) => {

                    console.error(
                      "Failed to log ORDER_CREATED:",
                      error.message
                    );

                    showToast(
                      "Order could not be placed"
                    );

                  });

              }}
            >
              Pay & Place Order
            </button>


            <p className="checkout-safe-text">
              🔒 Your order is protected by
              SecureMart security monitoring.
            </p>

          </div>


          <div className="checkout-action-row">

            <button
              className="secondary-button"
              onClick={() =>
                setCheckoutStep(2)
              }
            >
              ← Back to Payment
            </button>

          </div>

        </div>

      )}

    </div>

  </div>

)}


      {/* =====================================================
          TOAST
          ===================================================== */}

      {toast && (
        <div
          className="toast"
          role="status"
        >
          {toast}
        </div>
      )}

    </div>
  );
}

/* =========================================================
   PRODUCT CARD
   ========================================================= */

function ProductCard({
  product,
  isWishlisted,
  onWishlist,
  onAdd,
  onView,
}) {
  const discount = Math.round(
    ((product.oldPrice - product.price) /
      product.oldPrice) *
      100
  );

  return (
    <article className="product-card">

      <div className="product-image">

        <button
          className={`wishlist-button ${
            isWishlisted
              ? "wishlisted"
              : ""
          }`}
          onClick={onWishlist}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

        <div className="product-image-frame">

          <img
            className="product-image-real"
            src={product.image}
            alt={product.name}
          />

        </div>

        <div className="product-badge">
          {product.badge}
        </div>

      </div>

      <div className="product-info">

        <span className="product-category">
          {product.category}
        </span>

        <h3
          onClick={onView}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onView();
            }
          }}
        >
          {product.name}
        </h3>

        <div className="rating">

          <strong>
            {product.rating}
          </strong>

          <span>★</span>

          <small>
            ({product.reviews})
          </small>

        </div>

        <div className="price-row">

          <strong>
            {formatPrice(product.price)}
          </strong>

          <del>
            {formatPrice(product.oldPrice)}
          </del>

          <span>
            {discount}% off
          </span>

        </div>

        <p className="delivery-text">
          🚚 <strong>FREE delivery</strong>
        </p>

        <div className="product-actions">

          <button
            className="view-button"
            onClick={onView}
          >
            View
          </button>

          <button
            className="add-button"
            onClick={onAdd}
          >
            Add to Cart
          </button>

        </div>

      </div>

    </article>
  );
}

/* =========================================================
   TRUST CARD
   ========================================================= */

function TrustCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="trust-card">

      <span>
        {icon}
      </span>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   FOOTER COLUMN
   ========================================================= */

function FooterColumn({
  title,
  items,
}) {
  return (
    <div className="footer-column">

      <h3>
        {title}
      </h3>

      {items.map((item) => (

        <button
          key={item}
          onClick={() =>
            console.log(
              `${item} clicked`
            )
          }
        >
          {item}
        </button>

      ))}

    </div>
  );
}

export default App;