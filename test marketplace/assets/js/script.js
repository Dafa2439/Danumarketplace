// Basic marketplace interactivity
(function(){
  const state = { cart: [] };

  function formatCurrency(n){
    return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
  }

  function addToCart(item){
    const existing = state.cart.find(i=>i.id===item.id);
    if(existing){ existing.qty += 1; }
    else { state.cart.push({...item, qty:1}); }
    renderCartBadge();
  }

  function renderCartBadge(){
    const badge = document.querySelector('[data-cart-count]');
    if(!badge) return;
    const count = state.cart.reduce((s,i)=>s+i.qty,0);
    badge.textContent = String(count);
    badge.classList.toggle('hidden', count===0);
  }

  function attachHandlers(){
    document.addEventListener('click', (e)=>{
      // Learn more button opens modal
      const learnBtn = e.target.closest('[data-learn-more]');
      if(learnBtn){
        const card = learnBtn.closest('.product-card');
        if(card){
          openProductModal(card);
        }
        return; // skip other handlers when button clicked
      }
      const scrollBtn = e.target.closest('[data-scroll-to]');
      if(scrollBtn){
        e.preventDefault();
        const selector = scrollBtn.getAttribute('data-scroll-to');
        const target = selector ? document.querySelector(selector) : null;
        if(target){
          const nav = document.querySelector('nav');
          const offset = nav ? nav.offsetHeight + 8 : 0;
          const extra = Number(scrollBtn.getAttribute('data-scroll-offset')) || 24; // scroll a bit further
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset + extra;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }

      const scrollTopBtn = e.target.closest('[data-scroll-top]');
      if(scrollTopBtn){
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Vibrate the learn more button if card (non-button area) clicked
      const card = e.target.closest('.product-card');
      if(card && !e.target.closest('button')){
        const btn = card.querySelector('[data-learn-more]');
        if(btn){
          btn.classList.remove('shake');
          // force reflow to restart animation
          void btn.offsetWidth;
          btn.classList.add('shake');
          btn.addEventListener('animationend', ()=>btn.classList.remove('shake'), { once:true });
        }
      }

      if(e.target.closest('[data-modal-close]')){
        closeProductModal();
      }
    });


  function openProductModal(card){
    const modal = document.getElementById('productModal');
    if(!modal) return;
    const titleEl = document.getElementById('modalTitle');
    const subtitleEl = document.getElementById('modalSubtitle');
    const priceEl = document.getElementById('modalPrice');
    const imgEl = document.getElementById('modalImage');
    const contactBtn = document.getElementById('modalContactBtn');

    const name = card.getAttribute('data-name') || card.querySelector('.product-name')?.textContent || 'Produk';
    const brand = card.querySelector('.product-brand')?.textContent || '';
    const priceRaw = card.querySelector('[data-format-price]')?.textContent || '0';
    const imgSrc = card.querySelector('img')?.getAttribute('src') || '';

    titleEl.textContent = name;
    subtitleEl.textContent = brand ? brand : 'Detail Produk';
    priceEl.textContent = priceRaw.startsWith('Rp') ? priceRaw : formatCurrency(Number(priceRaw)||0);
    imgEl.src = imgSrc;
    imgEl.alt = name;
    contactBtn.onclick = () => {
      const waMessage = encodeURIComponent(`Halo, saya ingin menanyakan ketersediaan ${name} (harga ${priceEl.textContent}).`);
      window.open(`https://wa.me/6282237681480?text=${waMessage}`,'_blank');
    };

    modal.classList.add('active');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }

  function closeProductModal(){
    const modal = document.getElementById('productModal');
    if(!modal) return;
    modal.classList.remove('active');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
    const searchForm = document.querySelector('[data-search-form]');
    if(searchForm){
      searchForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const q = searchForm.querySelector('input')?.value?.trim()||'';
        filterProducts(q);
      });
    }
  }

  function filterProducts(query){
    const products = document.querySelectorAll('[data-product]');
    const q = query.toLowerCase();
    products.forEach(p=>{
      const name = p.getAttribute('data-name')?.toLowerCase()||'';
      p.style.display = name.includes(q) ? '' : 'none';
    });
  }

  function init(){
    attachHandlers();
    renderCartBadge();
    // Example: format prices if marked
    document.querySelectorAll('[data-format-price]').forEach(el=>{
      const value = Number(el.textContent||'0');
      el.textContent = formatCurrency(value);
    });
    // Fallback image handling
    document.querySelectorAll('.product-image img').forEach(img=>{
      img.addEventListener('error', ()=>{
        console.warn('Image failed to load:', img.src);
        img.src = 'https://via.placeholder.com/300x200?text=No+Image';
      });
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  // Close modal on ESC key
  window.addEventListener('keydown',(e)=>{if(e.key==='Escape') closeProductModal();});
  // Close modal on overlay click
  window.addEventListener('click',(e)=>{
    const modal = document.getElementById('productModal');
    if(modal && e.target===modal) closeProductModal();
  });
})();
