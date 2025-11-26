# Marketplace Website

A simple marketplace scaffold with HTML, CSS, and JavaScript.

## Structure
- `danu.html`: main page (link CSS/JS below)
- `assets/css/styles.css`: base styles and components
- `assets/js/script.js`: cart, search, and small utilities
- `assets/img/`: product images

## Quick Start (Windows PowerShell)
```powershell
# Open the page directly in your browser
Start-Process .\danu.html

# Or serve locally (requires Python)
python -m http.server 5500 ; Start-Process http://localhost:5500/danu.html
```

## Conventions
- Use `data-*` attributes for interactivity: `data-add-to-cart`, `data-product`, `data-search-form`, `data-cart-count`, `data-format-price`.
- Prices are in IDR and formatted via `Intl.NumberFormat('id-ID')`.

## Example Markup
```html
<header class="header">
  <div class="container">
    <div class="logo">DanuMarket</div>
    <form class="search" data-search-form>
      <input type="search" placeholder="Cari produk..." />
      <button type="submit">Cari</button>
    </form>
    <nav class="nav">
      <a href="#">Masuk</a>
      <span class="badge hidden" data-cart-count>0</span>
    </nav>
  </div>
</header>

<main class="container">
  <div class="grid">
    <article class="card" data-product data-name="Kaos Polos">
      <img src="assets/img/sample-1.jpg" alt="Kaos" />
      <div class="body">
        <h3>Kaos Polos</h3>
        <div class="price" data-format-price>75000</div>
        <button class="btn primary" data-add-to-cart data-id="p1" data-name="Kaos Polos" data-price="75000">Tambah ke Keranjang</button>
      </div>
    </article>
  </div>
</main>
```
