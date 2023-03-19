export const countCartItems = () => JSON.parse(localStorage.getItem('cart'))?.length || 0;

export const listCartItems = () =>{
  const cart = JSON.parse(localStorage.getItem('cart'))

  const listItems = cart.map((cartProduct) => `Product: ${cartProduct.product.name} x ${cartProduct.product.quantity} with price: ${cartProduct.product.price}`);

  alert(listItems.join(', '));
}
