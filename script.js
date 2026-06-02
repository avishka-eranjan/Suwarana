
const cart = JSON.parse(localStorage.getItem('suwadharana_cart') || '[]');

function saveCart() {
  localStorage.setItem('suwadharana_cart', JSON.stringify(cart));
}

function money(value) {
  return `LKR ${Number(value).toLocaleString('en-LK')}`;
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');

  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty">Your cart is empty.</p>';
    cartTotal.textContent = money(0);
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.textContent = money(total);

  cartItems.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <small>${money(item.price)} × ${item.qty}</small>
      </div>
      <button aria-label="Remove item" onclick="removeFromCart(${idx})">Remove</button>
    </div>
  `).join('');
}

function addToCart(name, price) {
  const found = cart.find(item => item.name === name);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function clearCart() {
  cart.length = 0;
  saveCart();
  renderCart();
}

function checkoutWhatsApp() {
  if (!cart.length) {
    alert('Your cart is empty.');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const items = cart.map(item => `- ${item.name} x${item.qty} (${money(item.price)})`).join('%0A');
  const message = `Hello Suwadharana,%0A%0AI would like to place an order:%0A${items}%0A%0ATotal: ${money(total)}`;
  window.open(`https://wa.me/94703701478?text=${message}`, '_blank', 'noopener');
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function submitForm(event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  const whatsappMessage = `Hello Suwadharana,%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0ASubject: ${encodeURIComponent(subject)}%0AMessage: ${encodeURIComponent(message)}`;
  window.open(`https://wa.me/94703701478?text=${whatsappMessage}`, '_blank', 'noopener');
}

document.addEventListener('click', (e) => {
  const nav = document.getElementById('navLinks');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkoutWhatsApp = checkoutWhatsApp;
window.toggleMenu = toggleMenu;
window.submitForm = submitForm;

AOS.init({
  duration: 900,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80
});

renderCart();
