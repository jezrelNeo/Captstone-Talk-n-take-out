// utils/cartUtils.js
const CART_KEY = 'coffeeMasterCart';

const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

const addToCart = (item) => {
  try {
    const cart = getCart();
    const existingItem = cart.find(cartItem => cartItem.code === item.code);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    saveCart(cart);
    document.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

const updateCartItem = (code, quantity) => {
  try {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.code === code);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      saveCart(cart);
      document.dispatchEvent(new Event('cartUpdated'));
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
  }
};

const removeFromCart = (code) => {
  try {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.code !== code);
    saveCart(updatedCart);
    document.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

const clearCart = () => {
  try {
    localStorage.removeItem(CART_KEY);
    document.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

const getCartTotal = () => {
  try {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
};

const getCartCount = () => {
  try {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  } catch (error) {
    return 0;
  }
};

// Expose globally
window.cartUtils = {
  getCart,
  saveCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCartCount
};