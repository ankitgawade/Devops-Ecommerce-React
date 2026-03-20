import { useMemo, useState } from 'react'

const products = [
  {
    id: 1,
    title: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Classic Cotton Crew T-Shirt',
    category: 'Fashion',
    price: 24.5,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Ceramic Pour Over Coffee Set',
    category: 'Home',
    price: 48.0,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Smart Fitness Tracker Watch',
    category: 'Electronics',
    price: 89.0,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Minimalist Leather Wallet',
    category: 'Accessories',
    price: 36.75,
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Running Shoes - Lightweight Foam',
    category: 'Fashion',
    price: 72.4,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
]

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [cartCount, setCartCount] = useState(0)

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((item) => item.category))]
    return ['all', ...unique]
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory = category === 'all' || item.category === category
      const matchQuery = item.title
        .toLowerCase()
        .includes(query.trim().toLowerCase())

      return matchCategory && matchQuery
    })
  }, [query, category])

  const onAddToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#">ShopNest</a>
        <nav className="topnav">
          <a className="nav-link" href="#">Home</a>
          <a className="nav-link" href="#">Products</a>
          <a className="nav-link" href="#">Deals</a>
          <a className="cart-link" href="#">
            Cart <span>{cartCount}</span>
          </a>
        </nav>
      </header>

      <main className="container">
        <section className="hero-block">
          <p>Fresh picks for your cart</p>
          <h1>Simple Ecommerce Homepage</h1>
        </section>

        <section className="controls" aria-label="Product filters">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'All Categories' : item}
              </option>
            ))}
          </select>

          <select defaultValue="featured" aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </section>

        {filteredProducts.length === 0 ? (
          <div className="state">No products found for your search.</div>
        ) : (
          <section className="products-grid" aria-label="Products">
            {filteredProducts.map((item) => (
              <article key={item.id} className="product-card">
                <div className="product-media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="product-content">
                  <p className="product-category">{item.category}</p>
                  <a className="product-title" href="#">
                    {item.title}
                  </a>
                  <div className="product-footer">
                    <strong>${item.price.toFixed(2)}</strong>
                    <button type="button" onClick={onAddToCart}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
